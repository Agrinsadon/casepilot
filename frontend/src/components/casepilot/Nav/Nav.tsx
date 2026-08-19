"use client";

import { CASE_ID } from "@/data/casePilotContent";
import type { SectionStatus, Tone } from "@/types/casepilot";
import { cx } from "@/utils/cx";
import styles from "./Nav.module.css";

interface NavProps {
  tone: Tone;
  isApp: boolean;
  status: SectionStatus | null;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onOpenArch: () => void;
  onOpenTry: () => void;
}

export function Nav({ tone, isApp, status, mobileMenuOpen, onToggleMobileMenu, onOpenArch, onOpenTry }: NavProps) {
  return (
    <div className={cx(styles.nav, tone === "ink" ? styles.ink : styles.paper)}>
      <div className={styles.logo}>CASEPILOT</div>

      {isApp && status && (
        <div className={styles.status}>
          <span className={styles.caseId}>{CASE_ID}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.statusLabel} style={{ color: status.color }}>
            {status.label}
          </span>
        </div>
      )}

      <div className={styles.links}>
        {isApp && (
          <>
            <button type="button" className={styles.linkItem} onClick={onOpenArch}>
              ARCHITECTURE
            </button>
            <button type="button" className={styles.linkItem} onClick={onOpenTry}>
              TRY CASEPILOT →
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        className={styles.burger}
        onClick={onToggleMobileMenu}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        <span
          className={styles.burgerLine}
          style={{ transform: mobileMenuOpen ? "translateY(4px) rotate(45deg)" : "none" }}
        />
        <span
          className={styles.burgerLine}
          style={{ transform: mobileMenuOpen ? "translateY(-4px) rotate(-45deg)" : "none" }}
        />
      </button>
    </div>
  );
}
