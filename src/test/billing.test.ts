import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { type SavedProgress, useGameStore } from "../store/gameStore";

const lobbyScreenSourcePath = fileURLToPath(new URL("../screens/LobbyScreen.tsx", import.meta.url));

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

const testWindow = globalThis as typeof globalThis & {
  Capacitor?: {
    Plugins?: {
      PlayBilling?: unknown;
    };
  };
};

describe("Google Play billing integration", () => {
  beforeEach(() => {
    vi.resetModules();
    useGameStore.setState({
      screen: "lobby",
      selectedStageId: "stage_001",
      lastResult: null,
      lastBattleRewards: null,
      lastBattleRewardBoosted: false,
      loadingPlan: null,
      progress: emptyProgress,
    });
    vi.stubGlobal("window", testWindow);
    testWindow.Capacitor = { Plugins: {} };
  });

  afterEach(() => {
    vi.doUnmock("@capacitor/core");
    vi.unstubAllGlobals();
    delete testWindow.Capacitor;
  });

  it("keeps the Play Console one-time product catalog stable", async () => {
    const { BILLING_PRODUCTS, BILLING_PRODUCT_IDS } = await import("../game/billing");

    expect(BILLING_PRODUCT_IDS).toEqual([
      "gold_1200",
      "gold_4000",
      "gold_9000",
      "fish_120",
      "fish_420",
      "fish_1000",
      "starter_pack_01",
      "growth_pack_01",
      "kingdom_pack_01",
    ]);
    expect(BILLING_PRODUCTS).toMatchObject([
      { id: "gold_1200", title: "Gold 1,200", krwPrice: 1100, reward: { gold: 1200 } },
      { id: "gold_4000", title: "Gold 4,000", krwPrice: 3300, reward: { gold: 4000 } },
      { id: "gold_9000", title: "Gold 9,000", krwPrice: 6600, reward: { gold: 9000 } },
      { id: "fish_120", title: "Fish 120", krwPrice: 1100, reward: { fish: 120 } },
      { id: "fish_420", title: "Fish 420", krwPrice: 3300, reward: { fish: 420 } },
      { id: "fish_1000", title: "Fish 1,000", krwPrice: 6600, reward: { fish: 1000 } },
      { id: "starter_pack_01", title: "스타터 보급팩", krwPrice: 4400, reward: { gold: 3000, fish: 250 } },
      { id: "growth_pack_01", title: "성장 지원팩", krwPrice: 9900, reward: { gold: 8000, fish: 700 } },
      { id: "kingdom_pack_01", title: "왕국 강화팩", krwPrice: 19900, reward: { gold: 18000, fish: 1500 } },
    ]);
  });

  it("queries native Play Billing product details and overlays localized prices", async () => {
    vi.doMock("@capacitor/core", () => ({
      Capacitor: {
        isNativePlatform: () => true,
      },
    }));
    testWindow.Capacitor!.Plugins!.PlayBilling = {
      queryProducts: vi.fn().mockResolvedValue({
        products: [
          { productId: "gold_1200", price: "₩1,100" },
          { productId: "starter_pack_01", price: "₩4,400" },
        ],
      }),
    };

    const { loadBillingProducts } = await import("../game/billing");

    const products = await loadBillingProducts();

    expect(products.find((product) => product.id === "gold_1200")?.priceLabel).toBe("₩1,100");
    expect(products.find((product) => product.id === "starter_pack_01")?.priceLabel).toBe("₩4,400");
    expect(products.find((product) => product.id === "fish_120")?.priceLabel).toBe("₩1,100");
  });

  it("runs a native consumable purchase and grants the matching reward once the purchase is consumed", async () => {
    vi.doMock("@capacitor/core", () => ({
      Capacitor: {
        isNativePlatform: () => true,
      },
    }));
    testWindow.Capacitor!.Plugins!.PlayBilling = {
      purchase: vi.fn().mockResolvedValue({
        status: "purchased",
        productId: "growth_pack_01",
        purchaseToken: "token-123",
      }),
    };

    const { purchaseBillingProduct } = await import("../game/billing");

    const purchase = await purchaseBillingProduct("growth_pack_01");
    const claim = useGameStore.getState().claimBillingProduct(purchase.productId!);

    expect(purchase).toMatchObject({ ok: true, status: "purchased", productId: "growth_pack_01" });
    expect(claim).toEqual({ ok: true, reward: { gold: 8000, fish: 700 } });
    expect(useGameStore.getState().progress.gold).toBe(8000);
    expect(useGameStore.getState().progress.fish).toBe(700);
  });

  it("does not fake purchases outside the native Play Billing runtime", async () => {
    vi.doMock("@capacitor/core", () => ({
      Capacitor: {
        isNativePlatform: () => false,
      },
    }));

    const { purchaseBillingProduct } = await import("../game/billing");

    await expect(purchaseBillingProduct("gold_1200")).resolves.toEqual({
      ok: false,
      status: "unavailable",
      error: "Google Play Billing is only available in the Android app installed from Google Play.",
    });
  });

  it("wires a billing shop into the lobby screen", () => {
    const source = readFileSync(lobbyScreenSourcePath, "utf8");

    expect(source).toContain("loadBillingProducts");
    expect(source).toContain("purchaseBillingProduct");
    expect(source).toContain("showBillingShop");
    expect(source).toContain("결제 상점");
  });
});
