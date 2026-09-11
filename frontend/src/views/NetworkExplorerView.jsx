import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Layers, 
  Sparkles,
  RefreshCw,
  User,
  Network,
  Eye,
  Sliders,
  X,
  ArrowRight,
  GitFork,
  PanelRightOpen
} from 'lucide-react';
import NetworkGraph from '../components/NetworkGraph';
import EntityDossier from '../components/EntityDossier';
import TemporalSlider from '../components/TemporalSlider';
import { fetchGraphData, fetchEntities } from '../services/api';

export default function NetworkExplorerView({ 
  selectedEntityId, 
  onSelectEntity, 
  onOpenEvidence, 
  onAskCopilot,
  onStartDemo,
  refreshKey = 0,
  highlightNodeIds = [],
  highlightEdgeIds = []
}) {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [], total_nodes: 0, total_edges: 0 });
  const [graphMode, setGraphMode] = useState('focus');
  const [focusPerson, setFocusPerson] = useState(selectedEntityId || 'PER_001');
  const [focusDepth, setFocusDepth] = useState(1);
  const [availablePersons, setAvailablePersons] = useState([]);
  const [isDossierOpen, setIsDossierOpen] = useState(true);
  
  const [filterType, setFilterType] = useState('ALL');
  const [colorByCommunity, setColorByCommunity] = useState(false);
  const [dateTo, setDateTo] = useState(null);
  const [loading, setLoading] = useState(false);

  const [relFilters, setRelFilters] = useState({
    COMMUNICATION: true,
    FINANCIAL: true,
    EMPLOYMENT: true,
    LOCATION: true,
    VEHICLE: true,
    OWNERSHIP: true
  });

  const [showPathModal, setShowPathModal] = useState(false);
  const [pathSource, setPathSource] = useState('');
  const [pathTarget, setPathTarget] = useState('');

  // Auto open drawer & sync focus whenever a node/entity is selected
  useEffect(() => {
    if (selectedEntityId) {
      setIsDossierOpen(true);
      if (selectedEntityId !== focusPerson) {
        setFocusPerson(selectedEntityId);
        setGraphMode('focus');
      }
    }
  }, [selectedEntityId]);

  useEffect(() => {
    loadGraph();
    fetchEntities('PERSON').then((persons) => {
      setAvailablePersons(persons || []);
      if (persons && persons.length > 0 && !focusPerson) {
        setFocusPerson(persons[0].id);
      }
    }).catch(console.error);
  }, [filterType, dateTo, refreshKey]);

  const loadGraph = () => {
    setLoading(true);
    const params = {};
    if (filterType !== 'ALL') {
      params.node_type = filterType;
    }
    if (dateTo) {
      params.date_to = dateTo;
    }

    fetchGraphData(params)
      .then((data) => {
        setGraphData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching graph data:', err);
        setLoading(false);
      });
  };

  const handleDateRangeChange = (from, to) => {
    setDateTo(to);
  };

  const toggleRelFilter = (cat) => {
    setRelFilters(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleExecutePathSearch = () => {
    const srcNode = graphData.nodes.find(n => n.id === pathSource) || { label: pathSource };
    const tgtNode = graphData.nodes.find(n => n.id === pathTarget) || { label: pathTarget };
    const srcLabel = srcNode.label || srcNode.id || 'Source Entity';
    const tgtLabel = tgtNode.label || tgtNode.id || 'Target Entity';
    setShowPathModal(false);
    onAskCopilot(`Trace the shortest connection path between ${srcLabel} and ${tgtLabel}.`);
  };

  const handleQuickDemoPath = (srcName, tgtName) => {
    setShowPathModal(false);
    onAskCopilot(`Show the connection path between ${srcName} and ${tgtName}.`);
  };

  const activeDossierId = selectedEntityId || focusPerson;

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden select-none min-h-0 mono-font">
      {/* Top Controls Bar */}
      <div className="h-14 border-b border-[var(--border-subtle)] glass-panel px-5 flex items-center justify-between z-10 shrink-0 text-xs">
        {/* Left: Mode Switcher */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center p-1 rounded-xl glass-card font-mono">
            <button
              onClick={() => setGraphMode('focus')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 active:scale-95 cursor-pointer ${
                graphMode === 'focus'
                  ? 'bg-[var(--neon-green)] text-[var(--bg-subtle)] font-bold shadow-[0_0_12px_rgba(82,255,140,0.35)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>FOCUS PERSON</span>
            </button>

            <button
              onClick={() => setGraphMode('full')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 active:scale-95 cursor-pointer ${
                graphMode === 'full'
                  ? 'bg-[var(--neon-green)] text-[var(--bg-subtle)] font-bold shadow-[0_0_12px_rgba(82,255,140,0.35)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>FULL NETWORK</span>
            </button>
          </div>

          {/* Conditional Controls */}
          {graphMode === 'focus' ? (
            <div className="flex items-center space-x-2">
              <span className="text-[var(--text-muted)] font-mono">Target:</span>
              <select
                value={focusPerson}
                onChange={(e) => {
                  setFocusPerson(e.target.value);
                  onSelectEntity(e.target.value);
                }}
                className="bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1 text-[var(--text-main)] font-mono text-xs focus:outline-none focus:border-[var(--border-focus)] transition-colors cursor-pointer"
              >
                {availablePersons.length > 0 ? (
                  availablePersons.map((p) => (
                    <option key={p.id} value={p.id}>{p.canonical_name} ({p.id})</option>
                  ))
                ) : (
                  <>
                    <option value="PER_001">Vikram Malhotra (PER_001)</option>
                    <option value="PER_002">Rajesh Thapa (PER_002)</option>
                    <option value="PER_004">Suresh Agarwal (PER_004)</option>
                  </>
                )}
              </select>

              <div className="flex items-center p-0.5 rounded-lg glass-card font-mono text-[11px]">
                <button
                  onClick={() => setFocusDepth(1)}
                  className={`px-2 py-0.5 rounded transition-all duration-150 cursor-pointer ${
                    focusDepth === 1 ? 'bg-[var(--neon-green)]/20 text-[var(--neon-green)] border border-[var(--neon-green)]/40 font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  1 HOP
                </button>
                <button
                  onClick={() => setFocusDepth(2)}
                  className={`px-2 py-0.5 rounded transition-all duration-150 cursor-pointer ${
                    focusDepth === 2 ? 'bg-[var(--neon-green)]/20 text-[var(--neon-green)] border border-[var(--neon-green)]/40 font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  2 HOPS
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5">
                <Filter className="w-3.5 h-3.5 text-[var(--neon-green)]" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-lg px-2 py-1 text-[var(--text-main)] font-mono text-xs focus:outline-none focus:border-[var(--border-focus)] transition-colors cursor-pointer"
                >
                  <option value="ALL">All Entity Types</option>
                  <option value="PERSON">Persons</option>
                  <option value="PHONE">Phones</option>
                  <option value="VEHICLE">Vehicles</option>
                  <option value="LOCATION">Locations</option>
                  <option value="ORGANIZATION">Organizations</option>
                  <option value="ACCOUNT">Accounts</option>
                </select>
              </div>

              <button
                onClick={() => setColorByCommunity(!colorByCommunity)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border font-mono text-xs transition-all duration-150 active:scale-95 cursor-pointer ${
                  colorByCommunity
                    ? 'bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] border-[var(--neon-pink)]/40 shadow-[0_0_8px_rgba(255,56,112,0.2)]'
                    : 'glass-card text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--neon-pink)]/40'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Clusters</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {graphData.nodes.length > 0 && (
            <button
              onClick={() => {
                if (!pathSource && graphData.nodes.length > 0) {
                  setPathSource(focusPerson || graphData.nodes[0].id);
                }
                if (!pathTarget && graphData.nodes.length > 1) {
                  setPathTarget(graphData.nodes[1].id);
                }
                setShowPathModal(true);
              }}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg glass-card text-[var(--text-main)] hover:text-[var(--neon-amber)] hover:border-[var(--neon-amber)]/40 font-mono text-xs transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--neon-amber)]" />
              <span>Find Path</span>
            </button>
          )}

          <button
            onClick={loadGraph}
            title="Refresh Data"
            className="p-1.5 rounded-lg glass-card text-[var(--text-muted)] hover:text-[var(--neon-green)] hover:border-[var(--neon-green)]/40 transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <span className="text-[11px] font-mono text-[var(--text-muted)] px-2.5 py-1 rounded-md glass-card">
            {graphData.total_nodes || 0} Nodes • {graphData.total_edges || 0} Edges
          </span>
        </div>
      </div>

      {/* Relationship Type Visibility Bar */}
      {graphMode === 'full' && (
        <div className="h-9 border-b border-[var(--border-subtle)] glass-panel px-5 flex items-center space-x-4 text-[11px] font-mono text-[var(--text-muted)] shrink-0">
          <span className="text-[var(--text-muted)]">Show Relationships:</span>
          {Object.keys(relFilters).map((cat) => (
            <label key={cat} className="flex items-center space-x-1.5 cursor-pointer hover:text-[var(--text-main)] transition-colors">
              <input
                type="checkbox"
                checked={relFilters[cat]}
                onChange={() => toggleRelFilter(cat)}
                className="rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)] accent-[var(--neon-green)] cursor-pointer"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative min-h-0 min-w-0">
        <div className="flex-1 h-full relative min-h-0 min-w-0 p-3">
          <NetworkGraph
            graphData={graphData}
            onSelectNode={(id) => onSelectEntity(id)}
            onSelectEdge={() => {}}
            highlightNodeIds={highlightNodeIds}
            highlightEdgeIds={highlightEdgeIds}
            colorByCommunity={colorByCommunity}
            onOpenEvidence={onOpenEvidence}
            onStartDemo={onStartDemo}
            mode={graphMode}
            focusPersonId={focusPerson}
            focusDepth={focusDepth}
            relationshipTypeFilters={relFilters}
          />
        </div>

        {/* Flush Right-Edge Reopen Handle (active when closed) */}
        {!isDossierOpen && activeDossierId && (
          <button
            onClick={() => setIsDossierOpen(true)}
            title="Open Entity Dossier"
            className="absolute top-4 right-0 z-30 flex items-center justify-center w-6 h-12 rounded-l-lg glass-card border-r-0 border-[var(--border-subtle)] hover:border-[var(--neon-green)]/60 text-[var(--text-muted)] hover:text-[var(--neon-green)] shadow-[-2px_0_12px_rgba(0,0,0,0.5)] transition-all duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95 group cursor-pointer"
          >
            <PanelRightOpen className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </button>
        )}

        {/* Collapsible Entity Dossier Drawer */}
        <EntityDossier
          entityId={activeDossierId}
          isOpen={isDossierOpen}
          onToggle={() => setIsDossierOpen(prev => !prev)}
          onClose={() => setIsDossierOpen(false)}
          onOpenEvidence={onOpenEvidence}
          onAskCopilot={onAskCopilot}
        />
      </div>

      {/* Bottom Temporal Slider */}
      <TemporalSlider onDateRangeChange={handleDateRangeChange} />

      {/* Path Modal */}
      {showPathModal && (
        <div className="fixed inset-0 z-50 bg-[var(--bg-base)]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn mono-font select-none">
          <div className="w-full max-w-lg glass-panel border border-[var(--border-subtle)] rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center space-x-2">
                <GitFork className="w-5 h-5 text-[var(--neon-amber)]" />
                <h3 className="text-sm font-bold text-[var(--text-main)]">Find Network Connection Path</h3>
              </div>
              <button
                onClick={() => setShowPathModal(false)}
                className="p-1 rounded-lg glass-card text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Select any two entities in the criminal intelligence network to compute and explain the shortest multi-hop connection chain.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-mono uppercase text-[var(--text-muted)] block mb-1">Source Entity</label>
                <select
                  value={pathSource}
                  onChange={(e) => setPathSource(e.target.value)}
                  className="w-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-lg p-2 text-[var(--text-main)] font-mono text-xs focus:border-[var(--border-focus)] outline-none cursor-pointer"
                >
                  {graphData.nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label} ({n.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[var(--text-muted)] block mb-1">Target Entity</label>
                <select
                  value={pathTarget}
                  onChange={(e) => setPathTarget(e.target.value)}
                  className="w-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-lg p-2 text-[var(--text-main)] font-mono text-xs focus:border-[var(--border-focus)] outline-none cursor-pointer"
                >
                  {graphData.nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label} ({n.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => handleQuickDemoPath('Vikram Malhotra', 'Apex Logistics Pvt Ltd')}
                className="text-[11px] font-mono text-[var(--neon-amber)] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>⚡ Quick Demo: Vikram → Apex Logistics</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPathModal(false)}
                  className="px-3 py-1.5 rounded-lg glass-card text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecutePathSearch}
                  className="px-4 py-1.5 rounded-lg bg-[var(--neon-green)] hover:brightness-110 text-[var(--bg-subtle)] font-bold text-xs font-mono transition-all active:scale-95 shadow-[0_0_12px_rgba(82,255,140,0.35)] cursor-pointer"
                >
                  Find Path with Copilot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}