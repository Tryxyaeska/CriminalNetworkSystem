import React, { useState } from 'react';
import { FolderPlus, X, FileText, Sparkles, CheckCircle2 } from 'lucide-react';

export default function NewCaseModal({ isOpen, onClose, onCreateCase }) {
  const [caseName, setCaseName] = useState('');
  const [caseId, setCaseId] = useState('');
  const [description, setDescription] = useState('');
  const [initialFIRTitle, setInitialFIRTitle] = useState('');
  const [initialFIRContent, setInitialFIRContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caseName.trim()) return;

    onCreateCase({
      name: caseName.trim(),
      id: caseId.trim() || `CASE-${Date.now().toString().slice(-6)}`,
      description: description.trim() || 'Custom independent law enforcement investigation session.',
      initialFIR: initialFIRTitle && initialFIRContent ? {
        title: initialFIRTitle.trim(),
        content: initialFIRContent.trim()
      } : null
    });

    setCaseName('');
    setCaseId('');
    setDescription('');
    setInitialFIRTitle('');
    setInitialFIRContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--bg-base)]/90 backdrop-blur-2xl select-none mono-font animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel border border-[var(--border-subtle)] rounded-3xl p-6 shadow-[0_0_80px_rgba(0,0,0,0.9)] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[var(--neon-green)]/15 border border-[var(--neon-green)]/35 text-[var(--neon-green)] shadow-[0_0_10px_rgba(82,255,140,0.2)]">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--text-main)] font-mono tracking-tight">Create New Investigation Case</h2>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Initialize a new independent investigation workspace from scratch.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg glass-card text-[var(--text-muted)] hover:text-[var(--neon-green)] hover:border-[var(--neon-green)]/40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Case Name / Title <span className="text-[var(--neon-green)]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Operation RedStorm (Highway Contraband)"
              value={caseName}
              onChange={(e) => setCaseName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Custom Case ID
              </label>
              <input
                type="text"
                placeholder="e.g., FIR-DEL-2026-88"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Classification / Agency
              </label>
              <input
                type="text"
                disabled
                value="CRIMENET AI • MHA PS 26189"
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-surface)]/60 border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)] cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Case Objective / Brief
            </label>
            <textarea
              rows={2}
              placeholder="Summary of suspected syndicate activity, jurisdictions, and operational scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] resize-none custom-scrollbar transition-colors"
            />
          </div>

          {/* Optional First Document Ingestion */}
          <div className="p-3.5 rounded-2xl glass-card border-[var(--border-subtle)] space-y-2.5 shadow-inner">
            <div className="flex items-center space-x-2 text-xs font-mono text-[var(--neon-green)] font-bold">
              <FileText className="w-3.5 h-3.5" />
              <span>Optional: Ingest Initial FIR / Incident Report</span>
            </div>

            <input
              type="text"
              placeholder="FIR Title (e.g. FIR #01/2026 - Initial Transit Intercept)"
              value={initialFIRTitle}
              onChange={(e) => setInitialFIRTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] transition-colors"
            />

            <textarea
              rows={2}
              placeholder="Paste raw police FIR narrative text here (entities will be extracted automatically)..."
              value={initialFIRContent}
              onChange={(e) => setInitialFIRContent(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] resize-none custom-scrollbar transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl glass-card text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-mono transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-[var(--neon-green)] hover:brightness-110 text-[var(--bg-subtle)] font-bold font-mono text-xs transition-all shadow-[0_0_14px_rgba(82,255,140,0.35)] active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create Case Workspace</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}