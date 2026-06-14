import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { skillDefinitions, stageDefinitions, superCatDefinitions, unitDefinitions } from "../data/gameData";
import { playBattleEventSfx, playSfx, unlockGameAudio } from "../game/audio";
import { BattleEngine } from "../game/BattleEngine";
import { createBattle } from "../game/createBattle";
import { preloadBattleImages } from "../game/imageAssets";
import { renderBattle, screenToWorld } from "../game/renderBattle";
import type { BattleSnapshot, UpgradeKind } from "../game/types";
import { getAvailablePlayerUnitIds, getBattlePlayerUnitPool, useGameStore } from "../store/gameStore";

type UpgradeState = Record<UpgradeKind, number>;
type UpgradeFeedback = {
  id: number;
  kind: UpgradeKind;
  status: "success" | "blocked";
  message: string;
};

const emptyUpgrades: UpgradeState = {
  production: 0,
  attack: 0,
  health: 0,
};

const emptyUpgradeCosts: UpgradeState = {
  production: 50,
  attack: 65,
  health: 60,
};

const upgradeLabels: Record<UpgradeKind, { title: string; bonusUnit: string; bonusStep: number }> = {
  production: { title: "생산", bonusUnit: "병력", bonusStep: 16 },
  attack: { title: "공격", bonusUnit: "피해", bonusStep: 14 },
  health: { title: "체력", bonusUnit: "HP", bonusStep: 14 },
};

const FIRE_SKILL_ID = "fire_bombardment";
const HEAL_SKILL_ID = "healing_light";
const SUPER_CAT_ID = "super_knight_cat";

