# Cat Kingdom Wars Monetization And Gameplay Expansion Plan

## Goal

Expand Cat Kingdom Wars beyond a simple auto-battle prototype by adding layered progression, strategic choices, live-service loops, rewarded ads, and paid products that do not block free progression.

## Monetization Principles

- Free players must be able to clear all 200 stages.
- Ads must be optional and reward-focused.
- Paid products should reduce time, increase convenience, or improve presentation.
- Do not sell mandatory combat power walls.
- Do not interrupt active battles with forced ads.
- Do not make super cats mandatory for stage clears.
- Do not tune stages around payment.

## Core Game Loop Expansion

```text
Lobby -> Stage Selection -> Battle Preparation -> Auto Frontline Battle
-> Result -> Reward Choice -> Research/Upgrade -> New Stage/Side Activity
```

The current game jumps too quickly from lobby to one battle. The release loop should add preparation and post-battle choices.

## Added Gameplay Layers

### 1. Battle Preparation

Before battle, the player chooses a small number of strategic settings:

- Main unit priority: balanced, melee-heavy, ranged-heavy, tank-heavy
- Starting skill loadout: 2-3 skills from unlocked skills
- Super cat slot: one selected super cat
- Battle item slot: one consumable item
- Formation width: narrow, standard, wide

This keeps the game automatic while giving the player meaningful control.

### 2. Stage Modifiers

Stages should use JSON modifiers:

- `wide_frontline`
- `neutral_base_bonus`
- `enemy_ranged_focus`
- `enemy_tank_wall`
- `fast_enemy_spawn`
- `high_enemy_base_hp`
- `skill_cooldown_pressure`
- `boss_fortress`
- `black_cat_elite`

These create variety without custom code for every stage.

### 3. Neutral Bases

Neutral bases add RTS territory pressure.

Types:

- Production Outpost: +15% spawn speed
- Watch Tower: reveals enemy movement and improves targeting
- Mana Shrine: skill cooldown recovery
- Supply Camp: bonus battle gold

Capture should be automatic based on nearby unit control.

### 4. Terrain And Weather

Map themes should affect play:

- Grassland: standard
- Desert: slower movement near sand lanes
- Forest: ranged units gain cover bonus
- Mine: more gold reward but tougher bases
- Dark Empire: enemy elite bonus and stronger skill pressure

Weather events:

- Sunny: no modifier
- Rain: fire skill slightly weaker, healing stronger
- Sandstorm: ranged accuracy lower
- Moonlight: mage units stronger

### 5. Research Branches

The current research system is too linear. Use branches:

- Economy: production, reward, offline gain
- Army: attack, health, role-specific boosts
- Skills: cooldown, range, effect value
- Super Cats: summon duration, cooldown, special traits
- Tactics: formation width, neutral capture speed

### 6. Super Cat Roster

Super cats should be more than one button.

- Super Knight Cat: frontline breaker
- Super Mage Cat: area burst
- Super Dragon Cat: base pressure
- Super Guardian Cat: defensive comeback
- Super Pirate Cat: fast raid

Each has cooldown, duration, battlefield role, and cosmetic skins.

### 7. Side Activities

To avoid stage-only repetition:

- Daily Challenge: fixed stage and loadout
- Gold Mine Expedition: passive reward timer
- Skill Trial: survive waves using skills
- Boss Rush: 5 bosses in a row
- Faction War Event: weekly enemy faction bonus

## Rewarded Ad Integration

Rewarded ads should appear only at decision points.

| Placement | Reward | Limit |
| --- | --- | --- |
| Victory result | 2x or 3x gold/fish | 5-10 per day |
| Defeat result | One revive with 40% base HP | 3 per day |
| Free super cat | One temporary summon charge | 3 per day |
| Offline reward | Double offline reward | 3 per day |
| Daily chest | Extra chest open | 1-3 per day |
| Research speed-up | Reduce remaining timer by 30 minutes | 5 per day |
| Battle item trial | Free one-use item | 3 per day |
| Stage scout | Preview enemy composition | 5 per day |
| Lucky wheel | Spin for small rewards | 1-3 per day |
| Boss retry | Retry without stamina cost if stamina is added later | 3 per day |

Do not show rewarded ad prompts during the middle of combat unless the player explicitly opens a pause/support menu.

## In-App Purchase Ideas

