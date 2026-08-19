import { cx } from "@/utils/cx";
import shared from "../shared/sectionShared.module.css";
import styles from "./NewInfoArrived.module.css";

interface NewInfoArrivedProps {
  sectionRef: (el: HTMLDivElement | null) => void;
  responseArrived: boolean;
}

export function NewInfoArrived({ sectionRef, responseArrived }: NewInfoArrivedProps) {
  return (
    <div ref={sectionRef} data-key="arrived" className={cx(shared.section, shared.paper, styles.section)}>
      <h2 className={shared.heading} style={{ maxWidth: 900 }}>
        New information received.
      </h2>
      <div
        className={styles.card}
        style={{
          opacity: responseArrived ? 1 : 0,
          transform: `translateX(${responseArrived ? 0 : 12}px)`,
        }}
      >
        <div className={styles.header}>
          <div className={styles.sender}>Nordic Repair Oy</div>
          <div className={styles.timestamp}>JUST NOW</div>
        </div>
        <p className={styles.message}>The leak appears to have started approximately two hours before it was discovered.</p>
        <div className={styles.statusRow}>
          <div className={styles.pulseDot} />
          <div className={styles.statusLabel}>CASE UPDATED — RE-EVALUATING COVERAGE...</div>
        </div>
      </div>
    </div>
  );
}
