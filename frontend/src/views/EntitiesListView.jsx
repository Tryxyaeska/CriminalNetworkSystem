import React, { useEffect, useState } from 'react';
import { Users, Filter, Search, ShieldAlert, ArrowUpRight, Bot } from 'lucide-react';
import { fetchEntities } from '../services/api';

export default function EntitiesListView({ onSelectEntity, onAskCopilot }) {
  const [entities, setEntities] = useState([]);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [typeFilter, searchTerm]);

  const loadData = () => {
    setLoading(true);
    fetchEntities(typeFilter === 'ALL' ? null : typeFilter, searchTerm || null)
      .then((data) => {
        setEntities(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading entities:', err);
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-6 space-y-5 overflow-y-auto custom-scrollbar select-none mono-font">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-[var(--neon-green)]" />
            <h1 className="text-lg font-extrabold text-[var(--text-main)] tracking-tight">INDEXED ENTITIES & INTELLIGENCE DOSSIERS</h1>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Complete registry of all indexed persons, phone numbers, vehicles, locations, organizations, and financial accounts.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search entity..."
            className="px-3 py-1.5 text-xs bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--border-focus)] transition-colors"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-[var(--text-main)] font-mono text-xs focus:outline-none focus:border-[var(--border-focus)] transition-colors cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="PERSON">Persons</option>
            <option value="PHONE">Phones</option>
            <option value="VEHICLE">Vehicles</option>
            <option value="LOCATION">Locations</option>
            <option value="ORGANIZATION">Organizations</option>
            <option value="ACCOUNT">Accounts</option>
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-xl glass-panel overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="text-[10px] text-[var(--text-muted)] uppercase bg-[var(--bg-subtle)]/70 border-b border-[var(--border-subtle)]">
            <tr>
              <th className="p-3.5">Entity ID</th>
              <th className="p-3.5">Canonical Name / Value</th>
              <th className="p-3.5">Type</th>
              <th className="p-3.5">Role / Metadata</th>
              <th className="p-3.5">Risk Score</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-main)]">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-[var(--text-muted)]">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-5 h-5 border-2 border-[var(--neon-green)] border-t-transparent rounded-full animate-spin" />
                    <span className="font-mono text-xs">Retrieving indexed entity records from database...</span>
                  </div>
                </td>
              </tr>
            ) : entities.length > 0 ? (
              entities.map((e) => (
                <tr key={e.id} className="hover:bg-[var(--bg-surface)]/60 transition-colors">
                  <td className="p-3.5 font-bold text-[var(--neon-green)]">{e.id}</td>
                  <td className="p-3.5 font-bold text-[var(--text-main)] font-sans">{e.canonical_name}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-muted)] font-mono">
                      {e.entity_type}
                    </span>
                  </td>
                  <td className="p-3.5 text-[var(--text-muted)] font-sans text-[11px]">
                    {e.metadata?.role || e.metadata?.make || e.metadata?.carrier || e.metadata?.city || '—'}
                  </td>
                  <td className="p-3.5 font-bold text-[var(--neon-pink)]">
                    {Math.round((e.risk_score || 0.5) * 100)}/100
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => onSelectEntity(e.id)}
                      className="px-2.5 py-1 rounded glass-card text-[var(--text-muted)] hover:text-[var(--neon-green)] hover:border-[var(--neon-green)]/40 text-[11px] transition-all duration-150 active:scale-95 cursor-pointer"
                    >
                      Dossier
                    </button>
                    <button
                      onClick={() => onAskCopilot(`Provide intelligence summary on ${e.canonical_name}`)}
                      className="p-1.5 rounded bg-[var(--neon-green)]/15 border border-[var(--neon-green)]/35 text-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-[var(--bg-subtle)] transition-all duration-150 active:scale-95 cursor-pointer"
                      title="Ask Copilot"
                    >
                      <Bot className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-12 text-center text-[var(--text-muted)]">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Users className="w-8 h-8 text-[var(--text-muted)]" />
                    <p className="font-mono text-xs text-[var(--text-main)] font-bold">No Entities Found</p>
                    <p className="text-[11px] text-[var(--text-muted)] max-w-sm">
                      No entities matched your search query or type filter. Try adjusting the search term or resetting the filter.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}