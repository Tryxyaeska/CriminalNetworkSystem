import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, Cpu, Eye, Sparkles } from 'lucide-react';
import { ingestDocument, fetchDocuments } from '../services/api';

const SAMPLE_RECORDS = [
  {
    title: 'FIR #304/2026 - Guwahati Narcotics Intercept',
    sourceType: 'FIR',
    content: 'On 05 March 2026, Guwahati Transit Yard officers intercepted driver Amit Kumar operating vehicle AS-01-XY-9821. Amit Kumar stated he received dispatch calls from Rajesh Thapa via phone +91-98111-22334. Transactions linked to Axis Bank account AXIS-SB-4455667788 held by Vikram Malhotra.'
  },
  {
    title: 'FIR #412/2026 - Siliguri Highway Interception',
    sourceType: 'FIR',
    content: 'On 18 March 2026, Siliguri Special Task Force intercepted Mahindra Bolero WB-02-CD-5678 driven by suspect Deepak Chawla near Siliguri Junction Depot. The suspect admitted receiving direct transport instructions from Rajesh Thapa via burner phone +91-98111-22334. Field search revealed a consignment manifest referencing Apex Logistics Pvt Ltd and destination coordinator Vikram Malhotra using phone +91-98765-43210.'
  },
  {
    title: 'FIR #509/2026 - Kolkata Port Hawala Intercept',
    sourceType: 'FIR',
    content: 'On 24 March 2026, Kolkata Police Crime Branch apprehended cash courier Tariq Ahmed near Haldia Port Terminal 4. Courier was in possession of Rs 12,00,000 unaccounted cash received from Suresh Agarwal at Park Street Plaza Office. Interrogation logs confirm funds were scheduled for deposit into HDFC account HDFC-CA-9988221100 before wire transfer to Axis Bank account AXIS-SB-4455667788 held by Vikram Malhotra. Customs Inspector S. K. Roy was observed meeting Tariq Ahmed prior to apprehension.'
  },
  {
    title: 'INTEL #88/2026 - Karol Bagh Tech Arcade SIM Raid',
    sourceType: 'INTEL',
    content: 'Cyber Cell raid at Karol Bagh Tech Arcade in New Delhi uncovered a counterfeit SIM card racket managed by Mohit Verma through Metro Telecom Solutions. Seized hardware logs confirm shared GSM gateway line +91-98555-66778 was actively used to coordinate cash transits towards Patna Safehouse Flat 3B and Dimapur Market Warehouse with courier Tariq Ahmed and logistics head Rajesh Thapa.'
  }
];

