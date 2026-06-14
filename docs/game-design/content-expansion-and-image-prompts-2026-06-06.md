# Cat Kingdom Wars Content Expansion And Image Prompts

Date: 2026-06-06

This document consolidates the current UX decisions, story direction, balance rules, and image prompts needed to move the game from a simple prototype toward a repeatable 200-stage mobile game loop.

## Current UX Decisions

- Battle starts only from the central portal on the lobby map.
- Stage list buttons select a front only. They do not start battle.
- The 1-10 number plate on the map is a region quick-jump selector. Each region contains 20 fronts.
- Upgrade Shop and Character Shop are separate entry points.
- Shops should be image-first: item art, character portraits, lock badges, owned badges, and cost chips should be visible before long descriptions.
- Daily reward and Today's Front buttons must show state feedback when tapped, even while the full reward system is still lightweight.
- Cleared-stage replay rewards are reduced to 50% Gold/Fish to prevent farming one easy stage.

## Story Direction

The cat kingdom is retaking a set of supply fronts from the dog empire. Each 20-stage region is a small campaign chapter:

1. Dawn Border: learn the front line and first supply routes.
2. Golden Fields: protect farms and unlock stronger economy pressure.
3. Magic Forest: introduce mage enemies and area-control battles.
4. Flame Canyon: introduce burst damage and tougher bases.
5. Dog Outpost: the first large dog military wall.
6. Crystal Coast: mixed lanes and faster enemy waves.
7. Storm Highlands: speed pressure and more ranged enemies.
8. Moonlit Desert: resource-starved battles and ambush pacing.
9. Shadow Sanctuary: elite enemy groups and heavy defense.
10. Emperor Fortress: final 20-stage push with bosses and late-game checks.

The lobby is the kingdom command map. The player selects the next front, upgrades the kingdom, buys new units, checks daily hooks, then starts battle from the portal.

## Balance Direction

- Stages remain locked until the previous stage is cleared.
- Stage rewards should grow enough to support free progression, but not enough to remove upgrade decisions.
- Every 10th stage is a mid-boss checkpoint.
- Every 20th stage is a region boss checkpoint with higher base HP and stronger enemy pools.
- Character unlock pacing:
  - Stage 1: Swordsman Cat and Archer Cat.
  - Stage 5 clear: Shield Cat purchase unlock.
  - Stage 12 clear: Mage Cat purchase unlock.
  - Stage 20 clear: Priest Cat support unlock.
  - Stage 40 clear: Lancer Cat unlock.
  - Stage 60 clear: Bomb Cat unlock.
  - Stage 80 clear: Ninja Cat unlock.
  - Stage 100 clear: Engineer Cat unlock.
  - Stage 120 clear: Frost Cat unlock.
  - Stage 140 clear: Thunder Drummer Cat unlock.
  - Stage 160 clear: Royal Cannon Cat unlock.
  - Stage 180 clear: Star Knight Cat hero unlock.
- Permanent lobby upgrades should matter after stage 20.
- Battle-money upgrades should feel tactical within one battle only.
- Replay farming pays 50% of the original stage reward.
- Late-game stages should require a mix of permanent upgrades, purchased roles, and correct in-battle upgrade timing.

## Global Image Rules

Use the same visual language across all prompts:

```text
Premium Korean mobile game style, cute SD chibi fantasy war, royal blue, gold, coral red, emerald green, warm cream highlights, clean readable silhouettes, launch-quality casual strategy polish, high contrast at small mobile size.
```

Cutout rules:

```text
Transparent background, centered subject, generous padding, no baked shadow, no ground rectangle, no text unless explicitly requested, no UI label, no watermark, no cropped ears, tails, weapons, staffs, or glow.
```

Sprite sheet rules:

```text
2048x2048 transparent-background sprite sheet, 8 columns x 5 rows. Rows: Idle, Walk, Attack or Cast, Hit, Death. All player cat units face right in every frame. Stable foot anchor and center point. At least 32 px padding between frames. No background, no text, no watermark.
```

VFX sheet rules:

