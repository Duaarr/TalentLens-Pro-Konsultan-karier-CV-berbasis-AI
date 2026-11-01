import React, { useState } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  RotateCcw, 
  Check, 
  Copy 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Badge from '../common/Badge';

export default function ATSAnalysisView() {
  const { cvData, setActiveModal } = useApp();
  const [bulletInput, setBulletInput] = useState('');
  const [polishedResult, setPolishedResult] = useState('');
  const [copied, setCopied] = useState(false);

  if (!cvData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-xl">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Belum Ada Dokumen CV yang Terhubung</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mb-5">
          Unggah dokumen CV Anda untuk melihat evaluasi skor ATS, analisis kepatuhan format, dan rekomendasi perbaikan berbasis data.
        </p>
        <button
          onClick={() => setActiveModal('upload-cv')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all"
        >
          Unggah Dokumen CV
        </button>
      </div>
    );
  }

  const { atsScore, metadata } = cvData;
  const majorLower = (metadata?.detectedMajor || '').toLowerCase();

  const handlePolishBullet = (e) => {
    e.preventDefault();
    if (!bulletInput.trim()) return;

    const mainAction = bulletInput.trim().replace(/^[-*•]\s*/, '');
    let enhanced = '';

    if (majorLower.includes('manajemen') || majorLower.includes('bisnis') || majorLower.includes('marketing') || majorLower.includes('pemasaran')) {
      enhanced = `Menginisiasi dan mengoptimalkan strategi ${mainAction}, menghasilkan lonjakan performa & konversi sebesar 32% serta memperluas jangkauan ke 45.000+ audiens target.`;
    } else if (majorLower.includes('data') || majorLower.includes('statistika')) {
      enhanced = `Merancang pipeline dan model ${mainAction}, mengotomatisasi pengolahan 1.500.000+ baris data serta mendongkrak akurasi analisis hingga 91.5%.`;
    } else if (majorLower.includes('akuntansi') || majorLower.includes('keuangan')) {
      enhanced = `Menyusun dan memodelkan analisis ${mainAction}, memangkas varians anggaran sebesar 18% serta memastikan audit kepatuhan finansial 100% tepat waktu.`;
    } else if (majorLower.includes('desain') || majorLower.includes('dkv') || majorLower.includes('ui/ux')) {
      enhanced = `Merancang sistem antarmuka ${mainAction}, memvalidasi kebutuhan 80+ responden pengguna hingga mendongkrak skor kepuasan CSAT sebesar 28%.`;
    } else {
      enhanced = `Memimpin inisiatif pengembangan ${mainAction}, mengoptimalkan performa arsitektur hingga memangkas waktu muat sebesar 35% dan mendukung 50.000+ pengguna aktif.`;
    }

    setPolishedResult(enhanced);
  };

  const handleCopyPolished = () => {
    navigator.clipboard.writeText(polishedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400';
    if (score >= 55) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getProgressBg = (score) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 55) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const sampleChips = majorLower.includes('manajemen') || majorLower.includes('marketing') || majorLower.includes('bisnis')
    ? ['Mengelola akun Instagram & TikTok klien', 'Riset pasar perilaku konsumen UMKM', 'Menyusun laporan Google Analytics 4']
    : majorLower.includes('data') || majorLower.includes('statistika')
      ? ['Membuat dashboard monitoring Tableau', 'Query SQL untuk ekstraksi transaksi', 'Model machine learning churn prediction']
      : ['Mengembangkan antarmuka dashboard React.js', 'Membuat RESTful API backend dengan Node.js', 'Menerapkan unit testing Jest'];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-6 custom-scrollbar">
      
      {/* Header Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Overall Score Gauge Card */}
        <Card className="p-6 flex flex-col items-center justify-center text-center space-y-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Skor Total Kepatuhan ATS
          </span>
          
          <div className="relative flex items-center justify-center my-2">
            <div className="w-32 h-32 rounded-full border-8 border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-inner relative">
              <div 
                className="absolute inset-0 rounded-full border-8 border-blue-600 border-t-cyan-400"
                style={{ clipPath: `polygon(0 0, 100% 0, 100% ${atsScore.overallScore}%, 0 ${atsScore.overallScore}%)` }}
              ></div>
              <div className="text-center z-10">
                <span className={`text-4xl font-extrabold tracking-tight ${getScoreColor(atsScore.overallScore)}`}>
                  {atsScore.overallScore}
                </span>
                <span className="block text-[10px] text-slate-600 dark:text-slate-400 uppercase font-bold mt-0.5">dari 100</span>
              </div>
            </div>
          </div>

          <Badge variant={atsScore.overallScore >= 80 ? 'emerald' : atsScore.overallScore >= 65 ? 'blue' : 'amber'} className="text-xs px-3 py-1 font-extrabold">
            {atsScore.gradeDescription}
          </Badge>
          
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 max-w-xs">
            Evaluasi profil <strong>{metadata.nameCandidate}</strong> ({metadata.detectedMajor}).
          </p>
        </Card>

        {/* Breakdown Metrics */}
        <Card className="lg:col-span-2 p-6 space-y-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Rincian Metrik Penilaian ATS
            </h4>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{atsScore.wordCount} Total Kata</span>
          </div>

          <div className="space-y-3.5">
            {[
              { label: 'Informasi Kontak & Identitas', score: atsScore.breakdown.contactInfo, weight: '20%' },
              { label: 'Kelengkapan Bagian Standar', score: atsScore.breakdown.sectionCompleteness, weight: '25%' },
              { label: 'Dampak Kuantitatif & Kata Kerja Aksi', score: atsScore.breakdown.quantifiableMetrics, weight: '25%' },
              { label: 'Kedalaman Kata Kunci Keahlian', score: atsScore.breakdown.skillsDepth, weight: '20%' },
              { label: 'Kesesuaian Format & Panjang Dokumen', score: atsScore.breakdown.formattingATS, weight: '10%' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{item.label} <span className="text-slate-500 text-[10px]">({item.weight})</span></span>
                  <span className={`font-extrabold ${getScoreColor(item.score)}`}>{item.score}/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getProgressBg(item.score)}`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Strengths & Improvements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Strengths */}
        <Card className="p-5 space-y-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Kekuatan Dokumen CV Terdeteksi</h4>
          </div>
          <div className="space-y-2.5">
            {atsScore.strengths.map((st, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-emerald-50/70 dark:bg-slate-950/70 border border-emerald-200 dark:border-emerald-900/40 text-xs space-y-0.5">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 block">{st.title}</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{st.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Priority Improvements */}
        <Card className="p-5 space-y-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-4 h-4" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Rekomendasi Perbaikan Prioritas</h4>
          </div>
          <div className="space-y-2.5">
            {atsScore.improvements.map((imp, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-amber-50/70 dark:bg-slate-950/70 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-300 block">{imp.area}</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{imp.issue}</p>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 text-[11px] text-blue-700 dark:text-blue-300 font-mono font-medium border border-slate-200 dark:border-slate-800">
                  Solusi: {imp.example}
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Action Verbs / STAR Resume Polisher Tool */}
      <Card className="p-6 space-y-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Alat Pengoptimal Poin Pengalaman (STAR Resume Polisher)</h4>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Ubah deskripsi tugas biasa menjadi kalimat berorientasi hasil yang disukai recruiter HR.</p>
            </div>
          </div>
        </div>

        {/* Quick Example Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 flex-shrink-0">Contoh Cepat:</span>
          {sampleChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setBulletInput(chip)}
              className="text-[11px] px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-800 transition-colors whitespace-nowrap shadow-xs font-medium cursor-pointer"
            >
              "{chip}"
            </button>
          ))}
        </div>

        <form onSubmit={handlePolishBullet} className="space-y-3">
          <input
            type="text"
            placeholder="Ketik tugas biasa Anda atau pilih salah satu contoh cepat di atas..."
            value={bulletInput}
            onChange={(e) => setBulletInput(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 shadow-xs font-medium"
          />
          
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={!bulletInput.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              Optimalkan dengan Formula STAR
            </button>
          </div>
        </form>

        {polishedResult && (
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-slate-950 border border-blue-200 dark:border-blue-500/40 space-y-2 animate-in fade-in shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-blue-700 dark:text-blue-400">Hasil Rekomendasi ATS-Optimized:</span>
              <button
                onClick={handleCopyPolished}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white inline-flex items-center gap-1 font-bold cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin Kalimat'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-semibold">
              "{polishedResult}"
            </p>
          </div>
        )}
      </Card>

    </div>
  );
}

