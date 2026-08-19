import { CASE_ID, CASE_RECEIVED } from "@/data/casePilotContent";
import type { Attachment } from "@/types/casepilot";
import { cx } from "@/utils/cx";
import shared from "../shared/sectionShared.module.css";
import styles from "./CaseArrives.module.css";

interface CaseArrivesProps {
  sectionRef: (el: HTMLDivElement | null) => void;
  customerName: string;
  caseIncidentType: string;
  customerMessage: string;
  attachments: Attachment[];
  caseOpened: boolean;
  onInvestigate: () => void;
}

export function CaseArrives({
  sectionRef,
  customerName,
  caseIncidentType,
  customerMessage,
  attachments,
  caseOpened,
  onInvestigate,
}: CaseArrivesProps) {
  return (
    <div
      ref={sectionRef}
      data-key="case"
      className={cx(shared.section, shared.paper, shared.twoCol)}
    >
      <div
        className={styles.left}
        style={{
          opacity: caseOpened ? 0.55 : 1,
          transform: caseOpened ? "scale(0.98)" : "scale(1)",
        }}
      >
        <div className={styles.meta}>
          {CASE_ID} · {CASE_RECEIVED}
        </div>
        <h2 className={styles.heading}>{caseIncidentType}</h2>
        <div className={styles.customer}>{customerName}</div>
        <div className={styles.message}>{customerMessage}</div>
        <button type="button" className={shared.primaryButton} onClick={onInvestigate}>
          INVESTIGATE CASE →
        </button>
      </div>
      <div className={styles.right} style={{ transform: caseOpened ? "translateX(-6px)" : "translateX(0)" }}>
        <div className={styles.attachmentsLabel}>ATTACHMENTS · {attachments.length}</div>
        {attachments.map((item) => (
          <div key={item.name} className={styles.attachmentRow}>
            <span className={styles.attachmentName}>{item.name}</span>
            <span className={styles.attachmentMeta}>{item.meta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
