"use client";

import { useRef, useState } from "react";
import type { MissingInformationItem } from "@/types/investigation";
import { cx } from "@/utils/cx";
import shared from "../shared/sectionShared.module.css";
import styles from "./FollowUpPanel.module.css";

type FollowUpStatus = "idle" | "sending" | "sent";

interface FollowUpPanelProps {
  sectionRef: (el: HTMLDivElement | null) => void;
  revealed: boolean;
  questions: MissingInformationItem[];
  answer: string;
  onAnswerChange: (value: string) => void;
  status: FollowUpStatus;
  onSubmit: (policyFile: File | null, images: File[]) => void;
  error: string | null;
}

const SEND_LABEL: Record<FollowUpStatus, string> = {
  idle: "SEND ANSWER →",
  sending: "ANALYZING…",
  sent: "SENT ✓",
};

const MAX_IMAGES = 4;

export function FollowUpPanel({
  sectionRef,
  revealed,
  questions,
  answer,
  onAnswerChange,
  status,
  onSubmit,
  error,
}: FollowUpPanelProps) {
  const sent = status === "sent";
  const [policyFile, setPolicyFile] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const policyInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = () => {
    onSubmit(policyFile, images);
    setPolicyFile(null);
    setImages([]);
  };

  return (
    <div
      ref={sectionRef}
      data-key="review"
      className={cx(shared.section, shared.ink, shared.fadeIn, styles.section)}
      style={{ opacity: revealed ? 1 : 0 }}
    >
      <div className={styles.card}>
        <div className={styles.tag}>AI NEEDS ONE MORE DETAIL</div>
        <div className={styles.questionBlock}>
          {questions.map((q, i) => (
            <div className={styles.questionRow} key={`${q.question}-${i}`}>
              <div className={styles.questionText}>{q.question}</div>
              <div className={styles.questionReason}>{q.reason}</div>
            </div>
          ))}
        </div>
        <div className={styles.answerLabel}>YOUR ANSWER</div>
        <textarea
          className={styles.answerInput}
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Type your answer here…"
          rows={3}
          disabled={status !== "idle"}
        />
        <div className={styles.attachLabel}>ATTACH A FILE (OPTIONAL)</div>
        <div className={styles.attachments}>
          <input
            ref={policyInputRef}
            type="file"
            accept=".pdf,.txt,image/*"
            className={styles.hiddenInput}
            onChange={(e) => setPolicyFile(e.target.files?.[0] ?? null)}
            disabled={status !== "idle"}
          />
          <button
            type="button"
            className={styles.uploadButton}
            onClick={() => policyInputRef.current?.click()}
            disabled={status !== "idle"}
          >
            {policyFile ? "REPLACE POLICY" : "ADD POLICY →"}
          </button>
          {policyFile && (
            <div className={styles.chip}>
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

          <input
            ref={imagesInputRef}
            type="file"
            accept="image/*"
            multiple
            className={styles.hiddenInput}
            onChange={(e) => {
              const files = e.target.files;
              if (files) setImages((prev) => [...prev, ...Array.from(files)].slice(0, MAX_IMAGES));
              if (imagesInputRef.current) imagesInputRef.current.value = "";
            }}
            disabled={status !== "idle"}
          />
          {images.length < MAX_IMAGES && (
            <button
              type="button"
              className={styles.uploadButton}
              onClick={() => imagesInputRef.current?.click()}
              disabled={status !== "idle"}
            >
              ADD PHOTO →
            </button>
          )}
          {images.map((file, i) => (
            <div key={`${file.name}-${i}`} className={styles.chip}>
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
        {error && <div className={styles.error}>{error}</div>}
        <button
          type="button"
          className={styles.sendButton}
          disabled={status !== "idle" || !answer.trim()}
          onClick={handleSubmit}
          style={{
            background: sent ? "var(--color-green)" : "var(--color-lime)",
            color: sent ? "var(--color-paper)" : "var(--color-ink)",
          }}
        >
          {SEND_LABEL[status]}
        </button>
      </div>
    </div>
  );
}
