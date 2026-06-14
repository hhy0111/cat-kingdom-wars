Original prompt: Build Cat Kingdom Wars as a high-quality 2D strategy game. The user later changed the target from Expo/React Native to a browser-testable web implementation and emphasized launch-quality opening, lobby, battle visuals, animations, and effects rather than a simple prototype.

2026-06-03:
- Target stack changed to Vite + React + TypeScript + HTML5 Canvas 2D + Zustand.
- Expo and React Native are excluded for this web version.
- Browser storage will use localStorage through a repository boundary instead of SQLite.
- Design and implementation plan documents were created under docs/superpowers.
- First test run hit dependency engine mismatch: Vite 7/jsdom 27 require newer Node than local Node 20.16.0. Package versions were pinned to Vite 5 + Vitest 2 and Vitest uses node environment.
- Added hash entry points for browser testing: `/#lobby` and `/#battle`.
- Implemented Vite + React + TypeScript web game vertical slice.
- Added JSON-driven data for 5 stages, 4 cat unit roles, dog enemy, 2 skills, 1 super cat, animation definitions, and effects.
- Added deterministic BattleEngine with tests for production, movement, skill damage, super cat summon, and victory.
- Added Canvas 2D renderer with terrain, bases, units, health bars, fire effect, summon portal, camera shake, and HUD.
- Added opening, lobby, battle, and result screens.
- Final verification:
  - `npm test` passed: 5/5 tests.
  - `npm run build` passed.
  - Dev server responded on `http://127.0.0.1:5174/`.
  - Playwright screenshots generated under `output/web-game/final/`.
  - Console output had only Vite/React dev info logs; no page errors.
- Follow-up suggestions:
  - Replace Canvas-drawn placeholder characters with real sprite sheets.
  - Add sound effects and BGM.
  - Add stage clear progression lock/unlock.
  - Add richer result reward animation.

2026-06-03 frontline update:
- User feedback: battle felt like a single-file line; requested a broad standoff/frontline shape.
- Added `laneOffset` to runtime units and deterministic broad lane spawning.
- Units now advance along parallel formation lanes and prefer engaging enemies near their own lane.
- Battle road rendering now shows a wide combat corridor with multiple parallel lane guides.
- Added regression test: units must spread across a broad frontline after battle progresses.
- Verification:
  - `npm test` passed: 6/6 tests.
  - `npm run build` passed.
  - Browser screenshot saved at `output/web-game/frontline/broad-frontline.png`.
  - Browser console had only Vite/React dev info logs; no page errors.

2026-06-03 200-stage planning update:
- User requested launch-scale content closer to 200 stages.
- Added `docs/game-design/200-stage-balance-plan.md`.
- Updated the web visual slice design doc to reference the 200-stage launch target.
- Current implementation still contains 5 playable stages for the vertical slice.
- Next recommended implementation task: add chapter data, stage generator, expanded stage schema, and generated 200-stage JSON.

2026-06-03 image prompt pack update:
- User requested full image-based game composition prompts, transparent cutout standards, sprite/VFX spacing rules, and stronger UI/UX feedback for cooldowns, item use, damage, and skill effects.
- Added `docs/game-design/image-asset-prompt-pack.md`.
- The prompt pack includes global asset rules, canvas/sprite standards, opening/lobby/stage/battle prompts, unit sprite prompts, building prompts, skill icon prompts, VFX sprite prompts, damage number prompts, item/currency prompts, result screen prompts, and one master combined production prompt.
- Key standard: cutout assets must be transparent PNG, centered, no baked background, no baked shadow, no text, no watermark, and no default decorative overlay.

2026-06-03 battle scale and monetization update:
- User feedback: bases and soldiers looked too large; requested smaller visuals so the battlefield feels wider.
- Added `src/game/visualScale.ts` as a single tuning point for base, unit, super unit, and health-bar visual scale.
- Reduced base scale, unit scale, and health bars in the Canvas renderer while keeping the existing combat positions and simulation unchanged.
- Added regression coverage in `src/test/battleVisualScale.test.ts` so normal units, bases, and health bars stay below the earlier oversized presentation.
- Added `docs/game-design/monetization-and-gameplay-expansion.md`.
- The new design document covers optional rewarded ads, IAP products, subscription/remove-ads/x2 speed ideas, cosmetic monetization, battle items, stage modifiers, neutral objectives, research branches, side modes, and a broader release roadmap.
- Verification:
  - `npm test` passed: 7/7 tests.
  - `npm run build` passed.
  - Browser screenshot saved at `output/web-game/scale-update/smaller-units-bases.png`.
  - Browser console had only Vite/React dev info logs; no page errors.

2026-06-03 opening/lobby/loading retention update:
- User requested higher quality start/lobby screens, a loading screen for new game flow, and planning for reasons to return the next day.
- Added `LoadingScreen` and routed opening -> loading -> lobby, lobby -> loading -> battle, and result retry -> loading -> battle.
- Reworked `OpeningScreen` with a stronger title lockup, kingdom crest, start/continue buttons, marching cats, and next-day reward hook.
- Reworked `LobbyScreen` into a retention-focused hub with daily rewards, daily missions, today's front, kingdom pass, offline reward chest, visible currencies, and next-stage battle portal.
- Fixed visible Korean UI strings in battle and result screens.
- Added `docs/game-design/retention-quality-plan.md` covering daily rewards, missions, offline rewards, daily event fronts, kingdom pass, collection goals, quality checklist, and implementation roadmap.
- Added store navigation regression tests for loading transitions.
- Verification:
  - `npm test` passed: 9/9 tests.
  - `npm run build` passed.
  - Official `develop-web-game` client successfully verified opening -> loading -> lobby. It also produced battle entry artifacts, but one battle-entry run timed out during process exit, so final visual verification used a direct Playwright script.
  - Final screenshots saved at `output/web-game/retention-flow-final-2/`.
  - Browser console had only Vite/React dev info logs; no page errors.

2026-06-03 image asset application update:
- User added generated image assets under `image/image-asset-prompt-pack` and requested applying them in-game.
- Original sprite/cutout PNGs were opaque with baked checkerboard backgrounds, so source files were preserved and runtime-ready derivatives were generated under `src/assets/generated`.
- Background images were copied as-is; unit/building/VFX/icon images were processed to remove edge-connected checkerboard backgrounds and add usable alpha.
- Added `src/game/imageAssets.ts` to centralize battle map, base, unit sprite sheet, and VFX image URLs.
- Battle renderer now uses:
  - `15-grassland-battle-map.png` for the battlefield board.
  - `18-player-base.png` and `19-dog-empire-base.png` for bases.
  - `21` to `26` unit sprite sheets for cats, super cat, and dog soldiers.
  - `31`, `33`, `34`, `35`, and `36` VFX sheets for fire, healing, summon, hit spark, and base explosion.
- CSS now uses image backgrounds/icons for opening, lobby, currency chips, hub buildings, stage portal, reward chest, battle buttons, and result effects.
- Verification:
  - `npm test` passed: 9/9 tests.
  - `npm run build` passed.
  - Official `develop-web-game` client verified `/#battle` and saved `output/web-game/image-assets-client/shot-0.png`.
  - Full flow screenshots saved at `output/web-game/image-assets-final/`.
  - Browser console had only Vite/React dev info logs; no page errors.
