import { CASE_ID } from "@/data/casePilotContent";
import styles from "./TransitionOverlay.module.css";

interface TransitionOverlayProps {
  stage: 0 | 1 | 2 | 3;
}

export function TransitionOverlay({ stage }: TransitionOverlayProps) {
  const isPaper = stage >= 3;

  return (
    <div
      className={styles.overlay}
      style={{
        background: isPaper ? "var(--color-paper)" : "var(--color-ink)",
        opacity: stage === 0 ? 0 : 1,
      }}
    >
      <div
        className={styles.text}
        style={{
          color: isPaper ? "var(--color-ink)" : "var(--color-paper)",
          opacity: stage === 2 ? 1 : 0,
        }}
      >
        {CASE_ID}
      </div>
    </div>
  );
}
