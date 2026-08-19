import { INVESTIGATION_ROWS } from "@/data/casePilotContent";
import { cx } from "@/utils/cx";
import shared from "../shared/sectionShared.module.css";
import styles from "./Investigation.module.css";

interface InvestigationProps {
  sectionRef: (el: HTMLDivElement | null) => void;
  revealedCount: number;
}

export function Investigation({ sectionRef, revealedCount }: InvestigationProps) {
  return (
    <div ref={sectionRef} data-key="investigation" className={cx(shared.section, shared.paper)}>
      <h2 className={shared.heading}>Investigating case.</h2>
      <div className={styles.list}>
        {INVESTIGATION_ROWS.map((row, i) => {
          const isRevealed = i < revealedCount;
          return (
            <div
              key={row.title}
              className={styles.row}
              style={{
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <div className={styles.rowHeader}>
                <div className={styles.rowTitle}>{row.title}</div>
                <div className={styles.rowStatus}>{row.status}</div>
              </div>
              {row.simple && <div className={styles.detail}>{row.detail}</div>}
              {row.hasFields && (
                <div className={styles.fields}>
                  {row.label1 && (
                    <div>
                      <div className={styles.fieldLabel}>{row.label1}</div>
                      <div className={styles.fieldValue}>{row.value1}</div>
                    </div>
                  )}
                  {row.label2 && (
                    <div>
                      <div className={styles.fieldLabel}>{row.label2}</div>
                      <div className={styles.fieldValue}>{row.value2}</div>
                    </div>
                  )}
                  {row.label3 && (
                    <div>
                      <div className={styles.fieldLabel}>{row.label3}</div>
                      <div className={styles.fieldValue}>{row.value3}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