- Known follow-up:
  - Image files are large, so release builds need WebP conversion, icon downscaling, and atlas slicing.
  - Unit sprite sheets contain large per-frame whitespace, so units currently render a bit smaller than ideal; frame auto-crop or pre-cut atlases should be added next.

2026-06-03 visual audit before repair:
- User reported the game does not feel mobile-first, lobby background/content assets look disconnected, loading screen lacks image quality, and battle sprites are cut/broken.
- Captured desktop/mobile opening, loading, lobby, and battle screens under `output/web-game/visual-audit/`.
- Confirmed major mobile layout issue: lobby panels and battle portal overlap in 390x844 viewport.
- Confirmed SPA navigation issue: changing hash to `#battle` after the app is already loaded does not update the Zustand screen; direct fresh load works.
- Confirmed sprite sheet issue:
  - Unit sheets are 1254x1254 but current code assumes 8x5 frames, producing fractional frame size 156.75x250.8.
  - Frame contents are not contained inside their cells; dog soldier and some cat attack frames cross cell boundaries.
  - Current slicing causes black fragments, cropped weapons, and adjacent-frame artifacts in battle.
- Generated frame audit overlays under `output/web-game/visual-audit/sprite-frames/`.
- Confirmed loading screen still uses CSS-only road/cloud/cat shapes and should be upgraded to image-backed loading art.

2026-06-03 visual repair update:
- Runtime-ready unit and VFX atlases were generated under `src/assets/generated/atlas` and wired through `src/game/imageAssets.ts`.
- Added hash-route synchronization so `/#battle`, `/#lobby`, and `/#opening` update the active Zustand screen after the app is already loaded.
- Reworked mobile lobby CSS so it behaves like a phone screen: top currency strip, image-backed hub, battle portal, and scrollable cards instead of overlapping absolute panels.
- Upgraded loading screen presentation with the lobby background image and atlas-based cat party icons.
- Reframed the battle renderer for portrait screens: the board now sits under the title instead of floating in the vertical center, and the page backdrop uses a blurred battle-map image so the board and background no longer feel detached.
- Verification:
  - `npm test` passed: 9/9 tests.
  - `npm run build` passed.
  - Official `develop-web-game` client verified `/#battle` after the repair and saved `output/web-game/repair-client-2/shot-0.png`.
  - Full desktop/mobile flow screenshots saved under `output/web-game/repair-final-2/`.
  - Mobile lobby scroll access was verified and saved as `output/web-game/repair-final-2/mobile-03-lobby-scrolled.png`.
  - Loaded-app hash navigation was verified with `location.hash = "#battle"` and saved as `output/web-game/repair-final-2/mobile-hash-sync-battle.png`.
  - Browser console logs were clean in the Playwright desktop/mobile flow.
- Remaining release-quality follow-up:
  - The generated PNG assets are still large; convert heavy UI/background assets to WebP and downscale icons before production.
  - The current mobile battle uses a square map, so some vertical empty space is unavoidable; future stages should add portrait-specific decorative HUD bands or minimap/objective panels if the game remains portrait-only.

2026-06-04 mobile polish and battle readability update:
- User reported that cats did not clearly face their walking direction, walking animation felt too jumpy, battle action buttons were unclear, the victory screen lacked image impact, lobby still did not feel mobile, super cat needed stronger presence, and unit health bars sat too low.
- Reworked the app shell into a centered mobile portrait frame even inside a wide desktop browser.
- Switched lobby layout rules to the mobile card/scroll layout for all browser widths, matching the mobile-first game target.
- Reversed sprite facing because the source atlases face left by default; player cats now face their movement direction toward the enemy line.
- Slowed unit sprite frame timing and reduced walk bobbing so movement is calmer.
- Raised unit health bars above the head area and added larger super-cat health bars.
- Increased super cat render scale and added a glowing aura ring so it reads as a hero unit.
- Reworked battle action buttons into icon + main label + short effect label:
  production speed, attack damage, HP increase, enemy bombardment, ally heal, and 30-second super hero.
- Upgraded the victory screen using image layers and reward icons:
  `43-victory-burst.png`, `45-reward-count-up-glow.png`, `40-gold-currency.png`, `39-fish-currency.png`, and `41-super-cat-ticket.png`.
- Added `docs/game-design/result-screen-image-effects-list.md` with applied and future result-screen image asset needs.
- Verification:
  - `npm test` passed: 9/9 tests.
  - `npm run build` passed.
  - Official `develop-web-game` client verified `/#battle` and saved `output/web-game/mobile-polish-client-2/shot-0.png`.
  - Final visual screenshots saved under `output/web-game/mobile-polish-final-2/`.
  - Playwright flow had no console errors.

2026-06-04 battle UX state and targeting polish update:
- User reported that production/attack/HP buttons should show current state and growth effect, global fire magic should require a drop-location step, victory should not show retry, lobby side content was still too dominant, loading art was cut on the right, unit health bars looked empty, super-cat frames looked broken, and units should face their attack direction.
- Battle upgrades now show current levels and effect values both in the battle status strip and on each action button.
- Fire Bombardment now enters a target-picking mode; the player taps the battlefield to choose the impact location before the skill is cast.
- The battle status strip highlights the target-picking instruction while a global skill is waiting for a battlefield tap.
- Victory results now show only the lobby button; retry remains available only on defeat.
- Lobby order was changed so the main kingdom hub and stage/battle area come before compact daily rewards and missions.
- Loading screen width/inset rules were tightened so the portrait loading card no longer clips on the right.
- Health-bar fill drawing now uses adaptive insets so small unit bars show visible colored HP instead of empty dark slots.
- Units now face their current attack target while attacking, not only their movement direction.
- Runtime sprite facing now accounts for mixed source-atlas directions: normal cat atlases and dog/super-cat atlases are flipped differently based on their source orientation.
- Super-cat and dog attack frame sequences now skip known bad/empty atlas cells to reduce broken-frame artifacts during animation.
- Verification:
  - `npm test` passed: 9/9 tests.
  - `npm run build` passed.
  - Official `develop-web-game` client verified `/#battle` after the changes and saved `output/web-game/state-target-polish-client/shot-0.png`.
  - Final visual screenshots saved under `output/web-game/state-target-polish-final/`.
  - Captured checks included loading no-cut, lobby main-stage priority, upgrade-state labels, fire target step, super-cat/facing, and victory no-retry.
  - Playwright console logs were clean.
- Remaining release-quality follow-up:
  - The current super-cat source sheet still has imperfect frame contents. Runtime skips the worst cells, but a production-ready super-cat sprite sheet should be regenerated with consistent 8x5 transparent cells, aligned feet, and no partial duplicate bodies.

2026-06-06 stage lock, shop, and battle-exit update in progress:
- Latest user request: add full-map close access, fix lobby bottom overlap, lock stages until previous clears, fix backward-looking battle sprites, add battle exit confirmation, add shop/basic upgrades/character purchases, remove unnecessary center rune, and rebalance so upgrades matter.
- Implemented store-level progression rules:
  - only the first uncleared stage is unlocked,
  - locked stages cannot start,
  - progress now stores owned character IDs,
  - shop can buy permanent kingdom upgrades and mission-unlocked cat units.
