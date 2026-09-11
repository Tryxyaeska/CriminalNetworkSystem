import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ArrowRight, 
  ShieldAlert, 
  FileText, 
  Sparkles, 
  Building2, 
  User, 
  ExternalLink,
  Layers,
  ArrowDown
} from 'lucide-react';
import { fetchFinancialFlow } from '../services/api';

export default function MoneyFlowView({ onSelectEntity, onOpenEvidence, onAskCopilot }) {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialFlow()
      .then((data) => {
        setFinancialData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading financial flow:', err);
        setLoading(false);
      });
  }, []);

  const layeringSteps = [
    {
      step: 1,
      entityId: "PER_004",
      name: "Suresh Agarwal",
      type: "PERSON / HAWALA OPERATOR",
      role: "Hawala Desk Operator (Park Street)",
      action: "Initiates Hawala cash deposits into front company accounts",
      amount: "Rs 15,00,000 (Aggregated)",
      badge: "ORIGIN OF ILLICIT FUNDS",
      badgeColor: "var(--neon-pink)",
      docId: "DOC_INTEL_002"
    },
    {
      step: 2,
      entityId: "ORG_001",
      name: "Apex Logistics Pvt Ltd",
      type: "ORGANIZATION / FRONT ENTITY",
      role: "Front Transport Company (Dir. Neha Sen)",
      action: "Receives 14 structured deposits of Rs 49,000 each (Smurfing)",
      amount: "14 x Rs 49,000 Deposits",
      badge: "SMURFING CONSOLIDATION",
      badgeColor: "var(--neon-amber)",
      docId: "DOC_BANK_005"
    },
    {
      step: 3,
      entityId: "ACC_001",
      name: "HDFC-CA-9988221100",
      type: "CURRENT ACCOUNT",
      role: "HDFC Corporate Pool (Apex Logistics)",
      action: "Consolidates deposits and executes single high-value RTGS transfer",
      amount: "Rs 15,00,000 (RTGS Outbound)",
      badge: "BANKING LAYERING CHANNEL",
      badgeColor: "var(--neon-cyan)",
      docId: "DOC_BANK_005"
    },
    {
      step: 4,
      entityId: "ACC_002",
      name: "AXIS-SB-4455667788",
      type: "SAVINGS ACCOUNT",
      role: "Axis Bank Personal Account",
      action: "Destination account receiving layered RTGS payout",
      amount: "Rs 15,00,000 Received",
      badge: "PAYOUT RECEIVER",
      badgeColor: "var(--neon-green)",
      docId: "DOC_BANK_005"
    },
    {
      step: 5,
      entityId: "PER_001",
      name: "Vikram Malhotra",
      type: "PERSON / KINGPIN",
      role: "Syndicate Coordinator",
      action: "Account holder and ultimate beneficiary of Hawala transfer chain",
      amount: "Beneficiary Payout",
      badge: "FINAL DESTINATION",
      badgeColor: "var(--neon-green)",
      docId: "DOC_INTEL_008"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto custom-scrollbar select-none p-7 space-y-7 mono-font">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-[var(--neon-green)]/15 border border-[var(--neon-green)]/35 text-[var(--neon-green)] shadow-[0_0_12px_rgba(82,255,140,0.2)] shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-[var(--text-main)] tracking-tight">
                Financial Intelligence: Hawala Layering
              </h1>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[var(--neon-green)]/15 text-[var(--neon-green)] border border-[var(--neon-green)]/35 shadow-[0_0_8px_rgba(82,255,140,0.15)] tracking-wide">
                AML FLOW
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-[var(--text-muted)]">
              Reconstruction of money routing from Hawala desk through corporate front accounts to the syndicate coordinator.
            </p>
          </div>
        </div>

        <button
          onClick={() => onAskCopilot && onAskCopilot("Explain the financial transactions linking Suresh Agarwal, Apex Logistics, and Vikram Malhotra.")}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl glass-card text-[var(--neon-green)] hover:border-[var(--neon-green)]/50 text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-95 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI Investigator →</span>
        </button>
      </div>

      {/* Dynamic Content or Empty State */}
      {financialData?.total_transfers > 0 && financialData?.nodes?.length > 0 ? (
        <>
          {/* AML Alert Flag Summary Banner */}
          {financialData.nodes.some(n => n.id === 'PER_001') ? (
            <div className="p-5 rounded-2xl bg-[var(--neon-amber)]/10 glass-panel border border-[var(--neon-amber)]/35 flex items-start space-x-4 shadow-lg">
              <div className="p-2 rounded-xl bg-[var(--neon-amber)]/15 border border-[var(--neon-amber)]/30 text-[var(--neon-amber)] shrink-0 mt-0.5 shadow-[0_0_8px_rgba(255,174,25,0.2)]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="text-xs sm:text-[13px] font-bold text-[var(--neon-amber)] uppercase tracking-wider">
                  Detected Financial Structuring Alert (FIU STR #882 / PMLA Rule 4.2)
                </div>
                <p className="text-xs sm:text-[13px] text-[var(--text-main)] leading-relaxed">
                  14 cash deposits of <span className="font-bold text-[var(--neon-amber)]">Rs 49,000</span> were structured consecutively into Apex Logistics (HDFC-CA-9988221100) specifically to avoid the mandatory Rs 50,000 CTR / PAN reporting threshold (<span className="text-[var(--neon-pink)] font-semibold">"Smurfing"</span>), followed by an immediate single RTGS transfer of <span className="font-bold text-[var(--neon-green)]">Rs 15,00,000</span> to Vikram Malhotra's personal Axis Bank savings account.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-[var(--neon-cyan)]/10 glass-panel border border-[var(--neon-cyan)]/35 flex items-start space-x-4 shadow-lg">
              <div className="p-2 rounded-xl bg-[var(--neon-cyan)]/15 border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] shrink-0 mt-0.5">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="text-xs sm:text-[13px] font-bold text-[var(--neon-cyan)] uppercase tracking-wider">
                  Active Financial Flow Network
                </div>
                <p className="text-xs sm:text-[13px] text-[var(--text-main)] leading-relaxed">
                  Tracking {financialData.total_transfers} financial transfers across {financialData.nodes.length} entities and accounts.
                </p>
              </div>
            </div>
          )}

          {/* Flow Diagram */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs sm:text-sm text-[var(--text-muted)] uppercase font-bold tracking-widest flex items-center space-x-2">
                <span>{financialData.nodes.some(n => n.id === 'PER_001') ? 'Multi-Hop Hawala Transfer Chain (A → B → C → D → E)' : 'Reconstructed Financial Trail'}</span>
                {financialData.nodes.some(n => n.id === 'PER_001') && (
                  <span className="text-[10px] text-[var(--neon-green)] glass-card px-2 py-0.5 rounded">5 STAGES AUDITED</span>
                )}
              </div>
              <span className="text-xs text-[var(--text-muted)]">Chronological Money Flow</span>
            </div>

            {financialData.nodes.some(n => n.id === 'PER_001') ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-stretch">
                {layeringSteps.map((step) => (
                  <div
                    key={step.step}
                    className="relative p-5 rounded-2xl glass-panel hover:border-[var(--border-focus)] transition-all duration-200 flex flex-col justify-between space-y-4 shadow-xl group min-h-[330px]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                        <span 
                          className="px-2.5 py-0.5 rounded text-[10px] font-bold border tracking-wider"
                          style={{ backgroundColor: `${step.badgeColor}22`, color: step.badgeColor, borderColor: `${step.badgeColor}55`, boxShadow: `0 0 8px ${step.badgeColor}22` }}
                        >
                          {step.badge}
                        </span>
                        <span className="text-xs font-bold text-[var(--text-muted)]">
                          STEP 0{step.step}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <button
                          onClick={() => onSelectEntity && onSelectEntity(step.entityId)}
                          className="text-sm sm:text-base font-bold text-[var(--text-main)] group-hover:text-[var(--neon-green)] text-left transition-colors truncate w-full cursor-pointer"
                        >
                          {step.name}
                        </button>
                        <div className="text-xs text-[var(--text-muted)] tracking-tight">
                          {step.type}
                        </div>
                      </div>

                      <p className="text-xs sm:text-[12.5px] text-[var(--text-muted)] leading-relaxed">
                        {step.action}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
                      <div className="text-xs sm:text-sm font-bold tracking-tight" style={{ color: step.badgeColor }}>
                        {step.amount}
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <button
                          onClick={() => onOpenEvidence && onOpenEvidence(step.docId)}
                          className="text-[11px] text-[var(--neon-green)] hover:underline flex items-center space-x-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{step.docId}</span>
                        </button>

                        <button
                          onClick={() => onSelectEntity && onSelectEntity(step.entityId)}
                          className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                        >
                          Dossier →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {financialData.edges.map((tx, idx) => (
                  <div key={tx.id || idx} className="p-4 rounded-2xl glass-card space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--neon-cyan)] font-bold">
                      <span>Transfer #{idx + 1}</span>
                      <span className="text-[var(--text-muted)]">{tx.timestamp || 'Recorded'}</span>
                    </div>
                    <div className="text-xs text-[var(--text-main)]">
                      <strong>{tx.source}</strong> ➔ <strong>{tx.target}</strong>
                    </div>
                    {tx.doc_id && (
                      <button
                        onClick={() => onOpenEvidence && onOpenEvidence(tx.doc_id)}
                        className="text-[11px] font-mono text-[var(--neon-green)] hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Source: {tx.doc_id}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Structured Account Comparison & Audit Records */}
          {financialData.nodes.some(n => n.id === 'PER_001') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="p-6 rounded-3xl glass-panel space-y-3.5 shadow-xl">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                  <h3 className="text-xs sm:text-[13px] font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-[var(--neon-cyan)]" />
                    <span>Front Entity: Apex Logistics Pvt Ltd</span>
                  </h3>
                  <span className="text-[11px] text-[var(--neon-amber)] font-bold">Risk: 0.90</span>
                </div>

                <div className="text-xs text-[var(--text-muted)] space-y-2 font-mono">
                  <div>• Registered Account: <span className="text-[var(--text-main)]">HDFC-CA-9988221100</span></div>
                  <div>• Authorized Signatory: <span className="text-[var(--text-main)]">Neha Sen (Director)</span></div>
                  <div>• Registered Address: <span className="text-[var(--text-main)]">Park Street Plaza Office, Kolkata</span></div>
                  <div>• Consignment Cargo: <span className="text-[var(--text-main)]">Escort vehicle WB-02-CD-5678</span></div>
                </div>
              </div>

              <div className="p-6 rounded-3xl glass-panel space-y-3.5 shadow-xl">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                  <h3 className="text-xs sm:text-[13px] font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center space-x-2">
                    <User className="w-4 h-4 text-[var(--neon-pink)]" />
                    <span>Kingpin Receiver: Vikram Malhotra</span>
                  </h3>
                  <span className="text-[11px] text-[var(--neon-pink)] font-bold">Risk: 0.94</span>
                </div>

                <div className="text-xs text-[var(--text-muted)] space-y-2 font-mono">
                  <div>• Personal Account: <span className="text-[var(--text-main)]">AXIS-SB-4455667788</span></div>
                  <div>• Primary Burner SIM: <span className="text-[var(--text-main)]">+91-98765-43210 (Airtel)</span></div>
                  <div>• Escort Vehicle: <span className="text-[var(--text-main)]">NL-01-AB-1234 (Fortuner)</span></div>
                  <div>• Centrality: <span className="text-[var(--neon-green)]">0.48 Betweenness (Top Structural Bridge)</span></div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-16 flex flex-col items-center justify-center space-y-3 text-center rounded-2xl glass-panel">
          <CreditCard className="w-10 h-10 text-[var(--text-muted)]" />
          <h2 className="font-mono text-sm text-[var(--text-main)] font-bold">No Financial Transactions Indexed</h2>
          <p className="text-xs text-[var(--text-muted)] max-w-md">
            No bank accounts, wire transfers, or Hawala structuring logs are currently loaded. Ingest financial records (e.g. Bank STRs) or load the demo investigation.
          </p>
        </div>
      )}
    </div>
  );
}