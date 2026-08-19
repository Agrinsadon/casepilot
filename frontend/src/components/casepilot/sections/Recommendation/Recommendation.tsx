import { EVIDENCE } from "@/data/casePilotContent";
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
}

export function Recommendation({
  sectionRef,
  revealed,
  sourcePanelOpen,
  onEvidenceClick,
  onWhyDecision,
}: RecommendationProps) {
  return (
    <div
      ref={sectionRef}
      data-key="recommendation"
      className={cx(shared.section, shared.paper, styles.section)}
      style={{ transform: sourcePanelOpen ? "scale(0.97)" : "scale(1)" }}
    >
      <div className={styles.eyebrow}>RECOMMENDATION</div>
      <h2 className={styles.heading}>APPROVE CLAIM</h2>
      <div className={styles.grid}>
        <div>
          <div className={styles.stats}>
            <div>
              <div className={styles.statLabel}>ESTIMATED COMPENSATION</div>
              <div className={styles.statValue}>€3,850</div>
            </div>
            <div>
              <div className={styles.statLabel}>CONFIDENCE</div>
              <div className={styles.statValue} style={{ color: "var(--color-green)" }}>
                94%
              </div>
            </div>
          </div>
          <button type="button" className={shared.primaryButton} onClick={onWhyDecision}>
            WHY THIS DECISION? →
          </button>
        </div>
        <div>
          <div className={styles.evidenceLabel}>EVIDENCE</div>
          {EVIDENCE.map((ev, i) => (
            <div
              key={ev.label}
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
