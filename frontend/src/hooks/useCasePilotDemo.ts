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
import { followUp as apiFollowUp, investigate as apiInvestigate } from "@/lib/api";
import type { ApprovalStatus, EvidenceItem, Phase, SectionKey } from "@/types/casepilot";
import type { CaseContext, CoverageAssessment } from "@/types/investigation";

const REVEAL_KEYS: SectionKey[] = ["plan", "missing", "next", "review", "recommendation", "trace", "final"];

const STORAGE_KEY = "casepilot-demo-state-v1";

type FollowUpStatus = "idle" | "sending" | "sent";

interface CustomCaseState {
  context: CaseContext;
  assessment: CoverageAssessment;
  priorConfidence: number | null;
  followUpAnswer: string;
  followUpStatus: FollowUpStatus;
  followUpError: string | null;
  followUpRounds: number;
}

export const MAX_FOLLOWUP_ROUNDS = 4;

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
  analyzing: boolean;
  analysisError: string | null;
  custom: CustomCaseState | null;
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
  analyzing: false,
  analysisError: null,
  custom: null,
};

function sanitizeRestoredState(saved: Partial<CasePilotState>): CasePilotState {
  const merged: CasePilotState = { ...initialState, ...saved };

  if (merged.phase === "transitioning") merged.phase = "app";
  merged.overlayStage = 0;
  merged.mobileMenuOpen = false;
  merged.activeSource = null;

  if (merged.investigationRevealed < INVESTIGATION_ROWS.length) merged.investigationRevealed = 0;
  if (!merged.confidenceDone) merged.confidenceValue = 78;
  if (merged.approvalStatus === "sending") merged.approvalStatus = "draft";

  merged.analyzing = false;
  if (merged.custom) {
    merged.custom = { ...merged.custom, followUpRounds: merged.custom.followUpRounds ?? 0 };
    if (merged.custom.followUpStatus === "sending") {
      merged.custom = { ...merged.custom, followUpStatus: "idle" };
    }
  }

  return merged;
}

export function useCasePilotDemo() {
  const [state, setState] = useState<CasePilotState>(initialState);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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
        setState(sanitizeRestoredState(saved));
      }
    } catch {} finally {
      setHasHydrated(true);
    }
  }, []);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {}
    }, 300);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
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

  const submitTry = useCallback(
    async (policyFile: File | null, images: File[]) => {
      if (stateRef.current.analyzing) return;
      const { formName, formIncident, formMessage } = stateRef.current;
      const description = formMessage.trim();
      if (!description) return;

      setState((prev) => ({ ...prev, analyzing: true, analysisError: null }));

      try {
        const result = await apiInvestigate({ description, policyFile, images });
        setState((prev) => ({
          ...prev,
          analyzing: false,
          customerName: formName.trim() || "You",
          caseIncidentType: formIncident.trim() || result.assessment.incident_type,
          customerMessage: description,
          custom: {
            context: result.context,
            assessment: result.assessment,
            priorConfidence: null,
            followUpAnswer: "",
            followUpStatus: "idle",
            followUpError: null,
            followUpRounds: 0,
          },
        }));
        runCase();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          analyzing: false,
          analysisError: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        }));
      }
    },
    [runCase]
  );

  const onFollowUpAnswerChange = useCallback(
    (value: string) =>
      setState((prev) => (prev.custom ? { ...prev, custom: { ...prev.custom, followUpAnswer: value } } : prev)),
    []
  );

  const submitFollowUp = useCallback(
    async (policyFile: File | null, images: File[]) => {
      const custom = stateRef.current.custom;
      if (!custom || custom.followUpStatus !== "idle") return;
      const answer = custom.followUpAnswer.trim();
      if (!answer) return;

      setState((prev) =>
        prev.custom ? { ...prev, custom: { ...prev.custom, followUpStatus: "sending", followUpError: null } } : prev
      );

      try {
        const result = await apiFollowUp({
          context: custom.context,
          priorAssessment: custom.assessment,
          answer,
          policyFile,
          images,
        });
        const rounds = custom.followUpRounds + 1;
        const stillMissing = result.assessment.missing_information.length > 0 && rounds < MAX_FOLLOWUP_ROUNDS;
        setState((prev) =>
          prev.custom
            ? {
                ...prev,
                custom: {
                  context: result.context,
                  assessment: result.assessment,
                  priorConfidence: prev.custom.priorConfidence ?? custom.assessment.confidence,
                  followUpAnswer: "",
                  followUpStatus: stillMissing ? "idle" : "sent",
                  followUpError: null,
                  followUpRounds: rounds,
                },
              }
            : prev
        );
        if (!stillMissing) addTimer(() => scrollToKey("confidence"), 400);
      } catch (err) {
        setState((prev) =>
          prev.custom
            ? {
                ...prev,
                custom: {
                  ...prev.custom,
                  followUpStatus: "idle",
                  followUpError: err instanceof Error ? err.message : "Something went wrong. Please try again.",
                },
              }
            : prev
        );
      }
    },
    [addTimer, scrollToKey]
  );

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
    hasHydrated,
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
      onFollowUpAnswerChange,
      submitFollowUp,
    },
  };
}

export type UseCasePilotDemoReturn = ReturnType<typeof useCasePilotDemo>;