export function BattleScreen() {
  useEffect(() => {
    preloadBattleImages();
  }, []);

  const selectedStageId = useGameStore((state) => state.selectedStageId);
  const finishBattle = useGameStore((state) => state.finishBattle);
  const enterLobby = useGameStore((state) => state.enterLobby);
  const recordSkillUse = useGameStore((state) => state.recordSkillUse);
  const progress = useGameStore((state) => state.progress);
  const kingdomUpgrades = progress.kingdomUpgrades;
  const ownedCharacterKey = progress.ownedCharacterIds.join("|");
  const ownedUnitIds = useMemo(() => getAvailablePlayerUnitIds(progress), [ownedCharacterKey]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<BattleEngine | null>(null);
  const frameRef = useRef<number | null>(null);
  const resultSentRef = useRef(false);
  const playedEventIdsRef = useRef<Set<string>>(new Set());
  const speedupSfxPlayedRef = useRef(false);
  const targetingSkillRef = useRef<string | null>(null);
  const exitConfirmRef = useRef(false);
  const feedbackTimeoutRef = useRef<number | null>(null);
  const feedbackSerialRef = useRef(0);
  const [snapshot, setSnapshot] = useState<BattleSnapshot | null>(null);
  const [targetingSkillId, setTargetingSkillId] = useState<string | null>(null);
  const [upgradeFeedback, setUpgradeFeedback] = useState<UpgradeFeedback | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [battleSpeed, setBattleSpeed] = useState<1 | 2>(1);

  const stage = useMemo(
    () => stageDefinitions.find((candidate) => candidate.id === selectedStageId) ?? stageDefinitions[0],
    [selectedStageId],
  );
  const stageNumber = useMemo(
    () => Math.max(1, stageDefinitions.findIndex((candidate) => candidate.id === selectedStageId) + 1),
    [selectedStageId],
  );

  useEffect(() => {
    targetingSkillRef.current = targetingSkillId;
  }, [targetingSkillId]);

  useEffect(() => {
    exitConfirmRef.current = showExitConfirm;
  }, [showExitConfirm]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const wrapper = canvas.parentElement;
    const rect = wrapper?.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect?.width ?? window.innerWidth));
    const height = Math.max(520, Math.floor(rect?.height ?? window.innerHeight));
    const pixelRatio = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }
  }, []);

  const draw = useCallback((currentSnapshot: BattleSnapshot) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }
    renderBattle(ctx, currentSnapshot, {
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    });
  }, []);

  const playNewBattleSounds = useCallback((currentSnapshot: BattleSnapshot, currentSpeed: 1 | 2) => {
    for (const event of currentSnapshot.events) {
      if (playedEventIdsRef.current.has(event.id)) {
        continue;
      }
      playedEventIdsRef.current.add(event.id);
      playBattleEventSfx(event);
    }

    if (currentSpeed === 2 && !speedupSfxPlayedRef.current) {
      speedupSfxPlayedRef.current = true;
      playSfx("occupationSpeedup");
    }
  }, []);

  useEffect(() => {
    const battle = createBattle({
      stageId: selectedStageId,
      stages: stageDefinitions,
      units: unitDefinitions,
      skills: skillDefinitions,
      superCats: superCatDefinitions,
    });

    const playerBase = battle.bases.find((base) => base.factionId === battle.playerFactionId);
    if (playerBase) {
      playerBase.unitPool = getBattlePlayerUnitPool(playerBase.unitPool, ownedUnitIds, stageNumber);
    }

    battle.upgrades.production = kingdomUpgrades.supply;
    battle.upgrades.attack = kingdomUpgrades.training;
    battle.upgrades.health = kingdomUpgrades.armor;
    const engine = new BattleEngine(battle);
    engineRef.current = engine;
    resultSentRef.current = false;
    playedEventIdsRef.current = new Set();
    speedupSfxPlayedRef.current = false;
    setTargetingSkillId(null);
    setShowExitConfirm(false);
    setBattleSpeed(1);
    resizeCanvas();

    const firstSnapshot = engine.getSnapshot();
    setSnapshot(firstSnapshot);
    draw(firstSnapshot);

    let lastTime = performance.now();
    const tick = (now: number) => {
      const delta = Math.min(50, now - lastTime);
      lastTime = now;
      const speed = getAutoBattleSpeed(engine.getSnapshot());
      engine.step(delta * speed);
      const next = engine.getSnapshot();
      const nextSpeed = getAutoBattleSpeed(next);
      window.__catKingdomBattleSnapshot = next;
      setSnapshot(next);
      setBattleSpeed(nextSpeed);
      draw(next);
      playNewBattleSounds(next, nextSpeed);

      if (next.result && !resultSentRef.current) {
        resultSentRef.current = true;
        window.setTimeout(() => finishBattle(next.result!), 900);
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    window.advanceTime = (ms: number) => {
      const speed = getAutoBattleSpeed(engine.getSnapshot());
      engine.step(ms * speed);
      const next = engine.getSnapshot();
      const nextSpeed = getAutoBattleSpeed(next);
      window.__catKingdomBattleSnapshot = next;
      setSnapshot(next);
      setBattleSpeed(nextSpeed);
      draw(next);
      playNewBattleSounds(next, nextSpeed);
      if (next.result && !resultSentRef.current) {
        resultSentRef.current = true;
        finishBattle(next.result);
      }
    };

    window.render_game_to_text = () => {
      const current = engine.getSnapshot();
      return JSON.stringify({
        mode: "battle",
        coordinateSystem: "world origin top-left, x right, y down, map 1000x1000",
        stageId: current.stageId,
        stageName: current.stageName,
        battleSpeed: getAutoBattleSpeed(current),
        exitConfirmOpen: exitConfirmRef.current,
        targetingSkillId: targetingSkillRef.current,
        battleMoney: current.battleMoney,
        battleMoneyEarned: current.battleMoneyEarned,
        upgrades: current.upgrades,
        upgradeCosts: current.upgradeCosts,
        ownedUnitIds,
        playerUnitPool: current.bases.find((base) => base.factionId === current.playerFactionId)?.unitPool ?? [],
        abilityRules: {
          fire: "쿨다운이 끝나면 버튼을 누른 뒤 전장을 탭해 범위 피해를 줍니다.",
          heal: "쿨다운이 끝나면 아군 본진 주변 병력을 회복합니다.",
          superCat: "쿨다운이 끝나면 30초 동안 강한 영웅 고양이를 소환합니다.",
        },
        abilityCooldowns: {
          fire: getRemainingSeconds(current.skillReadyAtMs[FIRE_SKILL_ID], current.timeMs),
          heal: getRemainingSeconds(current.skillReadyAtMs[HEAL_SKILL_ID], current.timeMs),
          superCat: getRemainingSeconds(current.superCatReadyAtMs[SUPER_CAT_ID], current.timeMs),
        },
        affordableUpgrades: Object.fromEntries(
          Object.entries(current.upgradeCosts).map(([kind, cost]) => [kind, current.battleMoney >= cost]),
        ),
        bases: current.bases.map((base) => ({
          id: base.id,
          factionId: base.factionId,
          x: Math.round(base.x),
          y: Math.round(base.y),
          hp: Math.round(base.hp),
          maxHp: Math.round(base.maxHp),
          level: base.level,
        })),
        units: current.units.slice(0, 30).map((unit) => ({
          id: unit.id,
          unitKey: unit.unitKey,
          factionId: unit.factionId,
          x: Math.round(unit.x),
          y: Math.round(unit.y),
          hp: Math.round(unit.hp),
          state: unit.state,
          facing: unit.facing,
          laneOffset: Math.round(unit.laneOffset),
        })),
        effects: current.events.map((event) => ({
          effectId: event.effectId,
          x: Math.round(event.x),
          y: Math.round(event.y),
          kind: event.kind,
        })),
        result: current.result,
      });
    };

    window.addEventListener("resize", resizeCanvas);
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (feedbackTimeoutRef.current) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [
    draw,
    finishBattle,
    kingdomUpgrades.armor,
    kingdomUpgrades.supply,
    kingdomUpgrades.training,
    ownedUnitIds,
    playNewBattleSounds,
    resizeCanvas,
    selectedStageId,
    stageNumber,
  ]);

  const showUpgradeFeedback = (feedback: Omit<UpgradeFeedback, "id">) => {
    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }
    const nextFeedback = { ...feedback, id: feedbackSerialRef.current++ };
    setUpgradeFeedback(nextFeedback);
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setUpgradeFeedback((current) => (current?.id === nextFeedback.id ? null : current));
    }, 950);
  };

  const refreshBattle = () => {
    const engine = engineRef.current;
    if (!engine) {
      return null;
    }
    const next = engine.getSnapshot();
    window.__catKingdomBattleSnapshot = next;
    setSnapshot(next);
    draw(next);
    playNewBattleSounds(next, getAutoBattleSpeed(next));
    return next;
  };

  const handleUpgrade = (kind: UpgradeKind) => {
    unlockGameAudio();
    const engine = engineRef.current;
    if (!engine) {
      return;
    }
    const before = engine.getSnapshot();
    const result = engine.upgrade(kind);
    const next = refreshBattle();
    const label = upgradeLabels[kind];

    if (!result.ok) {
      showUpgradeFeedback({
        kind,
        status: "blocked",
        message:
          result.reason === "battle_finished"
            ? "전투가 끝나 강화할 수 없습니다"
            : `전투머니 부족 · 필요 ${result.cost}`,
      });
      return;
    }

    const level = next?.upgrades[kind] ?? before.upgrades[kind] + 1;
    showUpgradeFeedback({
      kind,
      status: "success",
      message: `${label.title} Lv ${level} · ${label.bonusUnit} +${level * label.bonusStep}% · -${result.cost}`,
    });
  };

  const castHeal = () => {
    unlockGameAudio();
    const engine = engineRef.current;
    if (!engine) {
      return;
    }
    const current = engine.getSnapshot();
    const playerBase = current.bases.find((base) => base.factionId === current.playerFactionId);
    if (playerBase) {
      const result = engine.castSkill(HEAL_SKILL_ID, { x: playerBase.x + 90, y: playerBase.y - 90 });
      if (result.ok) {
        playSfx("skillHealCast");
        recordSkillUse();
      } else {
        playSfx("uiDisabled");
      }
      refreshBattle();
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    unlockGameAudio();
    const engine = engineRef.current;
    const canvas = canvasRef.current;
    if (!engine || !canvas || !targetingSkillId) {
      return;
    }
    const current = engine.getSnapshot();
    const rect = canvas.getBoundingClientRect();
    const world = screenToWorld(event.clientX - rect.left, event.clientY - rect.top, current, {
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    });
    const result = engine.castSkill(targetingSkillId, world);
    if (result.ok && (targetingSkillId === FIRE_SKILL_ID || targetingSkillId === HEAL_SKILL_ID)) {
      playSfx(targetingSkillId === FIRE_SKILL_ID ? "skillFireCast" : "skillHealCast");
      recordSkillUse();
    } else if (!result.ok) {
      playSfx("uiDisabled");
    }
    setTargetingSkillId(null);
    refreshBattle();
  };

  const confirmExitBattle = () => {
    playSfx("uiTap");
    setShowExitConfirm(false);
    enterLobby();
  };

  const upgrades = snapshot?.upgrades ?? emptyUpgrades;
  const upgradeCosts = snapshot?.upgradeCosts ?? emptyUpgradeCosts;
  const battleMoney = snapshot?.battleMoney ?? 0;
  const battleMoneyEarned = snapshot?.battleMoneyEarned ?? 0;
  const productionBonus = Math.round(upgrades.production * 16);
  const attackBonus = Math.round(upgrades.attack * 14);
  const healthBonus = Math.round(upgrades.health * 14);
  const isBattleFinished = Boolean(snapshot?.result);
  const fireCooldownSeconds = getRemainingSeconds(snapshot?.skillReadyAtMs[FIRE_SKILL_ID], snapshot?.timeMs ?? 0);
  const healCooldownSeconds = getRemainingSeconds(snapshot?.skillReadyAtMs[HEAL_SKILL_ID], snapshot?.timeMs ?? 0);
  const superCatCooldownSeconds = getRemainingSeconds(snapshot?.superCatReadyAtMs[SUPER_CAT_ID], snapshot?.timeMs ?? 0);
  const isFireReady = fireCooldownSeconds <= 0 && !isBattleFinished;
  const isHealReady = healCooldownSeconds <= 0 && !isBattleFinished;
  const isSuperCatReady = superCatCooldownSeconds <= 0 && !isBattleFinished;

  const getUpgradeButtonClass = (kind: UpgradeKind) => {
    const classes = ["upgrade-button"];
    classes.push(battleMoney >= upgradeCosts[kind] ? "can-afford" : "cant-afford");
    if (upgradeFeedback?.kind === kind) {
      classes.push(upgradeFeedback.status === "success" ? "upgrade-success" : "upgrade-blocked");
    }
    return classes.join(" ");
  };

  return (
    <section className="battle-screen screen-fill">
      <canvas
        id="battle-canvas"
        ref={canvasRef}
        className={targetingSkillId ? "battle-canvas targeting" : "battle-canvas"}
        onClick={handleCanvasClick}
        aria-label={`${stage.name} 전투 화면`}
      />

      <div className="battle-overlay">
        <button
          type="button"
          className="battle-exit-button"
          onClick={() => {
            playSfx("uiTap");
            setShowExitConfirm(true);
          }}
        >
          나가기
        </button>

        <div className="battle-title">
          <span>{stage.id.replace("stage_", "STAGE ")}</span>
          <strong>{stage.name}</strong>
        </div>

        <div className="battle-wallet" aria-label={`전투머니 ${battleMoney}`}>
          <span>전투머니</span>
          <strong>{battleMoney}</strong>
        </div>

        <div className={`battle-status ${targetingSkillId ? "targeting" : ""}`}>
          {targetingSkillId ? (
            <strong>화염 공격 위치를 전장에서 탭하세요</strong>
          ) : (
            <>
              <span>생산 Lv {upgrades.production} / +{productionBonus}%</span>
              <span>공격 Lv {upgrades.attack} / +{attackBonus}%</span>
              <span>체력 Lv {upgrades.health} / +{healthBonus}%</span>
            </>
          )}
        </div>

        {battleSpeed > 1 && <div className="battle-speed-badge">점령 정리 · 2배속</div>}

        <div className="battle-actions">
          {upgradeFeedback && (
            <div key={upgradeFeedback.id} className={`upgrade-toast ${upgradeFeedback.status}`}>
              {upgradeFeedback.message}
            </div>
          )}
          <button
            id="upgrade-production"
            type="button"
            className={getUpgradeButtonClass("production")}
            disabled={isBattleFinished}
            onClick={() => handleUpgrade("production")}
          >
            <span className="action-level">Lv {upgrades.production}</span>
            <span className="action-main">생산</span>
            <span className="action-sub">다음 +16%</span>
            <span className="action-cost">비용 {upgradeCosts.production}</span>
          </button>
          <button
            id="upgrade-attack"
            type="button"
            className={getUpgradeButtonClass("attack")}
            disabled={isBattleFinished}
            onClick={() => handleUpgrade("attack")}
          >
            <span className="action-level">Lv {upgrades.attack}</span>
            <span className="action-main">공격</span>
            <span className="action-sub">다음 +14%</span>
            <span className="action-cost">비용 {upgradeCosts.attack}</span>
          </button>
          <button
            id="upgrade-health"
            type="button"
            className={getUpgradeButtonClass("health")}
            disabled={isBattleFinished}
            onClick={() => handleUpgrade("health")}
          >
            <span className="action-level">Lv {upgrades.health}</span>
            <span className="action-main">체력</span>
            <span className="action-sub">다음 +14%</span>
            <span className="action-cost">비용 {upgradeCosts.health}</span>
          </button>
          <button
            id="fire-skill"
            type="button"
            className={`${targetingSkillId === FIRE_SKILL_ID ? "pending-target" : ""} ${isFireReady ? "ability-ready" : "ability-cooldown"}`}
            disabled={!isFireReady && targetingSkillId !== FIRE_SKILL_ID}
            onClick={() => {
              playSfx("uiTap");
              setTargetingSkillId((current) => (current === FIRE_SKILL_ID ? null : FIRE_SKILL_ID));
            }}
          >
            <span className="action-level">
              {fireCooldownSeconds > 0 ? `${fireCooldownSeconds}초` : targetingSkillId === FIRE_SKILL_ID ? "지정" : "준비"}
            </span>
            <span className="action-main">화염</span>
            <span className="action-sub">{fireCooldownSeconds > 0 ? "쿨다운" : "탭 지정"}</span>
            <span className="action-cost">{targetingSkillId === FIRE_SKILL_ID ? "전장 탭" : fireCooldownSeconds > 0 ? "대기" : "범위"}</span>
          </button>
          <button
            id="heal-skill"
            type="button"
            className={isHealReady ? "ability-ready" : "ability-cooldown"}
            disabled={!isHealReady}
            onClick={castHeal}
          >
            <span className="action-level">{healCooldownSeconds > 0 ? `${healCooldownSeconds}초` : "준비"}</span>
            <span className="action-main">치유</span>
            <span className="action-sub">{healCooldownSeconds > 0 ? "쿨다운" : "아군 회복"}</span>
            <span className="action-cost">{healCooldownSeconds > 0 ? "대기" : "회복"}</span>
          </button>
          <button
            id="super-cat"
            type="button"
            className={isSuperCatReady ? "ability-ready" : "ability-cooldown"}
            disabled={!isSuperCatReady}
            onClick={() => {
              unlockGameAudio();
              const result = engineRef.current?.summonSuperCat(SUPER_CAT_ID);
              if (result && !result.ok) {
                playSfx("uiDisabled");
              }
              refreshBattle();
            }}
          >
            <span className="action-level">{superCatCooldownSeconds > 0 ? `${superCatCooldownSeconds}초` : "준비"}</span>
            <span className="action-main">슈퍼냥</span>
            <span className="action-sub">{superCatCooldownSeconds > 0 ? "쿨다운" : "30초 영웅"}</span>
            <span className="action-cost">{superCatCooldownSeconds > 0 ? "대기" : "소환"}</span>
          </button>
        </div>
        <div className="battle-readout">
          <span>전투머니 {battleMoney}</span>
          <span>획득 {battleMoneyEarned}</span>
          <span>유닛 {snapshot?.units.length ?? 0}</span>
        </div>
      </div>

      {showExitConfirm && (
        <aside className="battle-confirm-modal" role="dialog" aria-label="전투 나가기 확인">
          <div className="battle-confirm-card">
            <h3>전투에서 나가겠습니까?</h3>
            <p>현재 전투 진행과 전투머니 강화는 저장되지 않습니다.</p>
            <div>
              <button
                type="button"
                className="secondary-action"
                onClick={() => {
                  playSfx("uiTap");
                  setShowExitConfirm(false);
                }}
              >
                아니오
              </button>
              <button type="button" className="primary-action" onClick={confirmExitBattle}>
                예, 나가기
              </button>
            </div>
          </div>
        </aside>
      )}
    </section>
  );
}

