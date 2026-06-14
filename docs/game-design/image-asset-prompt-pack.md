# Cat Kingdom Wars Image Asset Prompt Pack

## Goal

Define the image asset direction, UI/UX visual feedback rules, animation sheet rules, and production prompts for Cat Kingdom Wars.

The game should not feel like a simple prototype. Every major part of the experience should use image-based 2D assets: opening, lobby, stage map, battle backgrounds, units, buildings, UI buttons, skill icons, item icons, VFX, damage feedback, cooldown indicators, result effects, and reward effects.

## Global Asset Rules

Use these rules for every generated asset unless a specific section says otherwise.

- Strictly 2D game art.
- Cute SD chibi cat kingdom style.
- Mobile game readability first.
- Sprite-friendly shapes with clear silhouettes.
- No 3D render look.
- No photorealism.
- No illustration-poster composition for gameplay assets.
- No baked background for cutout assets.
- No baked UI frame unless the asset is explicitly a UI frame.
- No baked shadow for characters, units, buildings, icons, or effects.
- No text inside game assets unless the prompt explicitly requests text.
- No watermark.
- No cropped limbs, weapons, ears, tails, or effects.
- Center subject in canvas.
- Keep generous outer padding.
- Keep consistent frame spacing on sprite sheets.
- Use transparent PNG output for units, buildings, UI icons, and VFX sheets.
- Do not include default decorative overlays, sample labels, mock buttons, sample UI text, or preview backgrounds in cutout assets.

## Canvas And Sprite Standards

### Character Sprite Sheets

- Canvas: 2048 x 2048
- Grid: 5 rows x 6 columns when possible
- Frame cell: consistent size across the sheet
- Padding inside each frame: at least 12% of frame width
- Gap between frames: at least 32 px
- Background: transparent
- No shadow
- No ground
- No effects baked into the unit sheet
- Required rows:
  - Idle
  - Walk
  - Attack
  - Hit
  - Death

### VFX Sprite Sheets

- Canvas: 2048 x 2048
- Grid: 4 rows x 6 columns or 6 rows x 6 columns depending on effect length
- Frame spacing: at least 32 px
- Background: transparent
- No ground
- No UI frame
- Effect must fade cleanly at frame edges
- Keep center point stable across frames
- Outer glow must not touch frame boundary

### UI Icons

- Canvas: 512 x 512 or 1024 x 1024
- Background: transparent
- Subject centered
- Mobile-readable shape
- Thick clean silhouette
- No text
- No tiny detail that disappears at 48 px

### Buildings

- Canvas: 1024 x 1024 or 2048 x 2048
- 45-degree quarter view
- Transparent background
- No baked shadow
- No ground tile
- Enough padding for roof, flags, doors, and effects

### Backgrounds

- Opening, lobby, stage map, and battle backgrounds may include full painted backgrounds.
- Backgrounds must leave safe zones for UI.
- Do not place important detail behind HUD areas.
- Use layered production when possible:
  - far background
  - midground
  - buildings
  - props
  - particles

## UI/UX Visual Feedback Rules

The player must understand battle state without reading long text.

### Cooldown Feedback

Every skill and item button should have:

- Icon image
- Radial cooldown overlay
- Numeric countdown for cooldowns longer than 2 seconds
- Glow pulse when ready
- Desaturated icon state while unavailable
- Short button press burst when used
- Red shake or dull thunk feedback when unavailable

Prompt direction:

```text
Create a 2D mobile game skill button icon state set: ready, pressed, cooldown, disabled, and charged. Same icon shape across all states, transparent background, centered, strong silhouette, no text, no watermark. Cooldown state must support a radial dark overlay and bright rim highlight. Ready state must have a warm glow that can be separated from the icon.
```

### Damage Feedback

Damage must be visible even in crowded combat.

- Normal hit: small white/yellow impact spark
- Heavy hit: larger orange starburst
- Critical hit: red-orange flash with larger number pop
- Area damage: circular shockwave plus center burst
- Base damage: screen shake plus big impact ring
- Damage number: high contrast, white fill, dark outline, short upward motion

Prompt direction:

```text
Create a 2D mobile game damage feedback VFX sprite sheet: normal hit spark, heavy hit burst, critical hit flash, area shockwave, and base impact ring. Transparent background, separated frames, consistent center point, generous padding, no text, no numbers, no UI, no ground, no shadow, readable at small mobile size.
```

