# Portfolio Motion Implementation Plan

**Goal:** Deliver the user-approved local three-scene animation site using the user's original video.
**Architecture:** Persistent preloaded video layers, exact endpoint posters, serial adjacent transitions and gesture gating. Empty scene content slots.
**Tech Stack:** React 19, Vite, native video, Node test runner, FFmpeg.

- [x] Prepare public/media: first49frames / second97frames, forward and reverse; posters at shared endpoints; check decode and dimensions.
- [x] Write tests for adjacency routing, gesture inertia and scene boundaries; run node --test and confirm feature missing.
- [x] Implement motion-state.mjs, React Portfolio with loading/error/reduced-motion handling, CSS matching captured framing and controls.
- [x] Run tests and npm run build. Start localhost preview. Test every navigation direction, rapid requests, wheel and keyboard in browser.
- [x] Inspect desktop/mobile screenshots against source/approved video, fix issues, save design-qa.md. Leave preview running and document content insertion point.
