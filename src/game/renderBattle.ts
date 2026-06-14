import { animationDefinitions, effectDefinitions } from "../data/gameData";
import { getAssetImage, getEffectSprite, getUnitSprite } from "./imageAssets";
import type { AnimationDefinition, BattleEvent, BattleSnapshot, EffectDefinition, RuntimeBase, RuntimeUnit } from "./types";
import { battleVisualScale } from "./visualScale";

type RenderOptions = {
  width: number;
  height: number;
};

type Camera = {
  scale: number;
  scaleX: number;
  scaleY: number;
  offsetX: number;
  offsetY: number;
  boardWidth: number;
  boardHeight: number;
  shakeX: number;
  shakeY: number;
};

const animationMap = Object.fromEntries(animationDefinitions.map((animation) => [animation.id, animation]));
const effectMap = Object.fromEntries(effectDefinitions.map((effect) => [effect.id, effect]));

export function renderBattle(ctx: CanvasRenderingContext2D, snapshot: BattleSnapshot, options: RenderOptions): void {
  const camera = createCamera(snapshot, options);
  ctx.clearRect(0, 0, options.width, options.height);

  drawBackdrop(ctx, options, snapshot.timeMs);
  drawBattlefield(ctx, camera, snapshot.timeMs);
  drawBases(ctx, camera, snapshot.bases, snapshot.timeMs);
  drawLaneEnergy(ctx, camera, snapshot.timeMs);
  drawUnits(ctx, camera, snapshot.units, snapshot.timeMs);
  drawEvents(ctx, camera, snapshot.events, snapshot.timeMs);
  drawBattleHud(ctx, snapshot, options);
}

export function screenToWorld(x: number, y: number, snapshot: BattleSnapshot, options: RenderOptions) {
  const camera = createCamera(snapshot, options);
  return {
    x: (x - camera.offsetX - camera.shakeX) / camera.scaleX,
    y: (y - camera.offsetY - camera.shakeY) / camera.scaleY,
  };
}

function createCamera(snapshot: BattleSnapshot, options: RenderOptions): Camera {
  const isPortrait = options.height > options.width * 1.25;
  const topReserved = isPortrait ? 76 : 18;
  const bottomReserved = isPortrait ? 84 : 72;
  const squareSize = Math.min(options.width - 8, options.height - topReserved - bottomReserved);
  const boardWidth = isPortrait ? options.width - 8 : squareSize;
  const boardHeight = isPortrait ? options.height - topReserved - bottomReserved : squareSize;
  const scaleX = boardWidth / snapshot.mapSize;
  const scaleY = boardHeight / snapshot.mapSize;
  const scale = Math.min(scaleX, scaleY);

  return {
    scale,
    scaleX,
    scaleY,
    boardWidth,
    boardHeight,
    offsetX: (options.width - boardWidth) / 2,
    offsetY: isPortrait ? topReserved : Math.max(18, (options.height - boardHeight) / 2 - 8),
    shakeX: 0,
    shakeY: 0,
  };
}

function world(camera: Camera, x: number, y: number) {
  return {
    x: camera.offsetX + camera.shakeX + x * camera.scaleX,
    y: camera.offsetY + camera.shakeY + y * camera.scaleY,
  };
}

function drawBackdrop(ctx: CanvasRenderingContext2D, options: RenderOptions, timeMs: number): void {
  const battleMap = getAssetImage("battleGrassland");
  const gradient = ctx.createLinearGradient(0, 0, 0, options.height);
  gradient.addColorStop(0, "#6bb8ff");
  gradient.addColorStop(0.42, "#ffe2a8");
  gradient.addColorStop(1, "#70c18c");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, options.width, options.height);

  if (battleMap) {
    ctx.save();
    ctx.globalAlpha = 0.48;
    ctx.filter = "blur(5px) saturate(1.05)";
    drawImageCover(ctx, battleMap, -10, -10, options.width + 20, options.height + 20);
    ctx.restore();

    ctx.fillStyle = "rgba(96, 177, 243, 0.22)";
    ctx.fillRect(0, 0, options.width, options.height);
    ctx.fillStyle = "rgba(242, 213, 126, 0.12)";
    ctx.fillRect(0, options.height * 0.44, options.width, options.height * 0.28);
  }

  ctx.save();
  ctx.globalAlpha = battleMap ? 0.16 : 0.28;
  for (let i = 0; i < 7; i += 1) {
    const x = ((timeMs * 0.012 + i * 170) % (options.width + 240)) - 120;
    const y = 34 + (i % 3) * 34;
    drawCloud(ctx, x, y, 0.75 + (i % 2) * 0.25);
  }
  ctx.restore();
}

