# Mounir DABIRE — the portfolio town

The portfolio of AI engineer Mounir DABIRE, rebuilt as a small top-down pixel-art game. Visitors walk through a town where every building holds part of the portfolio: projects, experience, education, Erasmus exchanges, photography, hobbies and contact.

## Play

| Place | Content |
| --- | --- |
| Mounir's house | Hobbies: video games & manga, reading, music, strength training |
| AI Lab | Projects: UrdWell, HindSight (with their test cases), Grant Copilot, ADQUA, ChartMind, academic projects |
| ESSCA | Experience at ESSCA (AI developer, final-year project, internship) |
| Moov Africa tower | Data engineering at Moov Africa Burkina |
| ESAIP | Education, from Ouagadougou to Angers |
| Airport | Erasmus exchanges at KTU (Lithuania) and RWU (Germany), with photos |
| Gallery | 16 Pixel photographs and four personal moments |
| Post office | Email, LinkedIn, GitHub and CV download |

Controls:

- Move with the arrow keys or WASD (ZQSD on AZERTY keyboards: keys are read by position), or click/tap the ground.
- Interact with E, Enter or Space, by walking into a door, or by clicking/tapping a building, a character or an object.
- Open the town map with M, Escape or the Map button. The map lists every place and travels straight to it, so the whole portfolio is reachable without walking.

Eight skills (Python, FastAPI, React, RAG, MCP, Azure, AWS, Big Data) are hidden around town. Visited places and found skills are remembered in the visitor's browser only; the map menu can reset them.

## Run locally

No build step and no dependencies. ES modules need an HTTP server (they do not load from `file://`):

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/`.

Checks, also run by CI (Node.js 20 or later):

```bash
node scripts/check_game.js
```

They cover language selection, CV routing, FR/EN completeness of interface strings and content, the presence of every referenced asset, sprite templates, and that every door and skill can be reached from the starting point.

## Code structure

Plain JavaScript modules and a Canvas 2D renderer; all pixel art is drawn in code at start-up.

- `src/content/` — portfolio content as data with inline `{ fr, en }` values. Edit text here.
- `src/world/` — town plan (`townPlan.js`), grid building, collisions, pathfinding and interactable places. No drawing.
- `src/graphics/` — palette, pixel font, sprite templates and painters for terrain, buildings, trees, props and animated effects.
- `src/entities/`, `src/game/` — player movement, path following, game rules, progress and interaction handling.
- `src/render/` — camera, viewport scaling and the frame renderer.
- `src/ui/` — HUD, dialogue box, building panels, photo viewer, map menu and title screen (DOM, so text stays selectable and readable by assistive technology).
- `src/i18n/` — language resolution and interface strings.
- `src/main.js` — composition root wiring the services together.

To add a building: add its content to `src/content/locations.js`, a footprint in `src/world/townPlan.js`, a style in `src/graphics/buildingStyles.js` and a panel renderer in `src/ui/panels/index.js`.

## GitHub and deployment

Public repository: https://github.com/Mounir1200/mounir-town

GitHub Pages: https://mounir1200.github.io/mounir-town/

Every push to `main` runs `.github/workflows/pages.yml`: syntax checks, `scripts/check_game.js`, packaging into `_site`, then publication through GitHub Actions. The workflow can also be triggered manually.

`python scripts/build_site.py` packages only what the page uses: it follows `index.html`, stylesheet `url()` references, relative ES module imports and `assets/…` paths written in JavaScript, then adds font licences, `sitemap.xml` and `.nojekyll`. Paths stay relative so the site works under `/mounir-town/`.

## Languages and CVs

The game is available in French and English. The first visit uses the first supported language in the browser's preferences, falling back to English. The FR/EN button saves the choice in browser storage and updates the `?lang=` parameter; a `?lang=fr` or `?lang=en` link takes precedence over a saved choice. Switching language repaints the building signs and updates open windows without reloading.

The CV links download the file for the active language: `assets/Mounir-DABIRE-CV.pdf` (French) or `assets/Mounir-DABIRE-CV-EN.pdf` (English).

## Accessibility and motion

- Every place is reachable from the map menu with the keyboard; panels, dialogues and the photo viewer are native dialogs or labelled regions with focus management.
- The place currently in reach is announced through a polite live region; panel text is regular HTML.
- With `prefers-reduced-motion`, the title camera stays still, dialogue text appears at once, and smoke, drifting light specks and bobbing animations stop.
- The page needs JavaScript; a `<noscript>` block gives the email, LinkedIn, GitHub and both CVs.

## Search visibility

The primary portfolio URL is `https://mounir1200.github.io/mounir-town/`. The HTML declares this canonical URL, `sitemap.xml` lists it, and a `Person` JSON-LD block describes the owner. Because the content is rendered by the game, search engines mostly see the page title, description and structured data.

After publishing, configure [Google Search Console](https://search.google.com/search-console/):

1. Add a URL-prefix property for `https://mounir1200.github.io/mounir-town/`.
2. Choose HTML-tag verification. The owner's verification tag is already in the `<head>` of `index.html`; keep it.
3. Verify ownership, inspect the home page, and request indexing if appropriate.
4. Submit `https://mounir1200.github.io/mounir-town/sitemap.xml` in the Sitemaps report.

## Art direction

The town uses the portfolio palette — brown `#6c2b11`, peach `#f2ad78` and cobalt `#0057ba` — with tints and shades derived from it. Characters, buildings, trees, props, icons and the sign lettering are drawn in code (`src/graphics/`). The dialogue portrait is `assets/portrait-cobalt-peche-560.webp`, an image generated with imagegen from the original portrait kept in `assets/portrait.jpg`. Photographs keep their original colours.

Space Grotesk and Instrument Serif are served from `assets/fonts/` under the SIL Open Font License; see `assets/fonts/SOURCES.txt`.

## Background music

Music: [“Positive Chill-Hop” by ZephiraMusic on Pixabay](https://pixabay.com/fr/music/beats-positive-chill-hop-595886/). The track page lists use under the [Pixabay Content License](https://pixabay.com/service/license-summary/).

Every visit starts silent. Sound (music and small synthesized effects) starts only when the visitor turns it on with the sound button or the jukebox on the town square. The track loops at 18 % gain through Web Audio, falling back to the media element volume.

## Sources

- Supplied CVs, copied to `assets/Mounir-DABIRE-CV.pdf` and `assets/Mounir-DABIRE-CV-EN.pdf`: ESAIP, ESSCA, skills, contact details and main projects.
- Project test cases: UrdWell [`test_pipeline.py`](https://github.com/Mounir1200/urdwell-mcp/blob/main/test_pipeline.py#L89-L130) and HindSight [`test_retroactive_rate.py`](https://github.com/Mounir1200/HindSight/blob/main/tests/test_retroactive_rate.py#L37-L45). The panels describe these source tests; the external test suites are not run as part of this site.
- Photographs come from the four subfolders of `Photos-1-001`; `assets/life/sources.json` and `assets/life/photography.json` record the source mappings.
- The first reading excerpt is presented with Fiodor Dostoïevski’s *White Nights* (*Les Nuits blanches*). The author of the passage on page 99 has not been confirmed; its caption identifies it only as a passage kept from the copy being read.
- Previous portfolios: the “living poster” site (https://github.com/Mounir1200/Mounir), whose history this repository continues, and https://mounir1200.github.io/PortFolio/ (reviewed on October 2, 2026).
