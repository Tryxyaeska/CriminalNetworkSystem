import React from 'react';
import { 
  LayoutDashboard, 
  Network, 
  Clock, 
  CreditCard, 
  Target, 
  Users,
  FileText, 
  GitMerge, 
  AlertTriangle, 
  Bot, 
  ShieldCheck, 
  HelpCircle,
  PanelLeftClose
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  alertCount = 0, 
  candidateCount = 0, 
  onOpenTutorial,
  isOpen = true, 
  onToggle 
}) {
  const navSections = [
    {
      groupTitle: 'INVESTIGATE',
      items: [
        { id: 'dashboard', label: 'Case Overview', icon: LayoutDashboard },
        { id: 'network', label: 'Network Intelligence', icon: Network },
        { id: 'timeline', label: 'Time Machine', icon: Clock },
        { id: 'financial', label: 'Money Flow (Hawala)', icon: CreditCard },
        { id: 'leads', label: 'Investigative Leads', icon: Target },
        { id: 'entities', label: 'Entity Registry', icon: Users }
      ]
    },
    {
      groupTitle: 'VERIFY',
      items: [
        { id: 'documents', label: 'Evidence Records', icon: FileText },
        { id: 'resolution', label: 'Entity Resolution', icon: GitMerge, badge: candidateCount },
        { 
          id: 'alerts', 
          label: 'Anomaly Center', 
          icon: AlertTriangle, 
          badge: alertCount, 
          badgeColor: 'border-[var(--neon-pink)]/40 text-[var(--neon-pink)] shadow-[0_0_8px_rgba(255,56,112,0.2)]' 
        }
      ]
    },
    {
      groupTitle: 'ASSIST',
      items: [
        { id: 'copilot', label: 'AI Investigator', icon: Bot },
        { id: 'transparency', label: 'AI Transparency', icon: ShieldCheck }
      ]
    }
  ];

  return (
    <aside 
      className={`relative h-full glass-panel border-r border-[var(--border-subtle)] flex flex-col justify-between select-none shrink-0 transition-[width,opacity] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] mono-font ${
        isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden border-r-0 pointer-events-none'
      }`}
    >
      <div className="p-4 space-y-5 overflow-y-auto custom-scrollbar flex-1">
        <div className="flex items-center justify-between pb-1">
          <span className="text-[10px] tracking-widest uppercase font-bold text-[var(--text-muted)]">
            WORKSPACE
          </span>
          {onToggle && (
            <button
              onClick={onToggle}
              title="Collapse Sidebar"
              className="p-1 rounded-md glass-card text-[var(--text-muted)] hover:text-[var(--neon-green)] hover:border-[var(--neon-green)]/40 transition-all duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 cursor-pointer"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1.5">
            <div className="px-3 text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)]/70">
              {section.groupTitle}
            </div>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 cursor-pointer ${
                      isActive
                        ? 'bg-[var(--neon-green)]/20 text-[var(--neon-green)] border border-[var(--neon-green)]/60 font-bold shadow-[inset_0_0_12px_rgba(82,255,140,0.15),0_0_12px_rgba(82,255,140,0.25)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[var(--neon-green)]' : 'text-[var(--text-muted)]'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold glass-card ${
                        item.badgeColor || 'border-[var(--neon-amber)]/40 text-[var(--neon-amber)]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Responsible AI & Tutorial Link */}
      <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)]/70 space-y-2 text-[11px]">
        {onOpenTutorial && (
          <button
            onClick={onOpenTutorial}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg glass-card text-[var(--neon-cyan)] hover:text-[var(--text-main)] hover:border-[var(--neon-cyan)]/50 font-mono text-xs transition-all duration-150 shadow-sm active:scale-95 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
            <span>Feature Guide & Tutorial</span>
          </button>
        )}

        <div className="flex items-center justify-between text-[var(--text-muted)] pt-1">
          <span className="text-[10px]">SIH 2026 PS 26189</span>
          <span className="text-[10px] text-[var(--neon-green)] font-bold">MHA Prototype</span>
        </div>

        <div className="p-2.5 rounded-lg glass-card text-[var(--text-muted)] text-[10.5px] leading-snug">
          🛡️ <strong className="text-[var(--text-main)]">Decision-Support Mode:</strong> Human verification required before formal legal action.
        </div>
      </div>
    </aside>
  );
}