### Healing And Buff Feedback

- Healing: green-gold circular pulse, vertical light motes
- Buff: blue/gold ring around unit, small upward particles
- Cooldown reduction: pale cyan clock-like sparkle

Prompt direction:

```text
Create a 2D mobile game healing and buff VFX sprite sheet. Include healing circle, healing sparkle motes, buff aura ring, and cooldown-reduction sparkle. Transparent background, consistent frame spacing, centered effects, clean alpha fade, no text, no ground, no character, no UI.
```

## Opening Screen Assets

### Opening Background

```text
Create a premium 2D mobile game opening background for "Cat Kingdom Wars". Scene: cute cat kingdom castle at warm dawn, soft sky gradient, layered clouds, distant hills, royal banners, magical floating particles, cheerful heroic mood. Composition must leave center space for title and lower center space for a start button. High-quality Korean mobile game polish, bright royal blue, gold, coral, emerald accents. No characters in front of the title area, no text, no logo, no watermark.
```

### Opening Title Logo

```text
Create a 2D game title logo image for "Cat Kingdom Wars" with a cute royal cat kingdom feeling. Bold readable lettering style, gold and royal blue accents, small cat-ear crown motif, polished mobile game logo. Transparent background, no extra background, no characters, no subtitle, no watermark. Keep generous padding around the logo.
```

### Opening Particles

```text
Create a 2D sprite sheet of magical opening-screen particles: tiny gold sparkles, soft blue motes, small star twinkles, and warm dust glints. Transparent background, 2048x2048 sprite sheet, evenly spaced frames, no text, no ground, no shadows. Effects must be easy to cut into separate particles.
```

## Lobby Assets

### Lobby Background

```text
Create a premium 2D mobile game lobby background for a cute cat kingdom hub. Include cat castle, research lab, shop stall, stage portal gate, reward chest area, small paths, soft hills, warm daylight, floating magic particles. Leave clear safe zones for top currency UI and right-side stage panel. Friendly, polished, launch-quality casual strategy game style. No text, no UI labels, no watermark.
```

### Castle Hub Building

```text
Create a 2D cutout game asset of a cute cat kingdom castle building, 45-degree quarter view, royal blue roof, gold stone walls, small cat-ear architectural silhouette, centered on transparent background. No ground, no shadow, no text, no UI frame, no extra props. Keep roof, flags, and doorway fully inside canvas with generous padding.
```

### Research Lab Building

```text
Create a 2D cutout game asset of a cute cat kingdom research lab, 45-degree quarter view, glass vial tower, glowing green magic fluid, small brass pipes, gold-and-blue kingdom style. Transparent background, centered, no ground, no shadow, no text, no UI frame, generous padding.
```

### Shop Building

```text
Create a 2D cutout game asset of a cute cat kingdom shop stall, 45-degree quarter view, striped coral-and-cream awning, small fish-can display, gold trim, friendly mobile game style. Transparent background, centered, no ground, no shadow, no text, no UI frame, generous padding.
```

### Stage Portal

```text
Create a 2D cutout game asset of a magical stage portal gate for a cat kingdom mobile game. Gold stone arch, blue-purple portal core, rotating rune-ring design, cute royal style. Transparent background, no ground, no shadow, no text, no UI frame. Keep portal centered with padding for glow.
```

### Reward Chest

```text
Create a 2D cutout game asset of a cute cat kingdom reward chest. Gold chest with blue ribbon, small paw-shaped lock, polished mobile game style. Transparent background, centered, no ground, no shadow, no text, no UI frame, generous padding.
```

## Stage Map Assets

### Chapter Map Background

```text
Create a 2D mobile game chapter map background for Cat Kingdom Wars. Show a colorful fantasy continent with cat kingdom roads, forests, mines, ports, desert, ruins, black forest, and final dark empire region. Friendly polished strategy game map style, readable paths and regions, no text labels, no UI frame, no watermark. Leave top and bottom UI safe zones.
```

### Stage Node Icons

```text
Create a 2D icon set for stage nodes in a mobile strategy game: normal stage, cleared stage, locked stage, boss stage, treasure stage, neutral-base stage. Transparent background, consistent 512x512 canvas per icon, centered, no text, no number, no watermark. Shapes must be readable at 40 px.
```