- Reworked lobby source into a clearer stage/shop hub with locked stage labels, shop modal, character shop rows, and sticky full-map close/action footer.
- Reworked battle source with exit confirmation, owned-unit filtering for player unit pools, clearer ability rules in render_game_to_text, and improved Korean UI labels.
- Removed the central magic rune draw calls and changed hit-state sprite rows to reuse walk frames to reduce backward/broken hit frames.
- Increased enemy stage scaling and player upgrade bonus values so shop upgrades and unit purchases matter more.
- Added new character/shop/VFX prompts to docs/game-design/image-asset-prompt-pack.md.
- Next: run typecheck/tests/build, fix failures, then verify lobby/world-map/battle screenshots with Playwright.

2026-06-06 stage lock, shop, and battle-exit update complete:
- Added a top close button to the shop modal after visual review showed the long shop sheet needed an immediate exit path.
- Fixed the battle exit button click layer by giving it pointer events above the canvas.
- Verified lobby bottom panels no longer overlap in the mobile portrait frame.
- Verified full world map at bottom scroll keeps `전체지도 닫기` and battle action visible.
- Verified stage lock state: fresh progress unlocks stage 001 only and stage 002+ are locked in render_game_to_text.
- Verified battle exit confirmation opens, and confirming returns to the lobby.
- Verified owned unit filtering: fresh progress uses only swordsman/archer in the player battle pool.
- Verification:
  - `npm test` passed: 17/17 tests.
  - `npm run build` passed.
  - Official develop-web-game client verified `/#lobby` and `/#battle`.
  - Direct Playwright flow verified lobby -> shop -> full map bottom -> battle -> exit confirm -> lobby return.
  - Captures saved under `output/web-game/stage-shop-flow/`, `output/web-game/stage-shop-official-lobby/`, and `output/web-game/stage-shop-official-battle/`.
- Note: this folder is not a Git repository, so git status/diff could not be produced.
- Remaining follow-up:
  - Production assets are still large and should be optimized to WebP/downsized atlases before packaging.
  - The static compass mark is baked into the battle map image; the separate rotating rune overlay and its unused renderer function have been removed.
  - Final recheck after removing the unused rune function: `npm test` passed 17/17 and `npm run build` passed.

2026-06-06 opening screen image polish update:
- User reported that the first screen still looked like it lacked real images, especially the area above the title and the bottom moving strip.
- Confirmed existing assets include `04-opening-background.png` and `05-opening-title-logo.png`, but `05-opening-title-logo.png` has a baked checkerboard background and is not production-ready for direct use.
- Replaced opening-screen mojibake labels with clean Korean text.
- Replaced the top CSS-drawn paw crest with an existing image-backed reward crest treatment using `41-super-cat-ticket.png`.
- Replaced the bottom CSS-drawn marching cat shapes with actual character atlas sprites from swordsman, archer, tank, and mage atlases.
- Removed title opacity animation dependency so the first screen title/buttons are visible immediately in browser captures.
- Added new image prompts to `docs/game-design/image-asset-prompt-pack.md`:
  - transparent title logo replacement,
  - opening foreground hero parade,
  - opening top reward crest.
- Verification:
  - Official develop-web-game client captured `/#opening` under `output/web-game/opening-image-polish-2/`.
  - `npm test` passed: 17/17 tests.
  - `npm run build` passed.

2026-06-05 lobby/battle visual priority update:
- User reported that lobby missions and stage selection were still too large and text-heavy, and the battle controls made the battle screen feel smaller.
- Reworked the mobile lobby visual hierarchy so the chapter/world map and battle portal occupy almost the full portrait screen.
- Changed the lobby hub background to the image-backed chapter map (`13-chapter-map-background.png`) so the lobby reads as a playable map instead of a text dashboard.
- Converted stage selection into a small right-side numbered node stack; stage names no longer dominate the first view.
- Kept daily reward, mission, event, and pass content as small fixed overlay badges near the bottom instead of full-width stacked cards.
- Reworked the battle camera from a square-only board to a portrait battlefield viewport:
  - positions use separate X/Y screen scales,
  - unit/base sizes keep the smaller uniform scale,
  - the battle map now fills most of the phone-height screen instead of leaving a large blank area.
- Moved battle action buttons onto the lower part of the battlefield as a compact one-row in-game control bar.
- Verification:
  - `npm test` passed: 9/9 tests.
  - `npm run build` passed.
  - Official `develop-web-game` Playwright client verified `/#battle` after layout changes.
  - Final visual screenshots saved under `output/web-game/layout-priority-final-4/`.
  - Console logs contained only Vite/React dev messages; no page errors.

2026-06-05 battle economy implementation update:
- Added temporary battle money to BattleState/BattleSnapshot: starts at 0, grows during battle, gains bonus on enemy defeat, and resets with each new battle.
- Changed BattleEngine.upgrade() to return a result, block purchases without enough battle money, subtract cost on success, and emit warning/upgrade events for visual feedback.
- Added scaling upgrade costs for production, attack, and health.
- Updated BattleScreen to show battle money, upgrade costs, affordable/blocked states, success/blocked toast feedback, and render_game_to_text economy fields.
- Added a Lobby "전투 연구소" guide modal explaining that real upgrades happen only inside battle with battle money.
- Verification:
  - `npm test` passed: 11/11 tests.
  - `npm run build` passed.
  - State-level Playwright check saved under `output/web-game/battle-economy-state-check-3/`:
    start money 0, first upgrade blocked with warning, 7-second funded state can afford production, paid click raises production to Lv 1 and increases next cost.
  - Mobile visual screenshots saved under `output/web-game/battle-economy-visual-final-2/`.
  - Official develop-web-game client succeeded with a short battle run and saved `output/web-game/battle-economy-client-short/shot-0.png` plus `state-0.json`.
  - Console/page errors were clean in the direct Playwright checks.
- Remaining release-quality follow-up:
  - Generated PNG assets are still very large, which makes screenshot capture slow and should be optimized before store packaging.

2026-06-06 lobby hub, ability rules, and sprite readability update:
- User feedback: the lobby did not clearly explain its purpose, the stage numbers were hard to understand, bottom lobby panels still felt crowded, fire/heal/super-cat availability rules needed to be visible, and some battle sprites looked too small or disappeared during walking.
- Reworked `LobbyScreen` into a clearer hub:
  - central selected-stage summary,
  - compact stage minimap,
  - right-side stage selector with selected stage name and `전체 지도`,
  - full world-map modal with stage rewards,
  - actual `왕국 연구소` modal for permanent Gold upgrades.
- Added permanent kingdom upgrades to `gameStore`:
  - `보급 훈련` applies starting production level,
  - `검술 훈련` applies starting attack level,
  - `방어구 정비` applies starting health level,
  - purchases use lobby Gold earned from battle results.
- Applied permanent kingdom upgrades to battle initialization so lobby research visibly affects the next battle.
- Clarified battle ability buttons:
  - fire shows ready/targeting/cooldown state,
  - heal shows ready/cooldown state,
  - super-cat shows ready/cooldown state,
  - `render_game_to_text` now exposes ability cooldown seconds.
- Improved sprite readability:
  - increased unit/super-unit visual scale for mobile,
  - made walk frames advance faster,
  - skipped known empty/unstable mage and tank atlas cells so units no longer appear to vanish mid-animation.
