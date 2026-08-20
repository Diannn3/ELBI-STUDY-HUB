from playwright.sync_api import sync_playwright
from pathlib import Path
import base64
ROOT=Path(__file__).resolve().parents[2]; OUT=ROOT/'test-artifacts'; OUT.mkdir(exist_ok=True)
css=(ROOT/'preview/styles.css').read_text(); js=(ROOT/'preview/app.js').read_text(); hero=base64.b64encode((ROOT/'preview/assets/campus_hero.png').read_bytes()).decode()
html=f'''<style>{css}</style><div id="app"></div><script>window.__ELBI_FORCE_TEST__=true;window.__ELBI_HERO__='data:image/png;base64,{hero}';</script><script>{js}</script>'''
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':390,'height':844});page.set_content(html);page.wait_for_selector('[data-view=home]');page.screenshot(path=str(OUT/'mobile-home.png'),full_page=True)
 page.locator('[data-task]').first.click();page.locator('#startFocus').click();page.screenshot(path=str(OUT/'mobile-modal.png'),full_page=True)
 b.close()
