import type { Phase } from "@/types/casepilot";
import styles from "./Landing.module.css";

interface LandingProps {
  phase: Extract<Phase, "landing" | "transitioning">;
  onRunCase: () => void;
  onOpenTry: () => void;
}

export function Landing({ phase, onRunCase, onOpenTry }: LandingProps) {
  const isTransitioning = phase === "transitioning";

  return (
    <div
      className={styles.landing}
      style={{
        opacity: isTransitioning ? 0.85 : 1,
        transform: isTransitioning ? "translateY(-16px)" : "translateY(0)",
      }}
    >
      <div className={styles.eyebrow}>AI CASE INVESTIGATION · PORTFOLIO DEMO</div>
      <h1 className={styles.heading}>
        One case.
        <br />
        Six documents.
        <br />
        Three systems.
        <br />
        One decision.
      </h1>
      <p className={styles.subhead}>
        See how an AI agent investigates a complex case without pretending to know what it does not know.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.primaryButton} onClick={onRunCase}>
          RUN THE CASE →
        </button>
        <button type="button" className={styles.secondaryButton} onClick={onOpenTry}>
          TRY CASEPILOT →
        </button>
      </div>
      <div className={styles.hint}>RUN THE CASE: guided walkthrough · TRY CASEPILOT: submit your own claim</div>
      <div className={styles.watermark}>CASEPILOT</div>
    </div>
  );
}
