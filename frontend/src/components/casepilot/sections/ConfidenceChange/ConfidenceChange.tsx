import { cx } from "@/utils/cx";
import shared from "../shared/sectionShared.module.css";
import styles from "./ConfidenceChange.module.css";

interface ConfidenceChangeProps {
  sectionRef: (el: HTMLDivElement | null) => void;
  confidenceValue: number;
}

export function ConfidenceChange({ sectionRef, confidenceValue }: ConfidenceChangeProps) {
  const color = confidenceValue >= 85 ? "var(--color-lime)" : "var(--color-orange)";

  return (
    <div ref={sectionRef} data-key="confidence" className={cx(shared.section, shared.ink, styles.section)}>
      <div className={styles.compare}>
        <div>
          <div className={styles.label}>BEFORE · MISSING EVIDENCE</div>
          <div className={styles.before}>78%</div>
        </div>
        <div className={styles.arrow}>→</div>
        <div>
          <div className={styles.label}>AFTER · LEAK DURATION CONFIRMED</div>
          <div className={styles.after} style={{ color }}>
            {confidenceValue}%
          </div>
        </div>
      </div>
      <h2 className={styles.tagline}>
        The evidence changed.
        <br />
        So did the recommendation.
      </h2>
    </div>
  );
}
