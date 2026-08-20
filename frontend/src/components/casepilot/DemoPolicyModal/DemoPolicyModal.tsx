"use client";

import { DEMO_POLICY_TEXT } from "@/lib/demoPolicy";
import styles from "./DemoPolicyModal.module.css";

interface DemoPolicyModalProps {
  open: boolean;
  onClose: () => void;
  onUse: () => void;
}

export function DemoPolicyModal({ open, onClose, onUse }: DemoPolicyModalProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className={styles.eyebrow}>DEMO POLICY DOCUMENT</div>
        <h3 className={styles.heading}>No policy handy? Use this sample instead.</h3>
        <pre className={styles.body}>{DEMO_POLICY_TEXT}</pre>
        <button type="button" className={styles.useButton} onClick={onUse}>
          USE THIS POLICY →
        </button>
      </div>
    </div>
  );
}
