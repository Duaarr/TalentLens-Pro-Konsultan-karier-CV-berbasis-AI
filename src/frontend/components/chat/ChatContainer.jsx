import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  RotateCcw, 
  Trash2, 
  Upload, 
  Loader2, 
  Briefcase, 
  BarChart3, 
  UserCheck, 
  Award, 
  MessageSquarePlus,
  ArrowUp,
  FileText,
  Paperclip,
  X,
  BookOpen,
  KeyRound,
  ExternalLink,
  Target,
  Database,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ChatMessage from './ChatMessage';

const SHORTCUT_PROMPTS = [
  {
    id: 'career-match',
    icon: Briefcase,
    label: 'Pekerjaan yang Cocok',
    prompt: 'Berdasarkan pengalaman dan skill di CV ini, posisi pekerjaan atau magang apa yang paling cocok untuk saya lamar?',
    description: 'Rekomendasi role industri & estimasi gaji',
  },
  {
    id: 'cv-weakness',
    icon: BarChart3,
    label: 'Evaluasi & Kekurangan CV',
    prompt: 'Apa saja kekurangan di CV saya yang perlu diperbaiki agar lolos sistem ATS dan menarik bagi recruiter HR?',
    description: 'Analisis kelemahan poin & format dokumen',
  },
  {
    id: 'interview-pitch',
    icon: UserCheck,
    label: 'Teks Perkenalan Interview',
    prompt: 'Buatkan naskah perkenalan diri (elevator pitch) 60 detik untuk wawancara kerja berdasarkan CV ini dengan metode STAR.',
    description: 'Draf Bahasa Indonesia & Bahasa Inggris',
  },
  {
    id: 'skills-certifications',
    icon: Award,
    label: 'Rekomendasi Sertifikasi',
    prompt: 'Berdasarkan kesenjangan skill di CV ini, sertifikasi kredibel apa saja yang perlu saya ambil untuk meningkatkan nilai tawar?',
    description: 'Saran sertifikasi resmi & program industri',
  },
  {
    id: 'interview-sim',
    icon: MessageSquarePlus,
    label: 'Simulasi Tanya Jawab HR',
    prompt: 'Simulasikan 5 pertanyaan interview yang paling sering ditanyakan oleh HR terkait data di CV saya, beserta poin jawaban kuncinya.',
    description: 'Latihan antisipasi pertanyaan krusial',
  }
];

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function ChatContainer() {
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    cvData, 
    activeResolution,
    setActiveModal, 
    clearChat, 
    regenerateLastMessage,
    loadSampleCV,
    updateApiSettings
  } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [dragOverChat, setDragOverChat] = useState(false);
  const [quickApiKey, setQuickApiKey] = useState('');
  const [quickSaved, setQuickSaved] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileAttachmentInputRef = useRef(null);

  const isConfigured = activeResolution.provider === 'gemini' || activeResolution.provider === 'openai';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + 'px';
    }
  }, [inputPrompt]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if ((!inputPrompt.trim() && !attachedFile) || isLoading) return;

    const textToSend = inputPrompt;
    const fileToSend = attachedFile;

    setInputPrompt('');
    setAttachedFile(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    sendMessage(textToSend, fileToSend);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFile(file);
    }
  };

  const handleChatDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverChat(true);
  };

  const handleChatDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverChat(false);
  };

  const handleChatDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverChat(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setAttachedFile(file);
    }
  };

  const handleShortcut = (promptText) => {
    sendMessage(promptText);
  };

  const handleSaveQuickKey = (e) => {
    e.preventDefault();
    if (!quickApiKey.trim()) return;
    updateApiSettings({
      geminiKey: quickApiKey.trim(),
      geminiModel: 'gemini-3.6-flash',
      preferredProvider: 'gemini'
    });
    setQuickSaved(true);
    setQuickApiKey('');
    setTimeout(() => {
      setQuickSaved(false);
    }, 3000);
  };

  return (
    <div 
      onDragOver={handleChatDragOver}
      onDragLeave={handleChatDragLeave}
      onDrop={handleChatDrop}
      className="flex-1 flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full px-3 sm:px-6 py-3 relative"
    >
      <input
        ref={fileAttachmentInputRef}
        type="file"
        accept=".pdf,.txt,.text,.md"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drag Drop Overlay */}
      {dragOverChat && (
        <div className="absolute inset-3 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-2 border-dashed border-blue-500 rounded-2xl flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-150">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
            <Upload className="w-7 h-7 animate-bounce" />
          </div>
          <p className="font-bold text-slate-900 dark:text-white text-sm">Lepaskan Dokumen CV di Sini</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sistem RAG akan mengekstrak data teks secara instan</p>
        </div>
      )}

      {/* Top Banner 1: Prominent API Key Connection Bar (Always Visible & Easy to Enter) */}
      <div className="mb-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-xs dark:shadow-md flex-shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                Konfigurasi Token / API Key
                {isConfigured ? (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Aktif: {activeResolution.model}
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                    Mode Local Engine (Offline)
                  </span>
                )}
              </p>
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Gunakan <strong>Google Gemini API Key (100% Gratis)</strong> untuk hasil analisis penalaran terlengkap.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveQuickKey} className="flex items-center gap-2 flex-shrink-0">
            <input
              type="password"
              placeholder="Tempel Gemini API Key (AIzaSy...)"
              value={quickApiKey}
              onChange={(e) => setQuickApiKey(e.target.value)}
              className="px-3.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 font-mono w-48 sm:w-60"
            />
            <button
              type="submit"
              disabled={!quickApiKey.trim()}
              className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {quickSaved ? 'Tersimpan!' : 'Simpan'}
            </button>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold underline whitespace-nowrap pl-1 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Key Gratis</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </form>
        </div>
      </div>

      {/* Top Banner 2: Quick CV Preset Bar if no CV is loaded */}
      {!cvData && !attachedFile && (
        <div className="mb-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 via-slate-50 to-white dark:from-blue-950/70 dark:via-slate-900 dark:to-slate-900 border border-blue-200 dark:border-blue-900/50 shadow-xs flex-shrink-0 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900 dark:text-white">Lampirkan Dokumen CV Anda</p>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">Unggah berkas PDF CV Anda atau uji langsung menggunakan preset resume mahasiswa di samping.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => loadSampleCV('informatika')}
                className="px-3 py-1.5 text-xs font-bold bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
              >
                Sample CV IT
              </button>
              <button
                onClick={() => loadSampleCV('manajemen')}
                className="px-3 py-1.5 text-xs font-bold bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
              >
                Sample Bisnis
              </button>
              <button
                onClick={() => fileAttachmentInputRef.current?.click()}
                className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Pilih Berkas PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto pr-1 pb-2 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onShortcutClick={handleShortcut} />
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm animate-in fade-in">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <span>TalentLens sedang menganalisis dokumen...</span>
                <span className="flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"></span>
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Menghubungkan data ke model {activeResolution.model}...</p>
            </div>
          </div>
        )}

        {/* Shortcut Question Cards if CV is loaded & chat has few messages */}
        {cvData && messages.length <= 4 && !isLoading && (
          <div className="pt-2 pb-2 space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Pertanyaan Rekomendasi Berbasis CV:
              </span>
              <button
                onClick={() => setActiveModal('rag-explorer')}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                Basis Data RAG ({cvData.metadata?.wordCount || 0} kata)
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {SHORTCUT_PROMPTS.map((sc) => {
                const IconComponent = sc.icon;
                return (
                  <button
                    key={sc.id}
                    onClick={() => handleShortcut(sc.prompt)}
                    className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-blue-50/30 dark:hover:bg-slate-900 transition-all text-left group shadow-xs cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {sc.label}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                        "{sc.prompt}"
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Sticky Action Bar & Input */}
      <div className="pt-2 flex-shrink-0">
        
        {/* Quick Toolbar above input */}
        <div className="flex items-center justify-between gap-2 px-1 mb-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
            {SHORTCUT_PROMPTS.slice(0, 3).map(sc => (
              <button
                key={sc.id}
                onClick={() => handleShortcut(sc.prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-3 py-1 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-800 text-[11px] font-bold transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
              >
                {sc.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {messages.length > 1 && (
              <>
                <button
                  onClick={regenerateLastMessage}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Ulangi Respon Terakhir"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Ulangi</span>
                </button>
                <button
                  onClick={clearChat}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 px-2.5 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Bersihkan Sesi Chat"
                >
                  <Trash2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Bersihkan</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Input Box Form */}
        <form 
          onSubmit={handleSubmit} 
          className="relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 shadow-md p-2 transition-all"
        >
          {/* Active Attached File Chip */}
          {attachedFile && (
            <div className="mb-2 mx-1 p-2.5 rounded-xl bg-blue-50/70 dark:bg-slate-950 border border-blue-300 dark:border-blue-500/40 flex items-center justify-between text-xs animate-in fade-in">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate max-w-xs">{attachedFile.name}</p>
                  <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                    {formatBytes(attachedFile.size)} • Dokumen Siap Dipelajari
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors cursor-pointer"
                title="Hapus berkas"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            {/* Paperclip Button */}
            <button
              type="button"
              onClick={() => fileAttachmentInputRef.current?.click()}
              className={`p-2.5 rounded-xl transition-colors flex-shrink-0 cursor-pointer ${
                attachedFile 
                  ? 'bg-blue-100 dark:bg-blue-600/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-500/40' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Lampirkan Dokumen CV (PDF / TXT)"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                attachedFile
                  ? 'Ketik pertanyaan seputar CV ini (atau tekan Enter untuk analisis lengkap)...'
                  : cvData 
                    ? 'Tanyakan apa saja seputar evaluasi karier, CV, atau simulasi interview...' 
                    : 'Ketik pertanyaan Anda atau lampirkan berkas CV PDF di sini...'
              }
              className="flex-1 max-h-36 min-h-[40px] py-2 px-2 bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none focus:outline-hidden leading-relaxed"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={(!inputPrompt.trim() && !attachedFile) || isLoading}
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                (inputPrompt.trim() || attachedFile) && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30 cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
              title="Kirim pesan (Enter)"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>

        <p className="text-[11px] text-center font-medium text-slate-500 dark:text-slate-400 mt-1.5">
          Lampirkan file PDF CV Anda dan langsung ajukan pertanyaan konsultasi.
        </p>
      </div>

    </div>
  );
}

