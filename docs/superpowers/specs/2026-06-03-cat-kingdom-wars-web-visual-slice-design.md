# Cat Kingdom Wars Web Visual Slice Design

## Goal

Build a browser-testable, launch-quality 2D vertical slice of Cat Kingdom Wars. The first playable version must look like a polished mobile game, not a plain prototype.

## Technology

- Runtime: Web browser
- Language: TypeScript
- App framework: React with Vite
- Rendering: HTML5 Canvas 2D
- State: Zustand
- Tests: Vitest for battle simulation, Playwright-based web-game loop for visuals and interactions
- Persistence: localStorage repository for web; repository boundary remains replaceable by SQLite in a later native/mobile port

Expo and React Native are intentionally removed from this version.

## Visual Quality Bar

The build must include a polished opening screen, kingdom lobby, stage selection entry point, battle scene, skill effects, super cat summon effect, and result screen. Static placeholder boxes are not acceptable for the main experience. Missing final production art is acceptable only when the placeholder is an intentionally styled 2D game asset drawn in Canvas.

## Core Screens

### Opening

- Cat castle under warm dawn light
- Animated title entrance
- Floating particles
- Parallax clouds
- Pulsing start prompt

### Lobby

- Cat kingdom hub with castle, research lab, shop, stage portal, reward chest
- Building idle animations
- Polished mobile-style icon buttons
- No marketing landing page; this is the game hub

### Battle

- Square battlefield framed for mobile aspect ratios
- Player base and enemy base in opposite corners for the first slice
- Auto-spawned cat and enemy units
- Sprite-like Canvas characters with idle, walk, attack, hit, and death states
- Fire bombardment, lightning, healing glow, summon portal, impact sparks, dust trails, damage numbers, health bars, and camera shake

### Result

- Victory fireworks and reward count-up
- Defeat overlay with retry path

## Data Driven Design

Core gameplay and visual effects are defined by JSON files:

- `units.json`
- `stages.json`
- `skills.json`
- `superCats.json`
- `effects.json`
- `animations.json`

Adding a new unit, skill, stage, animation set, or effect should primarily require JSON changes.

## Battle Model

The battle simulation runs in deterministic ticks. Rendering receives snapshots from the engine and never owns battle rules.

Systems:

- `ProductionSystem`: base-level spawn rates
- `MovementSystem`: movement toward enemy base or current target
- `TargetingSystem`: nearest valid target selection
- `CombatSystem`: attack cooldowns, damage, hit events, death events
- `SkillSystem`: targeted effects and cooldowns
- `EffectSystem`: render-only effect instances from battle events
- `VictorySystem`: base destruction and result state

## MVP Content For This Slice

- 1 opening screen
- 1 lobby screen
- 1 battle screen
- 1 result screen
- 5 stages in data
- 4 unit roles: swordsman, archer, mage, tank
- 2 skills: fire bombardment, healing light
- 1 super cat: super knight cat
- 3 runtime upgrades: production, attack, health

## Launch Content Target

The vertical slice keeps 5 playable stages so the core loop can be tested quickly. The release-scale target is 200 stages, organized as 20 chapters with 10 stages per chapter.

The 200-stage structure, balance formulas, unlock schedule, faction progression, monetization guardrails, and simulation QA rules are defined in:

- `docs/game-design/200-stage-balance-plan.md`

The current `stages.json` schema is sufficient for 1v1 testing. Before generating the full 200-stage dataset, the stage schema should be expanded to support:

- `chapterId`
- `stageNo`
- `battleType`
- multiple factions
- neutral bases
- stage modifiers
- recommended power
- formula-generated balance multipliers

## Quality Gates

- Browser build compiles without TypeScript errors
- Battle engine tests pass
- `window.render_game_to_text()` exposes current mode, stage, bases, units, skill cooldowns, effects, and result
- `window.advanceTime(ms)` advances deterministic simulation for automation
- Playwright web-game loop captures opening/lobby/battle screenshots without console errors
- Battle view must show readable units, bases, HUD, and visible effects

## Non-Goals For This Slice

- Full 200-stage campaign
- Real ads or payments
- Native mobile packaging
- Server, PvP, guild, ranking
- Full final sprite-sheet import pipeline
