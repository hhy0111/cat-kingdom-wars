import { useEffect } from "react";
import { playSfx, unlockGameAudio } from "../game/audio";
import { useGameStore } from "../store/gameStore";

export function OpeningScreen() {
  const enterLobby = useGameStore((state) => state.enterLobby);

  const handleEnterLobby = () => {
    unlockGameAudio();
    playSfx("uiTap");
    enterLobby();
  };

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        mode: "opening",
        primaryAction: "start_new_game",
        secondaryAction: "continue_to_lobby",
      });
    window.advanceTime = undefined;
  }, []);

  return (
    <section className="opening-screen screen-fill">
      <div className="sky-layer cloud-a" />
      <div className="sky-layer cloud-b" />
      <div className="opening-sun" aria-hidden="true" />

      <div className="marching-cats" aria-hidden="true">
        {Array.from({ length: 11 }, (_, index) => (
          <span key={index} style={{ animationDelay: `${index * -0.2}s` }} />
        ))}
      </div>

      <div className="spark-field" aria-hidden="true">
        {Array.from({ length: 26 }, (_, index) => (
          <span key={index} style={{ "--spark-index": index } as React.CSSProperties} />
        ))}
      </div>

      <div className="title-lockup">
        <div className="kingdom-crest" aria-hidden="true">
          <span />
        </div>
        <p className="eyebrow opening-tagline">자동 전선 점령 전략</p>
        <div className="opening-logo" aria-hidden="true" />
        <h1 className="screen-reader-title">Cat Kingdom Wars</h1>
        <p className="korean-title">냥이 왕국 전쟁</p>
        <div className="opening-actions">
          <button id="start-btn" className="primary-action" type="button" onClick={handleEnterLobby}>
            새 왕국 시작
          </button>
          <button className="secondary-action" type="button" onClick={handleEnterLobby}>
            이어하기
          </button>
        </div>
        <div className="return-hook">
          <strong>내일 접속 보상</strong>
          <span>황금 생선 상자 + 슈퍼냥 체험권</span>
        </div>
        <a className="privacy-link" href="/privacy.html" target="_blank" rel="noreferrer">
          개인정보처리방침
        </a>
      </div>
    </section>
  );
}