function getRemainingSeconds(readyAtMs: number | undefined, currentTimeMs: number): number {
  return Math.max(0, Math.ceil(((readyAtMs ?? 0) - currentTimeMs) / 1000));
}

function getAutoBattleSpeed(snapshot: BattleSnapshot): 1 | 2 {
  if (snapshot.result) {
    return 1;
  }

  const enemyBase = snapshot.bases.find((base) => base.factionId === snapshot.enemyFactionId);
  if (!enemyBase || enemyBase.maxHp <= 0) {
    return 1;
  }

  const enemyHpRatio = enemyBase.hp / enemyBase.maxHp;
  if (enemyHpRatio > 0.35) {
    return 1;
  }

  const playerUnits = snapshot.units.filter((unit) => unit.factionId === snapshot.playerFactionId && unit.hp > 0);
  const enemyUnits = snapshot.units.filter((unit) => unit.factionId === snapshot.enemyFactionId && unit.hp > 0);
  const unitsNearEnemyBase = playerUnits.filter((unit) => distance(unit.x, unit.y, enemyBase.x, enemyBase.y) <= 235).length;

  if (unitsNearEnemyBase < 2) {
    return 1;
  }

  return playerUnits.length >= Math.max(1, Math.floor(enemyUnits.length * 0.55)) ? 2 : 1;
}

function distance(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(ax - bx, ay - by);
}