```text
2048x2048 transparent-background VFX sprite sheet, 6 columns x 4 rows, stable center point, clean alpha fade, readable over a bright grass battlefield and cream UI, no background, no text, no watermark.
```

## Opening Screen Required Images

### Opening Transparent Title Logo

```text
Create a transparent-background 2D mobile game title logo for "Cat Kingdom Wars". Royal-blue shield plaque, polished gold letters, cat-ear crown, small paw banners, warm highlights, readable at portrait phone width. Include only the English title text "Cat Kingdom Wars". No checkerboard, no white preview background, no extra subtitle, no watermark. Canvas 2048x1536, centered with generous transparent padding.
```

### Opening Hero Parade Foreground

```text
Create a 2048x512 transparent-background 2D foreground strip for a mobile game opening screen. Cute SD cat army parade moving left to right: swordsman cat, archer cat, shield cat, mage cat, small flags, coin sparkle dust. Bright royal blue and gold. No text, no background, no ground rectangle, no watermark, no cropped characters.
```

### Opening Reward Crest

```text
Create a 1024x1024 transparent-background 2D reward crest icon. Round royal-blue medallion with gold cat paw crown, small gem, polished rim, premium login reward feel. No text, no number, no white background, no checkerboard, no watermark.
```

## Lobby And Map Images

### Upgrade Shop Map Building

```text
Create a 1024x1024 transparent-background 2D cutout building for a mobile game map: cat kingdom upgrade shop / research forge. Blue roof, gold paw crest, glowing training scrolls, tiny hammer and shield props, magical upgrade sparkles, readable at 64 px. No text, no UI frame, no ground, no watermark.
```

### Character Shop Map Building

```text
Create a 1024x1024 transparent-background 2D cutout building for a mobile game map: cat character shop stall. Royal-blue awning, gold paw sign without text, small display helmets and staffs, warm lanterns, inviting shop feel, readable at 64 px. No text, no UI frame, no ground, no watermark.
```

### Central Battle Portal Upgrade

```text
Create a 1536x1536 transparent-background 2D cutout portal gate for a cat kingdom battle map. Gold stone arch, blue-purple swirling portal, bright inner glow, small paw runes, premium mobile game button presence, readable as the main battle start point. No text, no UI label, no ground, no watermark.
```

### Region Quick-Jump Plaque

```text
Create a 1024x512 transparent-background UI plaque for a region quick-jump selector. Cream parchment base, royal-blue and gold rim, ten small circular node sockets, selected-state gold glow, locked-state gray cover, cleared-state green sparkle. No numbers, no text, no watermark.
```

### World Map Stage Node Set

```text
Create a transparent-background 2D icon set for stage nodes: normal, selected, cleared, locked, mid-boss, region boss, treasure, replay. 512x512 per icon, consistent shape language, gold rim, blue core, green cleared variant, gray locked variant, red boss variant. No number, no text, no watermark. Readable at 34 px.
```

### Daily Reward Chest Panel

```text
Create a 1536x1024 transparent-background mobile game reward panel illustration. Seven-day login reward track with tiny chests, first day highlighted, gold coin and fish token motifs, cream parchment and blue-gold frame, no readable text, no numbers, no watermark.
```

### Today's Front Mission Board

```text
Create a 1536x1024 transparent-background mobile game mission board illustration. Small wooden board with cat kingdom map pin, supply route ribbon, gold/fish reward icons, blue-gold paper tags, no readable text, no numbers, no watermark.
```

### Kingdom Pass Ticket Panel

```text
Create a 1536x1024 transparent-background mobile game pass panel illustration. Premium pass ticket with cat paw crest, progress bar frame, small skin reward silhouette, gold and purple highlights, no readable text, no numbers, no watermark.
```

## Shop UI Images

### Upgrade Shop Interior Background

```text
Create a 1536x2048 portrait mobile game shop interior background for a cat kingdom upgrade shop. Cozy forge and research room, blue banners, gold paw crest, training manuals, shields, swords, glowing upgrade crystal, clear empty center area for item cards. No text, no UI labels, no characters, no watermark.
```

