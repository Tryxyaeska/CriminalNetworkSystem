import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import NetworkGraph from '../components/NetworkGraph';
import { fetchGraphData } from '../services/api';

const TIMELINE_MILESTONES = [
  {
    monthIndex: 0,
    monthKey: "2026-01-31",
    label: "January 2026",
    headline: "Contraband Interception at Dimapur",
    summary: "Dimapur Police intercept Tata cargo truck AS-01-XY-9821 near Dimapur Market. Escort vehicle NL-01-AB-1234 registered to Vikram Malhotra observed.",
    surgeNote: "Initial logistics nodes and driver Amit Kumar active.",
    activeEntitiesCount: 8,
    activeRelationsCount: 6,
    supportingDoc: "DOC_FIR_001"
  },
  {
    monthIndex: 1,
    monthKey: "2026-02-28",
    label: "February 2026",
    headline: "Hawala Structuring & Communication Burst (+340%)",
    summary: "Intensive 42-call burst recorded between Vikram Malhotra, Rajesh Thapa, and Suresh Agarwal. 14 structured deposits into Apex Logistics account followed by Rs 15L RTGS outbound to Vikram Malhotra.",
    surgeNote: "⚠️ Major activity spike: Hawala channel linked to logistics network.",
    activeEntitiesCount: 22,
    activeRelationsCount: 19,
    supportingDoc: "DOC_BANK_005"
  },
  {
    monthIndex: 2,
    monthKey: "2026-03-31",
    label: "March 2026",
    headline: "Cyber SIM Racket & Patna Safehouse Sighting",
    summary: "Cyber Cell raids uncover 300+ counterfeit SIMs distributed via Metro Telecom. Shared GSM gateway +91-98555-66778 identified. Amit Kumar & Tariq Ahmed sighted at Guwahati-Patna transit.",
    surgeNote: "Delhi tech cell and cross-border couriers fully integrated into syndicate.",
    activeEntitiesCount: 34,
    activeRelationsCount: 31,
    supportingDoc: "DOC_FIR_006"
  },
  {
    monthIndex: 3,
    monthKey: "2026-06-30",
    label: "April - June 2026",
    headline: "Centralized Multi-Cluster Syndicate Consolidation",
    summary: "Intelligence assessment confirms Vikram Malhotra operates as the central bridge interconnecting North-East Logistics, Kolkata Hawala, Haldia Port, and Delhi Tech cells.",
    surgeNote: "Full reconstructed multi-modal syndicate graph active across all jurisdictions.",
    activeEntitiesCount: 40,
    activeRelationsCount: 38,
    supportingDoc: "DOC_INTEL_008"
  }
];