- Mobile lobby layout adjustments:
  - moved the portal upward,
  - kept daily/mission/event/pass cards in separated bottom positions,
  - made stage selection and full map purpose visible without relying on unlabeled numbers.
- Verification:
  - `npm test` passed: 12/12 tests.
  - `npm run build` passed.
  - Direct Playwright mobile verification saved under `output/web-game/lobby-map-research-ability-sprite-check-2/`:
    lobby, research modal, purchase state, full map, selected stage, battle after 8 seconds, and ability cooldown screenshots.
  - Playwright state confirmed lobby Gold 620, research purchase `supply: 1`, stage 004 selection, ability cooldowns after use `{ fire: 4, heal: 6, superCat: 60 }`, and no console/page errors.
  - Official develop-web-game client completed and saved `output/web-game/final-lobby-sprite-ability-client/shot-0.png`.

2026-06-06 200-stage expansion and late-game balance update:
- User feedback: some cat units still appeared to face backward, the game needed far more stages, and the overall balance/fun loop needed improvement.
- Fixed unit-facing rules in `renderBattle` by separating source sprite directions:
  - swordsman/archer/mage cat sheets face left, so they are flipped to face the enemy front,
  - tank cat and super-cat sheets already face right, so they are no longer flipped backward,
  - dog units consistently face toward the player side.
- Replaced the small stage JSON dependency with generated `src/data/stages.ts`:
  - 200 stages total,
  - 10 regions with 20 stages each,
  - staged reward growth,
  - mid-boss/boss reward bumps,
  - player unit unlocks by progress,
  - enemy unit pools become more varied over time.
- Added enemy variety in `units.json`:
  - `dog_raider`,
  - `dog_guard`,
  - `dog_captain`.
- Reworked lobby stage UX for 200 stages:
  - central selected-stage card shows `001 / 200`,
  - region selector shows 10 region nodes,
  - right panel shows only nearby 7 stages with previous/next controls,
  - full map modal contains all 200 scrollable stages.
- Adjusted battle production pacing:
  - production levels are now 1, 1.45, 2.1, 2.8 units/sec instead of 1, 2, 4, 8,
  - late stages are still harder but no longer flood the screen as aggressively.
- Cleaned remaining Korean UI text in lobby/loading/result flows and made Result rewards reflect the selected stage.
- Added `stageData.test.ts` to verify 200 stages, reward scaling, late enemy pools, and `stage_200` battle creation.
- Verification:
  - `npm test` passed: 15/15 tests.
  - `npm run build` passed.
  - Direct Playwright mobile verification saved under `output/web-game/stage200-facing-balance-final/`.
  - Playwright confirmed `stageCount: 200`, full-map node count 200, selected `stage_200`, entered `stage_200` battle, and reported no console/page errors.
  - Official develop-web-game client completed and saved `output/web-game/stage200-facing-official-client/shot-0.png`.

2026-06-06 no-shake and mobile lobby clarity update:
- User feedback: repeated base-hit screen shake felt nauseating, battle upgrade money was not visible enough, the lobby bottom panels overlapped the central battle portal, and the right-side stage numbers did not explain their purpose.
- Disabled camera shake in the battle renderer; impact/explosion effects remain visual-only and no longer move the camera.
- Added a dedicated `전투머니` wallet badge to the battle HUD, separate from the small upgrade status chips.
- Changed the lobby stage number buttons so they select a stage only; actual battle start remains on the central portal, which now shows the selected stage name.
- Added a visible `전선 선택` label and selected-state styling to the right-side stage stack.
- Moved the central battle portal upward and reduced its size so it no longer overlaps bottom daily/mission/pass panels.
- Verification:
  - `npm test` passed: 11/11 tests.
  - `npm run build` passed.
  - Direct Playwright mobile screenshots saved under `output/web-game/no-shake-wallet-lobby-fix/`.
  - Stage number click stayed on `#lobby`, selected `stage_003`, and updated the portal target to `마법 숲길`.
  - Official develop-web-game client succeeded and saved `output/web-game/no-shake-wallet-client-short/shot-0.png` plus `state-0.json`.

2026-06-06 shop/stage UX and content prompt update in progress:
- User feedback: shop is too text-heavy, shop and character shop should separate, map numbers are unclear, today's reward/front buttons need feedback, modal battle buttons duplicate the central portal, replayed cleared stages should pay half income, and mage cat still appears backward.
- Reworked lobby intent:
  - central battle portal is the only battle start action,
  - stage list and full map select fronts only,
  - 1-10 number plate is labeled as region quick jump,
  - upgrade shop and character shop are separate image-style map buttons,
  - daily reward and today's front buttons now update an on-screen status notice.
- Added actual replay reward logic: first clear pays full stage reward, replay clear pays 50% Gold/Fish and result screen shows the paid amount.
- Updated cat unit visual facing so player cats use the generated sprite direction instead of being mirrored.
- Added consolidated plan and prompt file: `docs/game-design/content-expansion-and-image-prompts-2026-06-06.md`.

2026-06-06 shop/stage UX and content prompt update complete:
- Adjusted temporary character shop portraits so tank and mage cards crop a visible sprite-frame instead of showing a full atlas or blank frame.
- Verification:
  - `npm test` passed: 18/18 tests.
  - `npm run build` passed.
  - Direct mobile Playwright flow saved under `output/web-game/shop-stage-ux-flow/`.
  - Verified upgrade shop, character shop, daily reward feedback, world map select-only behavior, central portal battle start, and no console/page errors in `state.json`.
  - Official develop-web-game client was run and saved `output/web-game/shop-stage-ux-final-official/shot-0.png`; direct mobile screenshots remain the source of truth for the portrait UI because the official full-page capture included unrelated wide-page overlay artifacts.

2026-06-06 player cat facing correction:
- User feedback: player-side cats appeared to walk while facing backward in battle.
- Inspected the current cat sprite atlases and found their source-facing directions are not uniform:
  - swordsman and archer source frames face left,
  - mage, tank, and super knight source frames face right.
- Updated `src/game/renderBattle.ts` so player unit mirroring is decided by sprite key instead of applying one global cat-kingdom direction.
- Verification:
  - `npm test` passed: 18/18 tests.
  - `npm run build` passed.
  - Direct mobile Playwright screenshots saved under `output/web-game/player-facing-fix/`.
  - `battle-facing-after-fix.png` verified swordsman/archer face the enemy side.
  - `battle-facing-all-cats.png` verified swordsman, archer, tank, and mage all face the enemy side when owned together.
  - Official develop-web-game client completed and saved `output/web-game/player-facing-fix-official/shot-0.png`; the official state included active units with no console/page errors, while the direct mobile captures are the clearer visual source for unit direction.

2026-06-06 lobby map shop building update:
- User feedback: upgrade shop and character shop should be visible as map buildings like the battle portal, not just small UI buttons.
- Updated `src/styles.css`:
  - converted `.shop-shortcuts` into a full map overlay,
  - made upgrade shop and character shop actual building-sized touch targets on the lobby map,
  - used research lab and shop building images as the visible buttons,
  - kept labels attached to the buildings,
  - moved the idle animation from the clickable button box to the child building image so automated and real touch clicks remain stable.
