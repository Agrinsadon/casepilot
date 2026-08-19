"use client";

import { CASE_ID } from "@/data/casePilotContent";
import type { SectionStatus, Tone } from "@/types/casepilot";
import { cx } from "@/utils/cx";
import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
  open: boolean;
  tone: Tone;
  isApp: boolean;
  status: SectionStatus | null;
  onOpenArch: () => void;
  onRunCase: () => void;
  onOpenTry: () => void;
}

export function MobileMenu({ open, tone, isApp, status, onOpenArch, onRunCase, onOpenTry }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className={cx(styles.menu, tone === "ink" ? styles.ink : styles.paper)}>
      {isApp ? (
        <>
          <div className={styles.caseLine}>
            {CASE_ID} · <span style={{ color: status?.color }}>{status?.label}</span>
          </div>
          <button type="button" className={styles.menuLink} onClick={onOpenArch}>
            ARCHITECTURE
          </button>
          <button type="button" className={styles.menuLink} onClick={onOpenTry}>
            TRY CASEPILOT →
          </button>
        </>
      ) : (
        <>
          <button type="button" className={styles.menuLink} onClick={onRunCase}>
            RUN THE CASE →
          </button>
          <button type="button" className={styles.menuLink} onClick={onOpenTry}>
            TRY CASEPILOT →
          </button>
        </>
      )}
    </div>
  );
}