export default function TimelineView({ onSelectEntity, onOpenEvidence, onAskCopilot }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [], total_nodes: 0, total_edges: 0 });
  const [loading, setLoading] = useState(false);

  const activeMilestone = TIMELINE_MILESTONES[currentStep];

  useEffect(() => {
    loadTimelineGraph(activeMilestone.monthKey);
  }, [currentStep]);

  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < TIMELINE_MILESTONES.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1600);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  const loadTimelineGraph = (dateTo) => {
    setLoading(true);
    fetchGraphData({ date_to: dateTo })
      .then((data) => {
        setGraphData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching timeline graph data:', err);
        setLoading(false);
      });
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden select-none mono-font">
      {/* Top Banner */}
      <div className="h-14 border-b border-[var(--border-subtle)] glass-panel px-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-[var(--neon-green)]/15 border border-[var(--neon-green)]/35 text-[var(--neon-green)] shadow-[0_0_8px_rgba(82,255,140,0.2)]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-main)] tracking-tight flex items-center space-x-2">
              <span>Time Machine: Syndicate Network Evolution</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--neon-green)]/15 text-[var(--neon-green)] border border-[var(--neon-green)]/35">
                TEMPORAL RECONSTRUCTION
              </span>
            </h2>
            <p className="text-[11px] text-[var(--text-muted)] font-mono">
              Scrub through timeline to observe how nodes, calls, and financial paths emerged chronologically.
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-[var(--neon-green)] hover:brightness-110 text-[var(--bg-subtle)] shadow-[0_0_12px_rgba(82,255,140,0.35)]'
                : 'glass-card text-[var(--text-main)] hover:border-[var(--neon-green)]/40'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY EVOLUTION'}</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset to Beginning"
            className="p-1.5 rounded-lg glass-card text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="px-3 py-1 rounded glass-card font-mono text-xs text-[var(--text-main)]">
            {graphData.total_nodes} Nodes • {graphData.total_edges} Edges Active
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      {graphData.nodes?.length > 0 ? (
        <div className="flex-1 flex overflow-hidden min-h-0 min-w-0 p-4 gap-4">
          {/* Left: Interactive Canvas */}
          <div className="flex-1 h-full relative rounded-2xl glass-panel overflow-hidden shadow-2xl">
            <NetworkGraph
              graphData={graphData}
              onSelectNode={(id) => onSelectEntity && onSelectEntity(id)}
              onOpenEvidence={onOpenEvidence}
            />
          </div>

          {/* Right: Narrative Card */}
          <div className="w-96 flex flex-col space-y-4 shrink-0 overflow-y-auto custom-scrollbar pr-1">
            <div className="p-5 rounded-2xl glass-panel shadow-xl space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[var(--neon-green)]/15 text-[var(--neon-green)] border border-[var(--neon-green)]/35 shadow-[0_0_8px_rgba(82,255,140,0.15)]">
                  {activeMilestone.label}
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Stage {currentStep + 1} of {TIMELINE_MILESTONES.length}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)] leading-tight">
                  {activeMilestone.headline}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                  {activeMilestone.summary}
                </p>
              </div>

              {/* AI Insight */}
              <div className="p-3 rounded-xl glass-card text-xs space-y-1">
                <div className="flex items-center space-x-1.5 text-[var(--neon-green)] font-mono font-bold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI TEMPORAL INTERPRETATION</span>
                </div>
                <p className="text-[11.5px] text-[var(--text-main)] leading-snug">
                  {activeMilestone.surgeNote}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-1 flex items-center justify-between">
                {activeMilestone.supportingDoc && (
                  <button
                    onClick={() => onOpenEvidence && onOpenEvidence(activeMilestone.supportingDoc)}
                    className="flex items-center space-x-1 text-xs font-mono text-[var(--neon-amber)] hover:brightness-125 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View {activeMilestone.supportingDoc}</span>
                  </button>
                )}

                <button
                  onClick={() => onAskCopilot && onAskCopilot(`What happened during ${activeMilestone.label}? Summarize evidence and implicated suspects.`)}
                  className="px-3 py-1.5 rounded-lg glass-card text-[var(--text-muted)] hover:text-[var(--neon-green)] hover:border-[var(--neon-green)]/40 text-[11px] transition-all duration-150 active:scale-95 cursor-pointer"
                >
                  Ask AI Investigator →
                </button>
              </div>
            </div>

            {/* Chronological Steps Selector */}
            <div className="p-4 rounded-2xl glass-panel space-y-2.5">
              <div className="text-[11px] text-[var(--text-muted)] uppercase font-bold tracking-wider">
                Investigation Stages
              </div>

              <div className="space-y-2">
                {TIMELINE_MILESTONES.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStep(idx);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-150 flex items-center justify-between active:scale-95 cursor-pointer ${
                      idx === currentStep
                        ? 'bg-[var(--neon-green)]/15 border-[var(--neon-green)]/60 text-[var(--text-main)] shadow-[0_0_10px_rgba(82,255,140,0.15)]'
                        : 'glass-card text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--neon-green)]/30'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold font-mono">
                        {m.label}
                      </div>
                      <div className="text-[11px] truncate max-w-[220px] text-[var(--text-muted)]">
                        {m.headline}
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${idx === currentStep ? 'bg-[var(--neon-green)] shadow-[0_0_8px_var(--neon-green)] animate-pulse' : 'bg-[var(--border-subtle)]'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="p-12 max-w-lg rounded-3xl glass-panel text-center space-y-4">
            <Clock className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
            <h3 className="font-mono text-sm text-[var(--text-main)] font-bold">No Temporal Evolution Data</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              No time-stamped evidence or call logs are available in this session. Ingest FIRs or load the demo investigation to trace syndicate timeline milestones.
            </p>
          </div>
        </div>
      )}

      {/* Bottom Timeline Step Slider */}
      {graphData.nodes?.length > 0 && (
        <div className="h-16 border-t border-[var(--border-subtle)] glass-panel px-8 flex items-center justify-between z-10 shrink-0">
          <div className="w-full flex items-center space-x-6">
            <span className="text-xs font-mono text-[var(--text-muted)] whitespace-nowrap">
              Timeline Scrubber:
            </span>
            <div className="flex-1 flex items-center space-x-3">
              {TIMELINE_MILESTONES.map((m, idx) => (
                <React.Fragment key={idx}>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStep(idx);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl border font-mono text-xs transition-all duration-150 text-center flex flex-col items-center active:scale-95 cursor-pointer ${
                      idx === currentStep
                        ? 'bg-[var(--neon-green)] text-[var(--bg-subtle)] font-bold border-[var(--neon-green)] shadow-[0_0_12px_rgba(82,255,140,0.3)]'
                        : idx < currentStep
                        ? 'bg-[var(--neon-green)]/15 text-[var(--neon-green)] border-[var(--neon-green)]/30'
                        : 'glass-card text-[var(--text-muted)] hover:border-[var(--neon-green)]/40'
                    }`}
                  >
                    <span className="text-[11px] font-bold">{m.label}</span>
                    <span className="text-[9px] opacity-80">{m.activeEntitiesCount} Nodes Active</span>
                  </button>
                  {idx < TIMELINE_MILESTONES.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-[var(--border-subtle)] shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}