## Battle Background Assets

### Grassland Battle Map

```text
Create a 2D top-down/quarter-view square battlefield background for a cute mobile strategy game. Wide combat corridor from lower-left to upper-right, soft grassland, warm dirt paths split into several parallel lanes, subtle magic rune circle in center, clear empty space for many units. No units, no buildings, no UI, no text, no watermark. Must be readable under 100+ units.
```

### Desert Battle Map

```text
Create a 2D square battlefield background for a cute mobile strategy game desert chapter. Wide combat corridor, sand dunes, stone tiles, scattered ruins, several parallel lanes, clear unit readability, warm gold and teal accents. No units, no buildings, no UI, no text, no watermark.
```

### Dark Empire Battle Map

```text
Create a 2D square battlefield background for the Black Cat Empire final war. Wide combat corridor, dark magical ground, purple-black crystal cracks, red warning runes, readable lanes, high contrast for cute units. Stylized 2D only, not too dark, no units, no buildings, no UI, no text, no watermark.
```

## Base And Neutral Building Assets

### Player Base

```text
Create a 2D cutout asset of a cute cat kingdom battle base, 45-degree quarter view, blue roof, gold walls, small banner pole, sturdy doorway, polished mobile RTS style. Transparent background, no ground, no shadow, no UI, no text. Centered with padding.
```

### Dog Empire Base

```text
Create a 2D cutout asset of a cute enemy dog empire battle base, 45-degree quarter view, brown-red roof, sturdy wooden walls, small red banner, simple readable silhouette. Transparent background, no ground, no shadow, no UI, no text. Centered with padding.
```

### Neutral Base

```text
Create a 2D cutout asset of a neutral central base for a mobile RTS capture point. 45-degree quarter view, gray stone base, gold rune core, small neutral flag socket, cute but strategic style. Transparent background, no ground, no shadow, no UI, no text. Centered with padding.
```

## Unit Sprite Sheet Prompts

### Swordsman Cat

```text
Create a 2048x2048 transparent-background 2D sprite sheet for an SD chibi cat swordsman unit. 45-degree quarter view, cute cat kingdom soldier, small sword, royal blue tunic, gold trim, clear silhouette. Include rows for Idle, Walk, Attack, Hit, Death. Keep all frames evenly spaced with at least 32 px gaps. No background, no shadow, no UI, no text, no baked skill effects, no cropped ears, tail, sword, arms, or legs.
```

### Archer Cat

```text
Create a 2048x2048 transparent-background 2D sprite sheet for an SD chibi cat archer unit. 45-degree quarter view, cute cat kingdom archer, small bow, green-blue outfit, gold trim, clear mobile-readable silhouette. Include Idle, Walk, Attack, Hit, Death rows. Even frame spacing, at least 32 px gaps, generous padding. No background, no shadow, no UI, no text, no baked arrows as VFX, no cropped body parts or bow.
```

### Mage Cat

```text
Create a 2048x2048 transparent-background 2D sprite sheet for an SD chibi cat mage unit. 45-degree quarter view, cute cat kingdom mage, small staff, purple-blue robe, bright magic gem, clear silhouette. Include Idle, Walk, Attack, Hit, Death rows. Even frame spacing, at least 32 px gaps. No background, no shadow, no UI, no text, no baked spell effects except the staff gem glow, no cropped ears, tail, staff, arms, or legs.
```

### Tank Cat

```text
Create a 2048x2048 transparent-background 2D sprite sheet for an SD chibi cat tank unit. 45-degree quarter view, cute heavy armored cat, small shield, sturdy helmet, gold and steel armor, readable silhouette. Include Idle, Walk, Attack, Hit, Death rows. Even frame spacing, at least 32 px gaps. No background, no shadow, no UI, no text, no baked effects, no cropped shield, ears, tail, arms, or legs.
```

### Super Knight Cat

```text
Create a 2048x2048 transparent-background 2D sprite sheet for a powerful SD chibi Super Knight Cat summon. 45-degree quarter view, heroic cat knight, oversized shining sword, royal blue cape, gold armor, premium mobile game style. Include Idle, Walk, Attack, Hit, Death rows. Even frame spacing, at least 32 px gaps, generous padding for sword and cape. No background, no shadow, no UI, no text, no baked summon portal, no cropped sword, cape, ears, or tail.
```

