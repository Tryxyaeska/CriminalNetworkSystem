import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  FileText, 
  Network, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  TrendingUp,
  Compass,
  Play,
  CreditCard,
  Phone,
  Target,
  BookOpen
} from 'lucide-react';
import { fetchNetworkStats, fetchAlerts, fetchCentrality } from '../services/api';
import MetricTooltip from '../components/MetricTooltip';

export default function DashboardView({ 
  onNavigate, 
  onSelectEntity, 
  onStartDemo, 
  isDemoLoading, 
  onOpenStoryModal,
  onOpenTutorial,
  activeCase,
  onOpenNewCase
}) {
  const [stats, setStats] = useState({
    total_entities: 0,
    total_relationships: 0,
    total_documents: 0,
    total_alerts: 0,
    total_communities: 0,
    high_risk_entities_count: 0
  });
  const [influentialEntities, setInfluentialEntities] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchNetworkStats().then(setStats).catch(console.error),
      fetchCentrality(4).then(setInfluentialEntities).catch(console.error),
      fetchAlerts().then((a) => setActiveAlerts(a.slice(0, 3))).catch(console.error)
    ]).finally(() => setLoading(false));
  }, []);

  const hasData = stats.total_entities > 0;
  const currentCaseName = activeCase?.name || (hasData ? 'Operation ShadowNet' : 'New Investigation Workspace');
  const currentCaseId = activeCase?.id || (hasData ? 'SIH-26189-SHADOWNET' : 'CASE-NEW-001');
  const currentCaseDesc = activeCase?.description || (
    hasData 
      ? 'Dimapur → Kolkata Contraband Transit, Hawala Layering & Corrupt Port Clearance Network'
      : 'Active investigation workspace. Ingest incident records, FIRs, or CDR dumps to reconstruct multi-modal intelligence graphs.'
  );

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-transparent p-6 space-y-6 select-none mono-font">
      {/* Top Case Hero Header */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-7 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2.5">
              <span className={`px-3 py-0.5 rounded-md text-[11px] font-bold border tracking-wide ${
                hasData 
                  ? 'bg-[var(--neon-green)]/15 text-[var(--neon-green)] border-[var(--neon-green)]/35 shadow-[0_0_10px_rgba(82,255,140,0.2)]' 
                  : 'bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] border-[var(--neon-cyan)]/35 shadow-[0_0_10px_rgba(34,231,233,0.2)]'
              }`}>
                {hasData ? 'ACTIVE INVESTIGATION' : 'WORKSPACE READY'}
              </span>
              <span className="text-xs text-[var(--text-muted)] tracking-tight">
                Case ID: {currentCaseId}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-main)] tracking-tight uppercase">
              {currentCaseName}
            </h1>
            <p className="text-xs sm:text-[13px] text-[var(--text-muted)] leading-relaxed">
              {currentCaseDesc}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {onOpenStoryModal && hasData && activeCase?.name === 'Operation ShadowNet' && (
              <button
                onClick={onOpenStoryModal}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[var(--neon-green)] hover:brightness-110 text-[var(--bg-subtle)] font-bold text-xs transition-all duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 shadow-[0_0_15px_rgba(82,255,140,0.35)] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START DEMO STORY (3 MIN)</span>
              </button>
            )}

            {onOpenTutorial && (
              <button
                onClick={onOpenTutorial}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl glass-card text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/50 text-xs transition-all duration-150 active:scale-95 shadow-sm cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Feature Guide</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('network')}
              className="flex items-center space-x-1.5 px-6 py-3 rounded-xl glass-card text-[var(--text-main)] text-xs transition-all duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 hover:text-[var(--neon-green)] hover:border-[var(--neon-green)]/40 cursor-pointer"
            >
              <span>Explore Graph →</span>
            </button>
          </div>
        </div>

        {/* Live Case Counts Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-[var(--border-subtle)]">
          {[
            { label: 'Evidence Records', val: stats.total_documents, icon: FileText, color: 'var(--neon-amber)' },
            { label: 'Resolved Entities', val: stats.total_entities, icon: Users, color: 'var(--neon-cyan)' },
            { label: 'Reconstructed Links', val: stats.total_relationships, icon: Network, color: 'var(--neon-green)' },
            { label: 'Active Anomalies', val: stats.total_alerts, icon: AlertTriangle, color: 'var(--neon-pink)' },
          ].map((stat, i) => (
            <div key={i} className="p-3.5 rounded-xl glass-card flex items-center space-x-3.5">
              <div className="p-2.5 rounded-lg border" style={{ backgroundColor: `${stat.color}22`, borderColor: `${stat.color}44`, color: stat.color, boxShadow: `0 0 10px ${stat.color}22` }}>
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-xl font-black text-[var(--text-main)]">{stat.val}</div>
                <div className="text-[10.5px] text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Investigation Brief & Why This Matters */}
      {stats.total_entities > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Left 2 Cols: AI Investigation Brief */}
          <div className="lg:col-span-2 p-7 rounded-3xl glass-panel flex flex-col justify-between space-y-6 shadow-xl min-h-[520px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-[var(--border-subtle)]/70">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-md bg-[var(--neon-amber)]/20 text-[var(--neon-amber)] border border-[var(--neon-amber)]/35 shadow-[0_0_8px_rgba(255,174,25,0.2)]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h2 className="text-xs sm:text-sm font-bold text-[var(--neon-amber)] uppercase tracking-widest">
                    AI Investigation Executive Brief
                  </h2>
                </div>
                <span className="text-[11px] text-[var(--text-muted)]">Model: CRIMENET-Copilot-v2</span>
              </div>

              <div className="space-y-3.5 text-xs sm:text-[13px] text-[var(--text-main)] leading-relaxed">
                {activeCase?.name === 'Operation ShadowNet' ? (
                  <>
                    <p className="font-semibold text-sm sm:text-base tracking-tight text-[var(--text-main)]">
                      CRIMENET AI identified a highly coordinated syndicate linking North-East transport logistics, Kolkata Hawala desks, and corrupt customs clearance at Haldia Port.
                    </p>
                    <p className="text-[var(--text-muted)] leading-relaxed">
                      <strong className="text-[var(--text-main)]">Vikram Malhotra (PER_001)</strong> emerges as the primary high-value target. He operates as the sole structural bridge across three isolated clusters, showing synchronized multi-hop communication and banking surges throughout February 2026.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-sm sm:text-base tracking-tight text-[var(--text-main)]">
                      CRIMENET AI reconstructed an intelligence graph containing {stats.total_entities} entities and {stats.total_relationships} relationships across {stats.total_documents} evidence records.
                    </p>
                    <p className="text-[var(--text-muted)] leading-relaxed">
                      {influentialEntities.length > 0 ? (
                        <>
                          <strong className="text-[var(--text-main)]">{influentialEntities[0].name} ({influentialEntities[0].id})</strong> emerges as the top ranked lead with influence score {influentialEntities[0].influence_score}.
                        </>
                      ) : (
                        <>Ingested records have been indexed into the investigation workspace.</>
                      )}
                    </p>
                  </>
                )}
              </div>

              {/* Key Analytical Signals */}
              {activeCase?.name === 'Operation ShadowNet' ? (
                <div className="space-y-2.5 pt-4 border-t border-[var(--border-subtle)]">
                  <div className="text-[11px] text-[var(--text-muted)] uppercase font-bold tracking-widest">
                    Key Analytical Signals & Evidence Corroboration
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {[
                      { title: '1. Cross-Community Bridge', desc: 'Betweenness Centrality index of 0.48. Bridges North-East logistics, Kolkata Hawala, and Delhi tech cells.', color: 'var(--neon-cyan)', term: 'betweenness' },
                      { title: '2. Financial Structuring', desc: 'Received Rs 15,00,000 RTGS outward after 14 structured sub-50k deposits into Apex Logistics.', color: 'var(--neon-amber)' },
                      { title: '3. Pre-Incident Call Surge', desc: '+340% communication volume spike recorded between Feb 12-16 across key transport leads.', color: 'var(--neon-green)' },
                      { title: '4. Shared Gateway SIM', desc: 'Concurrent hardware binding detected on GSM burner +91-98555-66778 across 3 suspects.', color: 'var(--neon-pink)' }
                    ].map((sig, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl glass-card space-y-1.5 hover:border-[var(--border-focus)] transition-colors">
                        <div className="flex items-center space-x-2 text-xs sm:text-[12.5px] font-bold" style={{ color: sig.color }}>
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sig.color, boxShadow: `0 0 8px ${sig.color}` }} />
                          <span>{sig.title}</span>
                          {sig.term && <MetricTooltip term={sig.term} />}
                        </div>
                        <p className="text-[11.5px] text-[var(--text-muted)] leading-relaxed">{sig.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 pt-4 border-t border-[var(--border-subtle)]">
                  <div className="text-[11px] text-[var(--text-muted)] uppercase font-bold tracking-widest">
                    Case Network Topology
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="p-3.5 rounded-xl glass-card space-y-1.5">
                      <div className="flex items-center space-x-2 text-xs font-bold text-[var(--neon-cyan)]">
                        <span className="w-2 h-2 rounded-full bg-[var(--neon-cyan)] shadow-[0_0_8px_var(--neon-cyan)]" />
                        <span>Graph Density</span>
                        <MetricTooltip term="density" />
                      </div>
                      <p className="text-[11.5px] text-[var(--text-muted)]">
                        Network density score: {stats.density || 0.0} across {stats.total_communities || 1} clusters.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl glass-card space-y-1.5">
                      <div className="flex items-center space-x-2 text-xs font-bold text-[var(--neon-amber)]">
                        <span className="w-2 h-2 rounded-full bg-[var(--neon-amber)] shadow-[0_0_8px_var(--neon-amber)]" />
                        <span>High Risk Leads</span>
                      </div>
                      <p className="text-[11.5px] text-[var(--text-muted)]">
                        {stats.high_risk_entities_count || 0} entities flagged with elevated risk indicators.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)]/70 flex flex-wrap items-center justify-between gap-3">
              {influentialEntities.length > 0 && (
                <button
                  onClick={() => {
                    onSelectEntity(influentialEntities[0].id);
                    onNavigate('network');
                  }}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[var(--neon-green)] text-[var(--bg-subtle)] hover:brightness-110 font-bold text-xs transition-all duration-150 active:scale-95 shadow-[0_0_14px_rgba(82,255,140,0.35)] cursor-pointer"
                >
                  <span>Investigate {influentialEntities[0].name} (Focus Mode) →</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('leads')}
                className="text-xs text-[var(--neon-green)] hover:underline flex items-center space-x-1 transition-colors cursor-pointer ml-auto"
              >
                <span>Test Hypotheses Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Col: Top Ranked Leads & Next Action */}
          <div className="flex flex-col justify-between space-y-5">
            {/* Top Leads Box */}
            <div className="p-6 rounded-3xl glass-panel space-y-4 shadow-xl flex-1">
              <div className="flex items-center justify-between pb-1 border-b border-[var(--border-subtle)]/70">
                <h3 className="text-xs sm:text-[13px] font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center">
                  <span>Priority Leads</span>
                  <MetricTooltip term="influence" />
                </h3>
                <span className="text-[10px] text-[var(--text-muted)]">Ranked by Influence</span>
              </div>

              <div className="space-y-2.5">
                {loading ? (
                  <div className="p-4 text-center text-[var(--text-muted)] text-xs font-mono">
                    Loading ranked leads...
                  </div>
                ) : influentialEntities.length > 0 ? (
                  influentialEntities.map((ent, idx) => (
                    <button
                      key={ent.id}
                      onClick={() => {
                        onSelectEntity(ent.id);
                        onNavigate('network');
                      }}
                      className="w-full p-3 rounded-xl glass-card text-left transition-all duration-150 active:scale-95 flex items-center justify-between group cursor-pointer"
                    >
                      <div className="space-y-1">
                        <div className="text-xs sm:text-[13px] font-bold text-[var(--text-main)] group-hover:text-[var(--neon-green)] flex items-center space-x-2 transition-colors">
                          <span className="text-[var(--text-muted)] text-[10.5px]">#{idx + 1}</span>
                          <span>{ent.name}</span>
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">
                          {ent.role || ent.type} • Score: {ent.influence_score}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--neon-green)] transition-colors" />
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-[var(--text-muted)] text-xs">
                    No entities ranked yet. Ingest documents or load the demo investigation.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Jump to Next Action */}
            <div className="p-5 rounded-3xl glass-card border-[var(--neon-green)]/35 space-y-2.5 shadow-[0_0_15px_rgba(82,255,140,0.12)]">
              <div className="flex items-center space-x-2 text-xs sm:text-[12.5px] font-bold text-[var(--neon-green)] uppercase tracking-wide">
                <Target className="w-4 h-4" />
                <span>Recommended Next Step</span>
              </div>
              <p className="text-xs sm:text-[12.5px] text-[var(--text-main)] leading-relaxed">
                Subpoena CDR records for shared burner SIM (+91-98555-66778) used concurrently by 3 key suspects.
              </p>
              <button
                onClick={() => onNavigate('leads')}
                className="text-xs text-[var(--neon-green)] hover:underline flex items-center space-x-1 pt-1 transition-colors cursor-pointer"
              >
                <span>View All Recommended Actions →</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Investigation State after Reset */
        <div className="p-12 rounded-3xl glass-panel text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl glass-card border border-[var(--border-subtle)] flex items-center justify-center text-[var(--neon-green)] shadow-xl">
            <FileText className="w-8 h-8" />
          </div>
          
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-lg font-black text-[var(--text-main)] font-mono">
              Investigation Workspace Ready
            </h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              No active evidence records, suspects, or phone logs currently indexed. Ingest raw FIRs, CDR manifests, or financial intelligence reports to begin automated network reconstruction.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('documents')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[var(--neon-green)] hover:brightness-110 text-[var(--bg-subtle)] font-bold font-mono text-xs transition-all shadow-[0_0_12px_rgba(82,255,140,0.35)] active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Ingest FIR / Evidence Document →</span>
            </button>

            {onOpenNewCase && (
              <button
                onClick={onOpenNewCase}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl glass-card text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/50 font-mono text-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>+ Create Custom Case Title</span>
              </button>
            )}

            {onOpenTutorial && (
              <button
                onClick={onOpenTutorial}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl glass-card text-[var(--neon-amber)] hover:border-[var(--neon-amber)]/50 font-mono text-xs transition-all active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>System Guide (Tutorial)</span>
              </button>
            )}

            {onStartDemo && (
              <button
                onClick={onStartDemo}
                disabled={isDemoLoading}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl glass-card text-[var(--text-main)] hover:border-[var(--border-focus)] font-mono text-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>{isDemoLoading ? 'Loading Scenario...' : 'Load Sample Case (Operation ShadowNet)'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}