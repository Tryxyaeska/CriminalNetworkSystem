import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  FileText, 
  Cpu, 
  GitMerge, 
  Network, 
  Clock, 
  AlertTriangle, 
  HelpCircle, 
  ShieldAlert, 
  Target, 
  CheckCircle2, 
  ExternalLink, 
  BookOpen, 
  FolderPlus, 
  Play, 
  RotateCcw, 
  CreditCard, 
  Bot, 
  ShieldCheck, 
  Search, 
  Sliders, 
  Move 
} from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    step: 1,
    title: "1. Getting Started & Case Management",
    category: "SYSTEM WORKFLOW",
    icon: FolderPlus,
    badge: "FRESH WORKSPACE",
    badgeColor: "var(--neon-green)",
    headline: "Start with an empty workspace or load the sample syndicate case.",
    description: "CRIMENET AI boots in a clean 'Workspace Ready' state (0 entities/0 documents). You have two intuitive ways to begin an investigation:",
    bulletPoints: [
      "Create Independent Case (+ New Case): Set a custom Case Name, Custom ID, Objective, and paste your first FIR or incident report.",
      "Load Sample Case (Operation ShadowNet): Instantly seed a 16-node cross-border syndicate scenario with FIRs, Hawala bank statements, and phone logs.",
      "Reset Anytime: Click the 'Reset' button in the top navbar to wipe graph memory and start another investigation from scratch."
    ],
    tip: "Tip: Use '+ Create Custom Case Title' on the dashboard to start investigating your own real-world cases.",
    targetTab: "dashboard",
    actionPrompt: "Go to Case Overview →"
  },
  {
    step: 2,
    title: "2. Case Overview & Intelligence Dashboard",
    category: "INVESTIGATE",
    icon: Sparkles,
    badge: "EXECUTIVE BRIEF",
    badgeColor: "var(--neon-amber)",
    headline: "High-level syndicate topology, risk indicators, and ranked leads.",
    description: "The dashboard provides an instant executive summary of the criminal enterprise:",
    bulletPoints: [
      "Live Metric Counters: Track evidence documents indexed, resolved suspects, multi-modal relationships, and active AML alerts.",
      "AI Executive Brief: Auto-summarizes syndicate hubs, high-value targets, and operational patterns.",
      "Priority Investigative Leads: Suspects ranked by multi-modal network centrality (Betweenness, PageRank, Degree).",
      "Recommended Next Steps: Priority legal actions such as CDR subpoenas, bank freezes, or surveillance warrants."
    ],
    tip: "Click any suspect card from the Priority Leads list to instantly open their 1-hop focus network.",
    targetTab: "dashboard",
    actionPrompt: "View Dashboard View →"
  },
  {
    step: 3,
    title: "3. Network Intelligence & Graph Explorer",
    category: "INVESTIGATE",
    icon: Network,
    badge: "GRAPH ANALYTICS",
    badgeColor: "var(--neon-cyan)",
    headline: "Multi-modal interactive knowledge graph with Focus Person mode.",
    description: "Explore interconnected suspects, burner phones, vehicles, bank accounts, and locations:",
    bulletPoints: [
      "Focus Person Mode (1-Hop / 2-Hop): Focuses on an individual target to eliminate visual clutter and uncover immediate associates.",
      "Drag vs. Click Controls: Click and drag any node to reposition it cleanly on the canvas; single-click to inspect their complete dossier.",
      "Louvain Community Coloring: Color-codes separate syndicate sub-cells (Logistics, Hawala finance, Port clearance, Tech rings).",
      "Relationship Filters: Toggle Communication, Financial transfers, Co-location, or Vehicle links."
    ],
    tip: "You can zoom with the mouse wheel, pan by dragging the canvas, and use the 'Fit to Canvas' button to recenter.",
    targetTab: "network",
    actionPrompt: "Explore Network Graph →"
  },
  {
    step: 4,
    title: "4. Time Machine & Temporal Evolution",
    category: "INVESTIGATE",
    icon: Clock,
    badge: "TEMPORAL SLIDER",
    badgeColor: "var(--neon-amber)",
    headline: "Chronological reconstruction & pre-incident communication surges.",
    description: "Watch the criminal network assemble step-by-step across 6 chronological milestones:",
    bulletPoints: [
      "Interactive Step Stepper: Click individual circle pips or drag the slider to inspect the network state at any date.",
      "Automated Playback: Click Play to animate the syndicate's operational timeline from initial intercept to full syndicate activation.",
      "Activity Burst Detection: Identify when communication frequency and money laundering spikes prior to contraband movement.",
      "Document Linkage: Each milestone cites the exact underlying FIR, CDR log, or bank statement."
    ],
    tip: "Use the 'Show All' button to reset the temporal filter and view all historical interactions simultaneously.",
    targetTab: "timeline",
    actionPrompt: "Launch Time Machine →"
  },
  {
    step: 5,
    title: "5. Money Flow & Hawala Layering",
    category: "INVESTIGATE",
    icon: CreditCard,
    badge: "AML STRUCTURING",
    badgeColor: "var(--neon-green)",
    headline: "Trace layered Hawala desk payouts and corporate front companies.",
    description: "Follow the illicit money trail across cash couriers, smurfing accounts, and ultimate beneficiaries:",
    bulletPoints: [
      "5-Step Layering Chain: Visualizes cash origin (Hawala desk), smurfing deposits (sub-50k threshold), corporate pool account, and final beneficiary.",
      "Smurfing Detection: Highlights structured deposits designed to evade banking reporting thresholds.",
      "Interactive Flow Diagram: Inspect sender accounts, receiver accounts, routing amounts, and underlying FIU STR reports."
    ],
    tip: "Click 'View DOC_BANK_005' to inspect the actual bank ledger evidence supporting the money trail.",
    targetTab: "financial",
    actionPrompt: "Inspect Money Flow →"
  },
  {
    step: 6,
    title: "6. Investigative Reasoning & Hypothesis Testing",
    category: "DECISION SUPPORT",
    icon: Target,
    badge: "HYPOTHESIS MATRIX",
    badgeColor: "var(--neon-pink)",
    headline: "Test theories, simulate network disruption, and uncover missing links.",
    description: "Four powerful reasoning modules to support formal investigative strategy:",
    bulletPoints: [
      "Hypothesis Testing: Select a suspect theory to compute algorithmic confidence, supporting evidence, and counter-signals.",
      "Network Disruption Simulator: Pick a target suspect and click 'Simulate Removal' to calculate network fragmentation (% disruption).",
      "Hidden Intermediary Gaps: Detects unmonitored bridge nodes and suspected cutouts connecting isolated syndicate cells.",
      "Prioritized Next Best Actions: Actionable, court-defensible legal tasks ordered by evidentiary urgency."
    ],
    tip: "Simulate removing different suspects to find the highest-impact kingpin or logistics bottleneck.",
    targetTab: "leads",
    actionPrompt: "Open Investigative Reasoning →"
  },
  {
    step: 7,
    title: "7. Evidence Ingestion & Entity Resolution",
    category: "VERIFY",
    icon: GitMerge,
    badge: "HUMAN-IN-THE-LOOP",
    badgeColor: "var(--neon-cyan)",
    headline: "Ingest unstructured evidence and merge fragmented criminal aliases.",
    description: "Transform messy real-world police documents into clean, structured intelligence:",
    bulletPoints: [
      "Evidence Ingestion: Paste FIR texts, CDR manifests, or financial reports with automatic typed entity and relationship extraction.",
      "Entity Resolution: Uses token-sort and phonetic matching to detect when 'V. Malhotra' and 'Vicky M.' are the same person.",
      "Investigator Confirmation: Human-in-the-loop review allows investigators to merge aliases or dismiss false positives.",
      "Anomaly Center: Proactively alerts on shared burner SIMs, burst calls, and geographical co-occurrences."
    ],
    tip: "Always review pending resolution candidates to merge duplicate suspect profiles into a single canonical target.",
    targetTab: "resolution",
    actionPrompt: "View Entity Resolution →"
  },
  {
    step: 8,
    title: "8. AI Investigator Copilot & Transparency",
    category: "ASSIST",
    icon: Bot,
    badge: "AUDITABLE AI",
    badgeColor: "var(--neon-green)",
    headline: "Natural language query engine with 100% document citations.",
    description: "Collaborate with an intelligent, court-defensible investigative copilot:",
    bulletPoints: [
      "Multi-Hop Graph QA: Ask questions like 'Who connects the Dimapur transit hub to Kolkata Hawala desks?' or 'Summarize suspect roles'.",
      "Strict Citations: Every single answer includes verifiable source document IDs (e.g. DOC_FIR_001, DOC_BANK_005).",
      "Graph Highlighting: The Copilot can dynamically highlight implicated nodes and communication paths directly on the graph.",
      "Legal Transparency & Auditability: Detailed algorithmic audit trails adhering to SIH 2026 MHA guidelines."
    ],
    tip: "Try asking the Copilot: 'What is Vikram Malhotra's role and who are his direct associates?'",
    targetTab: "copilot",
    actionPrompt: "Chat with AI Investigator →"
  }
];

