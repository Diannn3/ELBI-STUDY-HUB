from playwright.sync_api import sync_playwright
from pathlib import Path
import base64, sys
ROOT=Path(__file__).resolve().parents[2]
css=(ROOT/'preview/styles.css').read_text(); js=(ROOT/'preview/app.js').read_text(); hero=base64.b64encode((ROOT/'preview/assets/campus_hero.png').read_bytes()).decode()
html=f'''<style>{css}</style><div id="app"></div><script>window.__ELBI_FORCE_TEST__=true;window.__ELBI_HERO__='data:image/png;base64,{hero}';</script><script>{js}</script>'''
failed=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    for result, expected in [('done','done'),('continue','doing'),('blocked','blocked')]:
        page=browser.new_page(viewport={'width':1000,'height':700})
        page.set_content(html); page.wait_for_selector('[data-view=home]')
        # Quick-create proves the create + auto-select path too.
        title=f'{result.title()} path task'
        page.locator('#quickTitle').fill(title); page.locator('#quickForm button').click(); page.wait_for_timeout(100)
        created=page.locator('[data-task]',has_text=title)
        if created.count()!=1: failed.append(f'{result}: quick create')
        # Newly created task is automatically selected, so Start must enable.
        if page.locator('#startFocus').is_disabled(): failed.append(f'{result}: auto-select')
        page.locator('#startFocus').click(); page.locator('[data-mode=quiet5]').click(); page.locator('#beginSession').click(); page.wait_for_selector('[data-view=focus]')
        page.locator('#end').click(); page.wait_for_selector('[data-view=wrap]')
        page.locator(f'[data-result={result}]').click(); page.locator('#skip').click(); page.wait_for_selector('[data-view=home]')
        tasks=page.evaluate("async()=>await __ELBI_TEST__.getAll('tasks')")
        row=[x for x in tasks if x['title']==title][0]
        ok=row['status']==expected
        print(('PASS' if ok else 'FAIL'),result,'=>',row['status'])
        if not ok: failed.append(f'{result}: expected {expected}, got {row["status"]}')
        page.close()
    browser.close()
print('FAILED',failed)
sys.exit(1 if failed else 0)