### Dog Soldier

```text
Create a 2048x2048 transparent-background 2D sprite sheet for a cute enemy dog empire soldier. 45-degree quarter view, small spear, brown-red armor, readable enemy silhouette, charming but clearly hostile. Include Idle, Walk, Attack, Hit, Death rows. Even frame spacing, at least 32 px gaps. No background, no shadow, no UI, no text, no baked effects, no cropped spear, ears, tail, arms, or legs.
```

## Skill Icon Prompts

### Fire Bombardment Icon

```text
Create a 512x512 transparent-background 2D mobile game skill icon for Fire Bombardment. Central fireball meteor impact symbol, orange-red flame, gold rim glow, strong silhouette, readable at 48 px. No text, no number, no UI button frame, no background, no watermark.
```

### Healing Light Icon

```text
Create a 512x512 transparent-background 2D mobile game skill icon for Healing Light. Central green-gold healing cross made of soft light, circular blessing aura, clear silhouette, readable at 48 px. No text, no number, no UI button frame, no background, no watermark.
```

### Super Cat Icon

```text
Create a 512x512 transparent-background 2D mobile game summon icon for Super Knight Cat. Cute heroic cat helmet, gold crown crest, purple-blue summon glow, premium readable silhouette. No text, no number, no UI button frame, no background, no watermark.
```

### Runtime Upgrade Icons

```text
Create a 512x512 transparent-background 2D mobile game icon set for runtime upgrades: production speed, attack power, health boost. Each icon centered, strong silhouette, no text, no number, no UI frame, no background. Production icon uses tiny marching cat paw and clock; attack icon uses sword impact; health icon uses heart shield.
```

## VFX Sprite Sheet Prompts

### Fire Bombardment VFX

```text
Create a 2048x2048 transparent-background 2D VFX sprite sheet for Fire Bombardment. Include falling fire impact, bright center explosion, circular shockwave, orange sparks, smoke fade, and final ember particles. 6 columns x 4 rows, consistent frame spacing at least 32 px, center point stable, outer glow must not touch frame boundaries. No background, no ground, no character, no UI, no text.
```

### Lightning VFX

```text
Create a 2048x2048 transparent-background 2D VFX sprite sheet for a lightning strike skill. Bright vertical bolt, branching arcs, white-blue flash, circular ground shock ring, fading sparks. 6 columns x 4 rows, consistent frame spacing at least 32 px, center point stable. No background, no ground, no character, no UI, no text.
```

### Healing Light VFX

```text
Create a 2048x2048 transparent-background 2D VFX sprite sheet for Healing Light. Green-gold circular healing field, upward light motes, soft blessing ring, gentle pulse, clean alpha fade. 6 columns x 4 rows, consistent frame spacing at least 32 px, center point stable. No background, no ground, no character, no UI, no text.
```

### Summon Portal VFX

```text
Create a 2048x2048 transparent-background 2D VFX sprite sheet for Super Cat summon portal. Purple-blue magic portal, gold runic rings, radial starburst, rising particles, bright center flash, premium mobile game effect. 6 columns x 4 rows, consistent frame spacing at least 32 px, center point stable, generous padding for glow. No background, no ground, no character, no UI, no text.
```

### Impact Spark VFX

```text
Create a 2048x2048 transparent-background 2D VFX sprite sheet for melee and projectile impact sparks. Include small white spark, yellow slash spark, orange heavy hit burst, red critical flash, and tiny debris dots. 6 columns x 4 rows, consistent frame spacing at least 32 px, center point stable. No background, no ground, no character, no UI, no text.
```

### Base Explosion VFX

```text
Create a 2048x2048 transparent-background 2D VFX sprite sheet for base destruction explosion. Large orange-gold blast, circular shockwave, wood/stone debris silhouettes, smoke puff, ember fade. 6 columns x 4 rows, consistent frame spacing at least 32 px, center point stable, no frame cropping. No background, no ground, no character, no UI, no text.
```

### Cooldown Ready Burst

```text
Create a 2048x2048 transparent-background 2D UI VFX sprite sheet for skill cooldown ready feedback. Small circular gold-blue glow burst, rim sparkle, short star pop, soft fade. 6 columns x 4 rows, consistent spacing, centered, no text, no icon, no button frame, no background.
```

