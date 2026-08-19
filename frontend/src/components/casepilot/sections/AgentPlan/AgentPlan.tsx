import { PLAN_STEPS } from "@/data/casePilotContent";
import { cx } from "@/utils/cx";
import shared from "../shared/sectionShared.module.css";
import styles from "./AgentPlan.module.css";

interface AgentPlanProps {
  sectionRef: (el: HTMLDivElement | null) => void;
  revealed: boolean;
  onExecutePlan: () => void;
}

export function AgentPlan({ sectionRef, revealed, onExecutePlan }: AgentPlanProps) {
  return (
    <div ref={sectionRef} data-key="plan" className={cx(shared.section, shared.ink)}>
      <h2 className={shared.heading}>The agent creates a plan.</h2>
      <div className={styles.list}>
        {PLAN_STEPS.map((step, i) => (
          <div
            key={step.n}
            className={styles.row}
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(16px)",
              transitionDelay: `${i * 70}ms`,
            }}
          >
            <div className={styles.index}>{step.n}</div>
            <div>
              <div className={styles.title}>{step.title}</div>
              <div className={styles.desc}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className={shared.accentButton} style={{ marginTop: 56 }} onClick={onExecutePlan}>
        EXECUTE PLAN →
      </button>
    </div>
  );
}