function drawBattlefield(ctx: CanvasRenderingContext2D, camera: Camera, timeMs: number): void {
  const { offsetX, offsetY, boardWidth, boardHeight } = camera;
  const radius = 18;
  const battleMap = getAssetImage("battleGrassland");

  ctx.save();
  roundedRect(ctx, offsetX, offsetY, boardWidth, boardHeight, radius);
  const fieldGradient = ctx.createLinearGradient(offsetX, offsetY, offsetX + boardWidth, offsetY + boardHeight);
  fieldGradient.addColorStop(0, "#91db88");
  fieldGradient.addColorStop(0.5, "#f4d876");
  fieldGradient.addColorStop(1, "#7bcdb5");
  ctx.fillStyle = fieldGradient;
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.clip();
  if (battleMap) {
    drawImageCover(ctx, battleMap, offsetX, offsetY, boardWidth, boardHeight);
    ctx.fillStyle = "rgba(255, 244, 196, 0.08)";
    ctx.fillRect(offsetX, offsetY, boardWidth, boardHeight);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.32)";
    ctx.lineWidth = 3 * camera.scale;
    drawFrontLineGuide(ctx, camera, 500, 270);
    ctx.restore();
    return;
  }
  drawTiledGrass(ctx, camera, timeMs);
  drawRoad(ctx, camera);
  ctx.restore();
}

