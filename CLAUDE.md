# Project: EF Compass (Executive Function Operating System)
Interactive client-side web app implementing Peg Dawson & Richard Guare's *Smart but Scattered* framework.

## Tech Stack & Constraints
- Vanilla HTML5, CSS3 (CSS variables for light/dark theme), ES6+ JavaScript modules (`type="module"`).
- Zero external frameworks or build steps (must run via `python3 -m http.server`).
- State persisted via `localStorage` with JSON import/export.

## File Structure
- `index.html`: Single-page app shell with tab navigation for 4 modules.
- `css/styles.css`: Responsive layout, theme tokens, SVG animations.
- `js/data.js`: Pure data exports (36 ESQ items, 12 skills, coping strategies).
- `js/state.js`: Scoring logic (sum of 3 items per skill, range 3-18), localStorage sync.
- `js/radar.js`: 12-axis SVG spider chart generator.
- `js/app.js`: DOM rendering, interactive wizard, and Web Speech API cues.