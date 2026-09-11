import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  ShieldAlert, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  Play, 
  Activity, 
  Layers,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { 
  testHypothesis, 
  fetchDisruptionSimulation, 
  fetchHiddenIntermediaries, 
  fetchNextActions,
  fetchEntities
} from '../services/api';
import MetricTooltip from '../components/MetricTooltip';

export default function InvestigativeLeadsView({ onSelectEntity, onOpenEvidence, onAskCopilot, onNavigateTab }) {
  const [activeTab, setActiveTab] = useState('hypothesis');
  const [availablePersons, setAvailablePersons] = useState([]);
  const [selectedHypothesisId, setSelectedHypothesisId] = useState('vikram_coordination');
  const [hypothesisResult, setHypothesisResult] = useState(null);
  const [testingHypothesis, setTestingHypothesis] = useState(false);
  const [simTargetNode, setSimTargetNode] = useState('PER_001');
  const [simulationResult, setSimulationResult] = useState(null);
  const [runningSimulation, setRunningSimulation] = useState(false);
  const [gaps, setGaps] = useState([]);
  const [nextActions, setNextActions] = useState([]);

  useEffect(() => {
    fetchEntities('PERSON').then((persons) => {
      setAvailablePersons(persons);
      if (persons && persons.length > 0) {
        setSimTargetNode(persons[0].id);
        runSimulation(persons[0].id);
        runHypothesisTest(selectedHypothesisId);
      } else {
        setSimulationResult(null);
        setHypothesisResult(null);
      }
    }).catch(console.error);

    fetchHiddenIntermediaries().then(setGaps).catch(console.error);
    fetchNextActions().then(setNextActions).catch(console.error);
  }, []);

  const runHypothesisTest = (hypId) => {
    setTestingHypothesis(true);
    testHypothesis(hypId)
      .then((res) => {
        setHypothesisResult(res);
        setTestingHypothesis(false);
      })
      .catch((err) => {
        console.error(err);
        setTestingHypothesis(false);
      });
  };

  const runSimulation = (nodeId) => {
    setRunningSimulation(true);
    fetchDisruptionSimulation(nodeId)
      .then((res) => {
        setSimulationResult(res);
        setRunningSimulation(false);
      })
      .catch((err) => {
        console.error(err);
        setRunningSimulation(false);
      });
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden select-none mono-font">
      {/* Top Header */}
      <div className="h-16 border-b border-[var(--border-subtle)] glass-panel px-7 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center space-x-3.5">
          <div className="p-2 rounded-xl bg-[var(--neon-green)]/15 border border-[var(--neon-green)]/35 text-[var(--neon-green)] shadow-[0_0_10px_rgba(82,255,140,0.2)]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[var(--text-main)] flex items-center space-x-2.5">
              <span>Investigative Reasoning & Hypothesis Testing</span>
              <span className="px-2.5 py-0.5 rounded text-[10.5px] bg-[var(--neon-green)]/15 text-[var(--neon-green)] border border-[var(--neon-green)]/35 font-bold tracking-wide">
                DECISION SUPPORT
              </span>
            </h2>
            <p className="text-[11px] text-[var(--text-muted)] font-mono">
              Evaluate theories, simulate network vulnerability, and identify next investigative steps.
            </p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl glass-card">
          {[
            { id: 'hypothesis', label: 'Hypothesis Testing', color: 'var(--neon-green)' },
            { id: 'simulator', label: 'Disruption Sim', color: 'var(--neon-pink)' },
            { id: 'gaps', label: `Network Gaps (${gaps.length})`, color: 'var(--neon-amber)' },
            { id: 'next_actions', label: `Next Actions (${nextActions.length})`, color: 'var(--neon-cyan)' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${
                  isActive ? 'font-bold shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
                style={
                  isActive
                    ? { backgroundColor: `${tab.color}22`, color: tab.color, borderColor: `${tab.color}66`, borderWidth: '1px' }
                    : { borderColor: 'transparent', borderWidth: '1px' }
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-7 space-y-7">
        {/* --- TAB 1: HYPOTHESIS TESTING --- */}
        {activeTab === 'hypothesis' && (
          availablePersons.length > 0 ? (
            <div className="space-y-7">
              {/* Hypothesis Selector Bar */}
              <div className="p-6 rounded-3xl glass-panel space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                  <div className="text-xs sm:text-[13px] text-[var(--text-muted)] uppercase font-bold tracking-widest">
                    Select Investigative Hypothesis to Test
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">
                    {availablePersons.some(p => p.id === 'PER_001') ? 'Preset Scenario Theories' : 'Live Graph Inferences'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {availablePersons.some(p => p.id === 'PER_001') ? (
                    [
                      { id: 'vikram_coordination', label: '1. Vikram Coordinates Multi-Wing Logistics & Hawala', code: 'HYP-01' },
                      { id: 'port_customs_collusion', label: '2. Inspector S. K. Roy Facilitates Clearance at Port', code: 'HYP-02' },
                      { id: 'shell_company_laundering', label: '3. Apex & Horizon Are Layering Shell Companies', code: 'HYP-03' }
                    ].map((hyp) => (
                      <button
                        key={hyp.id}
                        onClick={() => {
                          setSelectedHypothesisId(hyp.id);
                          runHypothesisTest(hyp.id);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all duration-150 active:scale-95 cursor-pointer flex flex-col justify-between min-h-[90px] ${
                          selectedHypothesisId === hyp.id
                            ? 'bg-[var(--neon-green)]/15 border-[var(--neon-green)]/60 text-[var(--neon-green)] font-bold shadow-[0_0_15px_rgba(82,255,140,0.25)]'
                            : 'glass-card text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--neon-green)]/35'
                        }`}
                      >
                        <span className="text-[10px] tracking-wider opacity-80 mb-1">{hyp.code}</span>
                        <span className="text-xs sm:text-[13px] leading-snug">{hyp.label}</span>
                      </button>
                    ))
                  ) : (
                    availablePersons.slice(0, 3).map((p, idx) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedHypothesisId(p.id);
                          runHypothesisTest(p.id);
                        }}
                        className={`p-4 rounded-2xl border text-left font-mono text-xs transition-all active:scale-95 cursor-pointer ${
                          selectedHypothesisId === p.id
                            ? 'bg-[var(--neon-green)]/15 border-[var(--neon-green)]/60 text-[var(--neon-green)] font-bold shadow-[0_0_15px_rgba(82,255,140,0.25)]'
                            : 'glass-card text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--neon-green)]/35'
                        }`}
                      >
                        {idx + 1}. Role & Connections of {p.canonical_name}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Evaluation Result */}
              {hypothesisResult && (
                <div className="p-7 rounded-3xl glass-panel space-y-6 shadow-2xl">
                  {/* Result Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[var(--neon-green)]/15 text-[var(--neon-green)] border border-[var(--neon-green)]/35 shadow-[0_0_10px_rgba(82,255,140,0.2)]">
                          {hypothesisResult.assessment}
                        </span>
                        <span className="text-xs sm:text-[13px] text-[var(--text-muted)]">
                          Confidence: <strong className="text-[var(--neon-green)] font-bold">{hypothesisResult.confidence_percent}%</strong> (Multi-Modal Correlation)
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-[var(--text-main)] tracking-tight">
                        {hypothesisResult.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => onAskCopilot && onAskCopilot(`Explain the evidence behind the hypothesis: "${hypothesisResult.title}"`)}
                      className="flex items-center space-x-2 px-4 py-2.5 rounded-xl glass-card text-[var(--neon-green)] hover:border-[var(--neon-green)]/50 text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-95 shrink-0 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Ask AI Investigator →</span>
                    </button>
                  </div>

                  {/* Supporting vs Contradictory Evidence Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                    <div className="p-5 rounded-2xl glass-card space-y-3.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2 text-[var(--neon-green)] text-xs sm:text-[13px] font-bold uppercase tracking-wider pb-2 border-b border-[var(--border-subtle)]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Supporting Corroboration ({hypothesisResult.supporting_signals?.length})</span>
                        </div>
                        <ul className="space-y-2.5 text-xs sm:text-[13px] text-[var(--text-muted)] pt-3">
                          {hypothesisResult.supporting_signals?.map((sig, idx) => (
                            <li key={idx} className="flex items-start space-x-2.5 leading-relaxed">
                              <span className="text-[var(--neon-green)] font-bold mt-0.5">•</span>
                              <span className="text-[var(--text-main)]">{sig}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl glass-card space-y-3.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2 text-[var(--neon-amber)] text-xs sm:text-[13px] font-bold uppercase tracking-wider pb-2 border-b border-[var(--border-subtle)]">
                          <AlertCircle className="w-4 h-4" />
                          <span>Uncertainties & Gaps</span>
                        </div>
                        <ul className="space-y-2.5 text-xs sm:text-[13px] text-[var(--text-muted)] pt-3">
                          {hypothesisResult.contradicting_signals?.map((sig, idx) => (
                            <li key={idx} className="flex items-start space-x-2.5 leading-relaxed">
                              <span className="text-[var(--neon-amber)] font-bold mt-0.5">•</span>
                              <span>{sig}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Falsification criteria */}
                  <div className="p-4 rounded-xl bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/25 space-y-1.5 text-xs text-[var(--text-main)]">
                    <div className="text-[11px] font-mono font-bold text-[var(--neon-cyan)] uppercase tracking-wider">
                      Falsification Criteria (What Could Disprove This Hypothesis?)
                    </div>
                    <p className="leading-relaxed">
                      {hypothesisResult.what_could_disprove}
                    </p>
                  </div>

                  {/* Supporting Documents & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)] text-xs font-mono">
                    <div className="flex items-center space-x-3 text-[var(--text-muted)]">
                      <span>Cited Sources:</span>
                      <div className="flex items-center space-x-2">
                        {hypothesisResult.supporting_documents?.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => onOpenEvidence && onOpenEvidence(doc.id)}
                            className="px-3 py-1.5 rounded-lg glass-card text-[var(--neon-green)] hover:border-[var(--neon-green)]/40 flex items-center space-x-1.5 cursor-pointer transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{doc.id}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-[var(--text-muted)]">
                      Recommended Next Step: <strong className="text-[var(--neon-green)]">{hypothesisResult.recommended_action}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-16 flex flex-col items-center justify-center space-y-3 text-center rounded-2xl glass-panel">
              <Target className="w-10 h-10 text-[var(--text-muted)]" />
              <h3 className="font-mono text-sm text-[var(--text-main)] font-bold">No Investigative Hypotheses Active</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-md">
                No entities or evidence have been indexed for hypothesis testing in this session. Ingest FIR documents or load the sample scenario.
              </p>
            </div>
          )
        )}

        {/* --- TAB 2: DISRUPTION SIMULATOR --- */}
        {activeTab === 'simulator' && (
          <div className="space-y-7">
            <div className="p-6 rounded-3xl glass-panel space-y-5 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[var(--text-main)]">
                    Topological Network Disruption Simulator ("What-If" Analysis)
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[var(--text-muted)] mt-1 leading-relaxed">
                    Graph-theory simulation measuring syndicate graph fragmentation, cut-vertices, and fallback bridges if key coordinators are taken down.
                  </p>
                </div>

                {/* Target Select */}
                <div className="flex items-center space-x-3 shrink-0">
                  <span className="text-xs text-[var(--text-muted)]">Target Node:</span>
                  <select
                    value={simTargetNode}
                    onChange={(e) => setSimTargetNode(e.target.value)}
                    className="bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-lg px-3.5 py-2 text-xs sm:text-[13px] text-[var(--text-main)] focus:outline-none focus:border-[var(--neon-pink)] transition-colors cursor-pointer"
                  >
                    {availablePersons.length > 0 ? (
                      availablePersons.map((p) => (
                        <option key={p.id} value={p.id}>{p.canonical_name} ({p.metadata?.role || p.id})</option>
                      ))
                    ) : (
                      <option value="">No Entities Indexed</option>
                    )}
                  </select>

                  <button
                    onClick={() => runSimulation(simTargetNode)}
                    disabled={!simTargetNode || availablePersons.length === 0}
                    className="px-4.5 py-2 rounded-lg bg-[var(--neon-pink)] hover:brightness-110 text-[var(--bg-subtle)] font-bold text-xs sm:text-[13px] transition-all active:scale-95 shadow-[0_0_14px_rgba(255,56,112,0.35)] disabled:opacity-50 cursor-pointer"
                  >
                    SIMULATE REMOVAL
                  </button>
                </div>
              </div>

              {runningSimulation ? (
                <div className="p-16 flex flex-col items-center justify-center space-y-3 rounded-2xl glass-card">
                  <div className="w-6 h-6 border-2 border-[var(--neon-pink)] border-t-transparent rounded-full animate-spin" />
                  <span className="font-mono text-xs text-[var(--text-muted)]">Simulating network fragmentation impact...</span>
                </div>
              ) : simulationResult ? (
                <div className="space-y-6 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Syndicate Fragmentation', val: `${simulationResult.fragmentation_percent}%`, desc: 'Immediate loss of total graph cohesion', color: 'var(--neon-pink)', term: 'density' },
                      { label: 'Isolated Sub-Clusters', val: `${simulationResult.after_components} Clusters`, desc: `Splits from ${simulationResult.before_components} connected core`, color: 'var(--neon-amber)', term: 'cluster' },
                      { label: 'Orphaned Associates', val: `${simulationResult.affected_direct_neighbors_count} Nodes`, desc: 'First-hop operators severed from command', color: 'var(--neon-cyan)', term: 'degree' },
                      { label: 'Anticipated Fallback', val: simulationResult.primary_fallback_bridge, desc: 'Likely secondary bridge node stepping up', color: 'var(--neon-green)', term: 'betweenness' }
                    ].map((m, i) => (
                      <div key={i} className="p-4.5 rounded-2xl glass-card space-y-1.5 min-h-[120px] flex flex-col justify-between">
                        <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider flex items-center">
                          <span>{m.label}</span>
                          {m.term && <MetricTooltip term={m.term} />}
                        </div>
                        <div className="text-2xl font-black truncate tracking-tight" style={{ color: m.color }}>{m.val}</div>
                        <div className="text-[11px] text-[var(--text-muted)] leading-tight">{m.desc}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 rounded-2xl bg-[var(--neon-pink)]/10 border border-[var(--neon-pink)]/35 space-y-2 text-xs sm:text-[13px] text-[var(--text-main)] shadow-md">
                    <div className="text-xs font-bold text-[var(--neon-pink)] uppercase tracking-wider flex items-center space-x-2">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Operational Impact Assessment</span>
                    </div>
                    <p className="leading-relaxed">
                      {simulationResult.plain_english_summary}
                    </p>
                  </div>

                  {/* Remaining Bridges */}
                  <div className="space-y-3">
                    <div className="text-xs font-mono text-[var(--text-muted)] uppercase font-bold tracking-wider flex items-center">
                      <span>New Successor Bridge Nodes (Post-Disruption Network)</span>
                      <MetricTooltip term="betweenness" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {simulationResult.remaining_bridges?.map((b, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl glass-card space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--text-main)] font-mono">{b.name}</span>
                            <span className="text-[10px] font-mono text-[var(--neon-cyan)]">Score: {b.new_betweenness}</span>
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)]">{b.role}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-[var(--text-muted)] text-xs rounded-2xl glass-card">
                  Select a suspect node and click "SIMULATE REMOVAL" to calculate disruption fragmentation.
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 3: NETWORK GAPS --- */}
        {activeTab === 'gaps' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="text-xs sm:text-[13px] text-[var(--text-muted)] uppercase font-bold tracking-widest">
                Unobserved Intermediaries & Structural Graph Holes ({gaps.length})
              </div>
              <span className="text-xs text-[var(--text-muted)]">High-Probability Missing Handlers</span>
            </div>

            {gaps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {gaps.map((gap) => (
                  <div key={gap.id} className="p-6 rounded-3xl glass-panel space-y-4 shadow-xl flex flex-col justify-between min-h-[220px]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-0.5 rounded-md text-[10.5px] font-bold bg-[var(--neon-amber)]/15 text-[var(--neon-amber)] border border-[var(--neon-amber)]/35 shadow-[0_0_8px_rgba(255,174,25,0.2)]">
                          {gap.gap_type}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                          Confidence: <strong className="text-[var(--neon-green)]">{Math.round(gap.confidence * 100)}%</strong>
                        </span>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[var(--text-main)] tracking-tight">
                          {gap.cluster_a} ⟷ {gap.cluster_b}
                        </h4>
                        <p className="text-xs sm:text-[13px] text-[var(--text-muted)] mt-2 leading-relaxed">
                          {gap.why_suspicious}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl glass-card text-xs sm:text-[13px] space-y-1.5 border-[var(--neon-green)]/30">
                      <span className="text-[11px] font-bold text-[var(--neon-green)] uppercase tracking-wide">
                        Recommended Lead:
                      </span>
                      <p className="text-[var(--text-main)] leading-relaxed">{gap.suggested_lead}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center text-[var(--text-muted)] text-xs rounded-2xl glass-panel">
                No unobserved network gaps detected in current graph topology.
              </div>
            )}
          </div>
        )}

        {/* --- TAB 4: RANKED ACTIONS --- */}
        {activeTab === 'next_actions' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="text-xs sm:text-[13px] text-[var(--text-muted)] uppercase font-bold tracking-widest">
                AI-Prioritized Next Investigative Steps
              </div>
              <span className="text-xs text-[var(--text-muted)]">Ranked by Topological Impact</span>
            </div>

            {nextActions.length > 0 ? (
              <div className="space-y-4">
                {nextActions.map((action, idx) => (
                  <div
                    key={action.id}
                    className="p-5 sm:p-6 rounded-3xl glass-panel flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl hover:border-[var(--neon-green)]/40 transition-all duration-150"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-2xl bg-[var(--neon-green)]/15 border border-[var(--neon-green)]/35 text-[var(--neon-green)] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 shadow-[0_0_10px_rgba(82,255,140,0.2)]">
                        #{idx + 1}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2.5">
                          <span className={`px-2.5 py-0.5 rounded text-[10.5px] font-bold border ${
                            action.priority === 'HIGH' 
                              ? 'bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] border-[var(--neon-pink)]/35 shadow-[0_0_8px_rgba(255,56,112,0.2)]' 
                              : 'bg-[var(--neon-amber)]/15 text-[var(--neon-amber)] border-[var(--neon-amber)]/35 shadow-[0_0_8px_rgba(255,174,25,0.2)]'
                          }`}>
                            {action.priority} PRIORITY
                          </span>
                          <span className="text-xs text-[var(--text-muted)]">
                            Target: <strong className="text-[var(--text-main)]">{action.target_entity}</strong> ({action.target_type})
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-[var(--text-main)] tracking-tight">
                          {action.title}
                        </h4>
                        <p className="text-xs sm:text-[13px] text-[var(--text-muted)] leading-relaxed max-w-4xl">
                          {action.why}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (action.action_category === 'FINANCIAL_SUBPOENA' && onNavigateTab) {
                          onNavigateTab('financial');
                        } else if (action.supporting_doc && onOpenEvidence) {
                          onOpenEvidence(action.supporting_doc);
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl glass-card text-[var(--neon-green)] hover:border-[var(--neon-green)]/60 text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all duration-150 active:scale-95 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(82,255,140,0.2)]"
                    >
                      {action.action_button_label} →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center text-[var(--text-muted)] text-xs rounded-2xl glass-panel">
                No recommended investigative actions generated yet. Ingest documents or load the demo investigation.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}