function drawTiledGrass(ctx: CanvasRenderingContext2D, camera: Camera, timeMs: number): void {
  for (let y = 80; y < 960; y += 80) {
    for (let x = 80; x < 960; x += 80) {
      const p = world(camera, x + Math.sin((timeMs + x * 3) * 0.001) * 2, y);
      ctx.fillStyle = "rgba(255,255,255,0.13)";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, 14 * camera.scale, 5 * camera.scale, -0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawRoad(ctx: CanvasRenderingContext2D, camera: Camera): void {
  const offsets = [-216, -144, -72, 0, 72, 144, 216];

  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(136, 92, 55, 0.2)";
  ctx.lineWidth = 286 * camera.scale;
  drawOffsetBattlePath(ctx, camera, 0);

  ctx.strokeStyle = "rgba(255, 246, 190, 0.2)";
  ctx.lineWidth = 224 * camera.scale;
  drawOffsetBattlePath(ctx, camera, 0);

  for (const offset of offsets) {
    ctx.strokeStyle = offset === 0 ? "rgba(255, 246, 190, 0.38)" : "rgba(125, 83, 49, 0.24)";
    ctx.lineWidth = (offset === 0 ? 28 : 18) * camera.scale;
    drawOffsetBattlePath(ctx, camera, offset);
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.38)";
  ctx.lineWidth = 3 * camera.scale;
  drawFrontLineGuide(ctx, camera, 500, 270);
}

function drawOffsetBattlePath(ctx: CanvasRenderingContext2D, camera: Camera, offset: number): void {
  const lane = offset / Math.SQRT2;
  const start = world(camera, 180 + lane, 820 + lane);
  const end = world(camera, 820 + lane, 180 + lane);
  const middle = world(camera, 500 + lane, 500 + lane);

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.quadraticCurveTo(middle.x, middle.y, end.x, end.y);
  ctx.stroke();
}

function drawFrontLineGuide(ctx: CanvasRenderingContext2D, camera: Camera, center: number, width: number): void {
  const half = width / 2 / Math.SQRT2;
  const a = world(camera, center - half, center - half);
  const b = world(camera, center + half, center + half);

  ctx.save();
  ctx.setLineDash([10 * camera.scale, 12 * camera.scale]);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.restore();
}

function drawBases(ctx: CanvasRenderingContext2D, camera: Camera, bases: RuntimeBase[], timeMs: number): void {
  for (const base of bases) {
    if (drawBaseImage(ctx, camera, base)) {
      continue;
    }

    const p = world(camera, base.x, base.y);
    const isPlayer = base.factionId === "cat_kingdom";
    const bannerWave = Math.sin(timeMs * 0.006 + base.x) * 4;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(camera.scale * battleVisualScale.base, camera.scale * battleVisualScale.base);

    ctx.fillStyle = "rgba(47, 50, 54, 0.28)";
    ctx.beginPath();
    ctx.ellipse(0, 44, 88, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isPlayer ? "#f4c75b" : "#a56a43";
    ctx.strokeStyle = "#5c3b2e";
    ctx.lineWidth = 8;
    roundedRect(ctx, -62, -46, 124, 92, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isPlayer ? "#2f6fd6" : "#7c2d12";
    ctx.beginPath();
    ctx.moveTo(-72, -42);
    ctx.lineTo(0, -108);
    ctx.lineTo(72, -42);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fff4ca";
    ctx.fillRect(-28, -10, 56, 56);
    ctx.fillStyle = isPlayer ? "#315caa" : "#492019";
    ctx.fillRect(-18, 6, 36, 40);

    ctx.fillStyle = isPlayer ? "#ffdd64" : "#ff6b3d";
    ctx.beginPath();
    ctx.moveTo(24, -110);
    ctx.lineTo(24, -154);
    ctx.lineTo(86, -144 + bannerWave);
    ctx.lineTo(24, -130);
    ctx.closePath();
    ctx.fill();

    drawHealthBar(
      ctx,
      -battleVisualScale.baseHealthBarWidth / 2,
      70,
      battleVisualScale.baseHealthBarWidth,
      battleVisualScale.baseHealthBarHeight,
      base.hp / base.maxHp,
      isPlayer ? "#4ade80" : "#ff6b6b",
    );
    ctx.restore();
  }
}

function drawBaseImage(ctx: CanvasRenderingContext2D, camera: Camera, base: RuntimeBase): boolean {
  const image = getAssetImage(base.factionId === "cat_kingdom" ? "playerBase" : "enemyBase");
  if (!image) {
    return false;
  }

  const p = world(camera, base.x, base.y);
  const isPlayer = base.factionId === "cat_kingdom";
  const baseImageScale = 1.5;
  const imageSize = 250 * camera.scale * battleVisualScale.base * baseImageScale;

  ctx.save();
  ctx.fillStyle = "rgba(47, 50, 54, 0.28)";
  ctx.beginPath();
  ctx.ellipse(
    p.x,
    p.y + 44 * camera.scale,
    82 * camera.scale * baseImageScale,
    24 * camera.scale * baseImageScale,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.drawImage(image, p.x - imageSize / 2, p.y - imageSize * 0.68, imageSize, imageSize);
  drawWorldBaseHealthBar(ctx, camera, base, isPlayer ? "#4ade80" : "#ff6b6b");
  ctx.restore();
  return true;
}

function drawLaneEnergy(ctx: CanvasRenderingContext2D, camera: Camera, timeMs: number): void {
  ctx.save();
  ctx.globalAlpha = 0.38;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  const offsets = [-180, -90, 0, 90, 180];
  for (let i = 0; i < 15; i += 1) {
    const t = ((timeMs * 0.00012 + i / 8) % 1);
    const offset = offsets[i % offsets.length] / Math.SQRT2;
    const x = 180 + (820 - 180) * t + offset;
    const y = 820 + (180 - 820) * t + offset + Math.sin(t * Math.PI * 8) * 14;
    const p = world(camera, x, y);
    ctx.beginPath();
    ctx.arc(p.x, p.y, (5 + i % 3) * camera.scale, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawUnits(ctx: CanvasRenderingContext2D, camera: Camera, units: RuntimeUnit[], timeMs: number): void {
  const sorted = [...units].sort((a, b) => a.y - b.y);
  for (const unit of sorted) {
    drawUnit(ctx, camera, unit, timeMs);
  }
}

function drawUnit(ctx: CanvasRenderingContext2D, camera: Camera, unit: RuntimeUnit, timeMs: number): void {
  const p = world(camera, unit.x, unit.y);
  const animation = animationMap[unit.animationSetKey];
  const palette = animation?.palette ?? ["#f7d58a", "#2f6fd6", "#ffffff", "#d94747"];
  const isEnemy = unit.factionId !== "cat_kingdom";
  const bob = unit.state === "walk" ? Math.sin(timeMs * 0.018 + unit.x) * 5 : Math.sin(timeMs * 0.006 + unit.x) * 2;
  const attackSquash = unit.state === "attack" ? 1 + Math.sin(timeMs * 0.04) * 0.08 : 1;
  const unitScale = unit.unitKey.includes("super") ? battleVisualScale.superUnit : battleVisualScale.unit;
  const scale = camera.scale * unitScale;

  if (drawUnitImage(ctx, camera, unit, timeMs, unitScale)) {
    return;
  }

  ctx.save();
  ctx.translate(p.x, p.y + bob * camera.scale);
  ctx.scale(scale * unit.facing, scale);

  ctx.fillStyle = "rgba(47, 50, 54, 0.25)";
  ctx.beginPath();
  ctx.ellipse(0, 28, 34, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.scale(attackSquash, 1 / attackSquash);

  ctx.fillStyle = isEnemy ? "#8a5a44" : palette[0];
  ctx.strokeStyle = unit.hitFlashMs > 0 ? "#ffffff" : "#3b2b25";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(0, -8, 27, 31, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-18, -34);
  ctx.lineTo(-33, -60);
  ctx.lineTo(-4, -44);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(18, -34);
  ctx.lineTo(33, -60);
  ctx.lineTo(4, -44);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isEnemy ? "#7c2d12" : palette[1];
  roundedRect(ctx, -23, -6, 46, 38, 13);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#211512";
  ctx.beginPath();
  ctx.arc(-10, -14, 3.5, 0, Math.PI * 2);
  ctx.arc(10, -14, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#211512";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, -5, 8, 0.15, Math.PI - 0.15);
  ctx.stroke();

  drawWeapon(ctx, unit, palette, isEnemy, timeMs);
  ctx.restore();

  drawWorldHealthBar(ctx, camera, unit.x, unit.y - 74 * unitScale, unit.hp / unit.maxHp, isEnemy ? "#fb7185" : "#4ade80");
}

function drawUnitImage(
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  unit: RuntimeUnit,
  timeMs: number,
  unitScale: number,
): boolean {
  const sprite = getUnitSprite(unit);
  if (!sprite) {
    return false;
  }

  const p = world(camera, unit.x, unit.y);
  const frameWidth = sprite.image.naturalWidth / sprite.config.columns;
  const frameHeight = sprite.image.naturalHeight / sprite.config.rows;
  const row = getUnitSpriteRow(unit.state);
  const frameSequence = getUnitSpriteFrameSequence(unit, row, sprite.config.columns);
  const frameMs = unit.state === "attack" ? 140 : unit.state === "walk" ? 120 : 190;
  const frameIndex = Math.floor(timeMs / frameMs + hashUnitId(unit.id)) % frameSequence.length;
  const frame = frameSequence[frameIndex];
  const bob = unit.state === "walk" ? Math.sin(timeMs * 0.007 + unit.x) * 1.7 : Math.sin(timeMs * 0.004 + unit.x) * 0.8;
  const isSuperUnit = unit.unitKey.includes("super");
  const targetHeight = (isSuperUnit ? 162 : 126) * camera.scale * unitScale;
  const atlasRatio = frameWidth / frameHeight;
  const targetWidth = targetHeight * Math.min(1.25, Math.max(0.78, atlasRatio * 0.9));
  const hitFlash = unit.hitFlashMs > 0;
  const visualFacing = getUnitVisualFacing(unit);

  ctx.save();
  ctx.fillStyle = "rgba(47, 50, 54, 0.24)";
  ctx.beginPath();
  ctx.ellipse(p.x, p.y + 23 * camera.scale, targetWidth * 0.34, targetHeight * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  if (isSuperUnit) {
    drawSuperUnitAura(ctx, p.x, p.y, targetHeight, timeMs);
  }

  ctx.translate(p.x, p.y + bob * camera.scale);
  ctx.scale(visualFacing, 1);
  ctx.globalAlpha = hitFlash ? 0.72 : 1;
  ctx.drawImage(
    sprite.image,
    frame * frameWidth,
    row * frameHeight,
    frameWidth,
    frameHeight,
    -targetWidth / 2,
    -targetHeight * 0.78,
    targetWidth,
    targetHeight,
  );
  if (hitFlash) {
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.38;
    ctx.drawImage(
      sprite.image,
      frame * frameWidth,
      row * frameHeight,
      frameWidth,
      frameHeight,
      -targetWidth / 2,
      -targetHeight * 0.78,
      targetWidth,
      targetHeight,
    );
  }
  ctx.restore();

  const healthWidth = isSuperUnit ? battleVisualScale.superUnitHealthBarWidth : battleVisualScale.unitHealthBarWidth;
  const healthHeight = isSuperUnit ? battleVisualScale.superUnitHealthBarHeight : battleVisualScale.unitHealthBarHeight;
  drawHealthBar(
    ctx,
    p.x - healthWidth / 2,
    p.y - targetHeight * 0.98,
    healthWidth,
    healthHeight,
    unit.hp / unit.maxHp,
    unit.factionId !== "cat_kingdom" ? "#fb7185" : "#4ade80",
  );
  return true;
}

function drawSuperUnitAura(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, timeMs: number): void {
  const pulse = 0.72 + Math.sin(timeMs * 0.005) * 0.16;
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.42 * pulse;
  const gradient = ctx.createRadialGradient(x, y - size * 0.42, size * 0.08, x, y - size * 0.36, size * 0.78);
  gradient.addColorStop(0, "rgba(255, 247, 176, 0.85)");
  gradient.addColorStop(0.46, "rgba(115, 92, 255, 0.42)");
  gradient.addColorStop(1, "rgba(115, 92, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(x, y - size * 0.36, size * 0.48, size * 0.66, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.78 * pulse;
  ctx.strokeStyle = "rgba(255, 234, 132, 0.92)";
  ctx.lineWidth = Math.max(2, size * 0.035);
  ctx.beginPath();
  ctx.ellipse(x, y - size * 0.34, size * 0.42, size * 0.58, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function getUnitVisualFacing(unit: Pick<RuntimeUnit, "spriteKey" | "unitKey" | "facing">): 1 | -1 {
  const sourceFacingBySprite: Record<string, 1 | -1> = {
    cat_swordsman: 1,
    cat_archer: 1,
    cat_mage: 1,
    cat_tank: 1,
    cat_lancer: 1,
    cat_priest: 1,
    cat_ninja: 1,
    cat_bomb: 1,
    cat_engineer: 1,
    cat_frost: 1,
    cat_thunder_drummer: 1,
    cat_royal_cannon: 1,
    cat_star_knight: 1,
    super_knight_cat: 1,
    dog_soldier: 1,
    dog_raider: -1,
    dog_guard: -1,
    dog_captain: -1,
    dog_mage: -1,
    dog_siege_brute: -1,
  };
  const sourceFacing = sourceFacingBySprite[unit.spriteKey] ?? 1;
  const desiredFacing = unit.facing;

  return sourceFacing === desiredFacing ? 1 : -1;
}

export function getUnitSpriteFrameSequence(unit: Pick<RuntimeUnit, "spriteKey" | "unitKey">, row: number, columns: number): number[] {
  const stableSequences: Record<string, Record<number, number[]>> = {
    cat_swordsman: {
      4: [0, 1, 2, 3, 4, 5, 7],
    },
    cat_archer: {
      2: [0, 1, 2, 3, 4, 6, 7],
      4: [0, 1, 2, 3, 4, 7],
    },
    cat_mage: {
      2: [0, 1, 2, 3, 4, 5, 7],
      4: [0, 1, 2, 3, 4, 5, 7],
    },
    cat_tank: {
      4: [0, 1, 2, 3, 4],
    },
    cat_lancer: getConservativeCatFrames(),
    cat_priest: getConservativeCatFrames(),
    cat_ninja: getConservativeCatFrames(),
    cat_bomb: getConservativeCatFrames(),
    cat_engineer: getConservativeCatFrames(),
    cat_frost: getConservativeCatFrames(),
    cat_thunder_drummer: getConservativeCatFrames(),
    cat_royal_cannon: getConservativeCatFrames(),
    cat_star_knight: getConservativeCatFrames(),
    dog_soldier: getDogSoldierFrames(),
    dog_raider: getDogRaiderFrames(),
    dog_guard: getDogGuardFrames(),
    dog_captain: getDogFrames([0, 1, 2, 5, 6, 7]),
    dog_mage: getDogFrames([0, 1, 2, 3, 6, 7]),
    dog_siege_brute: getDogFrames([0, 1, 2, 3, 4, 5, 6]),
  };
  const stableSequence = stableSequences[unit.spriteKey]?.[row];
  if (stableSequence) {
    return stableSequence.filter((frame) => frame < columns);
  }

  if (unit.unitKey.includes("super")) {
    if (row === 0) {
      return [0, 1, 3, 4, 5, 7];
    }
    if (row === 1) {
      return [0, 2, 3, 4, 5, 7];
    }
    if (row === 2) {
      return [0, 2, 3];
    }
    if (row === 3) {
      return [0, 2, 3, 4, 5, 7];
    }
    return [0, 1, 3, 5, 7];
  }

  return Array.from({ length: columns }, (_, index) => index);
}

function getConservativeCatFrames(): Record<number, number[]> {
  return {
    0: [0, 1, 2, 3],
    1: [0, 1, 2, 3],
    2: [0, 1, 2, 3],
    3: [0, 1, 2, 3],
    4: [0, 1, 2, 3],
  };
}

function getDogFrames(attackFrames: number[]): Record<number, number[]> {
  const loop = [0, 1, 2, 3, 4, 5, 6, 7];

  return {
    0: loop,
    1: loop,
    2: attackFrames,
    3: loop,
    4: loop,
  };
}

function getDogSoldierFrames(): Record<number, number[]> {
  const loop = [0, 1, 2, 3, 4, 5];

  return {
    0: loop,
    1: loop,
    2: [0, 1, 2, 5],
    3: loop,
    4: loop,
  };
}

function getDogGuardFrames(): Record<number, number[]> {
  return {
    0: [0, 1, 2, 3, 4, 5],
    1: [0, 1, 2, 3, 4, 5],
    2: [0, 1, 2, 7],
    3: [0, 2, 3, 4, 5],
    4: [0, 1, 2, 3],
  };
}

function getDogRaiderFrames(): Record<number, number[]> {
  const loop = [0, 1, 2, 3, 4, 5, 6];

  return {
    0: loop,
    1: loop,
    2: [0, 1, 2, 3, 6],
    3: loop,
    4: loop,
  };
}

function getUnitSpriteRow(state: RuntimeUnit["state"]): number {
  if (state === "walk") {
    return 1;
  }
  if (state === "attack") {
    return 2;
  }
  if (state === "hit") {
    return 1;
  }
  if (state === "death") {
    return 4;
  }
  return 0;
}

function hashUnitId(id: string): number {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash + id.charCodeAt(index) * (index + 1)) % 97;
  }
  return hash;
}

function drawWeapon(ctx: CanvasRenderingContext2D, unit: RuntimeUnit, palette: string[], isEnemy: boolean, timeMs: number): void {
  const attackLift = unit.state === "attack" ? Math.sin(timeMs * 0.05) * 12 : 0;

  if (unit.role === "ranged") {
    ctx.strokeStyle = "#895737";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(30, -5, 25, -1.1, 1.1);
    ctx.stroke();
    ctx.strokeStyle = "#f8fafc";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(41, -26);
    ctx.lineTo(41, 16);
    ctx.stroke();
    return;
  }

  if (unit.role === "aoe") {
    ctx.strokeStyle = "#5b3a27";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(30, 18);
    ctx.lineTo(42, -45 - attackLift);
    ctx.stroke();
    ctx.fillStyle = palette[3] ?? "#58c7ff";
    ctx.beginPath();
    ctx.arc(45, -52 - attackLift, 11, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (unit.role === "tank") {
    ctx.fillStyle = "#64748b";
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 4;
    roundedRect(ctx, 24, -10, 24, 38, 8);
    ctx.fill();
    ctx.stroke();
    return;
  }

  ctx.strokeStyle = isEnemy ? "#3f1f16" : "#eef2ff";
  ctx.lineWidth = unit.unitKey.includes("super") ? 10 : 6;
  ctx.beginPath();
  ctx.moveTo(28, 18);
  ctx.lineTo(56, -38 - attackLift);
  ctx.stroke();
}

function drawEvents(ctx: CanvasRenderingContext2D, camera: Camera, events: BattleEvent[], timeMs: number): void {
  for (const event of events) {
    const progress = Math.min(1, Math.max(0, (timeMs - event.createdAtMs) / event.durationMs));
    const effect = effectMap[event.effectId];
    const color = event.color ?? effect?.colorTint ?? "#ffffff";
    const p = world(camera, event.x, event.y);

    if (drawEventSprite(ctx, event, p.x, p.y, camera.scale, progress)) {
      // Sprite asset already rendered.
    } else if (event.effectId.includes("fire") || event.effectId.includes("explosion")) {
      drawFireEffect(ctx, p.x, p.y, event.radius * camera.scale, progress);
    } else if (event.effectId.includes("healing")) {
      drawHealEffect(ctx, p.x, p.y, event.radius * camera.scale, progress);
    } else if (event.effectId.includes("summon")) {
      drawPortalEffect(ctx, p.x, p.y, event.radius * camera.scale, progress);
    } else {
      drawSparkEffect(ctx, p.x, p.y, event.radius * camera.scale, progress, color);
    }

    if (event.label) {
      const labelStyle = getEventLabelStyle(event);
      ctx.save();
      ctx.globalAlpha = 1 - progress;
      ctx.fillStyle = labelStyle.fill;
      ctx.strokeStyle = labelStyle.stroke;
      ctx.lineWidth = labelStyle.lineWidth;
      ctx.font = `${labelStyle.weight} ${labelStyle.size}px system-ui`;
      ctx.textAlign = "center";
      ctx.strokeText(event.label, p.x, p.y - labelStyle.rise * progress);
      ctx.fillText(event.label, p.x, p.y - labelStyle.rise * progress);
      ctx.restore();
    }
  }
}

function getEventLabelStyle(event: BattleEvent) {
  if (event.kind === "money") {
    return { fill: "#fff7b0", stroke: "#24502f", size: 20, weight: 950, lineWidth: 5, rise: 56 };
  }
  if (event.kind === "upgrade") {
    return { fill: "#ffffff", stroke: "#8a4d11", size: 19, weight: 950, lineWidth: 5, rise: 52 };
  }
  if (event.kind === "warning") {
    return { fill: "#ffe1d3", stroke: "#7c1d12", size: 17, weight: 900, lineWidth: 5, rise: 38 };
  }
  return { fill: "#ffffff", stroke: "#3b1f1a", size: 18, weight: 700, lineWidth: 4, rise: 42 };
}

function drawEventSprite(
  ctx: CanvasRenderingContext2D,
  event: BattleEvent,
  x: number,
  y: number,
  scale: number,
  progress: number,
): boolean {
  const sprite = getEffectSprite(event.effectId);
  if (!sprite) {
    return false;
  }

  const frameWidth = sprite.image.naturalWidth / sprite.config.columns;
  const frameHeight = sprite.image.naturalHeight / sprite.config.rows;
  const { column, row } = getEffectSpriteCell(sprite.config, progress);
  const size = Math.max(42, event.radius * scale * (event.kind === "hit" ? 1.5 : 2.25));

  ctx.save();
  ctx.globalCompositeOperation = event.kind === "hit" ? "source-over" : "screen";
  ctx.globalAlpha = Math.max(0, 1 - progress * 0.42);
  ctx.drawImage(
    sprite.image,
    column * frameWidth,
    row * frameHeight,
    frameWidth,
    frameHeight,
    x - size / 2,
    y - size / 2,
    size,
    size,
  );
  ctx.restore();
  return true;
}

export function getEffectSpriteCell(
  config: { columns: number; rows: number; startRow: number; frames?: Array<{ row: number; column: number }> },
  progress: number,
): { row: number; column: number } {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  if (config.frames && config.frames.length > 0) {
    const frameIndex = Math.min(config.frames.length - 1, Math.floor(clampedProgress * config.frames.length));
    const frame = config.frames[frameIndex];
    return {
      row: Math.max(0, Math.min(config.rows - 1, frame.row)),
      column: Math.max(0, Math.min(config.columns - 1, frame.column)),
    };
  }

  const startRow = Math.max(0, Math.min(config.rows - 1, config.startRow));
  const totalFrames = Math.max(1, (config.rows - startRow) * config.columns);
  const frameIndex = Math.min(totalFrames - 1, Math.floor(clampedProgress * totalFrames));

  return {
    row: startRow + Math.floor(frameIndex / config.columns),
    column: frameIndex % config.columns,
  };
}

function drawFireEffect(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, progress: number): void {
  const alpha = 1 - progress;
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const coreRadius = radius * (0.45 + progress * 0.65);
  const coreGradient = ctx.createRadialGradient(x, y, 0, x, y, coreRadius);
  coreGradient.addColorStop(0, "rgba(255, 255, 220, 1)");
  coreGradient.addColorStop(0.28, "rgba(255, 197, 74, 0.95)");
  coreGradient.addColorStop(0.62, "rgba(255, 84, 42, 0.55)");
  coreGradient.addColorStop(1, "rgba(255, 35, 18, 0)");
  ctx.globalAlpha = Math.max(0, alpha * 0.95);
  ctx.fillStyle = coreGradient;
  ctx.beginPath();
  ctx.arc(x, y, coreRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = alpha * 0.85;
  ctx.strokeStyle = "#fff2a8";
  ctx.lineWidth = Math.max(3, radius * 0.05);
  ctx.beginPath();
  ctx.arc(x, y, radius * (0.25 + progress * 0.85), 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 14; i += 1) {
    const angle = i * 1.7 + progress * 5;
    const distance = radius * progress * (0.35 + (i % 5) * 0.13);
    const particleRadius = radius * (0.18 + (i % 3) * 0.05) * alpha;
    const gradient = ctx.createRadialGradient(
      x + Math.cos(angle) * distance,
      y + Math.sin(angle) * distance,
      0,
      x + Math.cos(angle) * distance,
      y + Math.sin(angle) * distance,
      particleRadius,
    );
    gradient.addColorStop(0, "#fff7a6");
    gradient.addColorStop(0.45, "#ff7a2f");
    gradient.addColorStop(1, "rgba(255, 20, 20, 0)");
    ctx.globalAlpha = alpha;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, particleRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawHealEffect(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, progress: number): void {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 1 - progress * 0.65;
  ctx.strokeStyle = "#8dffb0";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, radius * (0.25 + progress * 0.65), 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2 + progress * 2;
    ctx.fillStyle = i % 2 === 0 ? "#ffffff" : "#8dffb0";
    ctx.fillRect(x + Math.cos(angle) * radius * 0.5 - 3, y + Math.sin(angle) * radius * 0.5 - 10, 6, 20);
  }
  ctx.restore();
}

function drawPortalEffect(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, progress: number): void {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.translate(x, y);
  ctx.rotate(progress * Math.PI * 3);
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.85);
  glow.addColorStop(0, "rgba(255, 255, 255, 0.9)");
  glow.addColorStop(0.35, "rgba(139, 92, 246, 0.68)");
  glow.addColorStop(1, "rgba(65, 48, 190, 0)");
  ctx.fillStyle = glow;
  ctx.globalAlpha = 1 - progress * 0.45;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#7b5cff";
  ctx.lineWidth = 8;
  ctx.globalAlpha = 1 - progress * 0.55;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * (0.35 + i * 0.14), radius * (0.12 + i * 0.05), i * 0.7, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = "#fff7b0";
  ctx.lineWidth = 4;
  for (let i = 0; i < 10; i += 1) {
    const angle = (i / 10) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * radius * 0.28, Math.sin(angle) * radius * 0.28);
    ctx.lineTo(Math.cos(angle) * radius * (0.92 + progress * 0.35), Math.sin(angle) * radius * (0.92 + progress * 0.35));
    ctx.stroke();
  }
  ctx.restore();
}

function drawSparkEffect(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, progress: number, color: string): void {
  ctx.save();
  ctx.globalAlpha = 1 - progress;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * radius * progress, y + Math.sin(angle) * radius * progress);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBattleHud(ctx: CanvasRenderingContext2D, snapshot: BattleSnapshot, options: RenderOptions): void {
  if (options.height > options.width * 1.25) {
    return;
  }

  const playerBase = snapshot.bases.find((base) => base.factionId === snapshot.playerFactionId);
  const enemyBase = snapshot.bases.find((base) => base.factionId === snapshot.enemyFactionId);

  ctx.save();
  ctx.fillStyle = "rgba(32, 28, 25, 0.58)";
  roundedRect(ctx, 18, options.height - 62, options.width - 36, 44, 14);
  ctx.fill();

  ctx.font = "700 15px system-ui";
  ctx.textAlign = "left";
  ctx.fillStyle = "#fff7d6";
  ctx.fillText(`Stage ${snapshot.stageId.replace("stage_", "")}  ${snapshot.stageName}`, 34, options.height - 35);

  ctx.textAlign = "right";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`냥이 ${Math.round(playerBase?.hp ?? 0)} / 적 ${Math.round(enemyBase?.hp ?? 0)}  유닛 ${snapshot.units.length}`, options.width - 34, options.height - 35);
  ctx.restore();
}

function drawHealthBar(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, ratio: number, color: string): void {
  const clampedRatio = Math.max(0, Math.min(1, ratio));
  const inset = Math.max(1, Math.min(2, height * 0.25));
  const innerWidth = Math.max(0, width - inset * 2) * clampedRatio;
  const innerHeight = Math.max(1.5, height - inset * 2);

  ctx.fillStyle = "rgba(24, 24, 27, 0.75)";
  roundedRect(ctx, x, y, width, height, height / 2);
  ctx.fill();
  if (innerWidth <= 0) {
    return;
  }
  ctx.fillStyle = color;
  roundedRect(ctx, x + inset, y + inset, innerWidth, innerHeight, innerHeight / 2);
  ctx.fill();
}

function drawWorldHealthBar(ctx: CanvasRenderingContext2D, camera: Camera, x: number, y: number, ratio: number, color: string): void {
  const p = world(camera, x, y);
  const width = battleVisualScale.unitHealthBarWidth;
  drawHealthBar(ctx, p.x - width / 2, p.y, width, battleVisualScale.unitHealthBarHeight, ratio, color);
}

function drawWorldBaseHealthBar(ctx: CanvasRenderingContext2D, camera: Camera, base: RuntimeBase, color: string): void {
  const p = world(camera, base.x, base.y);
  const width = battleVisualScale.baseHealthBarWidth;
  drawHealthBar(
    ctx,
    p.x - width / 2,
    p.y + 70 * camera.scale,
    width,
    battleVisualScale.baseHealthBarHeight,
    base.hp / base.maxHp,
    color,
  );
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number): void {
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x, y, 28 * scale, 0, Math.PI * 2);
  ctx.arc(x + 30 * scale, y - 10 * scale, 36 * scale, 0, Math.PI * 2);
  ctx.arc(x + 70 * scale, y, 26 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource & { naturalWidth?: number; naturalHeight?: number },
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  const imageWidth = image.naturalWidth ?? width;
  const imageHeight = image.naturalHeight ?? height;
  const scale = Math.max(width / imageWidth, height / imageHeight);
  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;
  ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}