### Character Shop Interior Background

```text
Create a 1536x2048 portrait mobile game shop interior background for a cat character shop. Cute fantasy recruitment stall, royal-blue curtains, armor stands, staff rack, small cat banners, warm lantern light, clear empty center area for character cards. No text, no UI labels, no watermark.
```

### Upgrade Item Card Frame

```text
Create a 1024x512 transparent-background mobile game item card frame for permanent upgrades. Cream parchment card, blue-gold rim, icon socket on the left, price chip socket at bottom, lock/owned state friendly shapes, premium but readable. No text, no number, no watermark.
```

### Character Card Frame

```text
Create a 1024x640 transparent-background mobile game character shop card frame. Large portrait socket, role badge socket, cost chip area, locked overlay variant, owned ribbon variant, cream parchment with royal-blue and gold rim. No text, no numbers, no watermark.
```

### Shop Purchase Success VFX

```text
Create a 2048x2048 transparent-background UI VFX sprite sheet for shop purchase success. Gold coins fly upward, green check sparkle, paw-shaped glow, quick satisfying pop. 6 columns x 4 rows, centered, clean fade, no text, no background, no watermark.
```

### Not Enough Currency VFX

```text
Create a 2048x2048 transparent-background UI VFX sprite sheet for not-enough-currency feedback. Small gray coin shake, soft red-orange warning pulse, tiny crossed coin/fish silhouettes, friendly non-harsh mobile game style. 6 columns x 4 rows, centered, no text, no background, no watermark.
```

### Resource Spend VFX

```text
Create a 2048x2048 transparent-background UI VFX sprite sheet for spending game currency. Gold coins and fish tokens shrink toward the center, small minus-friendly glow trail, satisfying but not noisy. 6 columns x 4 rows, centered, no text, no background, no watermark.
```

### Shop Lock Badge

```text
Create a 512x512 transparent-background 2D UI badge for locked shop items. Rounded blue-gray lock medallion, small gold paw keyhole, readable at 28 px, friendly mobile game style. No text, no number, no watermark.
```

### Owned Badge

```text
Create a 512x512 transparent-background 2D UI badge for owned shop items. Green-gold check medallion with small paw crest, premium mobile game style, readable at 28 px. No text, no number, no watermark.
```

## Player Cat Character Sprites

### Swordsman Cat Refresh

```text
Create a 2048x2048 transparent-background sprite sheet for a cute SD swordsman cat. Royal-blue tunic, gold trim, short sword, brave expression, faces right in every frame. 8 columns x 5 rows: Idle, Walk, Attack, Hit, Death. Stable foot anchor, no background, no text, no watermark.
```

### Archer Cat Refresh

```text
Create a 2048x2048 transparent-background sprite sheet for a cute SD archer cat. Blue hood, gold trim, small bow, quiver, focused expression, faces right in every frame. 8 columns x 5 rows: Idle, Walk, Shoot, Hit, Death. Stable foot anchor, no background, no text, no watermark.
```

### Shield Cat Refresh

```text
Create a 2048x2048 transparent-background sprite sheet for a cute SD shield cat tank. Large rounded royal-blue shield with gold paw crest, small armor, sturdy stance, faces right in every frame. 8 columns x 5 rows: Idle, Walk, Shield Bash, Hit, Death. Stable foot anchor, no background, no text, no watermark.
```

### Mage Cat Refresh

```text
Create a 2048x2048 transparent-background sprite sheet for a cute SD mage cat. Purple-gold wizard hood, glowing crystal staff, star magic casting, faces right in every frame. 8 columns x 5 rows: Idle, Walk, Cast, Hit, Death. Important: no backward-facing frames, no rear view, no turned-away walking. Stable foot anchor, no background, no text, no watermark.
```

### Priest Cat

```text
Create a 2048x2048 transparent-background sprite sheet for a cute SD priest cat support unit. White and emerald robe, gold bell staff, healing paw aura, calm expression, faces right in every frame. 8 columns x 5 rows: Idle, Walk, Heal Cast, Hit, Death. Stable foot anchor, no background, no text, no watermark.
```

