import { cx } from "@/utils/cx";
import shared from "../shared/sectionShared.module.css";
import styles from "./FinalScreen.module.css";

interface FinalScreenProps {
  sectionRef: (el: HTMLDivElement | null) => void;
  revealed: boolean;
  onRunAgain: () => void;
  onOpenArch: () => void;
  onOpenTry: () => void;
}

export function FinalScreen({ sectionRef, revealed, onRunAgain, onOpenArch, onOpenTry }: FinalScreenProps) {
  return (
    <div
      ref={sectionRef}
      data-key="final"
      className={cx(shared.sectionTall, shared.paper, shared.fadeIn, styles.section)}
      style={{ opacity: revealed ? 1 : 0 }}
    >
      <h2 className={styles.heading}>
        AI should not just answer.
        <br />
        It should know what happens next.
      </h2>
      <p className={styles.body}>
        CasePilot combines AI reasoning, business rules, evidence, and human review inside one auditable workflow.
      </p>
      <div className={styles.actions}>
        <button type="button" className={shared.accentButton} onClick={onOpenTry}>
          TRY CASEPILOT →
        </button>
        <button type="button" className={shared.primaryButton} onClick={onRunAgain}>
          RUN AGAIN
        </button>
        <button type="button" className={shared.outlineButton} onClick={onOpenArch}>
          VIEW ARCHITECTURE
        </button>
        <span className={styles.comingSoon}>GITHUB (COMING SOON)</span>
      </div>
    </div>
  );
}
