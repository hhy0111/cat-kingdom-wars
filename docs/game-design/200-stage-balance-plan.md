# Cat Kingdom Wars 200 Stage And Balance Plan

## Goal

Define the launch-scale content structure for Cat Kingdom Wars. The current web vertical slice contains 5 playable stages, but the release target is 200 stages.

## Scope

- 200 total stages
- 20 chapters
- 10 stages per chapter
- JSON-driven stage data
- Formula-based baseline balancing
- Manual tuning only for milestone, boss, and final-war stages

## Design Principle

The goal is not to create 200 copied battles. Each 10-stage chapter must introduce a readable theme, one pacing change, and one tactical pressure. Stage data should be generated from templates first, then tuned through simulation.

## Stage Structure

| Stage Range | Chapters | Battle Type | Main Factions | Purpose |
| --- | ---: | --- | --- | --- |
| 1-20 | 1-2 | 1v1 | Dog Empire | Teach base combat |
| 21-40 | 3-4 | 1v1 hard | Dog Empire elite units | Upgrade and skill mastery |
| 41-60 | 5-6 | 1v1 plus neutral base | Golden Cat Kingdom | Introduce capture bonuses |
| 61-80 | 7-8 | Three-way | Golden Cat, Dog Empire | Teach multi-front pressure |
| 81-100 | 9-10 | Three-way hard | Pirate Cat Alliance | Skill timing and wide frontlines |
| 101-120 | 11-12 | Three-way variants | Desert Cat Tribe | Production and base layout variation |
| 121-140 | 13-14 | Four-way | Pirate Cat, Desert Cat, Dog Empire | Chaotic territory control |
| 141-160 | 15-16 | Four-way hard | Mid-game factions | High-pressure mixed battles |
| 161-180 | 17-18 | Final war prelude | Black Cat Empire | Special AI and elite enemies |
| 181-200 | 19-20 | Final war | Black Cat Empire and allied armies | Endgame challenge |

## Chapter List

1. Dawn Border
2. Dog Empire Outpost
3. Golden Plains
4. Royal Mines
5. Central Neutral Base
6. Golden Cat Civil War
7. Pirate Harbor
8. Wave Fortress
9. Desert Entrance
10. Sandstorm Front
11. Ancient Ruins
12. Magic Crystal Canyon
13. Four Kingdom Border
14. Continental War
15. Black Forest
16. Black Cat Espionage
17. Dark Castle Gate
18. Black Cat Empire Homeland
19. Nangard Final Defense
20. Continental Unification War

## Chapter Pacing

Every chapter uses the same 10-stage pacing skeleton.

| Chapter Stage | Role |
| ---: | --- |
| 1 | Basic battle for the chapter theme |
| 2 | Enemy production pressure |
| 3 | Enemy base durability pressure |
| 4 | New enemy role or formation |
| 5 | Mid-chapter difficulty check |
| 6 | Map layout variation |
| 7 | Skill timing pressure |
| 8 | Super cat value check |
| 9 | Large frontline battle |
| 10 | Boss or fortress battle |

## Unlock Schedule

| Stage | Unlock |
| ---: | --- |
| 1 | Swordsman Cat |
| 3 | Archer Cat |
| 6 | Fire Bombardment |
| 10 | Runtime upgrades |
| 15 | Tank Cat |
| 20 | Healing Light |
| 30 | Mage Cat |
| 40 | Super Knight Cat |
| 60 | Neutral base |
| 80 | Three-way battle |
| 120 | Four-way battle |
| 160 | Black Cat Empire |
| 180 | Advanced super cat |
| 200 | Final boss battle |

## Balance Formula

Use formula output as the first pass. Do not hand-author all 200 stages.

```ts
const chapter = Math.ceil(stageNo / 10);
const chapterStage = ((stageNo - 1) % 10) + 1;
const bossBonus = chapterStage === 10 ? 0.18 : 0;
const lateGameBonus = stageNo >= 161 ? 0.12 : 0;

const enemyHpMultiplier = 0.9 + stageNo * 0.028 + bossBonus + lateGameBonus;
const enemyAttackMultiplier = 0.85 + stageNo * 0.022 + bossBonus + lateGameBonus;
const enemyBaseHpMultiplier = 1.0 + stageNo * 0.032 + bossBonus;
const rewardMultiplier = 1.0 + stageNo * 0.035;
```

Expected rough values at stage 200:

- Enemy HP: about 6.6x
- Enemy attack: about 5.4x
- Enemy base HP: about 7.6x
- Reward: about 8.0x

These values are starting points. Simulation results decide final tuning.

## Stage Data Schema Target

The current `stages.json` is enough for the 1v1 vertical slice. The 200-stage target needs a broader schema.

```ts
type StageDefinition = {
  id: string;
  chapterId: string;
  stageNo: number;
  name: string;
  battleType: "duel" | "duel_neutral" | "three_way" | "four_way" | "boss";
  mapTheme: string;
  mapSize: number;
  playerFactionId: string;
  factions: StageFactionDefinition[];
  neutralBases: NeutralBaseDefinition[];
  enemyPowerMultiplier: number;
  enemyHpMultiplier: number;
  enemyAttackMultiplier: number;
  enemyBaseHpMultiplier: number;
  productionBias: number;
  stageModifiers: string[];
  recommendedPower: number;
  rewards: StageRewards;
};
```