- Verification:
  - `npm test` passed: 18/18 tests.
  - `npm run build` passed.
  - Official lobby screenshot saved under `output/web-game/map-shop-buildings-official/shot-0.png`.
  - Official selector-click checks opened both shops:
    - `output/web-game/map-upgrade-shop-click-official/shot-0.png`,
    - `output/web-game/map-character-shop-click-official/shot-0.png`.

2026-06-07 generated image application in progress:
- User added a new generated image set and asked to inspect and apply it to the game.
- Imported 74 PNGs from `image/content-expansion-and-image-prompts-READY_TO_COPY-20260606` into `src/assets/generated`.
- Removed baked checkerboard backgrounds from transparent-style cutouts/sprites before app use; opaque backgrounds such as shop interiors and region maps were kept intact.
- Applied new visual assets to:
  - opening logo, reward crest, and bottom parade foreground,
  - lobby region map background, shop buildings, and central battle portal,
  - region quick-jump plaque and world/stage node icons,
  - daily reward, today front, and kingdom pass panels,
  - upgrade shop and character shop interior backgrounds,
  - shop item/card frames and owned/locked badges,
  - victory result celebration effect.
- Reconnected enemy sprite keys to their matching dog unit IDs and added generated `dog_mage` and `dog_siege_brute` sprites for late-stage enemy pools.
- Verification:
  - `npm test` passed: 18/18 tests.
  - `npm run build` passed.
  - Official develop-web-game client screenshots:
    - opening: `output/web-game/generated-image-apply-opening/shot-0.png`,
    - lobby: `output/web-game/generated-image-apply-lobby/shot-0.png`,
    - upgrade shop: `output/web-game/generated-image-apply-upgrade-shop-r2/shot-0.png`,
    - character shop: `output/web-game/generated-image-apply-character-shop/shot-0.png`,
    - battle: `output/web-game/generated-image-apply-battle/shot-0.png`.
  - Visual check confirmed the opening logo/parade, lobby map buildings/portal/panels, shop backgrounds/frames/icons, and battle unit sprites are visible.

2026-06-07 shop close and sprite-facing correction:
- User feedback:
  - upgrade shop and character shop had duplicate close actions,
  - player units appeared to walk backward,
  - enemy attack frames sometimes looked like broken vertical slices.
- Removed the bottom duplicate close buttons from both upgrade and character shop modals; the top-right close button is now the single close action.
- Reworked sprite facing logic in `renderBattle.ts`:
  - source sprite facing and desired faction facing are now separated,
  - cat faction units are forced to face right,
  - dog faction units are forced to face left.
- Restricted dog attack frame sequences to stable body-visible frames only to avoid generated-sheet frames that contain mostly effects or partial silhouettes.
- Rechecked stage 8 battle with injected progress and owned cats:
  - screenshot: `output/web-game/facing-frame-fix-stage8-r3/stage8-battle-after-fix.png`,
  - no console errors in `output/web-game/facing-frame-fix-stage8-r3/console.json`.
- Rechecked shop modals:
  - character shop: `output/web-game/shop-close-dedupe-character/shot-0.png`,
  - upgrade shop: `output/web-game/shop-close-dedupe-upgrade-direct-r2/upgrade-shop.png`.
- Verification:
  - `npm test` passed: 18/18 tests.
  - `npm run build` passed.

2026-06-07 active sprite frame audit and animation stability fix:
- User feedback:
  - some enemy walk animations were rendering broken vertical slices,
  - the player archer disappeared for one attack frame,
  - all active and later-stage character sprite sheets needed a frame/facing check.
- Audited the active battle sprite sheets and generated frame-grid review images under `output/web-game/sprite-audit/`.
- Findings:
  - `cat_archer` attack frame 5 contains only the projectile, so the archer appears to vanish,
  - `cat_mage` attack frame 6 contains only a magic burst,
  - `dog_raider` idle/walk/hit/death rows include several split-body cells, which caused broken enemy motion,
  - `dog_mage` and `dog_siege_brute` are valid 8x5 sheets, but a few attack cells are effect-only and should not be looped as character frames.
- Updated `src/game/renderBattle.ts` so the renderer uses body-visible stable frame sequences per sprite and state.
- Added `src/test/spriteFrames.test.ts` to lock the most important skipped frames:
  - archer attack no longer includes the characterless projectile-only frame,
  - mage attack no longer includes the burst-only frame,
  - dog raider walk/attack avoid split-body frames,
  - late-stage dog mage/siege attack loops use body-visible frames.
- Verification:
  - `npm test` passed: 21/21 tests.
  - `npm run build` passed.
  - Stage 15 direct Playwright verification with all owned cats saved:
    - `output/web-game/sprite-frame-fix-stage15/03-battle-5500ms.png`,
    - `output/web-game/sprite-frame-fix-stage15/04-battle-8100ms.png`,
    - no console/page errors in `output/web-game/sprite-frame-fix-stage15/state.json`.
  - Official develop-web-game client completed and saved `output/web-game/sprite-frame-fix-official/shot-0.png`.
  - The worktree directory currently is not a Git repository, so git diff/status was unavailable.

2026-06-07 daily mission, reward boost, occupation speed, and shop expansion pass:
- User feedback:
  - enemy wolf/raider frames still sometimes looked clipped,
  - victory should offer an ad-style 2x reward effect,
  - capture/occupation cleanup should move faster,
  - daily mission progress was not actually clearing,
  - daily/reward/pass panels needed clearer backgrounds,
  - character shop needed more visible content from the generated image set.
- Changes:
  - tightened `dog_raider` frame sequences to only body-safe frames,
  - wired 9 generated cat sprite sheets into unit assets/data and added them as staged character shop unlocks,
  - added 14 future character cards with generated-image portraits to make shop depth visible without inventing unbuilt mechanics,
  - appended owned character units to the battle unit pool after the stage's base pool so purchased cats can appear in existing stages,
  - added persisted daily mission stats for battle participation, fire/heal skill use, stage clears, and daily reward claim state,
  - added a one-time mock ad 2x reward button on victory results and persisted the extra Gold/Fish payout,
  - added automatic 2x speed during enemy-base occupation cleanup,
  - reduced decorative panel background opacity and added clear complete/claimed states.
- Verification:
  - `npm test` passed: 24/24 tests.
  - `npm run build` passed.
  - Official develop-web-game client lobby capture saved under `output/web-game/latest-request-check/official-lobby/`.
  - Official character shop capture saved under `output/web-game/latest-request-check/official-character-shop/`.
  - Direct mobile Playwright battle/result flow saved under `output/web-game/latest-request-check/direct-battle-result/`.
  - Direct state confirmed reward multiplier changed from 1 to 2 after mock ad, no page errors were recorded, and occupation speed reached `battleSpeed: 2`.

2026-06-08 wolf frame, base scale, and sound prompt pass:
- User feedback:
  - enemy wolf/dog walking still looked slightly clipped,
  - battle castles should be about 1.5x larger,
  - a sound prompt file was needed for the game.
- Changes:
  - increased battle base image rendering to 1.5x while scaling the base shadow with it,
  - tightened every dog/wolf sprite state to use only the first edge-safe frame so atlas cell spill cannot render as broken slices,
  - added battle image preloading on `BattleScreen` to reduce initial fallback-base rendering,
  - added `docs/audio/SOUND_PROMPTS_2026-06-08.md` with BGM, battle SFX, UI, economy, reward, and mixing prompts.
