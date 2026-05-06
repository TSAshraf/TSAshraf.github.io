#!/usr/bin/env python3
"""Capture portfolio screenshots from The Layer Below using Playwright."""

import asyncio
from playwright.async_api import async_playwright

URL = "http://localhost:8091"
OUT = "/Users/taashfeen/Personal/Archive/Projects/Website/Monochrome Narratives/The Layer Below/screenshots"

def force_scene(day, scene_idx):
    return f"""() => {{
        const g = window._game;
        if (g.scene) {{ g.scene.destroy(); g.scene = null; }}
        document.getElementById('day-overlay').classList.add('hidden');
        document.getElementById('day-overlay').style.opacity = '0';
        document.getElementById('choices-box').classList.add('hidden');
        document.getElementById('choices-box').innerHTML = '';
        document.getElementById('title-screen').style.display = 'none';
        g.currentDay = {day};
        g.sceneIndex = {scene_idx};
        g._startScene();
    }}"""

COMPLETE_TYPING = """() => {
    const n = window._game.scene.narrative;
    n.displayText = n.fullText;
    n.charIndex = n.fullText.length;
    n.typing = false;
    n.waiting = true;
    n._promptAlpha = 1;
    n._boxAlpha = 1;
}"""

async def wait(ms):
    await asyncio.sleep(ms / 1000)

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1280, "height": 720})
        await page.goto(URL, wait_until="domcontentloaded")
        await wait(3000)

        await page.evaluate("(async () => { if (!window._game) await import('/js/game.js?' + Date.now()); })()")
        await wait(1000)

        # 1. Title Screen
        await page.screenshot(path=f"{OUT}/01-title-screen.png")
        print("✓ 01-title-screen.png")

        # 2. Day Transition Card
        await page.evaluate("""() => {
            const g = window._game;
            g.state = 'dayTransition';
            g.transitionTimer = 0;
            document.getElementById('title-screen').style.display = 'none';
            const o = document.getElementById('day-overlay');
            o.classList.remove('hidden');
            o.style.opacity = '1';
            o.querySelector('.day-label').textContent = 'day 1';
            o.querySelector('.day-subtitle').textContent = 'the cut';
        }""")
        await wait(300)
        await page.screenshot(path=f"{OUT}/02-day-transition.png")
        print("✓ 02-day-transition.png")

        # 3. Walk Scene — Opening Narrative
        await page.evaluate(force_scene(1, 0))
        await wait(500)
        await page.evaluate(COMPLETE_TYPING)
        await wait(300)
        await page.screenshot(path=f"{OUT}/03-walk-narrative.png")
        print("✓ 03-walk-narrative.png")

        # 4. Walk Scene — Trench Discovery
        await page.evaluate("""() => {
            const g = window._game;
            const s = g.scene;
            const n = s.narrative;
            s.charWorldX = 1050;
            s.cameraX = 1050 - 1200 * 0.35;
            s.walking = false;
            n.load(s.data.nodes, 'w3');
            n.displayText = n.fullText;
            n.charIndex = n.fullText.length;
            n.typing = false;
            n.waiting = true;
            n._promptAlpha = 1;
        }""")
        await wait(300)
        await page.screenshot(path=f"{OUT}/04-trench-discovery.png")
        print("✓ 04-trench-discovery.png")

        # 5. Choice Point (Day 1 Night)
        await page.evaluate(force_scene(1, 1))
        await wait(500)
        await page.evaluate("""() => {
            const g = window._game;
            const n = g.scene.narrative;
            const nodes = g.scene.data.nodes;
            let choiceId = null;
            for (const [id, node] of Object.entries(nodes)) {
                if (node.ch && node.ch.length > 0) { choiceId = id; break; }
            }
            if (choiceId) {
                n.load(nodes, choiceId);
                n.displayText = n.fullText;
                n.charIndex = n.fullText.length;
                n.typing = false;
                n.showingChoices = true;
                n._showChoices(nodes[choiceId].ch);
                n._promptAlpha = 1;
            }
        }""")
        await wait(500)
        await page.screenshot(path=f"{OUT}/05-choice-point.png")
        print("✓ 05-choice-point.png")

        # 6. Night Scene Interior (Day 2)
        await page.evaluate(force_scene(2, 1))
        await wait(500)
        await page.evaluate(COMPLETE_TYPING)
        await wait(300)
        await page.screenshot(path=f"{OUT}/06-night-scene.png")
        print("✓ 06-night-scene.png")

        # 7. Burial Voice (Day 3 Walk)
        await page.evaluate(force_scene(3, 0))
        await wait(500)
        await page.evaluate("""() => {
            const g = window._game;
            const s = g.scene;
            const n = s.narrative;
            s.charWorldX = 1100;
            s.cameraX = 1100 - 1200 * 0.35;
            s.walking = false;
            n.load(s.data.nodes, 'v1');
            n.displayText = n.fullText;
            n.charIndex = n.fullText.length;
            n.typing = false;
            n.waiting = true;
            n._promptAlpha = 1;
        }""")
        await wait(300)
        await page.screenshot(path=f"{OUT}/07-burial-voice.png")
        print("✓ 07-burial-voice.png")

        await browser.close()
        print(f"\nAll screenshots saved to: {OUT}")

if __name__ == "__main__":
    asyncio.run(main())
