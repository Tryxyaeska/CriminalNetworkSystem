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
  ExternalLink
} from 'lucide-react';

const STORY_STEPS = [
  {
    step: 1,
    title: "1. Fragmented Evidence Ingestion",
    icon: FileText,
    badge: "RAW INTELLIGENCE",
    badgeColor: "var(--neon-cyan)",
    headline: "Law enforcement receives disconnected multi-source data.",
    body: "Police reports (FIRs), Call Detail Records (CDRs), FIU Suspicious Transaction Reports (STRs), and field surveillance logs arrive as unstructured documents across different jurisdictions.",
    callout: "8 Ingested Evidence Documents: Dimapur PS, DRI Kolkata, Haldia Customs, FIU STR #882, Kolkata Cyber Cell.",
    targetTab: "documents",
    actionPrompt: "View Evidence Records"
  },
  {
    step: 2,
    title: "2. Automated NLP Entity & Relation Discovery",
    icon: Cpu,
    badge: "HYBRID NLP PIPELINE",
    badgeColor: "var(--neon-green)",
    headline: "CRIMENET AI extracts typed entities and directional relationships.",
    body: "Using spaCy statistical NER and specialized pattern regexes for Indian phone formats (+91), vehicle registrations (NL/AS/WB), and bank accounts (HDFC/AXIS), the system automatically identifies entities and links them with sentence-level citations.",
    callout: "38 Entities Extracted • 37 Verified Relationships Reconstructed with 100% Document Traceability.",
    targetTab: "dashboard",
    actionPrompt: "Review Case Overview"
  },
  {
    step: 3,
    title: "3. Entity Resolution & Alias Deduplication",
    icon: GitMerge,
    badge: "HUMAN-IN-THE-LOOP",
    badgeColor: "var(--neon-amber)",
    headline: "Resolving fragmented aliases into canonical suspects.",
    body: "Criminals use multiple aliases across jurisdictions (e.g., 'Vicky M.', 'V. Malhotra', 'Vikram Malhotra'). The resolution engine flags high-confidence phonetic and token-sort matches for human investigator review.",
    callout: "Resolved: 'V. Malhotra' & 'Vicky M.' confirmed as aliases of Vikram Malhotra (PER_001).",
    targetTab: "resolution",
    actionPrompt: "Open Entity Resolution"
  },
  {
    step: 4,
    title: "4. Focus Person Network Intelligence",
    icon: Network,
    badge: "EGO-NETWORK VIEW",
    badgeColor: "var(--neon-cyan)",
    headline: "Simplifying complex graphs into actionable 1-hop / 2-hop views.",
    body: "Instead of overwhelming investigators with an unreadable web of nodes, CRIMENET provides instant Focus Person mode. Investigators can inspect Vikram Malhotra's immediate sphere of influence in a single clean radial perspective.",
    callout: "Vikram Malhotra holds Betweenness Centrality of 0.48, acting as the structural bridge across 3 isolated clusters.",
    targetTab: "network",
    actionPrompt: "Explore Focus Person Graph"
  },
  {
    step: 5,
    title: "5. Temporal Reconstruction (Time Machine)",
    icon: Clock,
    badge: "NETWORK EVOLUTION",
    badgeColor: "var(--neon-amber)",
    headline: "Watch the criminal syndicate form and evolve over time.",
    body: "Scrubbing through time (Jan - Jun 2026) reveals how initial vehicle procurements in January led to high-volume Hawala fund transfers and pre-incident communication surges in February.",
    callout: "February 2026: Activity spike with +340% CDR call frequency and 14 structured deposits into Apex Logistics.",
    targetTab: "timeline",
    actionPrompt: "Launch Time Machine"
  },
  {
    step: 6,
    title: "6. Explainable Anomaly Detection",
    icon: AlertTriangle,
    badge: "SIGNAL DETECTION",
    badgeColor: "var(--neon-pink)",
    headline: "Automated flagging of AML structuring and burner SIM sharing.",
    body: "CRIMENET computes explainable anomaly alerts without black-box guessing: Hawala smurfing deposits (sub-50k deposits summing to Rs 15L), call frequency bursts, and shared GSM gateway devices.",
    callout: "5 Active Investigative Signals: Structuring, Cross-Community Bridge, Shared SIM, Port Co-occurrence.",
    targetTab: "alerts",
    actionPrompt: "Inspect Anomaly Center"
  },
  {
    step: 7,
    title: "7. Hypothesis-Driven Investigation",
    icon: HelpCircle,
    badge: "DECISION SUPPORT",
    badgeColor: "var(--neon-cyan)",
    headline: "Test investigative theories against evidence and counter-signals.",
    body: "Investigator tests hypothesis: 'Is Vikram Malhotra coordinating both logistics and Hawala wings?'. The system evaluates supporting signals (4 financial links, 42 calls, surveillance) and explicitly notes potential contradictions.",
    callout: "Assessment: HIGH-VALUE INVESTIGATIVE LEAD (86% Confidence). Shows what could disprove the hypothesis.",
    targetTab: "leads",
    actionPrompt: "Test Investigative Hypotheses"
  },
  {
    step: 8,
    title: "8. 'What-If' Network Disruption Simulation",
    icon: ShieldAlert,
    badge: "TOPOLOGICAL RESILIENCE",
    badgeColor: "var(--neon-pink)",
    headline: "Simulate the structural fallout of neutralizing a key coordinator.",
    body: "Simulates removing Vikram Malhotra from the network graph: structural connectivity drops by 68%, fragmenting the syndicate into disconnected clusters and shifting operational fallback to Rajesh Thapa.",
    callout: "Decision-support simulation identifying critical structural dependencies before enforcement operations.",
    targetTab: "leads",
    actionPrompt: "Run Disruption Simulator"
  },
  {
    step: 9,
    title: "9. Next Best Investigative Action",
    icon: Target,
    badge: "ACTIONABLE LEADS",
    badgeColor: "var(--neon-green)",
    headline: "AI recommends what to investigate next and why.",
    body: "Rather than leaving investigators to wonder what to do next, the system ranks prioritized investigative steps (e.g. Subpoena CDR for shared GSM burner +91-98555-66778, Audit Apex Logistics HDFC account).",
    callout: "Top Recommendation: Subpoena CDR for Shared Burner SIM used by 3 suspects.",
    targetTab: "leads",
    actionPrompt: "View Next Best Actions"
  },
  {
    step: 10,
    title: "10. Evidence Traceability & Responsible AI",
    icon: CheckCircle2,
    badge: "VERIFIED CONCLUSION",
    badgeColor: "var(--neon-green)",
    headline: "From fragmented evidence to explainable investigative leads.",
    body: "Every finding, node, edge, and alert traces back to primary source documents. CRIMENET AI functions strictly as a decision-support copilot where human investigators verify every lead before legal action.",
    callout: "Complete 360° Traceability • Zero Hallucination Guarantee • Ready for SIH 2026 Evaluation.",
    targetTab: "dashboard",
    actionPrompt: "Return to Case Overview"
  }
];