- Verification:
  - `npm test` passed: 25/25 tests.
  - `npm run build` passed.
  - Official develop-web-game client capture passed under `output/web-game/wolf-base-sound-check/official-battle-r2/`.
  - Direct mobile stage 22 capture passed under `output/web-game/wolf-base-sound-check/direct-stage22-r2/`.
  - Direct state confirmed `stage_022`, no page/console errors, enlarged bases, and dog units facing left while player cats face right.
- Note:
  - `D:\dev\game314` is currently not a Git repository, so git diff/status is unavailable.

2026-06-08 content expansion images and lobby overlap pass:
- User feedback:
  - `image/content-expansion-and-image-prompts-READY_TO_COPY-20260606` should be checked, applied if needed, and deleted once applied,
  - the top-center selected-stage card and region quick-jump area appeared to overlap in the lobby.
- Changes:
  - compared 74 source images against `src/assets/generated`; all names existed but all hashes differed,
  - copied the 74 READY_TO_COPY images into `src/assets/generated` and verified hashes matched after copy,
  - deleted only the verified source folder `image/content-expansion-and-image-prompts-READY_TO_COPY-20260606`,
  - moved `.stage-minimap` lower to separate it from `.stage-summary-card`.
- Verification:
  - direct Playwright mobile layout check changed selected-card/quick-jump overlap from true to false,
  - final measured gap between selected-card and quick-jump is 17px, with 137px between quick-jump and battle portal,
  - `npm test` passed: 25/25 tests,
  - `npm run build` passed,
  - official develop-web-game client capture saved under `output/web-game/lobby-overlap-check-after/official/`.

2026-06-09 front selection overlap and enemy atlas normalization pass:
- User feedback:
  - the top-center selected front card and right-side front selection panel still looked overlapped,
  - enemy character animation frames still looked imperfect and needed a one-by-one frame review.
- Changes:
  - kept the mobile lobby layout fix at `.stage-summary-card { left: 39%; width: min(218px, calc(100% - 208px)); }`,
  - kept `.stage-minimap` lower/narrower so the selected front card, quick-jump, and right panel do not collide,
  - reviewed all active enemy sheets one by one:
    - `26-dog-soldier-atlas.png`,
    - `35-dog-raider-atlas.png`,
    - `36-dog-guard-atlas.png`,
    - `37-dog-captain-atlas.png`,
    - `38-dog-mage.png`,
    - `39-dog-siege-brute.png`,
  - found the active enemy sheets were `1254x1254`, which creates fractional 8x5 frame cells and can cause subtle frame bleed,
  - generated six normalized `1280x1280` enemy atlases with integer `160x256` cells:
    - `26-dog-soldier-fixed-atlas.png`,
    - `35-dog-raider-fixed-atlas.png`,
    - `36-dog-guard-fixed-atlas.png`,
    - `37-dog-captain-fixed-atlas.png`,
    - `38-dog-mage-fixed-atlas.png`,
    - `39-dog-siege-brute-fixed-atlas.png`,
  - removed checkerboard backgrounds from the mage and siege brute normalized atlases,
  - updated `src/game/imageAssets.ts` to use the normalized enemy atlases,
  - changed `src/game/renderBattle.ts` so enemy walk/idle/death rows use full body-visible loops again while attack rows skip effect-only frames,
  - updated `src/test/spriteFrames.test.ts` to lock the new dog frame rules.
- Verification:
  - `npm test` passed: 25/25 tests,
  - `npm run build` passed,
  - official develop-web-game client lobby capture saved under `output/web-game/enemy-frame-and-lobby-check/official-lobby/`,
  - mobile lobby layout metrics saved under `output/web-game/enemy-frame-and-lobby-check/layout/metrics.json`,
  - latest mobile layout metrics show no overlap:
    - selected front card to right panel gap: 23px,
    - quick-jump to right panel gap: 32px,
    - selected front card to quick-jump gap: 17px,
  - stage 22 mobile battle capture saved under `output/web-game/enemy-frame-and-lobby-check/stage22-debug/stage22-debug.png`,
 - stage 181 mobile battle capture saved under `output/web-game/enemy-frame-and-lobby-check/stage181/stage181-battle.png`,
  - both direct battle checks recorded no page/console errors.

2026-06-09 front selection spacing follow-up:
- User feedback:
  - the right-side front selection panel still visually felt overlapped with the selected-front card.
- Changes:
  - changed the mobile lobby selected-front card into a fixed left information column instead of a near-center overlay,
  - moved the region quick-jump plate into the same left column,
  - reserved the right side for the `전선 선택` panel so the three lobby controls no longer compete for the same visual space.
- Verification:
  - direct mobile Playwright screenshot saved at `output/web-game/front-panel-overlap-fix/after/after.png`,
  - official develop-web-game client screenshot saved at `output/web-game/front-panel-overlap-fix/official/shot-0.png`,
 - latest mobile layout metrics show no overlap:
    - selected front card to right panel gap: 58px,
    - quick-jump to right panel gap: 100px,
    - selected front card to quick-jump gap: 17px,
  - `npm test` passed: 25/25 tests,
  - `npm run build` passed.

2026-06-10 lobby card size and enemy frame repack pass:
- User feedback:
  - the selected front card for stage 022 felt too large,
  - enemy wolf/raider animation still looked imperfect and needed frame-by-frame inspection.
- Changes:
  - reduced the mobile selected-front card width from 218px to 198px and tightened its text sizing,
  - generated reviewed frame-grid sheets under `output/web-game/enemy-frame-audit-2026-06-10/`,
  - created six repacked enemy atlases with cell-local centered frames:
    - `26-dog-soldier-repacked-atlas.png`,
    - `35-dog-raider-repacked-atlas.png`,
    - `36-dog-guard-repacked-atlas.png`,
    - `37-dog-captain-repacked-atlas.png`,
    - `38-dog-mage-repacked-atlas.png`,
    - `39-dog-siege-brute-repacked-atlas.png`,
  - updated battle image assets to use the repacked atlases,
  - tightened dog soldier and dog raider frame sequences so clipped body/effect-only frames are not used in active animation,
  - updated sprite frame tests to lock the safer dog soldier and wolf raider sequences.
- Verification:
  - mobile lobby capture saved at `output/web-game/lobby-card-wolf-fix-2026-06-10/lobby-stage22-card.png`,
  - mobile battle capture saved at `output/web-game/lobby-card-wolf-fix-2026-06-10/battle-stage22-wolf.png`,
  - layout metrics show no overlap:
    - selected front card width: 196px,
    - selected front card to right panel gap: 76px,
    - quick-jump to right panel gap: 100px,
  - stage 022 battle state included dog soldier, wolf raider, and dog guard units with no page/console errors,
  - official develop-web-game client screenshot saved at `output/web-game/lobby-card-wolf-fix-2026-06-10/official/shot-0.png`,
 - `npm test` passed: 26/26 tests,
 - `npm run build` passed.

2026-06-10 sound integration pass:
- User feedback:
  - sound files were added under `sound/` and needed to be matched to the game.
- Changes:
  - added `src/game/audio.ts` as a guarded HTMLAudio manager with BGM/SFX manifests, autoplay unlock handling, SFX pooling, and cooldown throttling,
  - mapped opening, lobby, and battle BGM plus 33 SFX/stingers from `sound/SOUND_PROMPTS_READY_TO_COPY_20260608`,
  - connected opening buttons, lobby stage/shop/reward interactions, battle upgrades/skills/hits/base events/occupation speedup, and result victory/defeat/ad double reward flows,
  - added `src/test/audioAssets.test.ts` so all 36 sound assets must resolve to real files.