### Lancer Cat

```text
Create a 2048x2048 transparent-background sprite sheet for a cute SD lancer cat. Royal-blue light armor, long gold-tipped spear, quick charge pose, faces right in every frame. 8 columns x 5 rows: Idle, Walk, Thrust Attack, Hit, Death. Stable foot anchor, no background, no text, no watermark.
```

### Bomb Cat

```text
Create a 2048x2048 transparent-background sprite sheet for a cute SD bomb cat. Small engineer goggles, blue vest, round harmless fantasy bomb with paw fuse, cheerful expression, faces right in every frame. 8 columns x 5 rows: Idle, Walk, Throw Bomb, Hit, Death. Stable foot anchor, no background, no text, no watermark.
```

### Ninja Cat

```text
Create a 2048x2048 transparent-background sprite sheet for a cute SD ninja cat. Navy scarf, small twin daggers, quick dash silhouette, gold paw charm, faces right in every frame. 8 columns x 5 rows: Idle, Walk, Slash, Hit, Death. Stable foot anchor, no background, no text, no watermark.
```

### Engineer Cat

```text
Create a 2048x2048 transparent-background sprite sheet for a cute SD engineer cat. Blue work apron, small wrench, portable turret backpack, gold goggles, faces right in every frame. 8 columns x 5 rows: Idle, Walk, Build/Turret Attack, Hit, Death. Stable foot anchor, no background, no text, no watermark.
```

### Frost Cat

```text
Create a 2048x2048 transparent-background sprite sheet for a cute SD frost cat. Pale blue robe, snowflake wand, ice crystals, gentle determined face, faces right in every frame. 8 columns x 5 rows: Idle, Walk, Ice Cast, Hit, Death. Stable foot anchor, no background, no text, no watermark.
```

### Thunder Drummer Cat

```text
Create a 2048x2048 transparent-background sprite sheet for a cute SD thunder drummer cat. Tiny war drum, gold lightning ornaments, blue cloak, energetic expression, faces right in every frame. 8 columns x 5 rows: Idle, Walk, Drum Buff Attack, Hit, Death. Stable foot anchor, no background, no text, no watermark.
```

### Royal Cannon Cat

```text
Create a 2048x2048 transparent-background sprite sheet for a cute SD royal cannon cat. Small wheeled gold-blue cannon, cat operator with helmet, heavy ranged role, faces right in every frame. 8 columns x 5 rows: Idle, Walk/Push Cannon, Fire Cannon, Hit, Death. Stable wheel/foot anchor, no background, no text, no watermark.
```

### Star Knight Cat Hero

```text
Create a 2048x2048 transparent-background sprite sheet for a premium star knight cat hero. Royal-blue and gold armor, luminous cape, star-shaped sword, heroic but cute SD proportions, faces right in every frame. 8 columns x 5 rows: Idle, Walk, Star Slash, Hit, Death. Stable foot anchor, no background, no text, no watermark.
```

## Enemy Dog Character Sprites

### Dog Soldier Refresh

```text
Create a 2048x2048 transparent-background sprite sheet for a cute but enemy-looking SD dog soldier. Dark red-brown armor, small spear, dog empire badge without text, faces left in every frame. 8 columns x 5 rows: Idle, Walk, Attack, Hit, Death. Stable foot anchor, no background, no text, no watermark.
```

### Dog Raider

```text
Create a 2048x2048 transparent-background sprite sheet for a fast SD dog raider enemy. Dark leather armor, short blades, aggressive but not scary, faces left in every frame. 8 columns x 5 rows: Idle, Walk, Slash, Hit, Death. Stable foot anchor, no background, no text, no watermark.
```

### Dog Guard

```text
Create a 2048x2048 transparent-background sprite sheet for a heavy SD dog guard enemy. Black-red shield, plated armor, slow tank role, faces left in every frame. 8 columns x 5 rows: Idle, Walk, Shield Attack, Hit, Death. Stable foot anchor, no background, no text, no watermark.
```