### Permanent Products

- Remove Ads: removes non-reward ad prompts and gives daily ad reward tickets
- Battle Speed x2: permanent speed toggle
- Extra Research Queue: one additional research slot
- Extra Battle Item Slot: one more pre-battle item slot
- Cosmetic Nameplate Pack: UI decoration only

### Subscription

Monthly Royal Pass:

- Daily gold/fish
- Daily super cat ticket
- Extra offline reward cap
- 1 free reward multiplier per day
- Cosmetic lobby banner
- No exclusive stage lock

### Packs

- Starter Pack: small currency, one super cat ticket, one skin
- Chapter Clear Pack: appears after every 10 stages
- Boss Prep Pack: battle items and currency, not mandatory
- Research Pack: research points and speed-up tickets
- Super Cat Pack: summon tickets and cosmetic skin

### Cosmetics

Cosmetics are safe monetization:

- Cat unit skins
- Super cat skins
- Castle skins
- Projectile skins
- Skill VFX color variants
- Lobby themes
- Victory celebration effects

Cosmetics should not affect combat stats unless clearly separated as paid convenience-free cosmetics.

## Battle Items

Battle items add monetization and strategy without direct unit deployment.

Examples:

- Sardine Rally: +20% production for 15 seconds
- Paw Shield: all allied units take -30% damage for 10 seconds
- Catnip Surge: skill cooldown recovery burst
- Emergency Repair: restores player base HP
- Smoke Bomb: reduces enemy attack briefly

Rules:

- Limited slots before battle
- Cooldowns visible
- Clear image icon
- Strong use animation
- Earnable through play
- Purchasable as convenience packs

## UI/UX Monetization Rules

Monetization UI should be clear and non-hostile.

- Reward choices appear on result screens, not during combat.
- Paid products show exactly what they give.
- Ads show expected reward before playback.
- Daily limits are visible.
- Purchased remove-ads users still receive equivalent reward tickets.
- Do not hide the normal continue button.
- Do not make the paid button visually dominate the free option.

## Economy Safeguards

To avoid pay-to-win pressure:

- Paid rewards must not exceed the expected progression curve by more than 20-30% over time.
- Ads should accelerate but not replace research progression.
- Super cat tickets are useful but not required.
- Boss stages should be clearable with correct strategy and free growth.
- Simulation QA must test with no ads and no purchases.

## Additional Systems To Reduce Simplicity

### Commander Skill Deck

Players equip 2-3 skills before battle. New skills unlock by chapter.

Skill categories:

- Damage
- Heal
- Buff
- Debuff
- Summon
- Base support

### Formation Strategy

Formation is not direct unit control but changes auto-spawn behavior:

- Wide Front: broad pressure, good against AoE
- Spearhead: center push, good against bases
- Defensive Spread: protects base, slower push
- Ranged Support: keeps archers/mages safer

### Faction AI Profiles

AI profiles are JSON-driven:

- Aggressive: high production, early pressure
- Defensive: high base HP, slower push
- Skill-heavy: frequent skill events
- Flanker: wider lanes
- Boss: fewer but stronger waves

### Chapter Relics

Relics are chapter-level passive bonuses earned through play:

- Paw Banner: unit HP
- Fish Drum: production
- Sun Bell: healing skill
- Moon Gem: mage attack
- Royal Anvil: base durability

Relics support long-term progression without requiring money.

### Events

Events keep replayability:

- Weekend Gold Rush
- Super Cat Trial
- Black Cat Invasion
- Neutral Base Festival
- Skill Cooldown Madness

## Implementation Roadmap

1. Reduce visual scale of units and bases so the map feels larger.
2. Add battle preparation screen.
3. Add formation strategy data and UI.
4. Add battle item data and cooldown UI.
5. Add optional rewarded ad service interface.
6. Add purchase product data JSON.
7. Add remove-ads and reward-ticket replacement logic.
8. Add neutral bases and capture system.
9. Add stage modifiers and AI profiles.
10. Add simulation QA for free/no-ad/no-purchase progression.

## Success Criteria

- Battle screen feels larger and less crowded.
- Units remain readable after size reduction.
- Ads are optional and reward-based.
- Paid products improve convenience but do not block progress.
- Battle preparation adds strategy without making the game manual RTS.
- 200-stage structure has enough modifiers and side systems to avoid repetition.

