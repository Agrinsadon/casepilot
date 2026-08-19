"use client";

import { useMemo } from "react";
import { MAX_FOLLOWUP_ROUNDS, useCasePilotDemo } from "@/hooks/useCasePilotDemo";
import { ATTACHMENTS, EVIDENCE, getSectionStatus, INVESTIGATION_ROWS, SECTION_TONE, TRACE_STEPS } from "@/data/casePilotContent";
import {
  buildCustomAttachments,
  buildCustomEvidence,
  buildCustomInvestigationRows,
  buildCustomTraceSteps,
  getRecommendationCopy,
} from "@/lib/customCaseAdapters";
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
import { FollowUpPanel } from "./sections/FollowUpPanel/FollowUpPanel";
import { NewInfoArrived } from "./sections/NewInfoArrived/NewInfoArrived";
import { ConfidenceChange } from "./sections/ConfidenceChange/ConfidenceChange";
import { Recommendation } from "./sections/Recommendation/Recommendation";
import { SourcePanel } from "./SourcePanel/SourcePanel";
import { WhyDecision } from "./sections/WhyDecision/WhyDecision";
import { FinalScreen } from "./sections/FinalScreen/FinalScreen";
import { ArchitectureOverlay } from "./ArchitectureOverlay/ArchitectureOverlay";

export function CasePilotDemo() {
  const { state, hasHydrated, scrollPct, registerSection, actions } = useCasePilotDemo();

  const tone = SECTION_TONE[state.activeKey];
  const navFg = tone === "ink" ? "var(--color-paper)" : "var(--color-ink)";
  const status = useMemo(() => getSectionStatus(state.activeKey, navFg), [state.activeKey, navFg]);

  if (!hasHydrated) {
    return <div className={styles.root} />;
  }

  const isApp = state.phase === "app";
  const isTryForm = state.phase === "tryForm";
  const showLanding = !state.archOpen && (state.phase === "landing" || state.phase === "transitioning");
  const overlayVisible = state.phase === "transitioning" || state.overlayStage > 0;

  const custom = state.custom;
  const roundsExhausted = custom ? custom.followUpRounds >= MAX_FOLLOWUP_ROUNDS : false;
  const hasMissingInfo = custom ? custom.assessment.missing_information.length > 0 && !roundsExhausted : false;
  const customResolved = custom ? !hasMissingInfo : true;
  const followUpHappened = custom ? custom.priorConfidence !== null : false;

  const planRevealed = Boolean(state.revealed.plan) || state.planExecuted || state.caseOpened;
  const evidenceRevealed = Boolean(state.revealed.recommendation) || state.confidenceDone;
  const traceRevealed = Boolean(state.revealed.trace) || Boolean(state.revealed.recommendation);

  const attachments = custom ? buildCustomAttachments(custom.context) : ATTACHMENTS;
  const investigationRows = custom ? buildCustomInvestigationRows(custom.context, custom.assessment) : INVESTIGATION_ROWS;
  const evidence = custom ? buildCustomEvidence(custom.assessment) : EVIDENCE;
  const traceSteps = custom
    ? buildCustomTraceSteps(custom.context, custom.assessment, custom.priorConfidence)
    : TRACE_STEPS;
  const recommendationCopy = custom ? getRecommendationCopy(custom.assessment.recommendation) : null;

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
          analyzing={state.analyzing}
          error={state.analysisError}
        />
      )}

      {isApp && (
        <div>
          <CaseArrives
            sectionRef={registerSection("case")}
            customerName={state.customerName}
            caseIncidentType={state.caseIncidentType}
            customerMessage={state.customerMessage}
            attachments={attachments}
            caseOpened={state.caseOpened}
            onInvestigate={actions.onInvestigate}
          />

          <AgentPlan sectionRef={registerSection("plan")} revealed={planRevealed} onExecutePlan={actions.onExecutePlan} />

          <Investigation
            sectionRef={registerSection("investigation")}
            rows={investigationRows}
            revealedCount={state.investigationRevealed}
          />

          {(!custom || hasMissingInfo) && (
            <MissingInfo
              sectionRef={registerSection("missing")}
              revealed={Boolean(state.revealed.missing)}
              bodyText={custom ? custom.assessment.reasoning : undefined}
              confidenceValue={custom ? custom.assessment.confidence : undefined}
            />
          )}

          {(!custom || hasMissingInfo) && (
            <NextAction
              sectionRef={registerSection("next")}
              revealed={Boolean(state.revealed.next)}
              onReviewRequest={actions.onReviewRequest}
              requiredTitle={custom ? custom.assessment.missing_information[0]?.question : undefined}
              requiredDesc={custom ? custom.assessment.missing_information[0]?.reason : undefined}
              nextActionTitle={custom ? "Answer the question below" : undefined}
              nextActionDesc={custom ? "so the agent can re-assess your case" : undefined}
              reviewLabel={custom ? "ANSWER NOW →" : undefined}
            />
          )}

          {custom ? (
            hasMissingInfo && (
              <FollowUpPanel
                sectionRef={registerSection("review")}
                revealed={Boolean(state.revealed.review)}
                questions={custom.assessment.missing_information}
                answer={custom.followUpAnswer}
                onAnswerChange={actions.onFollowUpAnswerChange}
                status={custom.followUpStatus}
                onSubmit={actions.submitFollowUp}
                error={custom.followUpError}
              />
            )
          ) : (
            <HumanReview
              sectionRef={registerSection("review")}
              revealed={Boolean(state.revealed.review)}
              approvalStatus={state.approvalStatus}
              onApprove={actions.handleApprove}
            />
          )}

          {!custom && <NewInfoArrived sectionRef={registerSection("arrived")} responseArrived={state.responseArrived} />}

          {(!custom || (customResolved && followUpHappened)) && (
            <ConfidenceChange
              sectionRef={registerSection("confidence")}
              confidenceValue={custom ? custom.assessment.confidence : state.confidenceValue}
              beforeValue={custom ? (custom.priorConfidence ?? 0) : undefined}
              afterLabel={custom ? "AFTER · YOU ANSWERED" : undefined}
            />
          )}

          {(!custom || customResolved) && (
            <Recommendation
              sectionRef={registerSection("recommendation")}
              revealed={evidenceRevealed}
              sourcePanelOpen={Boolean(state.activeSource)}
              onEvidenceClick={actions.openSource}
              onWhyDecision={actions.onWhyDecision}
              evidence={evidence}
              heading={recommendationCopy?.heading}
              headingColor={recommendationCopy?.color}
              estimatedCompensation={custom ? (custom.assessment.estimated_compensation ?? "Not yet estimated") : undefined}
              confidenceValue={custom ? custom.assessment.confidence : undefined}
              confidenceColor={recommendationCopy?.color}
            />
          )}

          <SourcePanel item={state.activeSource} onClose={actions.closeSource} />

          {(!custom || customResolved) && (
            <WhyDecision sectionRef={registerSection("trace")} revealed={traceRevealed} steps={traceSteps} />
          )}

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
