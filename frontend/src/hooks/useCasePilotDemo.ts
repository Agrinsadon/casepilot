"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useSectionObserver } from "@/hooks/useSectionObserver";
import {
  DEFAULT_CUSTOMER_MESSAGE,
  DEFAULT_CUSTOMER_NAME,
  DEFAULT_INCIDENT_TYPE,
  INVESTIGATION_ROWS,
} from "@/data/casePilotContent";
import type { ApprovalStatus, EvidenceItem, Phase, SectionKey } from "@/types/casepilot";

const REVEAL_KEYS: SectionKey[] = ["plan", "missing", "next", "review", "recommendation", "trace", "final"];

const STORAGE_KEY = "casepilot-demo-state-v1";

interface CasePilotState {
  phase: Phase;
  overlayStage: 0 | 1 | 2 | 3;
  caseOpened: boolean;
  planExecuted: boolean;
  investigationRevealed: number;
  confidenceValue: number;
  confidenceDone: boolean;
  approvalStatus: ApprovalStatus;
  responseArrived: boolean;
  activeSource: EvidenceItem | null;
  archOpen: boolean;
  activeKey: SectionKey | "landing";
  mobileMenuOpen: boolean;
  formName: string;
  formIncident: string;
  formMessage: string;
  customerName: string;
  customerMessage: string;
  caseIncidentType: string;
  revealed: Partial<Record<SectionKey, boolean>>;
}

const initialState: CasePilotState = {
  phase: "landing",
  overlayStage: 0,
  caseOpened: false,
  planExecuted: false,
  investigationRevealed: 0,
  confidenceValue: 78,
  confidenceDone: false,
  approvalStatus: "draft",
  responseArrived: false,
  activeSource: null,
  archOpen: false,
  activeKey: "landing",
  mobileMenuOpen: false,
  formName: "",
  formIncident: "",
  formMessage: "",
  customerName: DEFAULT_CUSTOMER_NAME,
  customerMessage: DEFAULT_CUSTOMER_MESSAGE,
  caseIncidentType: DEFAULT_INCIDENT_TYPE,
  revealed: {},
};

function sanitizeRestoredState(saved: Partial<CasePilotState>): CasePilotState {
  const merged: CasePilotState = { ...initialState, ...saved };

  // Never resume mid-flight, purely transient UI states.
  if (merged.phase === "transitioning") merged.phase = "app";
  merged.overlayStage = 0;
  merged.mobileMenuOpen = false;
  merged.activeSource = null;

  // Replay staggered reveals that were interrupted instead of freezing them mid-animation.
  if (merged.investigationRevealed < INVESTIGATION_ROWS.length) merged.investigationRevealed = 0;
  if (!merged.confidenceDone) merged.confidenceValue = 78;
  if (merged.approvalStatus === "sending") merged.approvalStatus = "draft";

  return merged;
}

