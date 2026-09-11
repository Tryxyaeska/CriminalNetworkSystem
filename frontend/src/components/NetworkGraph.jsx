import React, { useEffect, useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2,
  RotateCcw,
  RefreshCw, 
  Sparkles,
  Network,
  User,
  Phone,
  Car,
  MapPin,
  Building2,
  CreditCard,
  FileText,
  X
} from 'lucide-react';

const TYPE_COLORS = {
  PERSON: 'var(--neon-cyan)',       // Neon Cyan
  PHONE: 'var(--neon-green)',       // Neon Green
  VEHICLE: 'var(--neon-pink)',      // Neon Pink
  LOCATION: '#FF4757',              // Red / Crimson
  ORGANIZATION: 'var(--neon-amber)',// Neon Amber
  ACCOUNT: '#2ED573',               // Mint / Cyan-Green
  DEFAULT: 'var(--text-muted)'      // Muted Gray
};

const COMMUNITY_COLORS = [
  '#22E7E9', '#FFAE19', '#52FF8C', '#FF3870', '#FF4757', '#A55EEA', '#2ED573'
];

export default function NetworkGraph({ 
  graphData, 
  onSelectNode, 
  onSelectEdge,
  highlightNodeIds = [], 
  highlightEdgeIds = [],
  colorByCommunity = false,
  onOpenEvidence,
  onStartDemo,
  mode = 'full',
  focusPersonId = 'PER_001',
  focusDepth = 1,
  relationshipTypeFilters = {
    COMMUNICATION: true,
    FINANCIAL: true,
    EMPLOYMENT: true,
    LOCATION: true,
    VEHICLE: true,
    OWNERSHIP: true
  }
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState(null);
  const [nodeDragStart, setNodeDragStart] = useState(null);
  const [hasDraggedNode, setHasDraggedNode] = useState(false);
  const [nodePositions, setNodePositions] = useState({});
  const [layoutMode, setLayoutMode] = useState('circular');
  const [selectedEdgeData, setSelectedEdgeData] = useState(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => {
      const next = !prev;
      setTimeout(() => handleFit(), 80);
      return next;
    });
  };

  const rawNodes = graphData?.nodes || [];
  const rawEdges = graphData?.edges || [];

  const getRelationCategory = (relType) => {
    const t = (relType || '').toUpperCase();
    if (t.includes('CALL') || t.includes('COMMUNICAT')) return 'COMMUNICATION';
    if (t.includes('MONEY') || t.includes('TRANSFERRED') || t.includes('BANK')) return 'FINANCIAL';
    if (t.includes('WORK') || t.includes('ASSOCIATED') || t.includes('MEET') || t.includes('SEEN')) return 'EMPLOYMENT';
    if (t.includes('LOCATED') || t.includes('VISITED')) return 'LOCATION';
    if (t.includes('VEHICLE') || t.includes('USES') && !t.includes('SIM')) return 'VEHICLE';
    if (t.includes('OWNS')) return 'OWNERSHIP';
    return 'COMMUNICATION';
  };

  let visibleNodes = rawNodes;
  let visibleEdges = rawEdges;

  if (mode === 'focus' && focusPersonId) {
    const directNeighborIds = new Set([focusPersonId]);
    const secondHopNeighborIds = new Set();
    const activeEdgeIds = new Set();

    rawEdges.forEach((e) => {
      if (e.source === focusPersonId) {
        directNeighborIds.add(e.target);
        activeEdgeIds.add(e.id);
      } else if (e.target === focusPersonId) {
        directNeighborIds.add(e.source);
        activeEdgeIds.add(e.id);
      }
    });

    if (focusDepth >= 2) {
      rawEdges.forEach((e) => {
        if (directNeighborIds.has(e.source) && !directNeighborIds.has(e.target)) {
          secondHopNeighborIds.add(e.target);
          activeEdgeIds.add(e.id);
        } else if (directNeighborIds.has(e.target) && !directNeighborIds.has(e.source)) {
          secondHopNeighborIds.add(e.source);
          activeEdgeIds.add(e.id);
        } else if (directNeighborIds.has(e.source) && directNeighborIds.has(e.target)) {
          activeEdgeIds.add(e.id);
        }
      });
    }

    const allAllowedIds = new Set([...directNeighborIds, ...secondHopNeighborIds]);
    visibleNodes = rawNodes.filter((n) => allAllowedIds.has(n.id));
    visibleEdges = rawEdges.filter((e) => allAllowedIds.has(e.source) && allAllowedIds.has(e.target));
  } else {
    visibleEdges = rawEdges.filter((e) => {
      const cat = getRelationCategory(e.label);
      return relationshipTypeFilters[cat] !== false;
    });
    const connectedNodeIds = new Set();
    visibleEdges.forEach((e) => {
      connectedNodeIds.add(e.source);
      connectedNodeIds.add(e.target);
    });
    visibleNodes = rawNodes.filter((n) => connectedNodeIds.has(n.id) || highlightNodeIds.includes(n.id) || rawNodes.length < 15);
  }

  const hasNodes = visibleNodes.length > 0;

  useEffect(() => {
    if (!hasNodes) return;

    const width = 850;
    const height = 520;
    const centerX = width / 2;
    const centerY = height / 2;
    const newPositions = {};

    if (mode === 'focus' && focusPersonId) {
      newPositions[focusPersonId] = { x: centerX, y: centerY };

      const directNodes = visibleNodes.filter((n) => n.id !== focusPersonId);
      directNodes.forEach((n, idx) => {
        const angle = (idx / Math.max(directNodes.length, 1)) * 2 * Math.PI;
        const radius = directNodes.length > 8 ? 200 : 170;
        newPositions[n.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      });
    } else if (layoutMode === 'circular') {
      const centerNodes = visibleNodes.filter(n => n.betweenness > 0.15 || n.id === 'PER_001');
      const outerNodes = visibleNodes.filter(n => !centerNodes.includes(n));

      centerNodes.forEach((n, idx) => {
        const angle = (idx / Math.max(centerNodes.length, 1)) * 2 * Math.PI;
        const radius = centerNodes.length > 1 ? 85 : 0;
        newPositions[n.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      });

      outerNodes.forEach((n, idx) => {
        const ring = (idx % 2 === 0) ? 210 : 290;
        const angle = (idx / outerNodes.length) * 2 * Math.PI;
        newPositions[n.id] = {
          x: centerX + ring * Math.cos(angle) + (Math.sin(idx) * 12),
          y: centerY + ring * Math.sin(angle) + (Math.cos(idx) * 12)
        };
      });
    } else if (layoutMode === 'layered') {
      const typeGroups = ['PERSON', 'PHONE', 'VEHICLE', 'ORGANIZATION', 'ACCOUNT', 'LOCATION'];
      typeGroups.forEach((type, colIdx) => {
        const typeNodes = visibleNodes.filter(n => n.type === type);
        const colX = 100 + colIdx * 135;
        typeNodes.forEach((n, rowIdx) => {
          const rowY = 80 + (rowIdx * (390 / Math.max(typeNodes.length, 1)));
          newPositions[n.id] = { x: colX, y: rowY };
        });
      });
    } else {
      const cols = Math.ceil(Math.sqrt(visibleNodes.length));
      visibleNodes.forEach((n, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        newPositions[n.id] = {
          x: 90 + col * 125,
          y: 70 + row * 95
        };
      });
    }

    setNodePositions(newPositions);
  }, [graphData, layoutMode, mode, focusPersonId, focusDepth, hasNodes]);

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'svg' || e.target.id === 'canvas-bg') {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDraggingCanvas) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else if (draggedNode) {
      if (nodeDragStart) {
        const dist = Math.hypot(e.clientX - nodeDragStart.x, e.clientY - nodeDragStart.y);
        if (dist > 4) {
          setHasDraggedNode(true);
        }
      }
      const svg = e.currentTarget.getBoundingClientRect();
      const clientX = (e.clientX - svg.left - panOffset.x) / zoomLevel;
      const clientY = (e.clientY - svg.top - panOffset.y) / zoomLevel;
      setNodePositions(prev => ({
        ...prev,
        [draggedNode]: { x: clientX, y: clientY }
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
    if (draggedNode) {
      if (!hasDraggedNode) {
        if (onSelectNode) onSelectNode(draggedNode);
      }
      setDraggedNode(null);
      setNodeDragStart(null);
      setHasDraggedNode(false);
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev * 1.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev * 0.8, 0.4));
  const handleFit = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className={`${
      isFullscreen 
        ? 'fixed inset-0 z-50 w-screen h-screen bg-[var(--bg-base)] overflow-hidden flex flex-col select-none animate-fadeIn mono-font' 
        : 'relative w-full h-full min-h-[480px] bg-[var(--bg-base)] overflow-hidden rounded-2xl border border-[var(--border-subtle)] shadow-2xl flex flex-col select-none mono-font'
    }`}>
      {/* Fullscreen Mode Top Banner */}
      {isFullscreen && (
        <div className="absolute top-4 left-4 z-30 flex items-center space-x-2.5 px-3.5 py-1.5 rounded-xl glass-panel border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-main)] backdrop-blur shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-[var(--neon-green)] animate-pulse" />
          <span className="font-bold text-[var(--text-main)]">Full Screen Graph Mode</span>
          <span className="text-[var(--text-muted)] text-[10.5px]">| Press ESC or click minimize to exit</span>
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        id="canvas-bg"
        className="w-full h-full cursor-grab active:cursor-grabbing flex-1"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={(e) => {
          if (e.deltaY < 0) handleZoomIn();
          else handleZoomOut();
        }}
      >
        <defs>
          <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="var(--neon-amber)" floodOpacity="0.9" />
          </filter>
          <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="var(--neon-cyan)" floodOpacity="0.8" />
          </filter>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
          </marker>
          <marker
            id="arrow-highlight"
            viewBox="0 0 10 10"
            refX="24"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--neon-amber)" />
          </marker>
          <marker
            id="arrow-hover"
            viewBox="0 0 10 10"
            refX="24"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--neon-cyan)" />
          </marker>
        </defs>

        <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}>
          {/* Edges */}
          {visibleEdges.map((edge) => {
            const p1 = nodePositions[edge.source];
            const p2 = nodePositions[edge.target];
            if (!p1 || !p2) return null;

            const isHigh = highlightEdgeIds.includes(edge.id) ||
              (highlightNodeIds.includes(edge.source) && highlightNodeIds.includes(edge.target));
            const isHovered = hoveredEdgeId === edge.id;
            const isSelected = selectedEdgeData?.id === edge.id;

            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const showLabel = mode === 'focus' || isHigh || isHovered || isSelected;

            return (
              <g 
                key={edge.id} 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredEdgeId(edge.id)}
                onMouseLeave={() => setHoveredEdgeId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEdgeData(edge);
                  if (onSelectEdge) onSelectEdge(edge);
                }}
              >
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={isHigh || isSelected ? 'var(--neon-amber)' : isHovered ? 'var(--neon-cyan)' : '#475569'}
                  strokeWidth={isHigh || isSelected ? 3 : isHovered ? 2.5 : 1.75}
                  strokeOpacity={isHigh || isSelected || isHovered ? 1.0 : 0.85}
                  markerEnd={isHigh || isSelected ? 'url(#arrow-highlight)' : isHovered ? 'url(#arrow-hover)' : 'url(#arrow)'}
                />

                {/* Edge Label Pill */}
                {showLabel && (
                  <g>
                    <rect
                      x={midX - (edge.label.length * 3.2)}
                      y={midY - 7}
                      width={edge.label.length * 6.4}
                      height={13}
                      fill="var(--bg-surface)"
                      rx="3"
                      stroke={isHigh || isSelected ? 'var(--neon-amber)' : isHovered ? 'var(--neon-cyan)' : '#475569'}
                      strokeWidth="1"
                      opacity="0.95"
                    />
                    <text
                      x={midX}
                      y={midY + 2.5}
                      textAnchor="middle"
                      fill={isHigh || isSelected ? 'var(--neon-amber)' : isHovered ? 'var(--neon-cyan)' : 'var(--text-main)'}
                      fontSize="7.5px"
                      fontFamily="Space Mono, monospace"
                      fontWeight="bold"
                    >
                      {edge.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {visibleNodes.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const isHigh = highlightNodeIds.includes(node.id) || (mode === 'focus' && node.id === focusPersonId);
            const isCenterFocus = mode === 'focus' && node.id === focusPersonId;
            const color = colorByCommunity
              ? COMMUNITY_COLORS[(node.community_id || 0) % COMMUNITY_COLORS.length]
              : (TYPE_COLORS[node.type] || TYPE_COLORS.DEFAULT);

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className={`cursor-pointer ${draggedNode === node.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setDraggedNode(node.id);
                  setNodeDragStart({ x: e.clientX, y: e.clientY });
                  setHasDraggedNode(false);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {/* Outer Glow */}
                {isHigh && (
                  <circle
                    r={isCenterFocus ? "28" : "24"}
                    fill="none"
                    stroke={isCenterFocus ? "var(--neon-cyan)" : "var(--neon-amber)"}
                    strokeWidth="3"
                    filter={isCenterFocus ? "url(#glow-blue)" : "url(#glow-gold)"}
                    className="animate-pulse"
                  />
                )}

                {/* Node Circle */}
                <circle
                  r={isCenterFocus ? 22 : (node.betweenness > 0.2 ? 18 : 15)}
                  fill={color}
                  fillOpacity={isHigh ? 1.0 : 0.9}
                  stroke="#1e293b"
                  strokeWidth="2.5"
                  className="hover:scale-110 transition-transform"
                />

                {/* Risk Dot */}
                {node.risk_score > 0.75 && (
                  <circle r="3.5" fill="var(--neon-pink)" />
                )}

                {/* Label Box */}
                <rect
                  x={-(node.label.length * 3.4)}
                  y={isCenterFocus ? 26 : 21}
                  width={node.label.length * 6.8}
                  height={14}
                  fill="var(--bg-surface)"
                  rx="3"
                  stroke={isHigh ? (isCenterFocus ? 'var(--neon-cyan)' : 'var(--neon-amber)') : '#334155'}
                  strokeWidth="1"
                  opacity="0.95"
                />

                {/* Node Label Text */}
                <text
                  x="0"
                  y={isCenterFocus ? 36 : 31}
                  textAnchor="middle"
                  fill="var(--text-main)"
                  fontSize="8.5px"
                  fontFamily="Space Mono, monospace"
                  fontWeight="bold"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Selected Edge Inspector Popover */}
      {selectedEdgeData && (
        <div className="absolute top-16 left-6 p-4 rounded-xl glass-panel border border-[var(--border-subtle)] shadow-2xl backdrop-blur text-xs space-y-2.5 z-30 max-w-sm animate-fade-in">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-1.5">
            <span className="font-mono text-[10.5px] font-bold text-[var(--neon-cyan)] uppercase">
              Relationship Inspector
            </span>
            <button
              onClick={() => setSelectedEdgeData(null)}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex items-center space-x-1.5 text-[var(--text-main)] font-bold">
              <span>{selectedEdgeData.source}</span>
              <span className="text-[var(--neon-amber)]">➔ [{selectedEdgeData.label}] ➔</span>
              <span>{selectedEdgeData.target}</span>
            </div>
            <div className="text-[var(--text-muted)]">Confidence: {Math.round((selectedEdgeData.confidence || 1.0) * 100)}%</div>
            {selectedEdgeData.timestamp && (
              <div className="text-[var(--text-muted)]">Date Logged: {selectedEdgeData.timestamp}</div>
            )}
          </div>

          {selectedEdgeData.document_id && (
            <button
              onClick={() => {
                if (onOpenEvidence) onOpenEvidence(selectedEdgeData.document_id);
              }}
              className="w-full flex items-center justify-center space-x-1 py-1.5 rounded-lg glass-card text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/50 font-mono text-[11px] transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Source Evidence ({selectedEdgeData.document_id})</span>
            </button>
          )}
        </div>
      )}

      {/* Floating Canvas Controls */}
      {hasNodes && (
        <div className="absolute top-4 right-4 flex items-center space-x-2 p-1.5 rounded-xl glass-panel border border-[var(--border-subtle)] backdrop-blur shadow-2xl z-20">
          {mode === 'full' && (
            <select
              value={layoutMode}
              onChange={(e) => setLayoutMode(e.target.value)}
              className="bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1 text-xs font-mono text-[var(--text-main)] focus:outline-none focus:border-[var(--border-focus)] cursor-pointer"
            >
              <option value="circular">Circular Hub (Cluster)</option>
              <option value="layered">Layered By Type</option>
              <option value="grid">Grid Matrix</option>
            </select>
          )}

          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleFit}
            title="Center / Reset View"
            className="p-1.5 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Full Screen (Esc)" : "Expand to Full Screen"}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isFullscreen 
                ? 'bg-[var(--neon-green)]/20 text-[var(--neon-green)] border border-[var(--neon-green)]/40 shadow-md' 
                : 'hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Legend Badge */}
      {hasNodes && (
        <div className="absolute bottom-4 left-4 p-3 rounded-xl glass-panel border border-[var(--border-subtle)] backdrop-blur text-[11px] space-y-1.5 shadow-2xl z-20">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
            {mode === 'focus' ? 'Focus Ego Network' : 'Entity Type Legend'}
          </div>
          <div className="grid grid-cols-3 gap-x-3.5 gap-y-1 text-[10.5px]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--neon-cyan)]"></span>
              <span className="text-[var(--text-muted)]">Person</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--neon-green)]"></span>
              <span className="text-[var(--text-muted)]">Phone</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--neon-pink)]"></span>
              <span className="text-[var(--text-muted)]">Vehicle</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4757]"></span>
              <span className="text-[var(--text-muted)]">Location</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--neon-amber)]"></span>
              <span className="text-[var(--text-muted)]">Org</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2ED573]"></span>
              <span className="text-[var(--text-muted)]">Account</span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State Overlay */}
      {!hasNodes && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-3 z-10 bg-[var(--bg-base)]/80">
          <div className="w-12 h-12 rounded-2xl glass-card border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)]">
            <Network className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[var(--text-main)] font-mono">No Graph Entities Available</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm">
              {mode === 'focus'
                ? 'No direct or multi-hop connections found for the selected entity under current filters.'
                : 'No entities or relationships match current visibility filters. Adjust filters or load the demo investigation.'}
            </p>
          </div>
          {onStartDemo && (
            <button
              onClick={onStartDemo}
              className="px-4 py-2 rounded-xl bg-[var(--neon-green)] hover:brightness-110 text-[var(--bg-subtle)] font-bold font-mono text-xs transition-all shadow-[0_0_12px_rgba(82,255,140,0.35)] active:scale-95 cursor-pointer"
            >
              Load Demo Investigation
            </button>
          )}
        </div>
      )}
    </div>
  );
}