import { cx } from "@/utils/cx";
import shared from "../shared/sectionShared.module.css";
import styles from "./NextAction.module.css";

interface NextActionProps {
  sectionRef: (el: HTMLDivElement | null) => void;
  revealed: boolean;
  onReviewRequest: () => void;
  requiredTitle?: string;
  requiredDesc?: string;
  nextActionTitle?: string;
  nextActionDesc?: string;
  reviewLabel?: string;
}

export function NextAction({
  sectionRef,
  revealed,
  onReviewRequest,
  requiredTitle = "Leak start time",
  requiredDesc = "Confirmation from repair company",
  nextActionTitle = "Request additional information",
  nextActionDesc = "from repair company",
  reviewLabel = "REVIEW REQUEST →",
}: NextActionProps) {
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
          <div className={styles.itemTitle}>{requiredTitle}</div>
          <div className={styles.itemDesc}>{requiredDesc}</div>
        </div>
        <div>
          <div className={styles.labelAccent}>NEXT ACTION</div>
          <div className={styles.itemTitle}>{nextActionTitle}</div>
          <div className={styles.itemDesc}>{nextActionDesc}</div>
        </div>
      </div>
      <button type="button" className={shared.primaryButton} onClick={onReviewRequest}>
        {reviewLabel}
      </button>
    </div>
  );
}