export default function SystemTutorialModal({ isOpen, onClose, onNavigateTab }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TUTORIAL_STEPS[currentStepIndex];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleJumpToFeature = (tabId) => {
    if (onNavigateTab) {
      onNavigateTab(tabId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--bg-base)]/90 backdrop-blur-2xl mono-font animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl glass-panel border border-[var(--border-subtle)] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--neon-green)]/15 border border-[var(--neon-green)]/35 flex items-center justify-center text-[var(--neon-green)] shadow-[0_0_10px_rgba(82,255,140,0.2)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-[var(--text-main)] tracking-tight font-mono">
                  CRIMENET AI • Complete System & Feature Guide
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--neon-green)]/15 text-[var(--neon-green)] border border-[var(--neon-green)]/30 font-bold shadow-[0_0_8px_rgba(82,255,140,0.15)]">
                  Tutorial
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                Interactive walkthrough of tools, graph intelligence, temporal analytics & AI reasoning
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg glass-card text-[var(--text-muted)] hover:text-[var(--neon-green)] hover:border-[var(--neon-green)]/40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Selector Horizontal Navigation Pills */}
        <div className="px-6 py-2.5 bg-[var(--bg-subtle)]/60 border-b border-[var(--border-subtle)] flex items-center space-x-1.5 overflow-x-auto custom-scrollbar">
          {TUTORIAL_STEPS.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;
            return (
              <button
                key={step.step}
                onClick={() => setCurrentStepIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-[var(--neon-green)] text-[var(--bg-subtle)] font-bold shadow-[0_0_12px_rgba(82,255,140,0.35)]'
                    : isCompleted
                    ? 'bg-[var(--bg-surface)] text-[var(--text-main)] hover:border-[var(--border-focus)] border border-[var(--border-subtle)]'
                    : 'bg-[var(--bg-subtle)]/80 text-[var(--text-muted)] hover:text-[var(--text-main)] border border-transparent'
                }`}
              >
                <span>{step.step}.</span>
                <span>{step.category}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Main Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-card border-[var(--border-subtle)] shadow-inner">
            <div className="flex items-center space-x-3.5">
              <div 
                className="w-12 h-12 rounded-2xl glass-panel border flex items-center justify-center shrink-0 shadow-inner"
                style={{ borderColor: `${currentStep.badgeColor}44`, color: currentStep.badgeColor }}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span 
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border"
                    style={{ 
                      color: currentStep.badgeColor, 
                      backgroundColor: `${currentStep.badgeColor}22`, 
                      borderColor: `${currentStep.badgeColor}55` 
                    }}
                  >
                    {currentStep.badge}
                  </span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    Step {currentStep.step} of {TUTORIAL_STEPS.length}
                  </span>
                </div>
                <h3 className="text-lg font-black text-[var(--text-main)] tracking-tight">
                  {currentStep.title}
                </h3>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => handleJumpToFeature(currentStep.targetTab)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[var(--neon-green)] hover:brightness-110 text-[var(--bg-subtle)] font-bold font-mono text-xs transition-all shadow-[0_0_12px_rgba(82,255,140,0.35)] shrink-0 self-start md:self-center cursor-pointer active:scale-95"
            >
              <span>{currentStep.actionPrompt}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Core Feature Explanation */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[var(--text-main)] font-mono">
              {currentStep.headline}
            </h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
              {currentStep.description}
            </p>
          </div>

          {/* Key Capabilities */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase font-bold tracking-wider">
              Key Capabilities & How to Use
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {currentStep.bulletPoints.map((point, pIdx) => {
                const parts = point.split(':');
                const title = parts.length > 1 ? parts[0] : null;
                const desc = parts.length > 1 ? parts.slice(1).join(':') : point;
                return (
                  <div 
                    key={pIdx}
                    className="p-3.5 rounded-xl glass-card border-[var(--border-subtle)] flex items-start space-x-3 shadow-inner"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[var(--neon-green)] shrink-0 mt-0.5" />
                    <div className="text-xs text-[var(--text-main)] leading-snug">
                      {title && <strong className="text-[var(--neon-green)] font-semibold">{title}: </strong>}
                      <span>{desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Investigator Tip Callout */}
          <div className="p-3.5 rounded-xl bg-[var(--neon-amber)]/10 border border-[var(--neon-amber)]/30 flex items-center space-x-2.5 text-xs text-[var(--neon-amber)] font-mono shadow-sm">
            <Sparkles className="w-4 h-4 text-[var(--neon-amber)] shrink-0" />
            <span>{currentStep.tip}</span>
          </div>
        </div>

        {/* Modal Bottom Footer Navigation */}
        <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl glass-card text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-focus)] disabled:opacity-30 disabled:pointer-events-none font-mono text-xs transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center space-x-1.5">
            {TUTORIAL_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex 
                    ? 'w-6 bg-[var(--neon-green)] shadow-[0_0_8px_var(--neon-green)]' 
                    : 'w-2 bg-[var(--border-subtle)] hover:bg-[var(--text-muted)]'
                }`}
                title={`Step ${idx + 1}`}
              />
            ))}
          </div>

          {currentStepIndex < TUTORIAL_STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--neon-green)] hover:brightness-110 text-[var(--bg-subtle)] font-bold font-mono text-xs transition-all shadow-[0_0_12px_rgba(82,255,140,0.35)] active:scale-95 cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--neon-green)] hover:brightness-110 text-[var(--bg-subtle)] font-bold font-mono text-xs transition-all shadow-[0_0_12px_rgba(82,255,140,0.35)] active:scale-95 cursor-pointer"
            >
              <span>Finish Tutorial</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}