### Dog Captain

```text
Create a 2048x2048 transparent-background sprite sheet for an elite SD dog captain enemy. Dark cape, gold-red armor, command sword, boss-like silhouette but cute mobile style, faces left in every frame. 8 columns x 5 rows: Idle, Walk, Command Slash, Hit, Death. Stable foot anchor, no background, no text, no watermark.
```

### Dog Mage

```text
Create a 2048x2048 transparent-background sprite sheet for an enemy SD dog mage. Dark purple robe, red crystal staff, shadow magic, faces left in every frame. 8 columns x 5 rows: Idle, Walk, Cast, Hit, Death. Stable foot anchor, no background, no text, no watermark.
```

### Dog Siege Brute

```text
Create a 2048x2048 transparent-background sprite sheet for a large SD dog siege brute. Heavy hammer, dark armor, boss checkpoint enemy, faces left in every frame. 8 columns x 5 rows: Idle, Walk, Hammer Attack, Hit, Death. Stable foot anchor, generous padding, no background, no text, no watermark.
```

## Region And Boss Images

### Region Background Set

```text
Create 10 portrait 1536x2048 mobile game region map backgrounds for Cat Kingdom Wars: Dawn Border, Golden Fields, Magic Forest, Flame Canyon, Dog Outpost, Crystal Coast, Storm Highlands, Moonlit Desert, Shadow Sanctuary, Emperor Fortress. Each image must share the same camera angle and UI safe zones: top currencies, right stage selector, bottom daily panels, central battle portal. No text, no UI labels, no characters, no watermark.
```

### Region Boss Banner Set

```text
Create a transparent-background 2D mobile game boss banner set for 10 regions. Cream parchment banner, royal-blue cat trim versus dark-red dog trim, boss medallion socket, gold sparkle for cleared state, gray chain overlay for locked state. No readable text, no numbers, no watermark.
```

### Mid-Boss Warning VFX

```text
Create a 2048x2048 transparent-background UI VFX sprite sheet for mid-boss warning. Red-gold pulse ring, small exclamation silhouette without text, dramatic but friendly mobile style. 6 columns x 4 rows, centered, no text, no background, no watermark.
```

### Region Clear Celebration VFX

```text
Create a 2048x2048 transparent-background UI VFX sprite sheet for region clear celebration. Gold confetti, blue ribbons, paw sparkles, soft radial burst, premium reward moment. 6 columns x 4 rows, centered, no text, no background, no watermark.
```

## New Content Icons

### Battle Item Icon Set

```text
Create a transparent-background 2D icon set for battle items: instant fish supply, cat rally horn, shield barrier, fire bomb, heal potion, slow trap, reward booster. 512x512 per icon, consistent blue-gold mobile game style, readable at 42 px, no text, no numbers, no watermark.
```

### Character Fragment Icon

```text
Create a 512x512 transparent-background 2D item icon for cat character fragments. Shiny paw-shaped shard, blue crystal edge, small gold rim, premium collection feel. No text, no number, no background, no watermark.
```

### Daily Mission Stamp Icon Set

```text
Create a transparent-background 2D icon set for daily mission stamps: battle participation, skill use, stage clear, shop purchase, character unlock, login streak. 512x512 per icon, readable at 32 px, no text, no number, no watermark.
```

### Replay Reward Half Badge

```text
Create a 512x512 transparent-background 2D UI badge showing reduced replay reward concept without text. Gold coin split in half with small blue replay arrow, friendly mobile game style, readable at 28 px. No numbers, no letters, no watermark.
```

## Implementation Notes For Generated Images

- Replace temporary CSS shop icons with the map building assets once generated.
- Replace current shop rows with character card frames and upgrade card frames.
- Replace the mage sprite sheet with a no-backward-frame refresh if any rear-view frames remain.
- Keep all player cats facing right and all dog enemies facing left.
- Do not bake Korean text into images; all localization should remain in UI code.
- Keep production sprites separate from background images so future characters and shops can be expanded without redrawing the full lobby.
