import styles from "./ArchitectureOverlay.module.css";

interface ArchitectureOverlayProps {
  onClose: () => void;
}

const SYSTEM_NODES = ["Agent Planner", "Tool Registry", "Policy Engine", "Document Retrieval", "Audit Service"];

const BOUNDARY_NODES = ["AI Agent", "Proposed Action", "Validation", "Policy Engine"];

export function ArchitectureOverlay({ onClose }: ArchitectureOverlayProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.header}>
        <div className={styles.logo}>CASEPILOT</div>
        <button type="button" className={styles.backLink} onClick={onClose}>
          ← BACK TO CASE
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.eyebrow}>SYSTEM ARCHITECTURE</div>
        <h2 className={styles.heading}>How CasePilot is built.</h2>

        <div className={styles.stack}>
          <div className={styles.stackNode}>Next.js</div>
          <div className={styles.arrowDown}>↓</div>
          <div className={styles.stackNode}>FastAPI</div>
          <div className={styles.arrowDown}>↓</div>
          <div className={styles.stackNode}>Case Orchestrator</div>
          <div className={styles.arrowDown}>↓</div>
          <div className={styles.systemGrid}>
            {SYSTEM_NODES.map((node) => (
              <div key={node} className={styles.systemNode}>
                {node}
              </div>
            ))}
          </div>
          <div className={styles.arrowDown}>↓</div>
          <div className={styles.stackNode}>PostgreSQL</div>
        </div>

        <div className={styles.eyebrow}>THE ACTION BOUNDARY</div>
        <h3 className={styles.subheading}>Where the agent must ask before it acts.</h3>
        <div className={styles.boundary}>
          {BOUNDARY_NODES.map((node) => (
            <div key={node}>
              <div className={styles.boundaryNode}>{node}</div>
              <div className={styles.arrowSmall}>↓</div>
            </div>
          ))}
          <div className={styles.boundaryNodeAccent}>Human Approval (if required)</div>
          <div className={styles.arrowSmall}>↓</div>
          <div className={styles.boundaryNode}>Execution</div>
        </div>
      </div>
    </div>
  );
}
