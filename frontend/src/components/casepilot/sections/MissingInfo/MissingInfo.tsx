import { cx } from "@/utils/cx";
import shared from "../shared/sectionShared.module.css";
import styles from "./MissingInfo.module.css";

interface MissingInfoProps {
  sectionRef: (el: HTMLDivElement | null) => void;
  revealed: boolean;
  bodyText?: string;
  confidenceValue?: number;
  thresholdValue?: number;
}

const DEFAULT_BODY =
  "The repair report confirms water damage. However the report does not confirm when the dishwasher leak began.";

export function MissingInfo({
  sectionRef,
  revealed,
  bodyText = DEFAULT_BODY,
  confidenceValue = 78,
  thresholdValue = 85,
}: MissingInfoProps) {
  return (
    <div
      ref={sectionRef}
      data-key="missing"
      className={cx(shared.section, shared.ink, shared.fadeIn, styles.section)}
      style={{ opacity: revealed ? 1 : 0 }}
    >
      <div className={styles.eyebrow}>CRITICAL INFORMATION MISSING</div>
      <h2 className={styles.heading}>The agent does not know enough.</h2>
      <p className={styles.body}>{bodyText}</p>
      <div className={styles.stats}>
        <div>
          <div className={styles.statLabel}>COVERAGE CONFIDENCE</div>
          <div className={styles.confidenceValue}>{confidenceValue}%</div>
        </div>
        <div className={styles.thresholdColumn}>
          <div className={styles.statLabel}>AUTOMATIC RECOMMENDATION THRESHOLD</div>
          <div className={styles.thresholdValue}>{thresholdValue}%</div>
        </div>
      </div>
      <div className={styles.badge}>NOT ENOUGH EVIDENCE</div>
    </div>
  );
}