Example:

```json
{
  "id": "stage_047",
  "chapterId": "chapter_05",
  "stageNo": 47,
  "name": "Central Supply Base Clash",
  "battleType": "duel_neutral",
  "mapTheme": "central_plains",
  "mapSize": 1000,
  "playerFactionId": "cat_kingdom",
  "enemyPowerMultiplier": 2.05,
  "enemyHpMultiplier": 2.22,
  "enemyAttackMultiplier": 1.88,
  "enemyBaseHpMultiplier": 2.5,
  "productionBias": 1.08,
  "stageModifiers": ["neutral_base_bonus", "fast_enemy_spawn"],
  "recommendedPower": 4100,
  "rewards": {
    "gold": 640,
    "fish": 36,
    "researchPoint": 4
  }
}
```

## Recommended Power

Recommended power should be calculated from expected player growth, not guessed.

```ts
const recommendedPower =
  450 +
  stageNo * 78 +
  chapter * 130 +
  (chapterStage === 10 ? 650 : 0) +
  (stageNo >= 161 ? 900 : 0);
```

## Reward Curve

Rewards must support free progression through all 200 stages.

```ts
const gold = Math.round((100 + stageNo * 18) * rewardMultiplier);
const fish = Math.round(6 + stageNo * 0.42 + chapter * 1.5);
const researchPoint = Math.max(1, Math.floor(stageNo / 12));
```

Boss stages may add:

- 1.5x gold
- 1.3x fish
- guaranteed super cat ticket every 20 stages

## Faction Progression

| Faction | Main Range | Gameplay Identity |
| --- | ---: | --- |
| Dog Empire | 1-40 | Simple pressure, sturdy melee |
| Golden Cat Kingdom | 41-80 | Production economy and neutral base contests |
| Pirate Cat Alliance | 81-110 | Fast units, flank pressure |
| Desert Cat Tribe | 101-130 | Durable bases, slower but stronger units |
| Mixed Kingdoms | 121-160 | Multi-front chaos |
| Black Cat Empire | 161-200 | Elite units, special AI, final boss pressure |

## Stage Modifiers

Use modifiers to keep stages distinct without hand-writing custom code per stage.

- `fast_enemy_spawn`
- `high_enemy_base_hp`
- `neutral_base_bonus`
- `wide_frontline`
- `skill_cooldown_pressure`
- `super_cat_recommended`
- `enemy_ranged_focus`
- `enemy_tank_wall`
- `enemy_mage_splash`
- `boss_fortress`
- `black_cat_elite`

Modifiers should change numeric data or AI profile selection. They should not require bespoke stage logic unless absolutely necessary.

## Monetization Balance Rules

Allowed:

- Reward ad for 2x or 3x victory reward
- One defeat revive option
- Free super cat summon through rewarded ad
- Battle speed x2 product
- Ad removal
- Monthly convenience rewards

Forbidden:

- Stage that cannot be cleared without ads or payment
- Stage that requires super cat to clear
- Forced ads during battle
- Reward ads strong enough to invalidate research pacing
- Sudden difficulty wall designed to sell products

## Simulation QA

Manual playtesting all 200 stages is not enough. Automated simulation is required.

Minimum simulation per stage:

- 20 runs with expected free-player growth
- 10 runs with under-leveled growth
- 10 runs with over-leveled growth
- 5 runs without super cat
- 5 runs without ad rewards

Target clear rates:

| Stage Type | Expected Free Growth Clear Rate |
| --- | ---: |
| Normal | 65-80% |
| Mid-chapter check | 55-70% |
| Boss | 45-60% |
| Final war normal | 45-65% |
| Final 181-200 boss | 35-55% |

## Performance QA

The battle view must remain readable and responsive at launch scale.

Required checks:

- 50 visible units
- 100 visible units
- 150 visible units
- 30 simultaneous hit events
- 5 overlapping skill effects
- Broad frontline mode enabled

Failure conditions:

- Severe frame drop
- Units overlap so much that factions are unreadable
- Health bars hide the combat
- Skill effects hide all units
- Battle result cannot be understood visually

## Implementation Order

1. Add chapter data file.
2. Add stage generator module.
3. Extend stage schema for `battleType`, `factions`, `neutralBases`, and modifiers.
4. Generate 200 baseline stages.
5. Add simulation report command.
6. Tune stages 10, 20, 40, 60, 80, 100, 120, 140, 160, 180, 190, and 200 manually.
7. Add stage select pagination or chapter map UI.
8. Add QA snapshots for early, mid, and final-war stages.

## Success Criteria

- 200 stages exist as JSON data.
- No code change is required to add a normal stage.
- Difficulty curve increases without sudden impossible walls.
- Free-player progression can clear stage 200 through time and skill.
- Super cat and ads help but are not mandatory.
- Multi-faction stages are data-driven.
- Automated simulation can flag balance outliers.

