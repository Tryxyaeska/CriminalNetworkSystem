import React from 'react';
import { 
  Shield, 
  RotateCcw, 
  Play, 
  FolderPlus,
  BookOpen
} from 'lucide-react';

export default function Navbar({ onReset, isDemoLoading, systemInfo, onOpenStoryModal, onOpenTutorial, activeCase, onOpenNewCase }) {
  const isCustomOrEmpty = !activeCase || activeCase.isCustom || activeCase.entityCount === 0;

  return (
    <header className="h-16 glass-panel border-b border-[var(--border-subtle)] px-6 flex items-center justify-between z-20 select-none shrink-0 transition-colors mono-font">
      {/* Left: Branding & Case Status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-[var(--neon-green)] border-[var(--neon-green)]/35 shadow-[0_0_10px_rgba(82,255,140,0.2)]">
            <Shield className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-black tracking-wider text-[var(--text-main)]">
                CRIMENET <span className="text-[var(--neon-green)]">AI</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] glass-card text-[var(--neon-green)] border-[var(--neon-green)]/35 font-semibold tracking-wider shadow-[0_0_8px_rgba(82,255,140,0.15)]">
                SIH 26189
              </span>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] tracking-tight">
              AI Investigation Command Center • MHA
            </div>
          </div>
        </div>

        {/* Vertical Separator */}
        <div className="h-5 w-px bg-[var(--border-subtle)] hidden md:block" />

        {/* Case Badge */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-md glass-card text-xs">
          <span className={`w-2 h-2 rounded-full ${activeCase?.name ? 'bg-[var(--neon-green)] shadow-[0_0_8px_var(--neon-green)] animate-pulse' : 'bg-[var(--text-muted)]'}`} />
          <span className="text-[var(--text-muted)]">Case:</span>
          <span className="text-[var(--text-main)] font-semibold">
            {activeCase?.name || 'No Active Case (Workspace Ready)'}
          </span>
        </div>

        {/* Persistent Demo / Synthetic Data Disclaimer */}
        {!isCustomOrEmpty && (
          <div 
            title="Simulated case file with fictional entities for demonstration. AI-generated leads require human investigator verification."
            className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[var(--neon-amber)]/10 border border-[var(--neon-amber)]/25 text-[10.5px] font-mono text-[var(--neon-amber)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-amber)]" />
            <span className="font-semibold">SYNTHETIC DEMO DATA</span>
            <span className="text-[var(--neon-amber)]/80">• Fictional Case • Human Verification Required</span>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-3">
        {onOpenTutorial && (
          <button
            onClick={onOpenTutorial}
            title="System & Feature Guide (Tutorial)"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg glass-card text-[var(--neon-cyan)] hover:text-[var(--text-main)] hover:border-[var(--neon-cyan)]/50 font-mono text-xs transition-all duration-150 active:scale-95 shadow-sm cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
            <span className="hidden sm:inline">Feature Guide</span>
          </button>
        )}

        {onOpenNewCase && (
          <button
            onClick={onOpenNewCase}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg glass-card text-[var(--neon-cyan)] hover:text-[var(--text-main)] hover:border-[var(--neon-cyan)]/50 font-mono text-xs transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Case</span>
          </button>
        )}

        {onOpenStoryModal && activeCase?.name === 'Operation ShadowNet' && (
          <button
            onClick={onOpenStoryModal}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[var(--neon-green)] hover:brightness-110 text-[var(--bg-subtle)] font-bold text-xs shadow-[0_0_15px_rgba(82,255,140,0.3)] transition-all duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>DEMO STORY (3 MIN)</span>
          </button>
        )}

        <button
          onClick={onReset}
          title="Reset / Clear Case Workspace"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg glass-card text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--neon-green)]/40 text-xs transition-all duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
}