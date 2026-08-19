import styles from "./ScrollProgressBar.module.css";

interface ScrollProgressBarProps {
  percent: number;
}

export function ScrollProgressBar({ percent }: ScrollProgressBarProps) {
  return (
    <div className={styles.track}>
      <div className={styles.fill} style={{ width: `${percent}%` }} />
    </div>
  );
}
