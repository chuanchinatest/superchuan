# Prototype Instructions

## Project decisions

- First version: animation only, no invented biography, career history, works or contact content.
- Three scenes: center opening with one-line liquid-glass ADRIAN PEI; left close-up with right copy slot; full body and ChatGPT/Claude Code/Gemini cubes on right with left copy slot.
- Use the user's generated video and endpoint-matched posters, not the original artist's media.
- User supplied a 2160p replacement and requested removal of the top-left visible AI-generated badge. Keep original download untouched, deliver a clean 4-second 2160p master and use native 3766×2160 clips/posters for web playback. User reported blur from the earlier 1080p downscale; prioritize source detail.
- Wheel/click plays full adjacent transitions and parks; upward wheel uses pre-rendered reverse clips. Bottom 01/02/03 navigation; no forced continuous loop.
- Original source: https://wenting-visual-portfolio.pages.dev . The first version references its presentation and interaction, with user-owned replacement artwork.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
