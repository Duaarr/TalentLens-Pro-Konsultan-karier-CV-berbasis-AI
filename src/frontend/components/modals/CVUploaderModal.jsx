import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Zap, 
  ShieldCheck,
  FileCheck2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_CVS } from '../../../backend/data/sampleCVs';

export default function CVUploaderModal() {
  const { 
    activeModal, 
    setActiveModal, 
    uploadCVFile, 
    loadSampleCV, 
    isUploading, 
    uploadError,
    setUploadError,
    cvData
  } = useApp();

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  if (activeModal !== 'upload-cv') return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      try {
        await uploadCVFile(file);
      } catch (err) {}
    }
  };

  const handleChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        await uploadCVFile(file);
      } catch (err) {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Unggah Dokumen CV Mahasiswa</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Format dokumen PDF (.pdf) atau Teks (.txt / .md)</p>
            </div>
          </div>
          <button
            onClick={() => {
              setUploadError(null);
              setActiveModal(null);
            }}
            className="text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          
          {/* Active CV status */}
          {cvData && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-xs">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>
                  CV Terhubung: <strong className="text-slate-900 dark:text-white">{cvData.fileName}</strong> ({cvData.metadata?.wordCount} kata)
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                Aktif
              </span>
            </div>
          )}

          {/* Error Notice */}
          {uploadError && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Gagal Memproses Dokumen</p>
                <p className="text-rose-700 dark:text-rose-400/90 mt-0.5">{uploadError}</p>
              </div>
            </div>
          )}

          {/* Drag & Drop Box */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[0.99]'
                : 'border-slate-300 dark:border-slate-800 hover:border-blue-500/50 hover:bg-blue-50/40 dark:hover:bg-slate-950/40 bg-slate-50/50 dark:bg-slate-950/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.text,.md"
              onChange={handleChange}
              className="hidden"
            />

            {isUploading ? (
              <div className="flex flex-col items-center py-4">
                <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin mb-3" />
                <p className="font-semibold text-slate-900 dark:text-white text-xs">Mengekstrak teks & menganalisis metadata...</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Menggunakan engine PDF.js client-side RAG</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  Pilih file CV dari komputer atau seret file ke sini
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mb-3">
                  Format PDF atau TXT (Maks. 10MB). Teks diekstrak langsung di peramban Anda.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-950/80 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800/50">
                  <Upload className="w-3.5 h-3.5" />
                  Pilih Berkas PDF
                </span>
              </>
            )}
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Privasi Dokumen:</strong> Ekstraksi dokumen dilakukan secara lokal di peramban (client-side). Dokumen tidak disimpan di server pihak ketiga.
            </p>
          </div>

          {/* Sample Presets Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
              Atau Uji dengan Contoh Preset CV Mahasiswa
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Sample CV Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {SAMPLE_CVS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => loadSampleCV(sample.id)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-blue-50/40 dark:hover:bg-slate-950/60 text-left transition-all group bg-slate-50/40 dark:bg-slate-950/20 cursor-pointer"
              >
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors truncate">
                  {sample.candidateName}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {sample.category}
                </p>
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
