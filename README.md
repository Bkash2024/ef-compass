# EF-Compass

EF-Compass is a client-side executive function assessment and reflection tool based on Peg Dawson and Richard Guare's *Smart but Scattered* framework. It uses vanilla HTML, CSS, and JavaScript modules, with no build step or external frameworks.

## Seven stages

1. **Profile:** Enter your name, age group, and primary context.
2. **Assessment:** Rate 36 statements from 1 (strongly disagree) to 6 (strongly agree).
3. **Results:** View a 12-axis radar chart and skill breakdown. Each skill has three items; a completed skill score is their sum, from 3 to 18. Higher scores indicate stronger skills.
4. **Friction:** Map difficult tasks to executive skills and review coping strategies.
5. **Execute:** Create an action plan and compare estimated task times with actual times.
6. **Reflect:** Record blameless postmortems and down-regulation practices, and follow a two-minute box-breathing guide (four seconds each for inhale, hold, exhale, and hold). Completing the guide can prefill a practice log; submit it to save.
7. **EF Guide:** Explore all 12 skills, personalized scores and matching paired patterns, profile and brain explanations, interventions, and a quick check. Select a skill on the radar chart or in Results to open its guide, then send it to the action-plan builder.

## Getting started

Run a local server from the `ef-compass` directory (Python 3 required):

```sh
python3 -m http.server 8000
```

On Windows, `py -m http.server 8000` is an alternative. Open <http://localhost:8000/> in a modern browser. Serving over HTTP is necessary for JavaScript modules; opening `index.html` directly is not recommended.

Enter your profile and complete the assessment, or use the navigation rail to visit a stage directly. Changes are stored in the browser's `localStorage`; use the navigation rail's export and import buttons to back up or restore JSON data. Data is local to that browser and origin, and clearing site data can remove it.

## Keyboard shortcuts

During the assessment:

- **1–6:** Select a rating.
- **Left arrow:** Previous question.
- **Right arrow:** Next question when a response is selected.

Question, action-plan cue, and guide summary speech require browser support for the Web Speech API. The breathing guide also provides text cues and respects reduced-motion preferences.

The guide displays scores only after a skill's three questions are answered. Strength, Friction Area, and Balanced are relative rankings shown after all 36 responses are complete. Ties follow the assessment's existing skill order (top three use reverse order, bottom three use forward order). Paired insights are illustrative prompts, not diagnoses.

## Project structure

```text
ef-compass/
├── index.html       # Seven-stage app shell and navigation
├── css/styles.css   # Layout, themes, and animations
├── js/data.js       # Assessment items, skill definitions, and worksheet schemas
├── js/state.js      # Scoring, validated records, localStorage, and JSON import/export
├── js/radar.js      # SVG radar chart generator
└── js/app.js        # UI, navigation, timers, and speech
```

## License

MIT License — feel free to use and modify for your own purposes.
