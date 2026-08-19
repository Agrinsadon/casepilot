import { TRY_SIM_ATTACHMENTS } from "@/data/casePilotContent";
import styles from "./TryForm.module.css";

interface TryFormProps {
  name: string;
  incident: string;
  message: string;
  onNameChange: (value: string) => void;
  onIncidentChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function TryForm({
  name,
  incident,
  message,
  onNameChange,
  onIncidentChange,
  onMessageChange,
  onSubmit,
  onBack,
}: TryFormProps) {
  return (
    <div className={styles.form}>
      <button type="button" className={styles.backLink} onClick={onBack}>
        ← BACK
      </button>
      <div className={styles.eyebrow}>SUBMIT A CLAIM · YOU ARE THE CUSTOMER</div>
      <h2 className={styles.heading}>Tell us what happened.</h2>
      <div className={styles.fields}>
        <div>
          <div className={styles.fieldLabel}>YOUR NAME</div>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Laura Virtanen"
          />
        </div>
        <div>
          <div className={styles.fieldLabel}>INCIDENT TYPE</div>
          <input
            className={styles.input}
            value={incident}
            onChange={(e) => onIncidentChange(e.target.value)}
            placeholder="Water damage"
          />
        </div>
        <div>
          <div className={styles.fieldLabel}>DESCRIBE WHAT HAPPENED</div>
          <textarea
            className={styles.textarea}
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Yesterday I noticed water coming through the kitchen ceiling. The upstairs apartment apparently had a dishwasher leak. I have attached photos and the repair company's initial report."
            rows={4}
          />
        </div>
        <div>
          <div className={styles.fieldLabel}>ATTACHMENTS (SIMULATED)</div>
          <div className={styles.attachments}>
            {TRY_SIM_ATTACHMENTS.map((a) => (
              <div key={a} className={styles.attachmentChip}>
                {a}
              </div>
            ))}
          </div>
        </div>
      </div>
      <button type="button" className={styles.submitButton} onClick={onSubmit}>
        SUBMIT CLAIM →
      </button>
    </div>
  );
}