## Damage Number Asset Prompt

```text
Create a 2D mobile game damage number style sheet. Include digits 0-9, minus sign, plus sign, critical marker shape, and small heal marker. White fill with dark brown outline for damage, red-orange variant for critical, green variant for healing. Transparent background, large readable glyphs, no extra words, no sample combat scene, no UI frame, no watermark.
```

## Item And Currency Prompts

### Fish Currency

```text
Create a 512x512 transparent-background 2D mobile game currency icon: cute shiny fish token, gold-blue rim, readable at small size. No text, no number, no background, no UI frame, no watermark.
```

### Gold Currency

```text
Create a 512x512 transparent-background 2D mobile game currency icon: cute gold coin with paw crest, polished highlight, readable at small size. No text, no number, no background, no UI frame, no watermark.
```

### Super Cat Ticket

```text
Create a 512x512 transparent-background 2D mobile game item icon: Super Cat summon ticket, purple-blue magic paper, gold paw seal, premium reward look. No text, no number, no background, no UI frame, no watermark.
```

### Reward Multiplier Token

```text
Create a 512x512 transparent-background 2D mobile game item icon: reward multiplier token, gold starburst coin, small upward arrow symbol, premium reward style. No text, no number, no background, no UI frame, no watermark.
```

## Result Screen Prompts

### Victory Burst

```text
Create a 2048x2048 transparent-background 2D VFX sprite sheet for victory celebration. Gold confetti, star fireworks, paw-shaped sparkles, warm glow arcs, clean fade. 6 columns x 4 rows, consistent spacing, center stable, no text, no UI, no background.
```

### Defeat Smoke

```text
Create a 2048x2048 transparent-background 2D VFX sprite sheet for gentle defeat screen smoke. Soft gray-blue smoke puffs, dim spark fade, non-scary mobile game style. 6 columns x 4 rows, consistent spacing, center stable, no text, no UI, no background.
```

### Reward Count-Up Glow

```text
Create a 2048x2048 transparent-background 2D UI VFX sprite sheet for reward count-up glow. Small gold flashes, coin sparkle, fish sparkle, radial pop, clean fade. 6 columns x 4 rows, consistent spacing, centered, no text, no icon, no button frame, no background.
```

## Master Combined Production Prompt

Use this when generating an entire concept batch or when giving instructions to an image generation pipeline.

```text
Create production-ready 2D game image assets for "Cat Kingdom Wars", a cute SD cat kingdom mobile/web strategy game with automatic frontline battles.

Global style: premium Korean mobile game polish, cute SD chibi cats, royal blue, gold, coral red, emerald green, warm cream highlights, bright readable fantasy mood, clean silhouettes, launch-quality UI/UX.

Required asset groups:
1. Opening screen background, title logo, magical particles.
2. Lobby background, cat castle, research lab, shop, stage portal, reward chest.
3. Stage map background and stage node icon set.
4. Square battle backgrounds with wide multi-lane frontline corridors.
5. Player base, dog enemy base, neutral base.
6. Sprite sheets for swordsman cat, archer cat, mage cat, tank cat, super knight cat, and dog soldier.
7. Skill icons for fire bombardment, healing light, super cat summon, production upgrade, attack upgrade, and health upgrade.
8. VFX sprite sheets for fire explosion, lightning, healing, summon portal, impact spark, base explosion, cooldown-ready burst, victory burst, defeat smoke, and reward count-up glow.
9. Currency and item icons for gold, fish, super cat ticket, and reward multiplier token.
10. Damage number style sheet with readable outlined digits and healing/critical variants.

Cutout asset rules: transparent background, centered subject, generous padding, no ground, no baked shadow, no text, no watermark, no UI frame unless the asset is explicitly a UI frame, no preview background, no sample labels, no decorative overlay baked into the asset.

Sprite sheet rules: 2048x2048, consistent grid, at least 32 px frame gaps, stable center point, enough padding so glow/weapons/tails/ears do not touch frame boundaries. Character sheets include Idle, Walk, Attack, Hit, Death. VFX sheets must fade cleanly and be easy to cut frame-by-frame.

UI/UX rules: icons must be readable at 48 px, cooldown states must support radial overlay and ready glow, damage and healing feedback must be high contrast, skill effects must be visible in crowded battles without hiding all units.

Avoid: 3D render look, photorealism, poster-style illustration for gameplay assets, cropped body parts, baked backgrounds on cutout assets, tiny unreadable details, text inside icons, watermarks, cluttered UI, dark low-contrast palettes.
```

