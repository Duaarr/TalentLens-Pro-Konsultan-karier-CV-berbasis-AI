import React from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  FileText, 
  User, 
  Database,
  X,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Badge from '../common/Badge';

export default function Sidebar({ isOpen, onClose }) {
  const { 
    sessions, 
    currentSessionId, 
    switchSession, 
    createNewSession, 
    deleteSession, 
    cvData, 
    setActiveModal,
    setActiveTab
  } = useApp();

  return (
    <>
      {/* Mobile / Slide-Over Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 lg:z-auto w-72 bg-white/90 lg:bg-slate-100/60 dark:bg-slate-950/95 lg:dark:bg-slate-950/60 backdrop-blur-xl border-r border-slate-200/90 dark:border-slate-800/80 p-4 flex flex-col space-y-4 select-none transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${!isOpen ? 'hidden lg:flex' : 'flex'}`}
      >
        {/* Mobile Header with Close Button */}
        <div className="flex lg:hidden items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <span className="font-bold text-sm text-slate-900 dark:text-white">Menu & Riwayat Sesi</span>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* New Chat Button */}
        <button
          onClick={() => {
            createNewSession();
            setActiveTab('chat');
            if (onClose) onClose();
          }}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Sesi Konsultasi Baru</span>
        </button>

        {/* Candidate Profile Card */}
        {cvData ? (
          <Card className="p-3.5 space-y-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                Profil Dokumen CV
              </span>
              <Badge variant="emerald" className="text-[10px] px-1.5 py-0 font-bold">Terhubung</Badge>
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{cvData.metadata?.nameCandidate || 'Mahasiswa'}</h4>
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 line-clamp-1">{cvData.metadata?.detectedMajor || 'Akademik'}</p>
            </div>
            
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400">Skor ATS</span>
                <span className="font-extrabold text-xs text-blue-600 dark:text-blue-400">{cvData.atsScore?.overallScore || 0}/100</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400">Total Kata</span>
                <span className="font-extrabold text-xs text-slate-900 dark:text-slate-200">{cvData.metadata?.wordCount || 0}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveModal('rag-explorer');
                if (onClose) onClose();
              }}
              className="w-full mt-1 py-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-900/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Inspeksi RAG Context</span>
            </button>
          </Card>
        ) : (
          <Card className="p-3.5 border border-dashed border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 text-center space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-slate-400 mx-auto flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Belum Ada Dokumen CV</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Unggah berkas CV untuk membuka fitur analisis penuh.</p>
            <button
              onClick={() => {
                setActiveModal('upload-cv');
                if (onClose) onClose();
              }}
              className="px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Pilih Berkas CV
            </button>
          </Card>
        )}

        {/* Sessions History List */}
        <div className="flex-1 flex flex-col min-h-0 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            Riwayat Percakapan
          </span>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {sessions.map((sess) => {
              const isSelected = sess.id === currentSessionId;
              return (
                <div
                  key={sess.id}
                  onClick={() => {
                    switchSession(sess.id);
                    setActiveTab('chat');
                    if (onClose) onClose();
                  }}
                  className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-100/80 dark:bg-blue-600/20 border border-blue-300 dark:border-blue-500/40 text-blue-900 dark:text-blue-200 font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white font-medium border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="text-xs truncate">{sess.title || 'Sesi Konsultasi'}</span>
                  </div>
                  
                  {sessions.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(sess.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 rounded-md transition-opacity cursor-pointer"
                      title="Hapus sesi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </aside>
    </>
  );
}

