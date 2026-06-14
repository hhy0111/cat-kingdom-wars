import { useEffect, useMemo, useRef, useState } from "react";
import stages from "../data/stages";
import { showResultBonusRewardedAd, showStageBreakInterstitial } from "../game/adMob";
import { playBattleResultSfx, playSfx, unlockGameAudio } from "../game/audio";
import { useGameStore } from "../store/gameStore";

export function ResultScreen() {
  const result = useGameStore((state) => state.lastResult);
  const selectedStageId = useGameStore((state) => state.selectedStageId);
  const lastBattleRewards = useGameStore((state) => state.lastBattleRewards);
  const lastBattleRewardBoosted = useGameStore((state) => state.lastBattleRewardBoosted);
  const claimDoubleBattleReward = useGameStore((state) => state.claimDoubleBattleReward);
  const retryStage = useGameStore((state) => state.retryStage);
  const enterLobby = useGameStore((state) => state.enterLobby);
  const [adState, setAdState] = useState<"idle" | "loading" | "claimed">("idle");
  const [isLeavingResult, setIsLeavingResult] = useState(false);
  const resultSfxKeyRef = useRef<string | null>(null);
  const isWin = result?.winnerFactionId === "cat_kingdom";
  const selectedStage = useMemo(
    () => stages.find((stage) => stage.id === selectedStageId) ?? stages[0],
    [selectedStageId],
  );
  const displayedRewards = isWin ? (lastBattleRewards ?? { ...selectedStage.rewards, replay: false }) : { gold: 0, fish: 0, replay: false };
  const rewardMultiplier = lastBattleRewardBoosted ? 2 : 1;
  const totalGold = displayedRewards.gold * rewardMultiplier;
  const totalFish = displayedRewards.fish * rewardMultiplier;

  useEffect(() => {
    setAdState(lastBattleRewardBoosted ? "claimed" : "idle");
  }, [lastBattleRewardBoosted, selectedStageId]);

  useEffect(() => {
    const sfxKey = `${selectedStageId}:${result?.winnerFactionId ?? "none"}`;
    if (result && resultSfxKeyRef.current !== sfxKey) {
      resultSfxKeyRef.current = sfxKey;
      playBattleResultSfx(result.winnerFactionId);
    }
  }, [result, result?.winnerFactionId, selectedStageId]);

  const handleDoubleReward = async () => {
    unlockGameAudio();
    if (!isWin || lastBattleRewardBoosted || adState === "loading") {
      playSfx("uiDisabled");
      return;
    }

    playSfx("adRewardReady");
    setAdState("loading");
    const adResult = await showResultBonusRewardedAd();
    if (!adResult.rewarded) {
      setAdState("idle");
      playSfx("uiDisabled");
      return;
    }

    const result = claimDoubleBattleReward();
    setAdState(result.ok ? "claimed" : "idle");
    if (result.ok) {
      playSfx("adRewardClaimed");
      playSfx("goldCount");
      playSfx("fishCount");
    } else {
      playSfx("uiDisabled");
    }
  };

  const handleEnterLobby = async () => {
    if (isLeavingResult) {
      return;
    }

    playSfx("uiTap");
    setIsLeavingResult(true);
    await showStageBreakInterstitial();
    enterLobby();
  };

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        mode: "result",
        stageId: selectedStageId,
        stageName: selectedStage.name,
        winnerFactionId: result?.winnerFactionId,
        isWin,
        rewards: displayedRewards,
        rewardMultiplier,
        adDoubleRewardState: adState,
        isLeavingResult,
      });
    window.advanceTime = undefined;
  }, [
    adState,
    displayedRewards,
    isLeavingResult,
    isWin,
    result?.winnerFactionId,
    rewardMultiplier,
    selectedStage.id,
    selectedStage.name,
    selectedStageId,
  ]);

  return (
    <section className={`result-screen screen-fill ${isWin ? "victory" : "defeat"}`}>
      <div className="result-burst" aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => (
          <span key={index} style={{ "--burst-index": index } as React.CSSProperties} />
        ))}
      </div>
      <div className="result-panel">
        <div className="result-medal" aria-hidden="true" />
        <p className="eyebrow">{selectedStageId.replace("stage_", "Stage ")}</p>
        <h2>{isWin ? "승리" : "패배"}</h2>
        <p>{isWin ? `${selectedStage.name} 전선을 돌파했습니다.` : "전선을 재정비해야 합니다."}</p>
        <div className={`result-reward-strip ${lastBattleRewardBoosted ? "boosted" : ""}`}>
          <span className="reward-token gold">
            <i aria-hidden="true" />
            <b>Gold</b>
            <em>{isWin ? `+${totalGold}` : "+0"}</em>
          </span>
          <span className="reward-token fish">
            <i aria-hidden="true" />
            <b>Fish</b>
            <em>{isWin ? `+${totalFish}` : "+0"}</em>
          </span>
          <span className="reward-token ticket">
            <i aria-hidden="true" />
            <b>진행</b>
            <em>{isWin ? "클리어" : "재도전"}</em>
          </span>
        </div>
        <div className="result-boost">
          {isWin
            ? lastBattleRewardBoosted
              ? `광고 보상 적용 완료. 기본 보상에 Gold ${displayedRewards.gold}, Fish ${displayedRewards.fish}를 한 번 더 지급했습니다.`
              : displayedRewards.replay
              ? "이미 클리어한 전선이라 반복 보상은 50%만 지급됩니다."
              : "광고를 보면 이번 전투 보상을 한 번 더 받을 수 있습니다."
            : "연구소 강화와 전투 중 업그레이드 순서를 다시 맞춰보세요."}
        </div>
        {isWin && (
          <button
            type="button"
            className={`ad-double-button ${adState}`}
            disabled={lastBattleRewardBoosted || adState === "loading"}
            onClick={handleDoubleReward}
          >
            {adState === "loading" ? "광고 확인 중..." : lastBattleRewardBoosted ? "2배 보상 수령 완료" : "광고 보고 2배 받기"}
          </button>
        )}
        <div className="result-actions">
          <button
            type="button"
            className="primary-action"
            disabled={isLeavingResult}
            onClick={handleEnterLobby}
          >
            {isLeavingResult ? "로비 이동 중..." : "로비"}
          </button>
          {!isWin && (
            <button
              type="button"
              className="secondary-action"
              disabled={isLeavingResult}
              onClick={() => {
                playSfx("uiTap");
                retryStage();
              }}
            >
              재도전
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