## Production Checklist

- Every screen has image assets, not plain colored boxes.
- Every battle action has a visual feedback asset.
- Every skill has icon, ready state, cooldown state, cast VFX, hit VFX, and optional screen feedback.
- Damage numbers use image/font styling with outline and pop animation.
- Cooldowns are readable through both radial overlay and number countdown.
- All cutout assets are transparent PNG.
- All sprite sheets use consistent spacing and padding.
- VFX does not hide unit silhouettes for longer than the intended moment.
- Assets are generated as separate reusable pieces, not baked into one background.

## 2026-06-06 Shop And Character Expansion Prompts

### Opening Transparent Title Logo Replacement

```text
Create a transparent-background 2D mobile game title logo for "Cat Kingdom Wars". Premium cute Korean mobile game style, royal blue shield plaque, polished gold 3D letters, cat ears crown, paw banners, warm highlights, readable at portrait phone width. Include only the English title text "Cat Kingdom Wars". No checkerboard, no white preview background, no extra subtitle, no watermark, no cropped edges. Canvas 2048x1536, centered subject, generous transparent padding.
```

### Opening Foreground Hero Parade

```text
Create a 2048x512 transparent-background 2D foreground strip for a mobile game opening screen. Cute SD cat army parade crossing left to right: swordsman cat, archer cat, shield cat, mage cat, small flags, coin sparkle dust. Same style as Cat Kingdom Wars, bright royal blue and gold, readable at small size. No text, no background, no ground rectangle, no watermark, no cropped characters.
```

### Opening Top Reward Crest

```text
Create a 1024x1024 transparent-background 2D reward crest icon for a mobile game opening screen. Round royal-blue medallion with gold cat paw crown, small gem, polished rim, premium login reward feel. No text, no number, no white/checkerboard background, no watermark.
```

### Shield Cat Shop Sprite

```text
Create a 2048x2048 transparent-background 2D sprite sheet for a cute SD shield cat unit. The character faces right in every frame, holds a large rounded royal-blue shield with gold paw crest, wears small armor, reads clearly at 48 px. 8 columns x 5 rows: Idle, Walk, Attack, Hit, Death. Stable feet position, generous padding, no background, no text, no watermark, no cropped ears/tail/shield.
```

### Mage Cat Shop Sprite

```text
Create a 2048x2048 transparent-background 2D sprite sheet for a cute SD mage cat unit. The character faces right in every frame, wears a purple-gold wizard hood, carries a glowing staff, casts small star magic. 8 columns x 5 rows: Idle, Walk, Attack, Hit, Death. Stable center point, readable silhouette, no background, no text, no watermark, no cropped staff glow.
```

### Premium Star Knight Cat

```text
Create a 2048x2048 transparent-background 2D sprite sheet for a premium star knight cat hero. Elegant royal-blue and gold armor, luminous cape, star-shaped sword, heroic but cute SD proportions, faces right in every frame. 8 columns x 5 rows: Idle, Walk, Attack, Hit, Death. Consistent foot anchor, bright readable silhouette, no background, no UI, no text, no watermark.
```

### Mission Priest Cat

```text
Create a 2048x2048 transparent-background 2D sprite sheet for a mission-unlocked priest cat support unit. White and emerald robe, small gold bell staff, healing paw aura, calm friendly expression, faces right in every frame. 8 columns x 5 rows: Idle, Walk, Heal Cast, Hit, Death. Stable center, no background, no text, no watermark, no cropped halo or staff.
```

### Shop Purchase Success VFX

```text
Create a 2048x2048 transparent-background 2D UI VFX sprite sheet for a shop purchase success effect. Gold coins fly upward, green check sparkle, small paw-shaped glow, quick satisfying pop. 6 columns x 4 rows, consistent center, no text, no background, no button frame, no watermark.
```

### Resource Spend VFX

```text
Create a 2048x2048 transparent-background 2D UI VFX sprite sheet for spending game currency. Gold coins and fish icons shrink into a soft burst, minus-number-friendly glow trail, readable but not harsh. 6 columns x 4 rows, centered, no text, no background, no watermark.
```
