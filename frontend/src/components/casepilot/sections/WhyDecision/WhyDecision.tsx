import type { TraceStep } from "@/types/casepilot";
import { cx } from "@/utils/cx";
import shared from "../shared/sectionShared.module.css";
import styles from "./WhyDecision.module.css";

interface WhyDecisionProps {
  sectionRef: (el: HTMLDivElement | null) => void;
  revealed: boolean;
  steps: TraceStep[];
}

export function WhyDecision({ sectionRef, revealed, steps }: WhyDecisionProps) {
  return (
    <div ref={sectionRef} data-key="trace" className={cx(shared.sectionTall, shared.ink)}>
      <h2 className={shared.heading}>Why this decision.</h2>
      <div className={styles.list}>
        {steps.map((step, i) => {
          const hasArrow = step.hasArrow !== false;
          return (
            <div
              key={`${step.label}-${i}`}
              className={styles.step}
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(14px)",
                transitionDelay: `${i * 90}ms`,
              }}
            >
              <div
                className={styles.stepLabel}
                style={{
                  fontSize: step.size ?? 22,
                  fontWeight: step.weight ?? 700,
                  color: step.color ?? "var(--color-paper)",
                }}
              >
                {step.label}
              </div>
              {step.sub && <div className={styles.stepSub}>{step.sub}</div>}
              {hasArrow && <div className={styles.arrow}>↓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
