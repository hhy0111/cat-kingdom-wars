import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getStageClearReward, getUnlockedStageIndex, type SavedProgress, useGameStore } from "../store/gameStore";

const emptyProgress: SavedProgress = {
  clearedStageIds: [],
  gold: 0,
  fish: 0,
  kingdomUpgrades: {
    training: 0,
    armor: 0,
    supply: 0,
  },
  ownedCharacterIds: ["cat_swordsman", "cat_archer"],
  dailyMissionStats: {
    battleParticipations: 0,
    skillUses: 0,
    stageClears: 0,
    dailyRewardClaimed: false,
    lastDailyRewardDate: null,
  },
};

describe("game store navigation", () => {
  beforeEach(() => {
    useGameStore.setState({
      screen: "opening",
      selectedStageId: "stage_001",
      lastResult: null,
      lastBattleRewards: null,
      lastBattleRewardBoosted: false,
      loadingPlan: null,
      progress: emptyProgress,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("routes the opening screen through loading before entering the lobby", () => {
    useGameStore.getState().enterLobby();

    expect(useGameStore.getState().screen).toBe("loading");
    expect(useGameStore.getState().loadingPlan?.target).toBe("lobby");

    useGameStore.getState().completeLoading();

    expect(useGameStore.getState().screen).toBe("lobby");
    expect(useGameStore.getState().loadingPlan).toBeNull();
  });

  it("keeps locked stages unavailable until the previous stage is cleared", () => {
    useGameStore.getState().startStage("stage_002");

    expect(useGameStore.getState().screen).toBe("opening");
    expect(useGameStore.getState().selectedStageId).toBe("stage_001");
    expect(getUnlockedStageIndex(useGameStore.getState().progress)).toBe(0);
  });

  it("routes an unlocked stage start through loading before entering battle", () => {
    useGameStore.setState({
      progress: {
        ...emptyProgress,
        clearedStageIds: ["stage_001"],
      },
    });

    useGameStore.getState().startStage("stage_002");

    expect(useGameStore.getState().screen).toBe("loading");
    expect(useGameStore.getState().selectedStageId).toBe("stage_002");
    expect(useGameStore.getState().loadingPlan?.target).toBe("battle");

    useGameStore.getState().completeLoading();

    expect(useGameStore.getState().screen).toBe("battle");
    expect(useGameStore.getState().loadingPlan).toBeNull();
  });

  it("buys permanent kingdom upgrades with lobby gold", () => {
    useGameStore.setState({
      progress: {
        ...emptyProgress,
        gold: 200,
      },
    });

    const result = useGameStore.getState().purchaseKingdomUpgrade("supply");

    expect(result.ok).toBe(true);
    expect(result.cost).toEqual({ gold: 120 });
    expect(useGameStore.getState().progress.gold).toBe(80);
    expect(useGameStore.getState().progress.kingdomUpgrades.supply).toBe(1);
  });

  it("buys mission-unlocked character units with lobby rewards", () => {
    useGameStore.setState({
      progress: {
        ...emptyProgress,
        gold: 800,
        clearedStageIds: ["stage_001", "stage_002", "stage_003", "stage_004", "stage_005"],
      },
    });

    const result = useGameStore.getState().purchaseCharacter("cat_tank");

    expect(result.ok).toBe(true);
    expect(useGameStore.getState().progress.gold).toBe(150);
    expect(useGameStore.getState().progress.ownedCharacterIds).toContain("cat_tank");
  });

  it("pays full rewards on first clear and half rewards on replay clears", () => {
    const firstClear = getStageClearReward({ gold: 120, fish: 8 }, false);
    const replayClear = getStageClearReward({ gold: 120, fish: 8 }, true);

    expect(firstClear).toEqual({ gold: 120, fish: 8, replay: false });
    expect(replayClear).toEqual({ gold: 60, fish: 4, replay: true });

    useGameStore.setState({
      screen: "battle",
      selectedStageId: "stage_001",
      progress: emptyProgress,
    });

    useGameStore.getState().finishBattle({ winnerFactionId: "cat_kingdom", reason: "base_destroyed" });

    expect(useGameStore.getState().lastBattleRewards).toEqual({ gold: 120, fish: 8, replay: false });
    expect(useGameStore.getState().progress.gold).toBe(120);
    expect(useGameStore.getState().progress.dailyMissionStats.battleParticipations).toBe(1);
    expect(useGameStore.getState().progress.dailyMissionStats.stageClears).toBe(1);

    useGameStore.setState({
      screen: "battle",
      selectedStageId: "stage_001",
    });

    useGameStore.getState().finishBattle({ winnerFactionId: "cat_kingdom", reason: "base_destroyed" });

    expect(useGameStore.getState().lastBattleRewards).toEqual({ gold: 60, fish: 4, replay: true });
    expect(useGameStore.getState().progress.gold).toBe(180);
    expect(useGameStore.getState().progress.dailyMissionStats.battleParticipations).toBe(2);
  });

  it("claims daily and double battle rewards only once", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-13T09:00:00+09:00"));

    const daily = useGameStore.getState().claimDailyReward();

    expect(daily.ok).toBe(true);
    expect(useGameStore.getState().progress.gold).toBe(120);
    expect(useGameStore.getState().progress.fish).toBe(8);
    expect(useGameStore.getState().progress.dailyMissionStats.lastDailyRewardDate).toBe("2026-06-13");

    const repeatDaily = useGameStore.getState().claimDailyReward();
    expect(repeatDaily.ok).toBe(false);
    expect(useGameStore.getState().progress.gold).toBe(120);

    useGameStore.setState({
      screen: "battle",
      selectedStageId: "stage_001",
    });
    useGameStore.getState().finishBattle({ winnerFactionId: "cat_kingdom", reason: "base_destroyed" });

    const doubled = useGameStore.getState().claimDoubleBattleReward();
    expect(doubled.ok).toBe(true);
    expect(useGameStore.getState().progress.gold).toBe(360);
    expect(useGameStore.getState().lastBattleRewardBoosted).toBe(true);

    const repeatDouble = useGameStore.getState().claimDoubleBattleReward();
    expect(repeatDouble.ok).toBe(false);
    expect(useGameStore.getState().progress.gold).toBe(360);
  });

  it("resets the daily reward claim when the saved claim date is not today", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-13T09:00:00+09:00"));
    useGameStore.setState({
      progress: {
        ...emptyProgress,
        dailyMissionStats: {
          ...emptyProgress.dailyMissionStats,
          dailyRewardClaimed: true,
          lastDailyRewardDate: "2026-06-12",
        },
      },
    });

    const daily = useGameStore.getState().claimDailyReward();

    expect(daily.ok).toBe(true);
    expect(useGameStore.getState().progress.dailyMissionStats.dailyRewardClaimed).toBe(true);
    expect(useGameStore.getState().progress.dailyMissionStats.lastDailyRewardDate).toBe("2026-06-13");
  });

  it("records fire and heal skill uses for daily missions", () => {
    useGameStore.getState().recordSkillUse();
    useGameStore.getState().recordSkillUse();

    expect(useGameStore.getState().progress.dailyMissionStats.skillUses).toBe(2);
  });
});
