import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Wrench, 
  FileText, 
  Eye, 
  CornerDownRight, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { queryCopilot } from '../services/api';

export default function CopilotChat({ 
  onHighlightGraph, 
  onOpenEvidence, 
  onSelectEntity,
  initialQuery = null 
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 **Welcome to CRIMENET AI Investigation Copilot.**

I analyze ingested FIRs, CDR communications, banking transfers, and surveillance reports through verified graph algorithms and analytics tools.

**Recommended Queries & Tasks:**
- *"What suspicious patterns or anomalies have been detected?"*
- *"Who are the top influential coordinators in this network?"*
- *"Trace the multi-hop connection between suspect entities."*
- *"Summarize recent evidence documents and call records."*`,
      toolTraces: [],
      citations: [],
      followups: [
        "Show all detected suspicious anomalies",
        "Rank top influential bridge entities",
        "Explain recent evidence records"
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim() || isLoading) return;

    const userMsg = { role: 'user', content: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await queryCopilot(q);
      
      const assistantMsg = {
        role: 'assistant',
        content: response.answer,
        toolTraces: response.tool_traces || [],
        citations: response.evidence_citations || [],
        followups: response.suggested_followups || [],
        highlightNodes: response.highlight_node_ids || [],
        highlightEdges: response.highlight_edge_ids || []
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Copilot query error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ **Error processing query**: Unable to connect to backend intelligence agent. Please ensure the backend is running.',
          toolTraces: [],
          citations: []
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/80 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--neon-cyan)]/15 border border-[var(--neon-cyan)]/30 flex items-center justify-center shadow-sm shadow-[var(--neon-cyan)]/20">
            <Bot className="w-5 h-5 text-[var(--neon-cyan)]" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-[var(--text-main)] flex items-center space-x-2">
              <span>Investigation Copilot</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] font-mono border border-[var(--neon-cyan)]/30">
                Agentic Tools
              </span>
            </h2>
            <p className="text-[11px] text-[var(--text-muted)]">Strictly Grounded • Evidence-Grounded AI • Tool-Orchestrated</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-[11px] text-[var(--neon-green)] bg-[var(--neon-green)]/10 border border-[var(--neon-green)]/20 px-2.5 py-1 rounded-md font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Local Engine</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}
          >
            {/* Message Bubble */}
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm ${
                msg.role === 'user'
                  ? 'bg-[var(--neon-cyan)] text-[var(--bg-base)] font-medium rounded-tr-none'
                  : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] rounded-tl-none space-y-3'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed">
                {msg.content}
              </div>

              {/* Tool Traces Accordion */}
              {msg.toolTraces?.length > 0 && (
                <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-[10px] font-mono uppercase text-[var(--text-muted)] font-semibold">
                    <Wrench className="w-3 h-3 text-[var(--neon-cyan)]" />
                    <span>Agent Tool Calls ({msg.toolTraces.length})</span>
                  </div>
                  <div className="space-y-1">
                    {msg.toolTraces.map((t, tIdx) => (
                      <div key={tIdx} className="p-1.5 px-2 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)] font-mono text-[10px]">
                        <span className="text-[var(--neon-cyan)] font-bold">{t.tool_name}()</span>
                        <p className="text-[var(--text-muted)] text-[9px] mt-0.5">{t.output_summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence Citations */}
              {msg.citations?.length > 0 && (
                <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-[10px] font-mono uppercase text-[var(--text-muted)] font-semibold">
                    <FileText className="w-3 h-3 text-[var(--neon-amber)]" />
                    <span>Evidence Citations ({msg.citations.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {msg.citations.map((c, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => onOpenEvidence && onOpenEvidence(c.id)}
                        className="p-1.5 px-2 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[var(--neon-amber)]/50 text-left transition-colors flex items-center justify-between"
                      >
                        <div>
                          <span className="font-mono font-bold text-[10px] text-[var(--neon-amber)]">{c.id}</span>
                          <span className="block text-[9px] text-[var(--text-muted)] truncate max-w-[140px]">{c.title}</span>
                        </div>
                        <Eye className="w-3 h-3 text-[var(--text-muted)]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons for Graph Highlight */}
              {msg.highlightNodes?.length > 0 && (
                <div className="pt-2 flex items-center space-x-2">
                  <button
                    onClick={() => onHighlightGraph && onHighlightGraph(msg.highlightNodes, msg.highlightEdges)}
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[var(--neon-cyan)]/20 hover:bg-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] font-mono text-[10px] border border-[var(--neon-cyan)]/40 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Highlight {msg.highlightNodes.length} Entities on Graph</span>
                  </button>
                </div>
              )}
            </div>

            {/* Suggested Followups */}
            {msg.followups?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1 max-w-[85%]">
                {msg.followups.map((f, fIdx) => (
                  <button
                    key={fIdx}
                    onClick={() => handleSend(f)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)] text-[var(--text-muted)] text-[10px] transition-all duration-150 active:scale-95"
                  >
                    <CornerDownRight className="w-2.5 h-2.5 text-[var(--neon-cyan)]" />
                    <span>{f}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] max-w-[50%]">
            <Bot className="w-4 h-4 text-[var(--neon-cyan)] animate-spin" />
            <span className="font-mono text-xs">Invoking analytical graph tools...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/50">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask an investigation question (e.g. 'Why is Vikram Malhotra important?')..."
            className="w-full pl-4 pr-12 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-cyan)] text-xs font-mono transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="absolute right-2 p-1.5 rounded-lg bg-[var(--neon-cyan)] hover:brightness-110 text-[var(--bg-base)] disabled:opacity-40 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}