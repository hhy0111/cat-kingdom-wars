import { useEffect, useMemo, useState } from "react";
import { preloadBattleImages } from "../game/imageAssets";
import { useGameStore } from "../store/gameStore";

const LOADING_DURATION_MS = 1300;

export function LoadingScreen() {
  const loadingPlan = useGameStore((state) => state.loadingPlan);
  const completeLoading = useGameStore((state) => state.completeLoading);
  const [elapsedMs, setElapsedMs] = useState(0);

  const progress = useMemo(() => Math.min(100, Math.round((elapsedMs / LOADING_DURATION_MS) * 100)), [elapsedMs]);
  const title = loadingPlan?.title ?? "냥이 왕국 준비 중";
  const tip = loadingPlan?.tip ?? "기사와 마법냥을 균형 있게 모으면 전선 돌파가 쉬워집니다.";

  useEffect(() => {
    if (loadingPlan?.target === "battle") {
      preloadBattleImages();
    }
  }, [loadingPlan?.target]);

  useEffect(() => {
    setElapsedMs(0);
    let elapsed = 0;
    let completed = false;

    const completeOnce = () => {
      if (completed) {
        return;
      }
      completed = true;
      completeLoading();
    };

    const intervalId = window.setInterval(() => {
      elapsed = Math.min(LOADING_DURATION_MS, elapsed + 50);
      setElapsedMs(elapsed);
      if (elapsed >= LOADING_DURATION_MS) {
        completeOnce();
      }
    }, 50);

    window.advanceTime = (ms: number) => {
      elapsed = Math.min(LOADING_DURATION_MS, elapsed + Math.max(0, ms));
      setElapsedMs(elapsed);
      if (elapsed >= LOADING_DURATION_MS) {
        completeOnce();
      }
    };

    return () => {
      window.clearInterval(intervalId);
    };
  }, [completeLoading, loadingPlan?.target]);

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        mode: "loading",
        target: loadingPlan?.target ?? "lobby",
        title,
        progress,
      });
  }, [loadingPlan?.target, progress, title]);

  return (
    <section className="loading-screen screen-fill">
      <div className="loading-sky" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span key={index} style={{ "--cloud-index": index } as React.CSSProperties} />
        ))}
      </div>

      <div className="loading-road" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="loading-card">
        <p className="eyebrow">Cat Kingdom Wars</p>
        <h2>{title}</h2>
        <div className="loading-party" aria-hidden="true">
          {["sword", "shield", "bow", "staff"].map((role, index) => (
            <span key={role} className={`loading-cat ${role}`} style={{ animationDelay: `${index * -0.14}s` }} />
          ))}
        </div>
        <div className="loading-progress" aria-label={`로딩 ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <strong>{progress}%</strong>
        <p>{tip}</p>
      </div>
    </section>
  );
}
