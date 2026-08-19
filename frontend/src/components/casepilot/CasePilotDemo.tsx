"use client";

import { useMemo } from "react";
import { useCasePilotDemo } from "@/hooks/useCasePilotDemo";
import { ATTACHMENTS, getSectionStatus, SECTION_TONE } from "@/data/casePilotContent";
import styles from "./CasePilotDemo.module.css";

import { Nav } from "./Nav/Nav";
import { MobileMenu } from "./MobileMenu/MobileMenu";
import { ScrollProgressBar } from "./ScrollProgressBar/ScrollProgressBar";
import { TransitionOverlay } from "./TransitionOverlay/TransitionOverlay";
import { Landing } from "./Landing/Landing";
import { TryForm } from "./TryForm/TryForm";
import { CaseArrives } from "./sections/CaseArrives/CaseArrives";
import { AgentPlan } from "./sections/AgentPlan/AgentPlan";
import { Investigation } from "./sections/Investigation/Investigation";
import { MissingInfo } from "./sections/MissingInfo/MissingInfo";
import { NextAction } from "./sections/NextAction/NextAction";
import { HumanReview } from "./sections/HumanReview/HumanReview";
import { NewInfoArrived } from "./sections/NewInfoArrived/NewInfoArrived";
import { ConfidenceChange } from "./sections/ConfidenceChange/ConfidenceChange";
import { Recommendation } from "./sections/Recommendation/Recommendation";
import { SourcePanel } from "./SourcePanel/SourcePanel";
import { WhyDecision } from "./sections/WhyDecision/WhyDecision";
import { FinalScreen } from "./sections/FinalScreen/FinalScreen";
import { ArchitectureOverlay } from "./ArchitectureOverlay/ArchitectureOverlay";

export function CasePilotDemo() {
  const { state, scrollPct, registerSection, actions } = useCasePilotDemo();

  const isApp = state.phase === "app";
  const isTryForm = state.phase === "tryForm";
  const showLanding = !state.archOpen && (state.phase === "landing" || state.phase === "transitioning");
  const overlayVisible = state.phase === "transitioning" || state.overlayStage > 0;

  const tone = SECTION_TONE[state.activeKey];
  const navFg = tone === "ink" ? "var(--color-paper)" : "var(--color-ink)";
  const status = useMemo(() => getSectionStatus(state.activeKey, navFg), [state.activeKey, navFg]);

  const planRevealed = Boolean(state.revealed.plan) || state.planExecuted || state.caseOpened;
  const evidenceRevealed = Boolean(state.revealed.recommendation) || state.confidenceDone;
  const traceRevealed = Boolean(state.revealed.trace) || Boolean(state.revealed.recommendation);

  return (
    <div className={styles.root}>
      {!state.archOpen && (
        <>
          <Nav
            tone={tone}
            isApp={isApp}
            status={status}
            mobileMenuOpen={state.mobileMenuOpen}
            onToggleMobileMenu={actions.toggleMobileMenu}
            onOpenArch={actions.openArch}
            onOpenTry={actions.openTry}
          />
          {isApp && <ScrollProgressBar percent={scrollPct} />}
          <MobileMenu
            open={state.mobileMenuOpen}
            tone={tone}
            isApp={isApp}
            status={status}
            onOpenArch={actions.openArch}
            onRunCase={() => {
              actions.closeMobileMenu();
              actions.runCase();
            }}
            onOpenTry={() => {
              actions.closeMobileMenu();
              actions.openTry();
            }}
          />
        </>
      )}

      {overlayVisible && <TransitionOverlay stage={state.overlayStage} />}

      {showLanding && (
        <Landing
          phase={state.phase === "transitioning" ? "transitioning" : "landing"}
          onRunCase={actions.runCase}
          onOpenTry={actions.openTry}
        />
      )}

      {isTryForm && (
        <TryForm
          name={state.formName}
          incident={state.formIncident}
          message={state.formMessage}
          onNameChange={actions.onFormNameChange}
          onIncidentChange={actions.onFormIncidentChange}
          onMessageChange={actions.onFormMessageChange}
          onSubmit={actions.submitTry}
          onBack={actions.resetAll}
        />
      )}

      {isApp && (
        <div>
          <CaseArrives
            sectionRef={registerSection("case")}
            customerName={state.customerName}
            caseIncidentType={state.caseIncidentType}
            customerMessage={state.customerMessage}
            attachments={ATTACHMENTS}
            caseOpened={state.caseOpened}
            onInvestigate={actions.onInvestigate}
          />

          <AgentPlan sectionRef={registerSection("plan")} revealed={planRevealed} onExecutePlan={actions.onExecutePlan} />

          <Investigation sectionRef={registerSection("investigation")} revealedCount={state.investigationRevealed} />

          <MissingInfo sectionRef={registerSection("missing")} revealed={Boolean(state.revealed.missing)} />

          <NextAction
            sectionRef={registerSection("next")}
            revealed={Boolean(state.revealed.next)}
            onReviewRequest={actions.onReviewRequest}
          />

          <HumanReview
            sectionRef={registerSection("review")}
            revealed={Boolean(state.revealed.review)}
            approvalStatus={state.approvalStatus}
            onApprove={actions.handleApprove}
          />

          <NewInfoArrived sectionRef={registerSection("arrived")} responseArrived={state.responseArrived} />

          <ConfidenceChange sectionRef={registerSection("confidence")} confidenceValue={state.confidenceValue} />

          <Recommendation
            sectionRef={registerSection("recommendation")}
            revealed={evidenceRevealed}
            sourcePanelOpen={Boolean(state.activeSource)}
            onEvidenceClick={actions.openSource}
            onWhyDecision={actions.onWhyDecision}
          />

          <SourcePanel item={state.activeSource} onClose={actions.closeSource} />

          <WhyDecision sectionRef={registerSection("trace")} revealed={traceRevealed} />

          <FinalScreen
            sectionRef={registerSection("final")}
            revealed={Boolean(state.revealed.final)}
            onRunAgain={actions.resetAll}
            onOpenArch={actions.openArch}
            onOpenTry={actions.openTry}
          />
        </div>
      )}

      {state.archOpen && <ArchitectureOverlay onClose={actions.closeArch} />}
    </div>
  );
}
