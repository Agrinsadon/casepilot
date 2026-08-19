"use client";

import { useRef, useState } from "react";
import styles from "./TryForm.module.css";

interface TryFormProps {
  name: string;
  incident: string;
  message: string;
  onNameChange: (value: string) => void;
  onIncidentChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmit: (policyFile: File | null, images: File[]) => void;
  onBack: () => void;
  analyzing: boolean;
  error: string | null;
}

const MAX_IMAGES = 4;

export function TryForm({
  name,
  incident,
  message,
  onNameChange,
  onIncidentChange,
  onMessageChange,
  onSubmit,
  onBack,
  analyzing,
  error,
}: TryFormProps) {
  const [policyFile, setPolicyFile] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const policyInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const handleImagesChange = (fileList: FileList | null) => {
    if (!fileList) return;
    setImages((prev) => [...prev, ...Array.from(fileList)].slice(0, MAX_IMAGES));
  };

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

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
            placeholder="Describe your situation in your own words — the AI will read this."
            rows={4}
          />
        </div>
        <div>
          <div className={styles.fieldLabel}>YOUR POLICY DOCUMENT (OPTIONAL)</div>
          <div className={styles.attachments}>
            <input
              ref={policyInputRef}
              type="file"
              accept=".pdf,.txt,image/*"
              className={styles.hiddenInput}
              onChange={(e) => setPolicyFile(e.target.files?.[0] ?? null)}
            />
            <button type="button" className={styles.uploadButton} onClick={() => policyInputRef.current?.click()}>
              {policyFile ? "REPLACE FILE" : "UPLOAD POLICY →"}
            </button>
            {policyFile && (
              <div className={styles.attachmentChip}>
                {policyFile.name}
                <button
                  type="button"
                  className={styles.chipRemove}
                  onClick={() => {
                    setPolicyFile(null);
                    if (policyInputRef.current) policyInputRef.current.value = "";
                  }}
                  aria-label="Remove policy document"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className={styles.fieldLabel}>DAMAGE PHOTOS (OPTIONAL, UP TO {MAX_IMAGES})</div>
          <div className={styles.attachments}>
            <input
              ref={imagesInputRef}
              type="file"
              accept="image/*"
              multiple
              className={styles.hiddenInput}
              onChange={(e) => {
                handleImagesChange(e.target.files);
                if (imagesInputRef.current) imagesInputRef.current.value = "";
              }}
            />
            {images.length < MAX_IMAGES && (
              <button type="button" className={styles.uploadButton} onClick={() => imagesInputRef.current?.click()}>
                ADD PHOTO →
              </button>
            )}
            {images.map((file, i) => (
              <div key={`${file.name}-${i}`} className={styles.attachmentChip}>
                {file.name}
                <button
                  type="button"
                  className={styles.chipRemove}
                  onClick={() => removeImage(i)}
                  aria-label={`Remove ${file.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <button
        type="button"
        className={styles.submitButton}
        onClick={() => onSubmit(policyFile, images)}
        disabled={analyzing || !message.trim()}
      >
        {analyzing ? "ANALYZING…" : "SUBMIT CLAIM →"}
      </button>
    </div>
  );
}
