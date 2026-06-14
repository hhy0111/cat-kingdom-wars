import { useEffect, useMemo, useState } from "react";
import stages, { STAGES_PER_REGION, TOTAL_STAGE_COUNT } from "../data/stages";
import { playSfx, unlockGameAudio } from "../game/audio";
import { useDragScroll } from "../hooks/useDragScroll";
import {
  characterShopItems,
  formatCost,
  getHighestClearedStageNumber,
  getKingdomUpgradeCost,
  getNextPlayableStage,
  getStageClearReward,
  getUnlockedStageIndex,
  isStageUnlocked,
  kingdomUpgradeDefinitions,
  type CharacterId,
  type DailyMissionStats,
  type KingdomUpgradeKind,
  useGameStore,
} from "../store/gameStore";

const researchKinds: KingdomUpgradeKind[] = ["supply", "training", "armor"];

export function LobbyScreen() {
  const progress = useGameStore((state) => state.progress);
  const startStage = useGameStore((state) => state.startStage);
  const purchaseKingdomUpgrade = useGameStore((state) => state.purchaseKingdomUpgrade);
  const purchaseCharacter = useGameStore((state) => state.purchaseCharacter);
  const claimDailyReward = useGameStore((state) => state.claimDailyReward);
  const [showUpgradeShop, setShowUpgradeShop] = useState(false);
  const [showCharacterShop, setShowCharacterShop] = useState(false);
  const [showWorldMap, setShowWorldMap] = useState(false);
  const [shopMessage, setShopMessage] = useState("전투 보상으로 왕국과 캐릭터를 강화하세요.");
  const [lobbyMessage, setLobbyMessage] = useState("1-10 번호는 20개 전선 단위의 지역 빠른 이동입니다. 전투는 중앙 포털에서 시작합니다.");
  const upgradeShopDragScroll = useDragScroll<HTMLDivElement>();
  const characterShopDragScroll = useDragScroll<HTMLDivElement>();
  const worldMapDragScroll = useDragScroll<HTMLDivElement>();

  const nextStage = useMemo(() => getNextPlayableStage(progress), [progress]);
  const unlockedStageIndex = useMemo(() => getUnlockedStageIndex(progress), [progress]);
  const highestClearedStageNumber = useMemo(() => getHighestClearedStageNumber(progress), [progress]);
  const [pickedStageId, setPickedStageId] = useState<string | null>(null);
  const pickedStage = useMemo(
    () => stages.find((stage) => stage.id === pickedStageId) ?? nextStage,
    [nextStage, pickedStageId],
  );
  const selectedStageIndex = Math.max(0, stages.findIndex((stage) => stage.id === pickedStage.id));
  const selectedRegionIndex = Math.floor(selectedStageIndex / STAGES_PER_REGION);
  const selectedStageNumber = selectedStageIndex + 1;
  const selectedRegionRange = `${selectedRegionIndex * STAGES_PER_REGION + 1}-${(selectedRegionIndex + 1) * STAGES_PER_REGION}`;
  const selectedStageUnlocked = isStageUnlocked(pickedStage.id, progress);
  const selectedStageCleared = progress.clearedStageIds.includes(pickedStage.id);
  const selectedStageReward = useMemo(
    () => getStageClearReward(pickedStage.rewards, selectedStageCleared),
    [pickedStage.rewards, selectedStageCleared],
  );
  const visibleStages = useMemo(
    () => getVisibleStages(Math.min(selectedStageIndex, unlockedStageIndex)),
    [selectedStageIndex, unlockedStageIndex],
  );
  const dailyMissionRows = useMemo(() => getDailyMissionRows(progress.dailyMissionStats), [progress.dailyMissionStats]);

  const selectStage = (stageId: string, stageName: string) => {
    unlockGameAudio();
    playSfx("stageSelect");
    setPickedStageId(stageId);
    setLobbyMessage(`${stageName} 전선을 선택했습니다. 중앙 포털의 전투 버튼으로 시작하세요.`);
  };

  const handleUpgradePurchase = (kind: KingdomUpgradeKind) => {
    const level = progress.kingdomUpgrades[kind];
    const result = purchaseKingdomUpgrade(kind);
    const definition = kingdomUpgradeDefinitions[kind];

    if (!result.ok) {
      playSfx("shopNotEnough");
      setShopMessage(`${formatCost(result.cost)}이 필요합니다. 전투를 클리어해서 Gold를 모아주세요.`);
      return;
    }

    playSfx("shopPurchase");
    playSfx("upgradeSpend");
    setShopMessage(`${definition.title} Lv ${level + 1} 달성. 다음 전투 시작 능력이 올라갑니다.`);
  };

  const handleCharacterPurchase = (characterId: CharacterId) => {
    const item = characterShopItems.find((candidate) => candidate.id === characterId);
    const result = purchaseCharacter(characterId);

    if (!item) {
      return;
    }

    if (!result.ok) {
      if (result.reason === "locked") {
        playSfx("uiDisabled");
        setShopMessage(`${item.title}은 ${item.unlockLabel} 가능합니다.`);
        return;
      }
      if (result.reason === "already_owned") {
        playSfx("uiDisabled");
        setShopMessage(`${item.title}은 이미 보유 중입니다.`);
        return;
      }
      playSfx("shopNotEnough");
      setShopMessage(`${item.title} 구매에는 ${formatCost(result.cost)}이 필요합니다.`);
      return;
    }

    playSfx("shopPurchase");
    setShopMessage(`${item.title} 합류. 다음 전투부터 편성에 등장합니다.`);
  };

  const pickRegion = (regionIndex: number) => {
    const start = regionIndex * STAGES_PER_REGION;
    const end = start + STAGES_PER_REGION;
    const unlockedInRegion = stages
      .slice(start, end)
      .filter((stage) => isStageUnlocked(stage.id, progress));
    const firstPlayable = unlockedInRegion.find((stage) => !progress.clearedStageIds.includes(stage.id));
    const selected = firstPlayable ?? unlockedInRegion.at(-1) ?? nextStage;
    selectStage(selected.id, selected.name);
  };

  const pickRelativeStage = (offset: number) => {
    const nextIndex = Math.max(0, Math.min(unlockedStageIndex, selectedStageIndex + offset));
    selectStage(stages[nextIndex].id, stages[nextIndex].name);
  };

  const tryStartPickedStage = () => {
    if (!selectedStageUnlocked) {
      playSfx("uiDisabled");
      setLobbyMessage("잠긴 전선입니다. 바로 앞 전선을 먼저 클리어해야 합니다.");
      return;
    }
    unlockGameAudio();
    playSfx("uiTap");
    startStage(pickedStage.id);
  };

  const handleDailyRewardCheck = () => {
    const result = claimDailyReward();
    if (result.ok) {
      playSfx("dailyReward");
      playSfx("goldCount");
      setLobbyMessage(`오늘의 보상 수령 완료: Gold ${result.reward.gold} / Fish ${result.reward.fish}`);
      return;
    }
    playSfx("uiDisabled");
    setLobbyMessage("오늘의 보상은 이미 수령했습니다. 내일 다시 받을 수 있습니다.");
  };

  const handleTodayFrontSelect = () => {
    playSfx("stageSelect");
    selectStage(nextStage.id, nextStage.name);
    setLobbyMessage("오늘의 전선을 중앙 전투 포털에 표시했습니다. 포털을 누르면 전투가 시작됩니다.");
  };

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        mode: "lobby",
        purpose: "stage_select_shop_and_progress_hub",
        stageCount: TOTAL_STAGE_COUNT,
        selectedStageNumber,
        selectedRegion: selectedRegionIndex + 1,
        selectedStageUnlocked,
        selectedStageCleared,
        selectedStageReward,
        unlockedStageNumber: unlockedStageIndex + 1,
        highestClearedStageNumber,
        gold: progress.gold,
        fish: progress.fish,
        kingdomUpgrades: progress.kingdomUpgrades,
        ownedCharacterIds: progress.ownedCharacterIds,
        kingdomUpgradeCosts: Object.fromEntries(
          researchKinds.map((kind) => [kind, formatCost(getKingdomUpgradeCost(kind, progress.kingdomUpgrades[kind]))]),
        ),
        clearedStageIds: progress.clearedStageIds,
        nextStage: { id: nextStage.id, name: nextStage.name },
        pickedStage: {
          id: pickedStage.id,
          name: pickedStage.name,
          rewards: pickedStage.rewards,
          locked: !selectedStageUnlocked,
        },
        visibleStages: visibleStages.map((stage) => ({
          id: stage.id,
          name: stage.name,
          cleared: progress.clearedStageIds.includes(stage.id),
          locked: !isStageUnlocked(stage.id, progress),
          rewards: stage.rewards,
        })),
        dailyMissions: dailyMissionRows,
        dailyRewardClaimed: progress.dailyMissionStats.dailyRewardClaimed,
        lobbyMessage,
        upgradeShopOpen: showUpgradeShop,
        characterShopOpen: showCharacterShop,
        worldMapOpen: showWorldMap,
        rule: "Stage buttons only select a front. The central portal starts battle. Re-cleared stages pay half rewards.",
      });
    window.advanceTime = undefined;
  }, [
    highestClearedStageNumber,
    lobbyMessage,
    nextStage.id,
    nextStage.name,
    pickedStage.id,
    pickedStage.name,
    pickedStage.rewards,
    progress,
    selectedRegionIndex,
    selectedStageCleared,
    selectedStageNumber,
    selectedStageReward,
    selectedStageUnlocked,
    showCharacterShop,
    showUpgradeShop,
    showWorldMap,
    unlockedStageIndex,
    visibleStages,
  ]);

  return (
    <section className="lobby-screen screen-fill">
      <header className="top-bar">
        <div>
          <p className="eyebrow">Cat Kingdom Wars</p>
          <h2>냥이 왕국</h2>
        </div>
        <div className="currency-row">
          <span>Gold {progress.gold}</span>
          <span>Fish {progress.fish}</span>
          <span>Ticket 3</span>
        </div>
      </header>

      <div className="kingdom-hub">
        <div className="shop-shortcuts" aria-label="왕국 기능">
          <button
            className="map-shop-button upgrade-shop-button"
            type="button"
            onClick={() => {
              playSfx("shopOpen");
              setShowUpgradeShop(true);
            }}
          >
            <i aria-hidden="true" />
            <strong>강화 상점</strong>
            <span>왕국 성장</span>
          </button>
          <button
            className="map-shop-button character-shop-button"
            type="button"
            onClick={() => {
              playSfx("shopOpen");
              setShowCharacterShop(true);
            }}
          >
            <i aria-hidden="true" />
            <strong>캐릭터 상점</strong>
            <span>출전 해금</span>
          </button>
        </div>

        <div className="stage-summary-card" aria-label={`선택 전선 ${pickedStage.name}`}>
          <span>
            선택 전선 {String(selectedStageNumber).padStart(3, "0")} / {TOTAL_STAGE_COUNT}
          </span>
          <strong>{pickedStage.name}</strong>
          <em>
            {selectedStageUnlocked ? (selectedStageCleared ? "재도전 가능" : "도전 가능") : `잠김 · ${unlockedStageIndex + 1}번 전선까지 열림`}
          </em>
          {selectedStageUnlocked && (
            <small>
              {selectedStageReward.replay ? "재도전 50%" : "클리어 보상"} Gold {selectedStageReward.gold} / Fish {selectedStageReward.fish}
            </small>
          )}
        </div>

        <div className="stage-minimap" aria-label="지역 빠른 이동">
          <strong className="stage-minimap-title">지역 빠른 이동 1-10</strong>
          {Array.from({ length: TOTAL_STAGE_COUNT / STAGES_PER_REGION }, (_, regionIndex) => {
            const start = regionIndex * STAGES_PER_REGION;
            const regionStages = stages.slice(start, start + STAGES_PER_REGION);
            const cleared = regionStages.every((stage) => progress.clearedStageIds.includes(stage.id));
            const selected = regionIndex === selectedRegionIndex;
            const locked = start > unlockedStageIndex;
            return (
              <button
                key={regionIndex}
                type="button"
                className={`${selected ? "selected" : ""} ${cleared ? "cleared" : ""} ${locked ? "locked" : ""}`}
                onClick={() => pickRegion(regionIndex)}
                aria-label={`지역 ${regionIndex + 1} 선택`}
              >
                <span>{regionIndex + 1}</span>
              </button>
            );
          })}
        </div>

        <button
          id="battle-gate"
          className={`stage-portal ${selectedStageUnlocked ? "" : "locked"}`}
          type="button"
          disabled={!selectedStageUnlocked}
          onClick={tryStartPickedStage}
        >
          <span className="portal-ring" />
          <span className="portal-core" />
          <strong>{selectedStageUnlocked ? "전투" : "잠김"}</strong>
          <em>{pickedStage.name}</em>
        </button>

        <div className="lobby-notice" role="status" aria-live="polite">
          {lobbyMessage}
        </div>
      </div>

      {showUpgradeShop && (
        <aside className="upgrade-guide-modal" role="dialog" aria-label="강화 상점">
          <div className="upgrade-guide-card research-card shop-card image-shop-card upgrade-shop-card drag-scroll" {...upgradeShopDragScroll}>
            <div className="modal-title-row">
              <div>
                <p className="eyebrow">Upgrade Shop</p>
                <h3>강화 상점</h3>
              </div>
              <button
                type="button"
                className="modal-close-button"
                onClick={() => {
                  playSfx("uiTap");
                  setShowUpgradeShop(false);
                }}
              >
                닫기
              </button>
            </div>
            <p>Gold로 시작 생산, 공격, 체력을 영구 강화합니다.</p>
            <div className="research-message">{shopMessage}</div>

            <section className="shop-section">
              <h4>기본 강화</h4>
              <div className="kingdom-upgrade-list">
                {researchKinds.map((kind) => {
                  const definition = kingdomUpgradeDefinitions[kind];
                  const level = progress.kingdomUpgrades[kind];
                  const cost = getKingdomUpgradeCost(kind, level);
                  const canBuy = progress.gold >= (cost.gold ?? 0);

                  return (
                    <div key={kind} className={`kingdom-upgrade-row image-shop-row upgrade-${kind}`}>
                      <span className="shop-item-art" aria-hidden="true" />
                      <div>
                        <strong>{definition.title}</strong>
                        <span>{definition.description}</span>
                        <em>
                          {definition.bonusLabel} {level}
                        </em>
                      </div>
                      <button type="button" disabled={!canBuy} onClick={() => handleUpgradePurchase(kind)}>
                        {canBuy ? formatCost(cost) : `부족 · ${formatCost(cost)}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        </aside>
      )}

      {showCharacterShop && (
        <aside className="upgrade-guide-modal" role="dialog" aria-label="캐릭터 상점">
          <div className="upgrade-guide-card research-card shop-card image-shop-card character-shop-card drag-scroll" {...characterShopDragScroll}>
            <div className="modal-title-row">
              <div>
                <p className="eyebrow">Character Shop</p>
                <h3>캐릭터 상점</h3>
              </div>
              <button
                type="button"
                className="modal-close-button"
                onClick={() => {
                  playSfx("uiTap");
                  setShowCharacterShop(false);
                }}
              >
                닫기
              </button>
            </div>
            <p>전선을 클리어해 병과를 해금하고 자원으로 합류시킵니다.</p>
            <div className="research-message">{shopMessage}</div>

            <section className="shop-section">
              <h4>출전 캐릭터</h4>
              <div className="character-shop-list">
                {characterShopItems.map((item) => {
                  const owned = progress.ownedCharacterIds.includes(item.id);
                  const unlocked = highestClearedStageNumber >= item.requiredClearedStageNumber;
                  const canAfford = progress.gold >= (item.cost.gold ?? 0) && progress.fish >= (item.cost.fish ?? 0);
                  const disabled = owned || !unlocked || !canAfford;

                  return (
                    <div key={item.id} className={`character-shop-row image-shop-row ${owned ? "owned" : ""} ${!unlocked ? "locked" : ""}`}>
                      <span className={`shop-item-art character-${item.id}`} aria-hidden="true" />
                      <div>
                        <strong>{item.title}</strong>
                        <span>
                          {item.roleLabel} · {item.description}
                        </span>
                        <em>{unlocked ? "구매 가능" : item.unlockLabel}</em>
                      </div>
                      <button type="button" disabled={disabled} onClick={() => handleCharacterPurchase(item.id)}>
                        {owned ? "보유중" : formatCost(item.cost)}
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="character-release-note">추가 캐릭터는 시즌 보상으로 공개됩니다.</p>
            </section>

          </div>
        </aside>
      )}

      {showWorldMap && (
        <aside className="upgrade-guide-modal" role="dialog" aria-label="전체 전선 지도">
          <div className="upgrade-guide-card world-map-card drag-scroll" {...worldMapDragScroll}>
            <div className="modal-title-row">
              <div>
                <p className="eyebrow">World Map</p>
                <h3>전체 전선 지도</h3>
              </div>
              <button
                type="button"
                className="modal-close-button"
                onClick={() => {
                  playSfx("uiTap");
                  setShowWorldMap(false);
                }}
              >
                닫기
              </button>
            </div>
            <p>총 200개 전선입니다. 클리어한 전선 바로 다음 전선까지만 도전할 수 있습니다.</p>
            <div className="world-map-track">
              {stages.map((stage, index) => {
                const cleared = progress.clearedStageIds.includes(stage.id);
                const selected = stage.id === pickedStage.id;
                const locked = !isStageUnlocked(stage.id, progress);
                const reward = getStageClearReward(stage.rewards, cleared);
                return (
                  <button
                    key={stage.id}
                    type="button"
                    className={`world-map-node ${selected ? "selected" : ""} ${cleared ? "cleared" : ""} ${locked ? "locked" : ""}`}
                onClick={() => {
                  if (!locked) {
                    selectStage(stage.id, stage.name);
                  } else {
                    playSfx("uiDisabled");
                  }
                }}
                  >
                    <span>{String(index + 1).padStart(3, "0")}</span>
                    <strong>{stage.name}</strong>
                    <em>{locked ? "잠김" : `${reward.replay ? "재도전 " : ""}Gold ${reward.gold} / Fish ${reward.fish}`}</em>
                  </button>
                );
              })}
            </div>
            <div className="upgrade-guide-actions sticky-actions">
              <button
                type="button"
                className="secondary-action"
                onClick={() => {
                  playSfx("uiTap");
                  setShowWorldMap(false);
                }}
              >
                전체지도 닫기
              </button>
              <button
                type="button"
                className="primary-action"
                onClick={() => {
                  playSfx("uiTap");
                  setShowWorldMap(false);
                  setLobbyMessage(`${pickedStage.name} 선택 완료. 중앙 포털에서 전투를 시작하세요.`);
                }}
              >
                선택 완료
              </button>
            </div>
          </div>
        </aside>
      )}

      <aside className="stage-panel">
        <h3>전선 선택</h3>
        <strong className="stage-panel-current">
          지역 {selectedRegionIndex + 1} · {selectedRegionRange}
        </strong>
        <div className="stage-step-actions">
          <button type="button" onClick={() => pickRelativeStage(-1)} disabled={selectedStageIndex === 0}>
            이전
          </button>
          <button type="button" onClick={() => pickRelativeStage(1)} disabled={selectedStageIndex >= unlockedStageIndex}>
            다음
          </button>
        </div>
        <div className="stage-list">
          {visibleStages.map((stage) => {
            const cleared = progress.clearedStageIds.includes(stage.id);
            const selected = stage.id === pickedStage.id;
            const locked = !isStageUnlocked(stage.id, progress);
            const stageNumber = stages.findIndex((candidate) => candidate.id === stage.id) + 1;
            return (
              <button
                key={stage.id}
                type="button"
                className={`stage-button ${selected ? "selected" : ""} ${cleared ? "cleared" : ""} ${locked ? "locked" : ""}`}
                aria-label={`${stage.name} 선택`}
                disabled={locked}
                onClick={() => selectStage(stage.id, stage.name)}
              >
                <span>{String(stageNumber).padStart(3, "0")}</span>
                <strong>{stage.name}</strong>
                <em>{locked ? "잠김" : cleared ? "클리어" : selected ? "선택중" : "도전"}</em>
              </button>
            );
          })}
        </div>
        <button
          className="map-open-button"
          type="button"
          onClick={() => {
            playSfx("uiTap");
            setShowWorldMap(true);
          }}
        >
          전체 지도
        </button>
      </aside>

      <aside className="lobby-panel daily-panel compact-panel">
        <h3>오늘의 보상</h3>
        <div className="daily-track">
          {["1일", "2일", "3일", "4일", "5일", "6일", "7일"].map((label, index) => (
            <span key={label} className={index === 0 ? "active" : ""}>
              {label}
            </span>
          ))}
        </div>
        <button
          className={`claim-button ${progress.dailyMissionStats.dailyRewardClaimed ? "claimed" : ""}`}
          type="button"
          onClick={handleDailyRewardCheck}
        >
          {progress.dailyMissionStats.dailyRewardClaimed ? "수령 완료" : "보상 받기"}
        </button>
      </aside>

      <aside className="lobby-panel mission-panel compact-panel">
        <h3>오늘의 임무</h3>
        <div className="mission-list">
          {dailyMissionRows.map((mission) => (
            <div key={mission.title} className={`mission-row ${mission.complete ? "complete" : ""}`}>
              <strong>{mission.title}</strong>
              <span>{mission.progress}</span>
              <em>{mission.reward}</em>
            </div>
          ))}
        </div>
      </aside>

      <aside className="lobby-panel event-panel compact-panel">
        <h3>오늘의 전선</h3>
        <p>{nextStage.name}에서 왕국 보급로가 열렸습니다.</p>
        <button type="button" onClick={handleTodayFrontSelect}>
          포털에 표시
        </button>
      </aside>

      <aside className="lobby-panel pass-panel compact-panel">
        <h3>왕국 패스</h3>
        <div className="pass-meter">
          <span />
        </div>
        <p>다음 보상: 슈퍼냥 기사 스킨</p>
      </aside>
    </section>
  );
}

function getVisibleStages(selectedStageIndex: number) {
  const windowSize = 7;
  const halfWindow = Math.floor(windowSize / 2);
  const start = Math.max(0, Math.min(stages.length - windowSize, selectedStageIndex - halfWindow));
  return stages.slice(start, start + windowSize);
}

function getDailyMissionRows(stats: DailyMissionStats) {
  const rows = [
    {
      title: "전투 3회 참여",
      reward: "진행 보상 Gold 300",
      current: stats.battleParticipations,
      target: 3,
    },
    {
      title: "화염/치유 5회 사용",
      reward: "스킬 훈련 Fish 12",
      current: stats.skillUses,
      target: 5,
    },
    {
      title: "스테이지 1회 클리어",
      reward: "슈퍼냥 조각 2",
      current: stats.stageClears,
      target: 1,
    },
  ];

  return rows.map((row) => {
    const capped = Math.min(row.current, row.target);
    return {
      ...row,
      progress: `${capped} / ${row.target}`,
      complete: capped >= row.target,
    };
  });
}
