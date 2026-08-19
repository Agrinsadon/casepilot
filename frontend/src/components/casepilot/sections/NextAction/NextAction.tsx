import { cx } from "@/utils/cx";
import shared from "../shared/sectionShared.module.css";
import styles from "./NextAction.module.css";

interface NextActionProps {
  sectionRef: (el: HTMLDivElement | null) => void;
  revealed: boolean;
  onReviewRequest: () => void;
}

export function NextAction({ sectionRef, revealed, onReviewRequest }: NextActionProps) {
  return (
    <div
      ref={sectionRef}
      data-key="next"
      className={cx(shared.section, shared.paper, shared.fadeIn, styles.section)}
      style={{ opacity: revealed ? 1 : 0 }}
    >
      <h2 className={shared.heading}>The agent knows what is missing.</h2>
      <div className={styles.grid}>
        <div>
          <div className={styles.label}>REQUIRED EVIDENCE</div>
          <div className={styles.itemTitle}>Leak start time</div>
          <div className={styles.itemDesc}>Confirmation from repair company</div>
        </div>
        <div>
          <div className={styles.labelAccent}>NEXT ACTION</div>
          <div className={styles.itemTitle}>Request additional information</div>
          <div className={styles.itemDesc}>from repair company</div>
        </div>
      </div>
      <button type="button" className={shared.primaryButton} onClick={onReviewRequest}>
        REVIEW REQUEST →
      </button>
    </div>
  );
}
