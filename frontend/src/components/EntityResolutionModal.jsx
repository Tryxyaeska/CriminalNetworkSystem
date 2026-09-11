import React, { useEffect, useState } from 'react';
import { GitMerge, Check, X, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { fetchResolutionCandidates, mergeEntities, dismissCandidate } from '../services/api';

export default function EntityResolutionModal({ onResolutionApplied }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = () => {
    setLoading(true);
    fetchResolutionCandidates()
      .then((data) => {
        setCandidates(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching resolution candidates:', err);
        setLoading(false);
      });
  };

  const handleMerge = async (cand) => {
    try {
      await mergeEntities(cand.id, cand.target_entity_id, cand.source_entity_id);
      setCandidates((prev) => prev.filter((c) => c.id !== cand.id));
      if (onResolutionApplied) onResolutionApplied();
    } catch (err) {
      console.error('Error merging entities:', err);
    }
  };

  const handleDismiss = async (candId) => {
    try {
      await dismissCandidate(candId);
      setCandidates((prev) => prev.filter((c) => c.id !== candId));
    } catch (err) {
      console.error('Error dismissing candidate:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-base)] p-6 space-y-5 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <GitMerge className="w-6 h-6 text-[var(--neon-pink)]" />
            <h1 className="text-lg font-extrabold text-[var(--text-main)] tracking-tight">ENTITY RESOLUTION & ALIAS DISAMBIGUATION</h1>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Detects potential alias variations, phonetic name matches, and identity duplicates. Requires human confirmation before physical graph merge.
          </p>
        </div>

        <button
          onClick={loadCandidates}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--neon-cyan)]/50 text-xs font-mono text-[var(--text-main)] transition-all duration-150 active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Rescan Candidates</span>
        </button>
      </div>

      {/* Candidate List */}
      {loading ? (
        <div className="p-12 text-center text-[var(--text-muted)] text-xs font-mono">
          Evaluating phonetic similarities and structural graph contexts...
        </div>
      ) : candidates.length > 0 ? (
        <div className="space-y-3">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className="p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--border-subtle)] space-y-3 hover:border-[var(--neon-pink)]/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] font-bold font-mono text-xs">
                    {Math.round((cand.similarity_score || 0.8) * 100)}% MATCH
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-mono">
                      <span className="text-[var(--neon-cyan)] font-bold">{cand.source_name}</span>
                      <span className="text-[var(--text-muted)]">↔</span>
                      <span className="text-[var(--neon-green)] font-bold">{cand.target_name}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{cand.reason}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleMerge(cand)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[var(--neon-green)]/20 text-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-[var(--bg-base)] text-xs font-semibold shadow-md transition-all active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm Merge</span>
                  </button>
                  <button
                    onClick={() => handleDismiss(cand.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--neon-pink)] border border-[var(--border-subtle)] text-xs transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Dismiss</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-[var(--text-muted)] text-xs">
          No pending entity resolution candidates found. Graph identities are currently resolved.
        </div>
      )}
    </div>
  );
}