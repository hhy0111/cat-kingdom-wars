/// <reference types="vite/client" />

import type { BattleSnapshot } from "./game/types";

declare global {
  interface Window {
    advanceTime?: (ms: number) => void;
    render_game_to_text?: () => string;
    __catKingdomBattleSnapshot?: BattleSnapshot;
  }
}

