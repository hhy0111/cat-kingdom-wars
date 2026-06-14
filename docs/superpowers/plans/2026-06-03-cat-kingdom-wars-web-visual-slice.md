# Cat Kingdom Wars Web Visual Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-playable, visually polished 2D Cat Kingdom Wars vertical slice.

**Architecture:** Use React for screen flow and HUD, Canvas 2D for the animated game scene, Zustand for app state, JSON for all gameplay definitions, and a deterministic TypeScript battle engine separated from rendering. The web version stores progress through a repository boundary backed by localStorage.

**Tech Stack:** Vite, React, TypeScript, Zustand, HTML5 Canvas 2D, Vitest, Playwright web-game test client.

---

## File Structure

- `package.json`: scripts and dependencies
- `vite.config.ts`: Vite and Vitest config
- `index.html`: root HTML document
- `src/main.tsx`: React entry
- `src/App.tsx`: screen orchestration
- `src/styles.css`: app layout and UI polish
- `src/data/*.json`: units, stages, skills, super cats, effects, animations
- `src/game/types.ts`: shared domain types
- `src/game/BattleEngine.ts`: deterministic battle engine
- `src/game/createBattle.ts`: builds initial battle state from data
- `src/game/effects.ts`: render-effect helpers
- `src/game/renderBattle.ts`: Canvas battle rendering
- `src/store/gameStore.ts`: Zustand screen and progress state
- `src/screens/OpeningScreen.tsx`: animated title screen
- `src/screens/LobbyScreen.tsx`: kingdom hub
- `src/screens/BattleScreen.tsx`: Canvas battle and HUD
- `src/screens/ResultScreen.tsx`: result presentation
- `src/test/battleEngine.test.ts`: unit tests for core battle behavior
- `progress.md`: continuation notes for future agents

## Tasks

### Task 1: Scaffold Web Project

- [ ] Create Vite React TypeScript project files.
- [ ] Install runtime and test dependencies.
- [ ] Add Vitest script.
- [ ] Confirm `npm install` completes.

### Task 2: Data And Types

- [ ] Write JSON definitions for MVP units, stages, skills, super cat, animations, and effects.
- [ ] Write TypeScript domain types matching JSON fields.
- [ ] Keep animation and effect keys data-driven.

### Task 3: Battle Engine With TDD

- [ ] Write failing tests for production, movement/combat, skill effect, super cat summon, and victory.
- [ ] Run Vitest and confirm tests fail for missing implementation.
- [ ] Implement minimal deterministic engine behavior.
- [ ] Run Vitest and confirm tests pass.

### Task 4: Canvas Battle Renderer

- [ ] Implement Canvas rendering for terrain, bases, units, health bars, effects, particles, damage numbers, and HUD anchors.
- [ ] Add camera shake and world-to-screen mapping.
- [ ] Expose `window.render_game_to_text()` and `window.advanceTime(ms)`.

### Task 5: Screens And Flow

- [ ] Implement opening screen, lobby screen, battle screen, and result screen.
- [ ] Connect start, stage entry, skills, upgrades, super cat, and retry/result flow.
- [ ] Keep visible text concise and mobile-game appropriate.

### Task 6: Verification

- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Start local dev server.
- [ ] Run the develop-web-game Playwright client against the local URL.
- [ ] Inspect latest screenshots and console errors.
- [ ] Fix issues and rerun checks until the build is playable and visually coherent.

## Self-Review

- Spec coverage: Opening, lobby, battle, result, JSON data, deterministic hooks, and visual effects are covered.
- Placeholder scan: No TBD or undefined future behavior is required for this slice.
- Type consistency: JSON keys, domain types, engine snapshots, and renderer inputs will use the same names.