export default function InvestigationStoryModal({ isOpen, onClose, onNavigateTab }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const current = STORY_STEPS[currentStepIndex];
  const IconComponent = current.icon;

  const handleNext = () => {
    if (currentStepIndex < STORY_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleAction = () => {
    if (onNavigateTab && current.targetTab) {
      onNavigateTab(current.targetTab);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--bg-base)]/90 backdrop-blur-2xl mono-font animate-fade-in">
      <div className="relative w-full max-w-3xl glass-panel border border-[var(--border-subtle)] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[var(--neon-green)]/15 border border-[var(--neon-green)]/35 text-[var(--neon-green)] shadow-[0_0_10px_rgba(82,255,140,0.2)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[var(--neon-green)] uppercase tracking-widest">
                SIH 2026 Demo Walkthrough (3-Minute Overview)
              </div>
              <h2 className="text-lg font-black text-[var(--text-main)] mt-0.5 tracking-tight">
                CRIMENET AI Investigation Story
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl glass-card text-[var(--text-muted)] hover:text-[var(--neon-green)] hover:border-[var(--neon-green)]/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-3 pb-2 border-b border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span className="font-bold tracking-wider uppercase">Step {currentStepIndex + 1} of {STORY_STEPS.length}</span>
          <div className="flex items-center space-x-1.5">
            {STORY_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex 
                    ? 'w-6 bg-[var(--neon-green)] shadow-[0_0_6px_var(--neon-green)]' 
                    : idx < currentStepIndex 
                    ? 'w-2 bg-[var(--neon-green)]/50' 
                    : 'w-2 bg-[var(--border-subtle)]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-7 space-y-5">
          <div className="flex items-center justify-between">
            <span 
              className="px-2.5 py-0.5 rounded text-[11px] font-bold border tracking-wider shadow-sm"
              style={{ 
                color: current.badgeColor, 
                backgroundColor: `${current.badgeColor}22`, 
                borderColor: `${current.badgeColor}55` 
              }}
            >
              {current.badge}
            </span>
            <span className="text-xs text-[var(--text-muted)] tracking-wider">
              Case: Operation ShadowNet
            </span>
          </div>

          <div className="flex items-start space-x-4">
            <div 
              className="w-12 h-12 rounded-xl glass-card border flex items-center justify-center shrink-0 mt-0.5"
              style={{ borderColor: `${current.badgeColor}44`, color: current.badgeColor }}
            >
              <IconComponent className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-[var(--text-main)] tracking-tight">
                {current.title}
              </h3>
              <p className="text-sm font-bold text-[var(--neon-green)] leading-snug">
                {current.headline}
              </p>
            </div>
          </div>

          <p className="text-sm text-[var(--text-main)] leading-relaxed">
            {current.body}
          </p>

          <div className="p-4 rounded-xl glass-card border-[var(--border-focus)] text-xs text-[var(--text-main)] flex items-start space-x-3 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-[var(--neon-amber)] shadow-[0_0_8px_var(--neon-amber)] animate-pulse shrink-0 mt-1" />
            <span className="leading-relaxed font-semibold">
              {current.callout}
            </span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="px-6 py-4 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] flex items-center justify-between">
          <button 
            onClick={handlePrev} 
            disabled={currentStepIndex === 0} 
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl glass-card text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-focus)] disabled:opacity-30 disabled:pointer-events-none text-xs transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            <button 
              onClick={handleAction} 
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl glass-card text-[var(--neon-green)] hover:border-[var(--neon-green)]/50 text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <span>{current.actionPrompt}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleNext} 
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-[var(--neon-green)] text-[var(--bg-subtle)] hover:brightness-110 font-bold text-xs transition-all active:scale-95 shadow-[0_0_12px_rgba(82,255,140,0.35)] cursor-pointer"
            >
              <span>{currentStepIndex === STORY_STEPS.length - 1 ? 'Finish Story' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}