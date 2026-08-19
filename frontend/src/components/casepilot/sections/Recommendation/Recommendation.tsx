import type { EvidenceItem } from "@/types/casepilot";
import { cx } from "@/utils/cx";
import shared from "../shared/sectionShared.module.css";
import styles from "./Recommendation.module.css";

interface RecommendationProps {
  sectionRef: (el: HTMLDivElement | null) => void;
  revealed: boolean;
  sourcePanelOpen: boolean;
  onEvidenceClick: (item: EvidenceItem) => void;
  onWhyDecision: () => void;
  evidence: EvidenceItem[];
  heading?: string;
  headingColor?: string;
  estimatedCompensation?: string;
  confidenceValue?: number;
  confidenceColor?: string;
}

export function Recommendation({
  sectionRef,
  revealed,
  sourcePanelOpen,
  onEvidenceClick,
  onWhyDecision,
  evidence,
  heading = "APPROVE CLAIM",
  headingColor = "var(--color-green)",
  estimatedCompensation = "€3,850",
  confidenceValue = 94,
  confidenceColor = "var(--color-green)",
}: RecommendationProps) {
  return (
    <div
      ref={sectionRef}
      data-key="recommendation"
      className={cx(shared.section, shared.paper, styles.section)}
      style={{ transform: sourcePanelOpen ? "scale(0.97)" : "scale(1)" }}
    >
      <div className={styles.eyebrow}>RECOMMENDATION</div>
      <h2 className={styles.heading} style={{ color: headingColor }}>
        {heading}
      </h2>
      <div className={styles.grid}>
        <div>
          <div className={styles.stats}>
            <div>
              <div className={styles.statLabel}>ESTIMATED COMPENSATION</div>
              <div className={styles.statValue}>{estimatedCompensation}</div>
            </div>
            <div>
              <div className={styles.statLabel}>CONFIDENCE</div>
              <div className={styles.statValue} style={{ color: confidenceColor }}>
                {confidenceValue}%
              </div>
            </div>
          </div>
          <button type="button" className={shared.primaryButton} onClick={onWhyDecision}>
            WHY THIS DECISION? →
          </button>
        </div>
        <div>
          <div className={styles.evidenceLabel}>EVIDENCE</div>
          {evidence.map((ev, i) => (
            <div
              key={`${ev.label}-${i}`}
              className={styles.evidenceRow}
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${i * 70}ms`,
              }}
            >
              <div className={styles.evidenceLabelText}>{ev.label}</div>
              <button type="button" className={styles.evidenceSource} onClick={() => onEvidenceClick(ev)}>
                {ev.sourceLabel}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