export default function IngestionModal({ onDocumentIngested, onOpenEvidence }) {
  const [title, setTitle] = useState('');
  const [sourceType, setSourceType] = useState('FIR');
  const [content, setContent] = useState('');
  const [ingesting, setIngesting] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [docList, setDocList] = useState([]);
  const [sampleIndex, setSampleIndex] = useState(0);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = () => {
    fetchDocuments().then(setDocList).catch(console.error);
  };

  const handleIngest = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || ingesting) return;

    setIngesting(true);
    try {
      const res = await ingestDocument(title, sourceType, content);
      setLastResult(res);
      setTitle('');
      setContent('');
      loadDocs();
      if (onDocumentIngested) onDocumentIngested();
    } catch (err) {
      console.error('Ingestion error:', err);
    } finally {
      setIngesting(false);
    }
  };

  const loadNextSample = () => {
    const sample = SAMPLE_RECORDS[sampleIndex];
    setTitle(sample.title);
    setSourceType(sample.sourceType);
    setContent(sample.content);
    setSampleIndex((prev) => (prev + 1) % SAMPLE_RECORDS.length);
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-6 space-y-5 overflow-hidden select-none mono-font min-h-0">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-[var(--neon-green)]/15 border border-[var(--neon-green)]/35 text-[var(--neon-green)] shadow-[0_0_10px_rgba(82,255,140,0.2)] shrink-0">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-lg sm:text-xl font-extrabold text-[var(--text-main)] tracking-tight">
                DATA INGESTION PIPELINE
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--neon-green)]/15 text-[var(--neon-green)] border border-[var(--neon-green)]/35 shadow-[0_0_8px_rgba(82,255,140,0.15)]">
                NLP ACTIVE
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Parse unstructured evidentiary transcripts, FIR filings, and records into resolved entities and graph links.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={loadNextSample}
            className="px-3.5 py-1.5 rounded-xl glass-card text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/50 text-xs font-mono transition-all duration-150 flex items-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer"
            title="Click to cycle between 4 different pre-formatted sample FIR & Intel reports"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
            <span>Insert Sample #{((sampleIndex) % SAMPLE_RECORDS.length) + 1} ({SAMPLE_RECORDS[sampleIndex].sourceType})</span>
          </button>

          <span className="text-xs text-[var(--text-muted)] glass-card px-3 py-1.5 rounded-xl border-[var(--border-subtle)] shrink-0">
            Corpus: <strong className="text-[var(--neon-green)]">{docList.length} Records Indexed</strong>
          </span>
        </div>
      </div>

      {/* Main Grid: Screen-Bounded Stature */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden items-stretch h-[calc(100vh-140px)]">
        {/* Left Form Panel */}
        <form 
          onSubmit={handleIngest} 
          className="lg:col-span-7 p-6 rounded-3xl glass-panel shadow-2xl flex flex-col justify-between h-full min-h-0 overflow-hidden"
        >
          <div className="space-y-4 flex-1 flex flex-col min-h-0">
            {/* Form Header Info */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5 shrink-0">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[var(--neon-green)]" />
                <span className="text-xs sm:text-[13px] font-bold text-[var(--text-main)] uppercase tracking-wider">
                  Parameters & Entity Extraction
                </span>
              </div>
              <span className="text-[10.5px] text-[var(--text-muted)]">Spacy + Regex Parser</span>
            </div>

            {/* Upload File Input */}
            <div className="space-y-1 shrink-0">
              <label className="text-[11px] text-[var(--text-muted)] uppercase font-bold tracking-wider block">
                UPLOAD FROM DISK (OPTIONAL)
              </label>
              <input
                type="file"
                accept=".txt,.json,.csv,.log,.md"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (!title) {
                      setTitle(file.name.replace(/\.[^/.]+$/, ''));
                    }
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setContent(event.target.result || '');
                    };
                    reader.readAsText(file);
                  }
                }}
                className="w-full text-xs text-[var(--text-muted)] file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:bg-[var(--bg-surface)] file:text-[var(--neon-cyan)] hover:file:bg-[var(--border-subtle)] cursor-pointer bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl p-1.5 transition-colors"
              />
            </div>

            {/* Inputs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] text-[var(--text-muted)] uppercase font-bold tracking-wider block">
                  DOCUMENT TITLE
                </label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g., FIR-2026-0881 Dimapur Border Seizure Record..." 
                  className="w-full px-3.5 py-2 text-xs sm:text-[13px] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-[var(--border-focus)] transition-colors" 
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[var(--text-muted)] uppercase font-bold tracking-wider block">
                  SOURCE TYPE
                </label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-[13px] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-[var(--border-focus)] transition-colors cursor-pointer"
                >
                  <option value="FIR">Police FIR</option>
                  <option value="CDR">CDR Transcript</option>
                  <option value="BANK_STATEMENT">Bank Statement</option>
                  <option value="CUSTOMS_LOG">Customs Clearance</option>
                  <option value="INTEL_MEMO">Intel Field Memo</option>
                </select>
              </div>
            </div>

            {/* Textarea Area */}
            <div className="space-y-1.5 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between shrink-0">
                <label className="text-[11px] text-[var(--text-muted)] uppercase font-bold tracking-wider block">
                  RECORD TEXT
                </label>
                <span className="text-[10px] text-[var(--text-muted)]">
                  Extracts: PERSON, PHONE, VEHICLE, ACCOUNT, LOCATION
                </span>
              </div>
              <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="Paste verbatim surveillance transcript, interrogation notes, or financial transfer logs here..." 
                className="w-full flex-1 p-4 text-xs sm:text-[13px] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-2xl text-[var(--text-main)] leading-relaxed focus:outline-none focus:border-[var(--border-focus)] transition-colors resize-none custom-scrollbar shadow-inner" 
                required 
              />
            </div>
          </div>

          {/* Action Button Area */}
          <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] shrink-0">
            <button 
              type="submit" 
              disabled={ingesting} 
              className="w-full py-3 rounded-xl bg-[var(--neon-green)] text-[var(--bg-subtle)] hover:brightness-110 font-bold text-xs sm:text-[13px] tracking-wider transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center space-x-2.5 shadow-[0_0_14px_rgba(82,255,140,0.35)] cursor-pointer"
            >
              <Cpu className={`w-4 h-4 ${ingesting ? 'animate-spin' : ''}`} />
              <span>{ingesting ? 'EXTRACTING ENTITIES & RECONSTRUCTING LINKS...' : 'RUN NLP INGESTION PIPELINE'}</span>
            </button>
          </div>
        </form>

        {/* Right Corpus & Extraction Results Panel */}
        <div className="lg:col-span-5 p-6 rounded-3xl glass-panel shadow-2xl flex flex-col justify-between h-full min-h-0 overflow-hidden">
          <div className="space-y-3.5 flex-1 flex flex-col min-h-0">
            {/* Header with Counter */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] shrink-0">
              <div>
                <h3 className="text-xs sm:text-[13px] uppercase text-[var(--text-main)] font-bold tracking-wider">
                  Ingested Documents ({docList.length})
                </h3>
                <p className="text-[10.5px] text-[var(--text-muted)] mt-0.5">
                  Select a document to inspect verified graph records
                </p>
              </div>
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded glass-card text-[var(--neon-amber)] border-[var(--neon-amber)]/35">
                {docList.length} Verified
              </span>
            </div>

            {/* Live NLP Results Display (Appears on new ingestion) */}
            {lastResult && (
              <div className="p-3.5 rounded-2xl bg-[var(--neon-green)]/10 border border-[var(--neon-green)]/30 space-y-2.5 shrink-0 animate-fadeIn">
                <div className="flex items-center space-x-2 text-[var(--neon-green)] font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>NLP Knowledge Extraction Completed</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                    <span className="text-[var(--text-muted)] text-[10px] uppercase block">Entities Discovered</span>
                    <span className="text-[var(--text-main)] font-bold text-sm">{lastResult.extracted_entities_count}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                    <span className="text-[var(--text-muted)] text-[10px] uppercase block">Links Formed</span>
                    <span className="text-[var(--text-main)] font-bold text-sm">{lastResult.extracted_relationships_count}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Scrollable Corpus List */}
            <div className="space-y-2.5 overflow-y-auto custom-scrollbar flex-1 pr-1.5 pt-1.5 px-1 min-h-0">
              {docList.length > 0 ? (
                docList.map((d) => (
                  <div 
                    key={d.id} 
                    onClick={() => onOpenEvidence && onOpenEvidence(d.id)} 
                    className="p-3 rounded-xl glass-card hover:border-[var(--border-focus)] cursor-pointer transition-all active:scale-98 flex items-center justify-between group shadow-sm"
                  >
                    <div className="space-y-1 min-w-0 pr-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10.5px] font-bold text-[var(--neon-amber)]">
                          {d.id}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded glass-card text-[var(--text-muted)] uppercase">
                          {d.source_type}
                        </span>
                      </div>
                      <p className="text-[var(--text-main)] text-xs sm:text-[12.5px] font-semibold truncate group-hover:text-[var(--neon-green)] transition-colors">
                        {d.title}
                      </p>
                      <span className="text-[10px] text-[var(--text-muted)] block">
                        {d.created_at || 'Verified Record'}
                      </span>
                    </div>

                    <div className="w-7 h-7 rounded-lg glass-card flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--neon-green)] group-hover:border-[var(--neon-green)]/40 shrink-0 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-[var(--text-muted)] text-xs">
                  No documents ingested yet.
                </div>
              )}
            </div>
          </div>

          {/* Bottom Resolution Status Pill */}
          <div className="mt-4 p-3 rounded-xl glass-card border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] flex items-center justify-between shrink-0">
            <span className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--neon-green)]" />
              <span>Automated Graph Linker</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-[var(--neon-green)] tracking-wider">
              Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}