export function useCasePilotDemo() {
  const [state, setState] = useState<CasePilotState>(initialState);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Restore progress after a refresh (client-only, runs once after the initial SSR-safe render).
  // `hasHydrated` is real state (not a ref) so the save effect below only starts writing once a
  // render has actually committed the restored value — otherwise, under React StrictMode's dev-only
  // double-invocation of effects, the save effect can fire with the pre-restore `initialState` and
  // permanently clobber the saved progress before the restore ever takes effect.
  const [hasHydrated, setHasHydrated] = useState(false);
  const restoreAttemptedRef = useRef(false);

  useEffect(() => {
    if (restoreAttemptedRef.current) {
      setHasHydrated(true);
      return;
    }
    restoreAttemptedRef.current = true;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<CasePilotState>;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState(sanitizeRestoredState(saved));
      }
    } catch {
      // Corrupt or inaccessible storage — fall back to the default landing state.
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable (private browsing, quota) — progress just won't persist.
    }
  }, [state, hasHydrated]);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const addTimer = useCallback((fn: () => void, delay: number) => {
    timersRef.current.push(setTimeout(fn, delay));
  }, []);
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);
  useEffect(() => () => clearTimers(), [clearTimers]);

  const scrollPct = useScrollProgress();

  const playInvestigationRows = useCallback(() => {
    for (let i = 1; i <= INVESTIGATION_ROWS.length; i++) {
      addTimer(() => setState((prev) => ({ ...prev, investigationRevealed: i })), i * 500);
    }
  }, [addTimer]);

  const playConfidenceCounter = useCallback(() => {
    const start = performance.now();
    const duration = 1600;
    const from = 78;
    const to = 94;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(from + (to - from) * eased);
      setState((prev) => ({ ...prev, confidenceValue: value, confidenceDone: p >= 1 }));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  const onSectionEnter = useCallback(
    (key: SectionKey) => {
      setState((prev) => ({
        ...prev,
        activeKey: key,
        revealed:
          REVEAL_KEYS.includes(key) && !prev.revealed[key] ? { ...prev.revealed, [key]: true } : prev.revealed,
      }));

      if (key === "investigation" && stateRef.current.investigationRevealed === 0) {
        playInvestigationRows();
      }
      if (key === "confidence" && !stateRef.current.confidenceDone && stateRef.current.confidenceValue === 78) {
        playConfidenceCounter();
      }
    },
    [playInvestigationRows, playConfidenceCounter]
  );

  const { registerSection, scrollToKey } = useSectionObserver<SectionKey>(onSectionEnter);

  const runCase = useCallback(() => {
    if (stateRef.current.phase === "transitioning") return;
    setState((prev) => ({ ...prev, phase: "transitioning", overlayStage: 1 }));
    addTimer(() => setState((prev) => ({ ...prev, overlayStage: 2 })), 180);
    addTimer(() => setState((prev) => ({ ...prev, overlayStage: 3 })), 480);
    addTimer(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
      setState((prev) => ({ ...prev, phase: "app" }));
    }, 760);
    addTimer(() => setState((prev) => ({ ...prev, overlayStage: 0 })), 980);
  }, [addTimer]);

  const openTry = useCallback(() => {
    clearTimers();
    window.scrollTo({ top: 0, behavior: "auto" });
    setState({ ...initialState, phase: "tryForm" });
  }, [clearTimers]);

  const submitTry = useCallback(() => {
    setState((prev) => ({
      ...prev,
      customerName: prev.formName.trim() || DEFAULT_CUSTOMER_NAME,
      caseIncidentType: prev.formIncident.trim() || DEFAULT_INCIDENT_TYPE,
      customerMessage: prev.formMessage.trim() || DEFAULT_CUSTOMER_MESSAGE,
    }));
    runCase();
  }, [runCase]);

  const resetAll = useCallback(() => {
    clearTimers();
    window.scrollTo({ top: 0, behavior: "auto" });
    setState(initialState);
  }, [clearTimers]);

  const handleApprove = useCallback(() => {
    if (stateRef.current.approvalStatus !== "draft") return;
    setState((prev) => ({ ...prev, approvalStatus: "sending" }));
    addTimer(() => setState((prev) => ({ ...prev, approvalStatus: "sent" })), 650);
    addTimer(() => scrollToKey("arrived"), 1150);
    addTimer(() => setState((prev) => ({ ...prev, responseArrived: true })), 1550);
  }, [addTimer, scrollToKey]);

  const openSource = useCallback((item: EvidenceItem) => setState((prev) => ({ ...prev, activeSource: item })), []);
  const closeSource = useCallback(() => setState((prev) => ({ ...prev, activeSource: null })), []);

  const onInvestigate = useCallback(() => {
    setState((prev) => ({ ...prev, caseOpened: true }));
    scrollToKey("plan");
  }, [scrollToKey]);

  const onExecutePlan = useCallback(() => {
    setState((prev) => ({ ...prev, planExecuted: true }));
    scrollToKey("investigation");
  }, [scrollToKey]);

  const onReviewRequest = useCallback(() => scrollToKey("review"), [scrollToKey]);
  const onWhyDecision = useCallback(() => scrollToKey("trace"), [scrollToKey]);

  const openArch = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setState((prev) => ({ ...prev, archOpen: true, mobileMenuOpen: false }));
  }, []);
  const closeArch = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setState((prev) => ({ ...prev, archOpen: false }));
  }, []);
  const toggleMobileMenu = useCallback(
    () => setState((prev) => ({ ...prev, mobileMenuOpen: !prev.mobileMenuOpen })),
    []
  );
  const closeMobileMenu = useCallback(() => setState((prev) => ({ ...prev, mobileMenuOpen: false })), []);

  const onFormNameChange = useCallback(
    (value: string) => setState((prev) => ({ ...prev, formName: value })),
    []
  );
  const onFormIncidentChange = useCallback(
    (value: string) => setState((prev) => ({ ...prev, formIncident: value })),
    []
  );
  const onFormMessageChange = useCallback(
    (value: string) => setState((prev) => ({ ...prev, formMessage: value })),
    []
  );

  return {
    state,
    scrollPct,
    registerSection,
    scrollToKey,
    actions: {
      runCase,
      openTry,
      submitTry,
      resetAll,
      handleApprove,
      openSource,
      closeSource,
      onInvestigate,
      onExecutePlan,
      onReviewRequest,
      onWhyDecision,
      openArch,
      closeArch,
      toggleMobileMenu,
      closeMobileMenu,
      onFormNameChange,
      onFormIncidentChange,
      onFormMessageChange,
    },
  };
}

export type UseCasePilotDemoReturn = ReturnType<typeof useCasePilotDemo>;