- Verification:
  - `npm test` passed: 27/27 tests,
  - `npm run build` passed and Vite emitted all `.ogg` / `.wav` files into `dist/assets`,
  - official develop-web-game client capture saved under `output/web-game/sound-check/`,
  - direct Playwright click flow generated `output/web-game/sound-direct-check/battle-after-audio-clicks.png`,
  - direct click flow recorded `errors.json` as an empty array.

2026-06-11 touch scroll and transparent unit atlas pass:
- User feedback:
  - mobile-style shop/map panels should scroll by dragging with mouse/touch,
  - some character animation frames appeared with white transparent-background boxes in battle.
- Changes:
  - added `src/hooks/useDragScroll.ts` for pointer-based drag scrolling while preserving normal button taps,
  - applied drag scrolling to the upgrade shop, character shop, and full world map panels,
  - changed shop panels back to scrollable containers after a later `overflow: hidden` rule was blocking drag behavior,
  - switched nine expanded cat units from original generated PNG sheets to transparent cleaned atlases:
    - `25-priest-cat-transparent-atlas.png`,
    - `26-lancer-cat-transparent-atlas.png`,
    - `27-bomb-cat-transparent-atlas.png`,
    - `28-ninja-cat-transparent-atlas.png`,
    - `29-engineer-cat-transparent-atlas.png`,
    - `30-frost-cat-transparent-atlas.png`,
    - `31-thunder-drummer-cat-transparent-atlas.png`,
    - `32-royal-cannon-cat-transparent-atlas.png`,
    - `33-star-knight-cat-transparent-atlas.png`,
  - updated both battle sprite references and character shop icon CSS to use the transparent atlases.
- Verification:
  - frame audit confirmed the new cat atlases have low opaque-white ratios after cleanup,
  - `npm test` passed: 27/27 tests,
  - `npm run build` passed and emitted the transparent cat atlases into `dist/assets`,
  - official develop-web-game battle capture saved at `output/web-game/touch-alpha-fix-2026-06-11/official-battle/shot-0.png`,
  - direct mobile Playwright shop drag check saved at `output/web-game/touch-alpha-fix-2026-06-11/direct-shop/character-shop-after-drag.png`,
  - direct shop drag check recorded `scrollTop` changing from 0 to 385 and no console/page errors.

2026-06-12 shop shortcut spacing and wolf frame stability pass:
- User feedback:
  - the upgrade shop shortcut overlapped nearby lobby content,
  - wolf enemy animation still felt unstable and needed frame-by-frame adjustment.
- Changes:
  - moved the mobile upgrade and character shop shortcuts to the upper-left of the map as compact building buttons,
  - reduced the mobile shop shortcut footprint so they sit above the selected-front card and quick-jump panel,
  - tightened `dog_raider` frame sequences:
    - walk now uses only stable body frames `0,1,2`,
    - attack skips overlarge slash/effect-only frames and uses `0,1,5,7`,
    - hit/death avoid the most partial side/back frames,
  - updated `src/test/spriteFrames.test.ts` to lock the safer wolf raider frame choices.
- Verification:
  - generated active wolf frame sheet at `output/web-game/shop-wolf-fix-2026-06-12/dog-raider-active-frames-after.png`,
  - mobile lobby metrics saved under `output/web-game/shop-wolf-fix-2026-06-12/direct/metrics.json`,
  - latest mobile layout metrics show no overlap between shop shortcuts and summary/minimap/portal,
  - direct stage 23 capture saved at `output/web-game/shop-wolf-fix-2026-06-12/stage23/stage23-battle.png`,
  - direct stage 23 sequence contact sheet saved at `output/web-game/shop-wolf-fix-2026-06-12/stage23-sequence/stage23-sequence-contact.png`,
 - official develop-web-game client capture saved at `output/web-game/shop-wolf-fix-2026-06-12/official-battle/shot-0.png`,
 - `npm test` passed: 27/27 tests,
 - `npm run build` passed.

2026-06-13 release polish and transparency pass:
- User feedback:
  - opening bottom parade and top reward crest looked like transparent backgrounds were not applied,
  - daily reward was already claimed on a first visit,
  - upgrade shop copy was too long and its background looked wrong,
  - character shop unreleased/ready states and native-looking scrollbar needed release polish,
  - loading title wrapped to two lines,
  - wolf raider walking frames needed another in-battle check,
  - victory top celebration overlay still looked partially opaque.
- Changes:
  - cleaned alpha on `02-opening-hero-parade-foreground.png`, `03-opening-reward-crest.png`, and `43-region-clear-celebration-vfx.png` and added alpha-format regression coverage,
  - added `lastDailyRewardDate` to persisted daily mission state so claimed rewards reset by local calendar day,
  - shortened upgrade shop descriptions and simplified shop card backgrounds,
  - removed unreleased future-character filler from the character shop, added a release note, and hid the rough native scrollbar while keeping drag/scroll behavior,
  - constrained the loading title to a single line,
  - switched the wolf raider runtime asset back to the fixed atlas and restored the full walk loop while keeping attack frames on body-safe cells.
- Verification:
  - `npm test` passed: 29/29 tests,
  - `npm run build` passed,
  - opening, daily reward reset, upgrade shop, character shop, loading, stage 23 battle, and result screenshots were captured under `output/web-game/release-polish-2026-06-13/`,
 - final direct Playwright check saved under `output/web-game/release-polish-2026-06-13/direct-final-clean/`,
 - final browser state confirmed stage 23, `dog_raider` visible across four walking samples, victory result for `stage_023`, and no page/console errors.

2026-06-13 opening opacity and wolf raider original-frame recut:
- User feedback:
  - the faster individual cats crossing the opening bottom looked semi-transparent,
  - wolf raider enemies still showed broken walking frames and needed frame-by-frame recutting.
- Root cause:
  - the fast opening cats were explicitly styled with `opacity: 0.72`,
  - the original `35-dog-raider` source has seven frames per row, but the previous runtime atlas/config treated it as eight columns, causing body parts to cross cell boundaries.
- Changes:
  - changed `.marching-cats span` to render at full opacity,
  - generated `src/assets/generated/atlas/35-dog-raider-recut-atlas.png` from the original seven-frame alpha source,
  - removed small row-boundary carryover fragments while generating the new atlas,
  - updated `dog_raider` runtime sprite config to seven columns,
  - updated wolf raider frame sequences so walk/idle use the seven original frames and attack skips effect-only/contaminated cells.
- Verification:
  - generated frame review assets under `output/web-game/wolf-raider-recut-2026-06-13/`,
  - official web-game client opening capture saved under `output/web-game/wolf-raider-recut-2026-06-13/official-opening/`,
  - direct stage 26 Playwright verification saved eight wolf walking samples under `output/web-game/wolf-raider-recut-2026-06-13/direct-stage26/`,
  - direct stage 26 state confirmed `stage_026`, eight `dog_raider` samples, new atlas fetch OK, and no page/console errors,
  - `npm test` passed: 32/32 tests,
  - `npm run build` passed and emitted `35-dog-raider-recut-atlas`.

