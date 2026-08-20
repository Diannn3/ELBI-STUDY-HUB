from playwright.sync_api import sync_playwright
from pathlib import Path
import json, sys, time
BASE='http://127.0.0.1:4174/?test=1'
OUT=Path('test-artifacts'); OUT.mkdir(exist_ok=True)
report={'checks':{},'data':{},'screenshots':[]}

def check(name, cond, detail=''):
    report['checks'][name]={'pass':bool(cond),'detail':detail}
    if not cond: print('FAIL',name,detail)
    else: print('PASS',name,detail)

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox','--disable-dev-shm-usage'])
    context=browser.new_context(viewport={'width':1440,'height':900}, service_workers='allow')
    page=context.new_page()
    errors=[]
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(BASE, wait_until='networkidle')
    check('home renders', page.locator('[data-view=home]').count()==1)
    check('seed tasks render', page.locator('[data-task]').count()>=2)
    pth=OUT/'home.png'; page.screenshot(path=str(pth)); report['screenshots'].append(str(pth))

    page.locator('[data-task]').first.click(); page.locator('#startFocus').click()
    check('start focus modal', page.locator('[role=dialog]').count()==1)
    pth=OUT/'start-focus.png'; page.screenshot(path=str(pth)); report['screenshots'].append(str(pth))

    page.locator('[data-mode=quiet5]').click(); page.locator('#beginSession').click(); page.wait_for_selector('[data-view=focus]')
    before=page.locator('#timerDigits').inner_text()
    check('focus view entered', bool(before), before)
    pth=OUT/'focus.png'; page.screenshot(path=str(pth)); report['screenshots'].append(str(pth))

    page.wait_for_timeout(1300); page.reload(wait_until='networkidle'); page.wait_for_selector('[data-view=focus]')
    after=page.locator('#timerDigits').inner_text()
    check('timer survives reload', before!=after or after in ('00:04','00:03'), f'{before}->{after}')

    # Background/visibility resilience: wait without interacting, then ensure derived clock moved.
    clock_a=page.locator('#timerDigits').inner_text(); page.wait_for_timeout(1300); clock_b=page.locator('#timerDigits').inner_text()
    check('timer derives from wall clock', clock_a!=clock_b, f'{clock_a}->{clock_b}')

    page.wait_for_selector('[data-view=wrap]', timeout=9000)
    check('natural finish reaches wrap', page.locator('[data-view=wrap]').count()==1)
    pth=OUT/'wrap.png'; page.screenshot(path=str(pth)); report['screenshots'].append(str(pth))

    page.locator('[data-result=done]').click(); page.locator('#tilText').fill('A specific task makes the first focus block easier to begin.'); page.locator('#save').click(); page.wait_for_selector('[data-view=home]')
    data=page.evaluate("""async()=>({tasks:await __ELBI_TEST__.getAll('tasks'),sessions:await __ELBI_TEST__.getAll('sessions'),til:await __ELBI_TEST__.getAll('til'),outbox:await __ELBI_TEST__.getAll('outbox')})""")
    report['data']={k:len(v) for k,v in data.items()}
    math=[x for x in data['tasks'] if x['id']=='task-math-ps3'][0]
    check('session persisted', len(data['sessions'])==1, str(len(data['sessions'])))
    check('done updates task', math['status']=='done', math['status'])
    check('TIL persisted', len(data['til'])==1, str(len(data['til'])))
    check('outbox populated', len(data['outbox'])>=3, str(len(data['outbox'])))
    check('history updated', '1 session' in page.locator('.stat').first.inner_text(), page.locator('.stat').first.inner_text())
    pth=OUT/'home-after.png'; page.screenshot(path=str(pth)); report['screenshots'].append(str(pth))

    # Make sure service worker controls the page, then perform a real offline reload.
    if not page.evaluate('navigator.serviceWorker.controller !== null'):
        page.reload(wait_until='networkidle'); page.wait_for_timeout(500)
    sw=page.evaluate('navigator.serviceWorker.controller !== null')
    check('service worker controls page', sw)
    context.set_offline(True)
    try:
        page.reload(wait_until='domcontentloaded', timeout=10000); page.wait_for_selector('[data-view=home]', timeout=5000)
        offline_ok=page.locator('.chip').inner_text()=='OFFLINE'
    except Exception as e:
        offline_ok=False; report['offline_error']=str(e)
    check('PWA reopens offline', offline_ok)
    if offline_ok:
        # Create a task while fully offline and verify it is local immediately.
        page.locator('#quickTitle').fill('Offline-created reading task'); page.locator('#quickForm button').click(); page.wait_for_timeout(250)
        offline_tasks=page.evaluate("async()=>await __ELBI_TEST__.getAll('tasks')")
        check('task creation works offline', any(x['title']=='Offline-created reading task' for x in offline_tasks))
        pth=OUT/'offline.png'; page.screenshot(path=str(pth)); report['screenshots'].append(str(pth))
    context.set_offline(False)

    # Keyboard path starts at a real control and Escape closes the modal.
    page.reload(wait_until='networkidle'); page.wait_for_selector('[data-view=home]')
    page.keyboard.press('Tab')
    active=page.evaluate("document.activeElement && (document.activeElement.id || document.activeElement.getAttribute('aria-label') || document.activeElement.textContent.trim())")
    check('keyboard focus available', bool(active), str(active))
    # Open modal with a selected task, then Escape.
    if page.locator('[data-task]').count():
        page.locator('[data-task]').first.click(); page.locator('#startFocus').click(); page.keyboard.press('Escape'); page.wait_for_timeout(150)
        check('Escape closes modal', page.locator('[role=dialog]').count()==0)

    check('no page errors', len(errors)==0, '; '.join(errors))
    browser.close()

(OUT/'preview-e2e-report.json').write_text(json.dumps(report,indent=2))
failed=[k for k,v in report['checks'].items() if not v['pass']]
print('\nFAILED:',failed)
sys.exit(1 if failed else 0)
