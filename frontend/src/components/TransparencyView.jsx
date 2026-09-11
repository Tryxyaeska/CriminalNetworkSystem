import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  Network, 
  Lock, 
  Server, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { fetchSystemInfo } from '../services/api';
import MetricTooltip from './MetricTooltip';

export default function TransparencyView() {
  const [sysInfo, setSysInfo] = useState(null);

  useEffect(() => {
    fetchSystemInfo().then(setSysInfo).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col h-full bg-transparent p-7 space-y-7 overflow-y-auto custom-scrollbar select-none mono-font">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--border-subtle)] pb-5 shrink-0">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-[var(--neon-green)]/15 border border-[var(--neon-green)]/35 text-[var(--neon-green)] shadow-[0_0_12px_rgba(82,255,140,0.2)] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-[var(--text-main)] tracking-tight">
                AI TRANSPARENCY, RESPONSIBLE AI & CONFLICTING EVIDENCE
              </h1>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[var(--neon-green)]/15 text-[var(--neon-green)] border border-[var(--neon-green)]/35 shadow-[0_0_8px_rgba(82,255,140,0.15)] tracking-wide">
                EXPLAINABLE AI
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-[var(--text-muted)]">
              Explainable AI principles, evidence-grounding constraints, and non-deterministic conflict verification safeguards.
            </p>
          </div>
        </div>

        <span className="text-xs text-[var(--text-muted)] glass-card px-3 py-1.5 rounded-xl border-[var(--border-subtle)] shrink-0">
          Standard: <strong className="text-[var(--neon-green)]">MHA-Responsible-AI-2026</strong>
        </span>
      </div>

      {/* Responsible AI: What AI Does vs What AI Does NOT Do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="p-7 rounded-3xl glass-panel space-y-5 shadow-2xl border-[var(--neon-green)]/35 flex flex-col justify-between min-h-[280px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center space-x-2 text-[var(--neon-green)] text-xs sm:text-[13px] font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-5 h-5" />
                <span>What CRIMENET AI Does (Decision Support)</span>
              </div>
              <span className="text-[10.5px] text-[var(--neon-green)] glass-card px-2 py-0.5 rounded border-[var(--neon-green)]/30">
                ACTIVE CAPABILITIES
              </span>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-[13.5px] text-[var(--text-main)] leading-relaxed">
              <li className="flex items-start space-x-3">
                <span className="text-[var(--neon-green)] font-bold text-base mt-0.5">✓</span>
                <span>Extracts structured entities and directional links from unstructured FIRs/CDRs.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[var(--neon-green)] font-bold text-base mt-0.5">✓</span>
                <span>Recommends alias deduplication candidates with explicit similarity scoring.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[var(--neon-green)] font-bold text-base mt-0.5">✓</span>
                <span className="flex items-center">
                  <span>Detects mathematical anomalies: Betweenness bridges, CDR surges, and Hawala structuring.</span>
                  <MetricTooltip term="betweenness" />
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[var(--neon-green)] font-bold text-base mt-0.5">✓</span>
                <span>Requires human investigator verification for every finding before legal action.</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)]/70 text-[11px] text-[var(--text-muted)] flex items-center justify-between">
            <span>Audit Trail: SQLite Write-Ahead Logging</span>
            <span className="text-[var(--neon-green)] font-semibold">Deterministic Tracing</span>
          </div>
        </div>

        <div className="p-7 rounded-3xl glass-panel space-y-5 shadow-2xl border-[var(--neon-pink)]/35 flex flex-col justify-between min-h-[280px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center space-x-2 text-[var(--neon-pink)] text-xs sm:text-[13px] font-bold uppercase tracking-wider">
                <XCircle className="w-5 h-5" />
                <span>What CRIMENET AI Does NOT Do</span>
              </div>
              <span className="text-[10.5px] text-[var(--neon-pink)] glass-card px-2 py-0.5 rounded border-[var(--neon-pink)]/30">
                STRICT BOUNDARIES
              </span>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-[13.5px] text-[var(--text-main)] leading-relaxed">
              <li className="flex items-start space-x-3">
                <span className="text-[var(--neon-pink)] font-bold text-base mt-0.5">✕</span>
                <span>Does NOT determine legal guilt or declare suspects "confirmed criminals".</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[var(--neon-pink)] font-bold text-base mt-0.5">✕</span>
                <span>Does NOT replace sworn law enforcement officers or judicial proceedings.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[var(--neon-pink)] font-bold text-base mt-0.5">✕</span>
                <span>Does NOT transmit sensitive case records to public cloud LLM servers.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[var(--neon-pink)] font-bold text-base mt-0.5">✕</span>
                <span>Does NOT fabricate facts or output ungrounded speculative accusations.</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)]/70 text-[11px] text-[var(--text-muted)] flex items-center justify-between">
            <span>Data Boundary: 100% Air-Gapped / On-Premise</span>
            <span className="text-[var(--neon-pink)] font-semibold">Zero Cloud Leak</span>
          </div>
        </div>
      </div>

      {/* Conflicting Evidence Engine Demo */}
      <div className="p-6 rounded-2xl glass-panel space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-[var(--neon-amber)]" />
            <h2 className="text-sm font-bold text-[var(--text-main)] tracking-tight">
              Conflicting Evidence Engine (Responsible AI Case Demonstration)
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[var(--neon-amber)]/20 text-[var(--neon-amber)] border border-[var(--neon-amber)]/30">
            UNRESOLVED CONTRADICTION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-[var(--neon-cyan)]">Evidence Record A: DOC_SURV_003</span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Feb 10, 2026</span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Field surveillance log places suspect <strong className="text-[var(--text-main)]">Rajesh Thapa (PER_002)</strong> at Haldia Port Terminal 4 meeting Customs Inspector S. K. Roy.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-[var(--neon-amber)]">Evidence Record B: DOC_CDR_004</span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Feb 10, 2026</span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Cell tower triangulation on phone +91-98111-22334 logs active tower ping near Guwahati Transit Yard at the exact same timestamp.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--neon-amber)]/10 border border-[var(--neon-amber)]/30 text-xs space-y-1.5 text-[var(--text-main)]">
          <div className="text-[11px] font-mono font-bold text-[var(--neon-amber)] uppercase">AI Handling & Non-Autonomous Guardrail:</div>
          <p className="leading-relaxed">
            CRIMENET AI recognizes this spatial-temporal contradiction. Rather than hallucinating or picking one source, the system flags the conflict as <strong className="text-[var(--neon-amber)]">UNRESOLVED</strong> and recommends human verification (investigating whether a clone SIM / courier handover occurred).
          </p>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel hover:border-[var(--border-focus)] transition-all duration-150 space-y-2 min-h-[130px] flex flex-col justify-between shadow-lg">
          <span className="text-[10.5px] font-mono uppercase text-[var(--text-muted)] font-bold block">INFERENCE ENGINE</span>
          <p className="text-sm sm:text-base font-bold text-[var(--text-main)] flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-[var(--neon-cyan)] shrink-0" />
            <span className="truncate">Local Open-Weight LLM</span>
          </p>
          <span className="text-[11px] font-mono text-[var(--neon-green)]">100% Offline / Private</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel hover:border-[var(--border-focus)] transition-all duration-150 space-y-2 min-h-[130px] flex flex-col justify-between shadow-lg">
          <span className="text-[10.5px] font-mono uppercase text-[var(--text-muted)] font-bold block">KNOWLEDGE GRAPH</span>
          <p className="text-sm sm:text-base font-bold text-[var(--text-main)] flex items-center space-x-2">
            <Network className="w-4 h-4 text-[var(--neon-pink)] shrink-0" />
            <span className="truncate">In-Memory NetworkX MultiGraph</span>
          </p>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">Pluggable Graph Store Interface</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel hover:border-[var(--border-focus)] transition-all duration-150 space-y-2 min-h-[130px] flex flex-col justify-between shadow-lg">
          <span className="text-[10.5px] font-mono uppercase text-[var(--text-muted)] font-bold block">DATABASE STORAGE</span>
          <p className="text-sm sm:text-base font-bold text-[var(--text-main)] flex items-center space-x-2">
            <Database className="w-4 h-4 text-[var(--neon-amber)] shrink-0" />
            <span className="truncate">SQLite WAL Embedded</span>
          </p>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">Zero Cloud Transmission</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel hover:border-[var(--border-focus)] transition-all duration-150 space-y-2 min-h-[130px] flex flex-col justify-between shadow-lg">
          <span className="text-[10.5px] font-mono uppercase text-[var(--text-muted)] font-bold block">DECISION SUPPORT COMPLIANCE</span>
          <p className="text-sm sm:text-base font-bold text-[var(--text-main)] flex items-center space-x-2">
            <Lock className="w-4 h-4 text-[var(--neon-green)] shrink-0" />
            <span className="truncate">Human-in-the-Loop</span>
          </p>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">No Definitive Guilt Claims</span>
        </div>
      </div>
    </div>
  );
}