import type { EvidenceItem } from "@/types/casepilot";
import styles from "./SourcePanel.module.css";

interface SourcePanelProps {
  item: EvidenceItem | null;
  onClose: () => void;
}

export function SourcePanel({ item, onClose }: SourcePanelProps) {
  return (
    <div className={styles.panel} style={{ transform: `translateX(${item ? 0 : 100}%)` }}>
      <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close source panel">
        ×
      </button>
      <div className={styles.doc}>{item?.doc ?? ""}</div>
      {item?.page != null && <div className={styles.page}>Page {item.page}</div>}
      <p className={styles.passage}>{item?.passage ?? ""}</p>
    </div>
  );
}
