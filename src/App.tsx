import { useEffect, useRef } from "react";
import { BattleScreen } from "./screens/BattleScreen";
import { LoadingScreen } from "./screens/LoadingScreen";
import { LobbyScreen } from "./screens/LobbyScreen";
import { OpeningScreen } from "./screens/OpeningScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { initializeAdMob, showAppOpenReturnAd } from "./game/adMob";
import { installAudioUnlockListeners, setGameBgm } from "./game/audio";
import { useGameStore } from "./store/gameStore";

export function App() {
  const screen = useGameStore((state) => state.screen);
  const syncHashRoute = useGameStore((state) => state.syncHashRoute);
  const wasHiddenRef = useRef(false);

  useEffect(() => {
    syncHashRoute();
    window.addEventListener("hashchange", syncHashRoute);
    return () => window.removeEventListener("hashchange", syncHashRoute);
  }, [syncHashRoute]);

  useEffect(() => installAudioUnlockListeners(), []);

  useEffect(() => {
    let cancelled = false;
    const showReturnAd = () => {
      if (!cancelled) {
        void showAppOpenReturnAd();
      }
    };

    void initializeAdMob().then(showReturnAd);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        wasHiddenRef.current = true;
        return;
      }

      if (document.visibilityState === "visible" && wasHiddenRef.current) {
        wasHiddenRef.current = false;
        showReturnAd();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    setGameBgm(screen === "result" || screen === "loading" ? null : screen);
  }, [screen]);

  if (typeof window !== "undefined") {
    window.render_game_to_text = window.render_game_to_text ?? (() => JSON.stringify({ mode: screen }));
  }

  return (
    <main className="app-shell">
      {screen === "opening" && <OpeningScreen />}
      {screen === "loading" && <LoadingScreen />}
      {screen === "lobby" && <LobbyScreen />}
      {screen === "battle" && <BattleScreen />}
      {screen === "result" && <ResultScreen />}
    </main>
  );
}
