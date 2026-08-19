import type { ApprovalStatus } from "@/types/casepilot";
import { cx } from "@/utils/cx";
import shared from "../shared/sectionShared.module.css";
import styles from "./HumanReview.module.css";

interface HumanReviewProps {
  sectionRef: (el: HTMLDivElement | null) => void;
  revealed: boolean;
  approvalStatus: ApprovalStatus;
  onApprove: () => void;
}

const APPROVE_LABEL: Record<ApprovalStatus, string> = {
  draft: "APPROVE & SEND →",
  sending: "SENDING…",
  sent: "SENT ✓",
};

export function HumanReview({ sectionRef, revealed, approvalStatus, onApprove }: HumanReviewProps) {
  const sent = approvalStatus === "sent";

  return (
    <div
      ref={sectionRef}
      data-key="review"
      className={cx(shared.section, shared.ink, shared.fadeIn, styles.section)}
      style={{ opacity: revealed ? 1 : 0 }}
    >
      <div className={styles.card} style={{ transform: sent ? "translateY(-10px)" : "translateY(0)" }}>
        <div className={styles.tag}>AI CREATED</div>
        <div className={styles.headerBlock}>
          <div className={styles.headerRow}>
            <span className={styles.headerKey}>TO</span>
            <span className={styles.headerVal}>Nordic Repair Oy</span>
          </div>
          <div className={styles.headerRow}>
            <span className={styles.headerKey}>SUBJECT</span>
            <span className={styles.headerVal}>Additional information required — Case #2026-1842</span>
          </div>
        </div>
        <p className={styles.body}>
          Hello,
          <br />
          <br />
          We are reviewing the water damage reported by Laura Virtanen. Could you confirm the estimated time at
          which the dishwasher leak began? This information is required to complete the coverage assessment.
        </p>
        <div className={styles.approvalTag}>HUMAN APPROVAL REQUIRED</div>
        <div className={styles.actions}>
          <button type="button" className={styles.editLink}>
            EDIT
          </button>
          <button
            type="button"
            className={styles.approveButton}
            disabled={approvalStatus !== "draft"}
            onClick={onApprove}
            style={{
              background: sent ? "var(--color-green)" : "var(--color-lime)",
              color: sent ? "var(--color-paper)" : "var(--color-ink)",
            }}
          >
            {APPROVE_LABEL[approvalStatus]}
          </button>
        </div>
      </div>
    </div>
  );
}
