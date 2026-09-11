import React, { useState } from 'react';
import { HelpCircle, Info } from 'lucide-react';

const METRIC_DEFINITIONS = {
  betweenness: {
    title: "Betweenness Centrality",
    text: "How much this person acts as a bridge connecting otherwise separate groups in the network."
  },
  pagerank: {
    title: "PageRank / Influence Score",
    text: "How central or important this person is, based on who they're connected to."
  },
  influence: {
    title: "Influence Score (PageRank)",
    text: "How central or important this person is, based on who they're connected to."
  },
  community: {
    title: "Community / Cluster (Louvain)",
    text: "A group of entities that interact closely with each other, separate from other groups."
  },
  cluster: {
    title: "Community / Cluster",
    text: "A group of entities that interact closely with each other, separate from other groups."
  },
  degree: {
    title: "Degree / Connection Count",
    text: "How many direct connections this entity has."
  },
  density: {
    title: "Graph Density",
    text: "The proportion of possible connections in the network that are actually present."
  }
};

export default function MetricTooltip({ term, text, title, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const def = (term && METRIC_DEFINITIONS[term.toLowerCase()]) || {
    title: title || "Metric Info",
    text: text || "Graph intelligence metric for criminal network analysis."
  };

  return (
    <span 
      className={`relative inline-flex items-center group cursor-help mono-font ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
    >
      <HelpCircle className="w-3.5 h-3.5 text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors ml-1 inline shrink-0" />
      
      {isOpen && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-2.5 rounded-xl glass-panel border border-[var(--border-subtle)] text-[var(--text-main)] text-[11px] shadow-2xl z-50 pointer-events-none text-left leading-tight backdrop-blur-md">
          <span className="block font-bold text-[var(--neon-cyan)] font-mono text-[10.5px] uppercase tracking-wider mb-1">
            {def.title}
          </span>
          <span className="block text-[var(--text-muted)] font-normal font-sans">
            {def.text}
          </span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-[var(--border-subtle)]" />
        </span>
      )}
    </span>
  );
}