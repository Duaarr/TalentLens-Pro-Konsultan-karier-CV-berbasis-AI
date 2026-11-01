import React, { useState } from 'react';
import { 
  X, 
  Database, 
  FileText, 
  Layers, 
  Search, 
  Copy, 
  Check, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  Hash, 
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { splitTextIntoChunks } from '../../../backend/rag/textSplitter';
import { SemanticRAGIndexer } from '../../../backend/rag/semanticRetriever';
import Card from '../common/Card';
import Badge from '../common/Badge';

export default function RAGExplorerModal() {
  const { activeModal, setActiveModal, cvData, clearCV } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chunks'); // 'chunks' | 'raw'
  const [copied, setCopied] = useState(false);

  if (activeModal !== 'rag-explorer' || !cvData) return null;

  const chunks = splitTextIntoChunks(cvData.rawText);
  const indexer = new SemanticRAGIndexer(cvData.rawText);
  const searchResults = searchQuery.trim() ? indexer.search(searchQuery, 10) : chunks;

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(cvData.rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">RAG Knowledge Context & Chunk Explorer</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Inspeksi representasi data dokumen yang dipelajari sistem</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Metadata Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Kandidat</span>
              <span className="font-bold text-xs text-slate-900 dark:text-white truncate block">{cvData.metadata?.nameCandidate || 'Mahasiswa'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Total Kata</span>
              <span className="font-bold text-xs text-blue-600 dark:text-blue-400">{cvData.metadata?.wordCount || 0} kata</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Jumlah Chunks</span>
              <span className="font-bold text-xs text-slate-700 dark:text-slate-200">{chunks.length} Segmen</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Halaman PDF</span>
              <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">{cvData.pageCount || 1} Halaman</span>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('chunks')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'chunks' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Segmen Chunks ({chunks.length})
              </button>
              <button
                onClick={() => setActiveTab('raw')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'raw' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Teks Mentah Terbaca
              </button>
            </div>

            {activeTab === 'chunks' && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Uji semantic search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-48"
                />
              </div>
            )}
          </div>

          {/* Tab 1: Chunks Explorer */}
          {activeTab === 'chunks' && (
            <div className="space-y-3">
              {searchResults.map((chunk, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                        Chunk #{chunk.index || idx + 1}
                      </span>
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">Bagian: {chunk.section}</span>
                    </div>
                    {chunk.similarityPercent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                        Match: {chunk.similarityPercent}%
                      </span>
                    )}
                  </div>
                  <p className="text-slate-800 dark:text-slate-300 leading-relaxed font-mono text-[11px] bg-white dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    {chunk.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Raw Extracted Text */}
          {activeTab === 'raw' && (
            <div className="space-y-2">
              <div className="flex justify-end">
                <button
                  onClick={handleCopyRaw}
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin Seluruh Teks'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono leading-relaxed whitespace-pre-wrap select-text max-h-[360px] overflow-y-auto custom-scrollbar">
                {cvData.rawText}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Hapus dokumen CV dari memori sesi ini?')) {
                clearCV();
                setActiveModal(null);
              }
            }}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-rose-100/50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Dokumen dari Sesi</span>
          </button>
          
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
