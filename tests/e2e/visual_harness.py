from playwright.sync_api import sync_playwright
from pathlib import Path
import base64, json, sys
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'test-artifacts'; OUT.mkdir(exist_ok=True)
css=(ROOT/'preview/styles.css').read_text()
js=(ROOT/'preview/app.js').read_text()
hero=base64.b64encode((ROOT/'preview/assets/campus_hero.png').read_bytes()).decode()
boot=f"window.__ELBI_FORCE_TEST__=true;window.__ELBI_HERO__='data:image/png;base64,{hero}';"
html=f'''<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head><body><div id="app"></div><script>{boot}</script><script>{js}</script></body></html>'''
report={'checks':{},'screenshots':[],'browser_limitations':['The managed Chromium policy blocks all URL navigation, so this harness uses page.set_content(). IndexedDB is intentionally denied on about:blank; preview/app.js falls back to an in-memory adapter only for this visual verification path.']}
def chk(name,ok,detail=''):
    print(('PASS' if ok else 'FAIL'),name,detail);report['checks'][name]={'pass':bool(ok),'detail':detail}
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    page=b.new_page(viewport={'width':1440,'height':900})
    errs=[]; page.on('pageerror',lambda e:errs.append(str(e)))
    page.set_content(html,wait_until='load');page.wait_for_selector('[data-view=home]',timeout=10000)
    chk('home renders',page.locator('[data-view=home]').count()==1)
    chk('seed tasks render',page.locator('[data-task]').count()==2,str(page.locator('[data-task]').count()))
    pth=OUT/'home.png';page.screenshot(path=str(pth));report['screenshots'].append(str(pth.relative_to(ROOT)))
    page.locator('[data-task]').first.click();page.locator('#startFocus').click();page.wait_for_selector('[role=dialog]')
    chk('modal opens',True);pth=OUT/'start-focus.png';page.screenshot(path=str(pth));report['screenshots'].append(str(pth.relative_to(ROOT)))
    page.locator('[data-mode=quiet5]').click();page.locator('#beginSession').click();page.wait_for_selector('[data-view=focus]')
    clock1=page.locator('#timerDigits').inner_text();page.wait_for_timeout(1100);clock2=page.locator('#timerDigits').inner_text()
    chk('wall-clock timer changes',clock1!=clock2,f'{clock1}->{clock2}')
    pth=OUT/'focus.png';page.screenshot(path=str(pth));report['screenshots'].append(str(pth.relative_to(ROOT)))
    page.wait_for_selector('[data-view=wrap]',timeout=8000);chk('natural expiration reaches wrap',True)
    pth=OUT/'wrap.png';page.screenshot(path=str(pth));report['screenshots'].append(str(pth.relative_to(ROOT)))
    page.locator('[data-result=done]').click();page.locator('#tilText').fill('A specific task makes a focus block easier to start.');page.locator('#save').click();page.wait_for_selector('[data-view=home]')
    data=page.evaluate("async()=>({tasks:await __ELBI_TEST__.getAll('tasks'),sessions:await __ELBI_TEST__.getAll('sessions'),til:await __ELBI_TEST__.getAll('til'),outbox:await __ELBI_TEST__.getAll('outbox')})")
    chk('session persists in data adapter',len(data['sessions'])==1,str(len(data['sessions'])))
    chk('TIL persists in data adapter',len(data['til'])==1,str(len(data['til'])))
    chk('outbox receives mutations',len(data['outbox'])>=3,str(len(data['outbox'])))
    math=[x for x in data['tasks'] if x['id']=='task-math-ps3'][0];chk('Done updates task status',math['status']=='done',math['status'])
    chk('history derives session count','1 session' in page.locator('.stat').first.inner_text(),page.locator('.stat').first.inner_text())
    pth=OUT/'home-after.png';page.screenshot(path=str(pth));report['screenshots'].append(str(pth.relative_to(ROOT)))
    # keyboard + Escape
    page.locator('[data-task]').first.click();page.locator('#startFocus').click();page.keyboard.press('Escape');page.wait_for_timeout(100);chk('Escape closes modal',page.locator('[role=dialog]').count()==0)
    page.keyboard.press('Tab');active=page.evaluate("document.activeElement && (document.activeElement.id || document.activeElement.getAttribute('aria-label') || document.activeElement.textContent.trim())");chk('keyboard focus reaches a control',bool(active),str(active))
    chk('no browser page errors',not errs,'; '.join(errs))
    b.close()
(OUT/'visual-harness-report.json').write_text(json.dumps(report,indent=2))
failed=[k for k,v in report['checks'].items() if not v['pass']]
print('FAILED',failed)
sys.exit(1 if failed else 0)
