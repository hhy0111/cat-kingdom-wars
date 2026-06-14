import { Capacitor } from "@capacitor/core";

export type BillingReward = {
  gold?: number;
  fish?: number;
};

type BillingProductDefinition = {
  id: string;
  title: string;
  krwPrice: number;
  reward: BillingReward;
  consumable: true;
  priceLabel: string;
};

export const BILLING_PRODUCTS = [
  { id: "gold_1200", title: "Gold 1,200", krwPrice: 1100, reward: { gold: 1200 }, consumable: true, priceLabel: "₩1,100" },
  { id: "gold_4000", title: "Gold 4,000", krwPrice: 3300, reward: { gold: 4000 }, consumable: true, priceLabel: "₩3,300" },
  { id: "gold_9000", title: "Gold 9,000", krwPrice: 6600, reward: { gold: 9000 }, consumable: true, priceLabel: "₩6,600" },
  { id: "fish_120", title: "Fish 120", krwPrice: 1100, reward: { fish: 120 }, consumable: true, priceLabel: "₩1,100" },
  { id: "fish_420", title: "Fish 420", krwPrice: 3300, reward: { fish: 420 }, consumable: true, priceLabel: "₩3,300" },
  { id: "fish_1000", title: "Fish 1,000", krwPrice: 6600, reward: { fish: 1000 }, consumable: true, priceLabel: "₩6,600" },
  { id: "starter_pack_01", title: "스타터 보급팩", krwPrice: 4400, reward: { gold: 3000, fish: 250 }, consumable: true, priceLabel: "₩4,400" },
  { id: "growth_pack_01", title: "성장 지원팩", krwPrice: 9900, reward: { gold: 8000, fish: 700 }, consumable: true, priceLabel: "₩9,900" },
  { id: "kingdom_pack_01", title: "왕국 강화팩", krwPrice: 19900, reward: { gold: 18000, fish: 1500 }, consumable: true, priceLabel: "₩19,900" },
] as const satisfies readonly BillingProductDefinition[];

export type BillingProductId = (typeof BILLING_PRODUCTS)[number]["id"];

export type BillingProduct = {
  id: BillingProductId;
  title: string;
  krwPrice: number;
  reward: BillingReward;
  consumable: true;
  priceLabel: string;
};

type NativeProductDetails = {
  productId: string;
  title?: string;
  description?: string;
  price?: string;
  formattedPrice?: string;
};

type NativeProductResponse = {
  products?: NativeProductDetails[];
};

type NativePurchaseResponse = {
  status?: "purchased" | "pending" | "canceled" | "error" | "unavailable";
  productId?: string;
  purchaseToken?: string;
  error?: string;
};

type PlayBillingBridge = {
  queryProducts?: (options: { productIds: BillingProductId[] }) => Promise<NativeProductResponse>;
  purchase?: (options: { productId: BillingProductId }) => Promise<NativePurchaseResponse>;
};

export type BillingPurchaseResult =
  | { ok: true; status: "purchased"; productId: BillingProductId; reward: BillingReward; purchaseToken?: string }
  | { ok: false; status: "pending" | "canceled" | "unavailable" | "invalid_product" | "error"; productId?: BillingProductId; error?: string };

declare global {
  interface Window {
    Capacitor?: {
      Plugins?: {
        PlayBilling?: PlayBillingBridge;
      };
    };
  }
}

export const BILLING_PRODUCT_IDS = BILLING_PRODUCTS.map((product) => product.id);

export function getBillingProduct(productId: string): BillingProduct | null {
  const product = BILLING_PRODUCTS.find((candidate) => candidate.id === productId);
  return product ? cloneBillingProduct(product) : null;
}

export function formatBillingReward(reward: BillingReward): string {
  const parts = [];
  if (reward.gold) {
    parts.push(`Gold ${reward.gold.toLocaleString("ko-KR")}`);
  }
  if (reward.fish) {
    parts.push(`Fish ${reward.fish.toLocaleString("ko-KR")}`);
  }
  return parts.length > 0 ? parts.join(" + ") : "보상 없음";
}

export async function loadBillingProducts(): Promise<BillingProduct[]> {
  const products = BILLING_PRODUCTS.map(cloneBillingProduct);
  const bridge = getPlayBillingBridge();

  if (!Capacitor.isNativePlatform() || !bridge?.queryProducts) {
    return products;
  }

  try {
    const response = await bridge.queryProducts({ productIds: [...BILLING_PRODUCT_IDS] });
    const detailsById = new Map((response.products ?? []).map((product) => [product.productId, product]));

    return products.map((product) => {
      const nativeDetails = detailsById.get(product.id);
      return {
        ...product,
        priceLabel: nativeDetails?.price ?? nativeDetails?.formattedPrice ?? product.priceLabel,
      };
    });
  } catch {
    return products;
  }
}

export async function purchaseBillingProduct(productId: BillingProductId): Promise<BillingPurchaseResult> {
  const product = getBillingProduct(productId);
  if (!product) {
    return { ok: false, status: "invalid_product", error: "Unknown billing product." };
  }

  const bridge = getPlayBillingBridge();
  if (!Capacitor.isNativePlatform() || !bridge?.purchase) {
    return {
      ok: false,
      status: "unavailable",
      error: "Google Play Billing is only available in the Android app installed from Google Play.",
    };
  }

  try {
    const response = await bridge.purchase({ productId });
    if (response.status === "purchased" && response.productId === productId) {
      return {
        ok: true,
        status: "purchased",
        productId,
        reward: { ...product.reward },
        purchaseToken: response.purchaseToken,
      };
    }

    if (response.status === "pending" || response.status === "canceled" || response.status === "unavailable") {
      return { ok: false, status: response.status, productId, error: response.error };
    }

    return {
      ok: false,
      status: "error",
      productId,
      error: response.error ?? "Google Play purchase did not complete.",
    };
  } catch (error) {
    return {
      ok: false,
      status: "error",
      productId,
      error: error instanceof Error ? error.message : "Google Play purchase failed.",
    };
  }
}

function cloneBillingProduct(product: (typeof BILLING_PRODUCTS)[number]): BillingProduct {
  return {
    ...product,
    reward: { ...product.reward },
  };
}

function getPlayBillingBridge(): PlayBillingBridge | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  return window.Capacitor?.Plugins?.PlayBilling;
}