2026-06-13 stage 26 enemy frame cleanup and roster balance pass:
- User feedback:
  - stage 26 enemy animation was improved but still sometimes showed previous-frame fragments at the left edge,
  - the current battle balance was too easy because upgrades were not needed from early play.
- Root cause:
  - `dog_soldier` was still configured as an 8-column atlas even though its source sheet is 6 columns x 5 rows,
  - `dog_guard` attack/walk/death rows include several edge-contaminated cells that should not be part of runtime loops,
  - battle setup appended every owned character to every stage pool, so owning late characters flooded mid-game battles.
- Changes:
  - generated `src/assets/generated/atlas/26-dog-soldier-recut-atlas.png` from the 6-column original source,
  - generated `src/assets/generated/atlas/36-dog-guard-recut-atlas.png` from the cleaned guard source,
  - updated `dog_soldier` runtime config to 6 columns and `dog_guard` to the cleaned recut atlas,
  - tightened `dog_soldier` and `dog_guard` state-specific frame sequences to avoid edge fragments,
  - prioritized preloading core battle sprites during the loading screen so enemies do not briefly fall back to procedural placeholder drawings,
  - added `getBattlePlayerUnitPool` and capped active battle rosters by region:
    - stages 1-10: 2 slots,
    - stages 11-20: 3 slots,
    - stages 21-60: 4 slots,
    - stages 61-120: 5 slots,
    - stages 121+: 6 slots.
- Verification:
  - recut review grids saved under `output/web-game/enemy-frame-audit-2026-06-13/recut-grids/`,
  - direct stage 26 Playwright verification saved under `output/web-game/stage26-balance-sprite-2026-06-13/direct-stage26-preload/`,
 - direct stage 26 state confirmed `stage_026`, all three recut dog atlases loaded, no page/console/request errors, and active player pool capped to `cat_swordsman`, `cat_archer`, `cat_tank`, `cat_mage` despite all characters being owned,
  - official develop-web-game client capture refreshed at `output/web-game/shot-1.png` / `output/web-game/state-1.json`,
  - `npm test` passed: 37/37 tests,
  - `npm run build` passed and emitted the new recut atlases into `dist/assets`.

2026-06-13 stage 27 facing and balance pass:
- User feedback:
  - some enemies in stage 27 still appeared to face right instead of the direction they were walking,
  - overall battle balance was too easy and did not require upgrades or level investment.
- Root cause:
  - `renderBattle` was still choosing visual sprite facing from faction/source defaults instead of the runtime unit `facing`,
  - `dog_soldier` source frames face right while `dog_raider` and `dog_guard` source frames face left, so the source-facing map needed to reflect mixed atlas directions,
  - enemy production and unit stats did not scale enough by stage, so permanent upgrades and in-battle upgrades were not meaningful around stage 27.
- Changes:
  - exported `getUnitVisualFacing` and made sprite drawing follow each unit's current movement/target direction,
  - corrected `dog_soldier` source orientation and added facing regression coverage,
  - added enemy production, hp, attack, and defense scaling from stage 11 onward,
  - added stage 27 balance tests showing no-upgrade auto-clear is blocked while in-battle upgrade investment can still win,
  - tightened `dog_guard` idle/walk/hit frame loops to avoid edge-contaminated end frames.
- Verification:
  - targeted tests passed: `spriteFrames`, `battleFacing`, and `battleBalance` (12/12),
 - official develop-web-game client refreshed `output/web-game/shot-1.png` / `output/web-game/state-1.json`,
  - direct no-upgrade stage 27 check saved under `output/web-game/stage27-facing-balance-2026-06-13/direct-no-upgrades-v3/`; state stayed in battle after 150s, enemy base HP remained 2182/2182, and no console/page errors were recorded,
  - direct upgrade stage 27 check saved under `output/web-game/stage27-facing-balance-2026-06-13/direct-upgrades/`; with production 3, attack 4, and health 10, `cat_kingdom` won by destroying the enemy base.

2026-06-14 battle VFX frame cleanup:
- User feedback:
  - the fire skill animation looked broken and each frame needed inspection,
  - other battle effects also needed image-frame checks.
- Root cause:
  - effect atlases were being sampled with a partial-row formula instead of a full row-major timeline,
  - several generated effect atlases had uneven frame cell sizes, which produced merged or empty cells when reviewed frame by frame,
  - `fx_unit_poof` reused impact frames that included non-smoke burst cells.
- Changes:
  - regenerated fire, healing, summon, impact, and base-explosion effect atlases into consistent 6 by 4 square grids,
  - added row-major effect playback through `getEffectSpriteCell`,
  - added explicit frame lists for hit sparks and unit-poof smoke/debris frames,
  - added tests covering effect frame selection and effect atlas dimensions/alpha-capable PNG format.
- Verification:
  - frame-by-frame review sheets saved under `output/web-game/effect-vfx-audit-2026-06-14/`,
 - direct Playwright effect check saved under `output/web-game/effect-vfx-audit-2026-06-14/browser-v2/`; it confirmed `fx_fire_bombardment`, `fx_healing_light`, and `fx_summon_portal` events in the running battle with no page errors or failed requests,
  - official develop-web-game client refreshed `output/web-game/shot-1.png` / `output/web-game/state-1.json`,
  - `npm test` passed: 45/45 tests,
  - `npm run build` passed and emitted the regenerated VFX atlases into `dist/assets`.

2026-06-14 privacy policy page and repository prep:
- User requested a complete privacy page HTML and then pushing all source to `https://github.com/hhy0111/cat-kingdom-wars.git`.
- Changes:
  - added `public/privacy.html` as a standalone Korean privacy policy for Cat Kingdom Wars,
  - covered localStorage game progress, Google AdMob advertising, analytics/diagnostics, third-party services, retention/deletion, user choices, child privacy, security, policy changes, and contact through GitHub Issues,
  - added an opening-screen link to `/privacy.html`,
  - added `.gitignore` to keep `node_modules`, `dist`, `output`, logs, and env files out of the repository,
  - added `src/test/privacyPage.test.ts` to ensure the page and opening link stay present.
- Verification:
  - TDD red run confirmed the privacy page and opening link were missing before implementation,
  - `npm test` passed: 47/47 tests,
  - `npm run build` passed and copied `public/privacy.html` to `dist/privacy.html`,
 - direct Playwright privacy verification saved under `output/web-game/privacy-page-2026-06-14/`; it confirmed title, 9 sections, AdMob mention, localStorage mention, contact link, and no page/request errors,
  - official develop-web-game client refreshed `output/web-game/shot-0.png` / `output/web-game/state-0.json`.

2026-06-14 GitHub Pages privacy publish fix:
- User saved GitHub Pages source as `main` branch `/docs` folder and asked for the privacy page location.
- Finding:
  - `https://hhy0111.github.io/cat-kingdom-wars/privacy.html` returned 404 because `privacy.html` existed only under `public/`, while Pages was configured to publish from `/docs`.
- Changes:
  - added `docs/privacy.html` with the same store-facing privacy policy content,
  - extended `src/test/privacyPage.test.ts` to require a `/docs` copy for GitHub Pages deployment.
- Verification:
  - TDD red run confirmed the `/docs` privacy page was missing,
  - targeted privacy page test passed: 3/3 tests.
