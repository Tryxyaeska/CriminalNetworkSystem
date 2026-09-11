import React, { useEffect, useState } from 'react';
import { 
  PanelRightClose, 
  ShieldAlert, 
  Phone, 
  Car, 
  MapPin, 
  CreditCard, 
  Users, 
  FileText, 
  Bot, 
  ExternalLink,
  Activity,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Target,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { fetchEntityDossier } from '../services/api';
import MetricTooltip from './MetricTooltip';

export default function EntityDossier({ 
  entityId, 
  isOpen = true, 
  onToggle, 
  onClose, 
  onOpenEvidence, 
  onAskCopilot 
}) {
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!entityId) return;
    setLoading(true);
    setDossier(null);
    setError(null);
    fetchEntityDossier(entityId)
      .then((data) => {
        setDossier(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dossier:', err);
        setError(err?.response?.data?.detail || err?.message || 'Failed to load entity details.');
        setLoading(false);
      });
  }, [entityId]);

  if (!entityId) return null;

  const handleCollapse = () => {
    if (onToggle) onToggle();
    else if (onClose) onClose();
  };

  const getWhyShouldICareText = () => {
    if (!dossier || !dossier.entity) return "";
    const name = dossier.entity.canonical_name;
    const type = dossier.entity.entity_type;
    const betweenness = dossier.entity.betweenness || 0;
    const degree = dossier.entity.degree || (dossier.direct_associates?.length || 0);

    if (name.includes("Vikram Malhotra")) {
      return "Vikram operates as the central coordinator and structural bridge across logistics transport, Kolkata Hawala accounts, and Delhi SIM distribution. He received Rs 15 Lakh RTGS outbound after smurfing deposits into Apex Logistics.";
    }
    if (name.includes("Rajesh Thapa")) {
      return "Rajesh directs the North-East logistics transport wing, issuing dispatch orders to truck drivers and meeting customs contacts at Haldia Port.";
    }
    if (name.includes("Suresh Agarwal")) {
      return "Suresh manages the Park Street bullion and Hawala desk, initiating structured cash routing into front company accounts.";
    }
    if (name.includes("Apex Logistics")) {
      return "Front transport company whose HDFC account received 14 structured sub-50k deposits ('Smurfing') before transferring Rs 15 Lakh to Vikram Malhotra.";
    }
    if (name.includes("Inspector S. K. Roy")) {
      return "Port customs official flagged by surveillance for physical off-duty meetings with syndicate couriers at Haldia Port Terminal 4.";
    }
    if (name.includes("+91-98555-66778")) {
      return "Hardware burner SIM gateway shared concurrently by 3 key syndicate suspects across different jurisdictions.";
    }

    if (betweenness > 0.15) {
      return `${name} connects multiple otherwise isolated groups in the syndicate and participates in multi-modal relationships across ${degree} connected entities.`;
    }
    return `${name} is an active ${type.toLowerCase()} entity linked across ${degree} direct relationships in the investigation knowledge graph.`;
  };

  return (
    <aside
      className={`relative h-full glass-panel border-l border-[var(--border-subtle)] flex flex-col justify-between select-none shrink-0 transition-[width,opacity] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] mono-font ${
        isOpen ? 'w-96 opacity-100' : 'w-0 opacity-0 overflow-hidden border-l-0 pointer-events-none'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-subtle)]/40 shrink-0">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-[var(--neon-green)]" />
          <h2 className="font-bold text-xs tracking-wider text-[var(--text-main)] uppercase">ENTITY DOSSIER (360°)</h2>
        </div>
        <button
          onClick={handleCollapse}
          title="Collapse Dossier"
          className="p-1 rounded-md glass-card text-[var(--text-muted)] hover:text-[var(--neon-green)] hover:border-[var(--neon-green)]/40 transition-all duration-150 active:scale-95 cursor-pointer"
        >
          <PanelRightClose className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-3">
          <Activity className="w-8 h-8 text-[var(--neon-green)] animate-spin" />
          <p className="text-xs text-[var(--text-muted)] font-mono">Compiling intelligence dossier...</p>
        </div>
      ) : dossier ? (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 text-xs">
          {/* Main Entity Card */}
          <div className="p-4 rounded-2xl glass-card space-y-3 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--neon-green)]/15 text-[var(--neon-green)] border border-[var(--neon-green)]/35 font-bold shadow-[0_0_8px_rgba(82,255,140,0.15)]">
                  {dossier.entity.entity_type}
                </span>
                <h3 className="text-base font-extrabold text-[var(--text-main)] mt-1.5">{dossier.entity.canonical_name}</h3>
                {dossier.entity.metadata?.aliases && (
                  <p className="text-[11px] text-[var(--text-muted)] font-medium mt-0.5">
                    Aliases: <span className="text-[var(--text-main)] font-mono">{dossier.entity.metadata.aliases.join(', ')}</span>
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono block">Risk Index</span>
                <span className="text-sm font-extrabold text-[var(--neon-pink)] font-mono">
                  {Math.round((dossier.entity.risk_score || 0.5) * 100)}/100
                </span>
              </div>
            </div>

            {dossier.entity.metadata?.role && (
              <p className="text-[11px] text-[var(--neon-amber)] font-medium bg-[var(--neon-amber)]/10 p-2 rounded-lg border border-[var(--neon-amber)]/25">
                ⚡ {dossier.entity.metadata.role}
              </p>
            )}

            {/* Quick Copilot Action */}
            <button
              onClick={() => onAskCopilot && onAskCopilot(`Why is ${dossier.entity.canonical_name} considered an important entity?`)}
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-[var(--neon-green)]/15 hover:bg-[var(--neon-green)]/25 text-[var(--neon-green)] font-semibold border border-[var(--neon-green)]/35 transition-all text-xs active:scale-95 cursor-pointer shadow-[0_0_10px_rgba(82,255,140,0.15)]"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Investigator About This Entity</span>
            </button>
          </div>

          {/* Significance */}
          <div className="p-3.5 rounded-2xl bg-[var(--neon-amber)]/10 border border-[var(--neon-amber)]/30 space-y-1.5 shadow-sm">
            <div className="flex items-center space-x-1.5 text-[var(--neon-amber)] font-mono text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Why Should I Care? (Investigative Significance)</span>
            </div>
            <p className="text-[11.5px] text-[var(--text-main)] leading-relaxed">
              {getWhyShouldICareText()}
            </p>

            <div className="pt-2 border-t border-[var(--neon-amber)]/20 flex items-center justify-between text-[10.5px] font-mono text-[var(--text-muted)]">
              <span className="flex items-center">
                <span>Bridge Score: {dossier.entity.betweenness || '0.00'}</span>
                <MetricTooltip term="betweenness" />
              </span>
              <span className="flex items-center">
                <span>Connections: {dossier.direct_associates?.length || 0}</span>
                <MetricTooltip term="degree" />
              </span>
            </div>
          </div>

          {/* Direct Associates */}
          {dossier.direct_associates?.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center space-x-1.5 text-[var(--text-muted)] font-semibold font-mono text-[10px] uppercase">
                <Users className="w-3.5 h-3.5 text-[var(--neon-green)]" />
                <span>Direct Associates ({dossier.direct_associates.length})</span>
              </div>
              <div className="space-y-1">
                {dossier.direct_associates.map((assoc, idx) => (
                  <div key={idx} className="p-2 rounded-xl glass-card flex items-center justify-between">
                    <div>
                      <span className="font-medium text-[var(--text-main)]">{assoc.name}</span>
                      <span className="block text-[10px] text-[var(--text-muted)] font-mono">{assoc.relationship}</span>
                    </div>
                    {assoc.doc_id && (
                      <button
                        onClick={() => onOpenEvidence && onOpenEvidence(assoc.doc_id)}
                        title="View Evidence Source"
                        className="text-[var(--neon-green)] hover:text-[var(--text-main)] p-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Associated Infrastructure */}
          <div className="space-y-3">
            {dossier.associated_phones?.length > 0 && (
              <div>
                <div className="flex items-center space-x-1.5 text-[var(--text-muted)] font-semibold font-mono text-[10px] uppercase mb-1">
                  <Phone className="w-3.5 h-3.5 text-[var(--neon-green)]" />
                  <span>Linked Communications</span>
                </div>
                {dossier.associated_phones.map((p, idx) => (
                  <div key={idx} className="p-1.5 px-2.5 rounded glass-card font-mono text-[var(--text-main)] text-[11px] mb-1">
                    {p.name}
                  </div>
                ))}
              </div>
            )}

            {dossier.associated_vehicles?.length > 0 && (
              <div>
                <div className="flex items-center space-x-1.5 text-[var(--text-muted)] font-semibold font-mono text-[10px] uppercase mb-1">
                  <Car className="w-3.5 h-3.5 text-[var(--neon-pink)]" />
                  <span>Linked Vehicles</span>
                </div>
                {dossier.associated_vehicles.map((v, idx) => (
                  <div key={idx} className="p-1.5 px-2.5 rounded glass-card font-mono text-[var(--text-main)] text-[11px] mb-1">
                    {v.name}
                  </div>
                ))}
              </div>
            )}

            {dossier.associated_accounts?.length > 0 && (
              <div>
                <div className="flex items-center space-x-1.5 text-[var(--text-muted)] font-semibold font-mono text-[10px] uppercase mb-1">
                  <CreditCard className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
                  <span>Financial Channels</span>
                </div>
                {dossier.associated_accounts.map((acc, idx) => (
                  <div key={idx} className="p-1.5 px-2.5 rounded glass-card font-mono text-[var(--text-main)] text-[11px] mb-1">
                    {acc.name}
                  </div>
                ))}
              </div>
            )}

            {dossier.associated_locations?.length > 0 && (
              <div>
                <div className="flex items-center space-x-1.5 text-[var(--text-muted)] font-semibold font-mono text-[10px] uppercase mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--neon-amber)]" />
                  <span>Known Operating Locations</span>
                </div>
                {dossier.associated_locations.map((loc, idx) => (
                  <div key={idx} className="p-1.5 px-2.5 rounded glass-card text-[var(--text-main)] text-[11px] mb-1">
                    {loc.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Evidence Records */}
          {dossier.evidence_records?.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center space-x-1.5 text-[var(--text-muted)] font-semibold font-mono text-[10px] uppercase">
                <FileText className="w-3.5 h-3.5 text-[var(--neon-amber)]" />
                <span>Primary Document Evidence</span>
              </div>
              <div className="space-y-1.5">
                {dossier.evidence_records.map((doc, idx) => (
                  <div
                    key={idx}
                    onClick={() => onOpenEvidence && onOpenEvidence(doc.id)}
                    className="p-2 rounded-xl glass-card hover:border-[var(--neon-green)]/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[var(--neon-green)]">{doc.id}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded glass-card text-[var(--text-muted)] font-mono">{doc.source_type}</span>
                    </div>
                    <p className="text-[var(--text-main)] font-medium text-[11px] mt-1 line-clamp-1">{doc.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : error ? (
        <div className="p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-[var(--neon-pink)] mx-auto" />
          <p className="text-xs text-[var(--neon-pink)] font-mono font-semibold">Failed to Load Dossier</p>
          <p className="text-[11px] text-[var(--text-muted)]">{error}</p>
          <p className="text-[10px] text-[var(--text-muted)] font-mono">Entity ID: {entityId}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchEntityDossier(entityId)
                .then((data) => { setDossier(data); setLoading(false); })
                .catch((err) => { setError(err?.response?.data?.detail || err?.message || 'Failed to load entity details.'); setLoading(false); });
            }}
            className="px-3 py-1.5 rounded-lg glass-card text-[var(--text-main)] hover:border-[var(--neon-green)]/40 text-xs font-mono transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="p-6 text-center text-[var(--text-muted)] text-xs">Entity details not available.</div>
      )}
    </aside>
  );
}