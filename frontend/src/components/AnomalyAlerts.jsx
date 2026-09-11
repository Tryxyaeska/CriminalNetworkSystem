import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  FileText, 
  Bot,
  Filter,
  Layers,
  Sparkles,
  Phone,
  CreditCard,
  MapPin,
  Cpu
} from 'lucide-react';
import { fetchAlerts, verifyAlert } from '../services/api';
import MetricTooltip from './MetricTooltip';

const CATEGORY_ICONS = {
  COMMUNICATION_BURST: Phone,
  UNUSUAL_TRANSACTION_STRUCTURING: CreditCard,
  CROSS_COMMUNITY_BRIDGE: Layers,
  SHARED_INFRASTRUCTURE: Cpu,
  REPEATED_LOCATION_OVERLAP: MapPin
};

export default function AnomalyAlerts({ onSelectEntity, onOpenEvidence, onAskCopilot, onHighlightEntities }) {
  const [alerts, setAlerts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = () => {
    setLoading(true);
    fetchAlerts()
      .then((data) => {
        setAlerts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching alerts:', err);
        setLoading(false);
      });
  };

  const handleVerify = (alertId, status) => {
    verifyAlert(alertId, status)
      .then(() => {
        setAlerts(alerts.map(a => a.id === alertId ? { ...a, status } : a));
      })
      .catch(console.error);
  };

  const filteredAlerts = alerts.filter((a) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'COMMUNICATION') return a.rule_name.includes('COMMUNICATION');
    if (activeCategory === 'FINANCIAL') return a.rule_name.includes('TRANSACTION');
    if (activeCategory === 'NETWORK') return a.rule_name.includes('BRIDGE');
    if (activeCategory === 'DEVICE') return a.rule_name.includes('SHARED') || a.rule_name.includes('INFRASTRUCTURE');
    if (activeCategory === 'LOCATION') return a.rule_name.includes('LOCATION');
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[var(--bg-base)] overflow-y-auto select-none p-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-[var(--neon-pink)]/10 border border-[var(--neon-pink)]/30 text-[var(--neon-pink)] shadow-sm shadow-[var(--neon-pink)]/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-[var(--text-main)] tracking-tight flex items-center space-x-2">
              <span>Anomaly Center: Explainable Signal Detection</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] border border-[var(--neon-pink)]/30 font-bold tracking-wider">
                {alerts.length} ACTIVE SIGNALS
              </span>
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Deterministic rule heuristics detecting Hawala structuring, pre-incident call bursts, and shared burner SIMs.
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[var(--bg-surface)]/90 border border-[var(--border-subtle)] text-xs font-mono">
          {['ALL', 'COMMUNICATION', 'FINANCIAL', 'NETWORK', 'DEVICE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg transition-all duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 ${
                activeCategory === cat
                  ? 'bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] border border-[var(--neon-pink)]/40 font-bold shadow-[0_0_10px_rgba(255,56,112,0.15)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border border-transparent hover:bg-[var(--border-subtle)]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Grid */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center space-y-3">
          <div className="w-6 h-6 border-2 border-[var(--neon-pink)] border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs text-[var(--text-muted)]">Executing real-time anomaly detector scans...</p>
        </div>
      ) : filteredAlerts.length > 0 ? (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const IconComponent = CATEGORY_ICONS[alert.rule_name] || AlertTriangle;
            const isLive = alert.source === 'live_detection';
            const isHighSeverity = alert.severity === 'HIGH' || alert.severity === 'CRITICAL';

            return (
              <div
                key={alert.id}
                className="p-5 rounded-2xl bg-[var(--bg-surface)]/70 backdrop-blur-md border border-[var(--border-subtle)] space-y-4 shadow-xl hover:border-[var(--neon-cyan)]/50 transition-all duration-150 ease-[cubic-bezier(0.25,1,0.5,1)]"
              >
                {/* Alert Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--neon-cyan)] shrink-0 mt-0.5">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          isHighSeverity
                            ? 'bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] border-[var(--neon-pink)]/30'
                            : 'bg-[var(--neon-amber)]/15 text-[var(--neon-amber)] border-[var(--neon-amber)]/30'
                        }`}>
                          {alert.severity} SEVERITY
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-bold border ${
                          isLive 
                            ? 'bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] border-[var(--neon-pink)]/30' 
                            : 'bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] border-[var(--neon-cyan)]/30'
                        }`}>
                          {isLive ? 'LIVE DETECTION' : 'CASE FILE RECORD'}
                        </span>
                        <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center">
                          <span>Rule: {alert.rule_name}</span>
                          {alert.rule_name.includes('BRIDGE') && <MetricTooltip term="betweenness" />}
                          {alert.rule_name.includes('COMMUNITY') && <MetricTooltip term="community" />}
                        </span>
                        <span className="text-[11px] font-mono text-[var(--neon-cyan)]">
                          Confidence: {Math.round((alert.confidence || 0.9) * 100)}%
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[var(--text-main)] mt-1">
                        {alert.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVerify(alert.id, 'VERIFIED')}
                      className={`px-2.5 py-1 rounded-lg font-mono text-[11px] flex items-center space-x-1 transition-all duration-150 active:scale-95 ${
                        alert.status === 'VERIFIED'
                          ? 'bg-[var(--neon-green)]/15 text-[var(--neon-green)] border border-[var(--neon-green)]/40 font-bold'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:text-[var(--text-main)] hover:border-[var(--neon-green)]/30'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verify</span>
                    </button>

                    <button
                      onClick={() => handleVerify(alert.id, 'DISMISSED')}
                      className={`px-2.5 py-1 rounded-lg font-mono text-[11px] flex items-center space-x-1 transition-all duration-150 active:scale-95 ${
                        alert.status === 'DISMISSED'
                          ? 'bg-[var(--border-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:text-[var(--text-main)] hover:border-[var(--neon-pink)]/30'
                      }`}
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Dismiss</span>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[var(--text-muted)] leading-relaxed pl-10">
                  {alert.description}
                </p>

                {/* Entities & Evidence Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)] text-xs font-mono">
                  {/* Linked Entities */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[var(--text-muted)]">Involved Entities:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {alert.entity_ids?.map((eid) => (
                        <button
                          key={eid}
                          onClick={() => {
                            if (onSelectEntity) onSelectEntity(eid);
                          }}
                          className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] text-[var(--neon-cyan)] border border-[var(--border-subtle)] hover:border-[var(--neon-cyan)]/40 text-[10.5px] transition-all duration-150 active:scale-95"
                        >
                          {eid}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Evidence Source Docs */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[var(--text-muted)]">Supporting Docs:</span>
                    <div className="flex items-center space-x-1.5">
                      {alert.evidence_document_ids?.map((did) => (
                        <button
                          key={did}
                          onClick={() => {
                            if (onOpenEvidence) onOpenEvidence(did);
                          }}
                          className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] text-[var(--neon-amber)] border border-[var(--border-subtle)] hover:border-[var(--neon-amber)]/40 text-[10.5px] flex items-center space-x-1 transition-all duration-150 active:scale-95"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{did}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 flex flex-col items-center justify-center space-y-2 text-center rounded-2xl bg-[var(--bg-surface)]/60 border border-[var(--border-subtle)]">
          <AlertTriangle className="w-8 h-8 text-[var(--text-muted)]" />
          <p className="font-mono text-xs text-[var(--text-main)] font-bold">No Alerts Detected in this Category</p>
          <p className="text-[11px] text-[var(--text-muted)] max-w-sm">
            No suspicious activity patterns match the "{activeCategory}" filter. Switch categories, ingest a document, or load the demo investigation.
          </p>
        </div>
      )}
    </div>
  );
}