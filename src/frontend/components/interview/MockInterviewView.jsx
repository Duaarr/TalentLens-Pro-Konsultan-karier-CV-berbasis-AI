import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  MessageSquare, 
  Check, 
  Copy,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getInterviewTracksForCandidate, evaluateUserAnswer } from '../../../backend/analysis/interviewEngine';
import Card from '../common/Card';
import Badge from '../common/Badge';

export default function MockInterviewView() {
  const { cvData, setActiveModal } = useApp();
  const [selectedTrackId, setSelectedTrackId] = useState('hr_behavioral');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  const tracks = cvData 
    ? getInterviewTracksForCandidate(cvData.metadata, cvData.rawText) 
    : [];

  useEffect(() => {
    setSelectedTrackId('hr_behavioral');
    setSelectedQuestionIndex(0);
    setUserAnswer('');
    setEvaluationResult(null);
  }, [cvData?.fileName, cvData?.metadata?.nameCandidate]);

  if (!cvData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Belum Ada Dokumen CV yang Terhubung</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mb-5">
          Unggah dokumen CV Anda untuk mengaktifkan simulasi wawancara kerja terarah, penilaian metode STAR, dan masukan recruiter secara langsung.
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

  const activeTrack = tracks.find(t => t.id === selectedTrackId) || tracks[0] || { questions: [] };
  const activeQuestion = activeTrack.questions[selectedQuestionIndex] || activeTrack.questions[0] || {
    question: 'Ceritakan pengalaman kerja/organisasi Anda...',
    criteria: 'Kelengkapan STAR'
  };

  const handleEvaluate = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setIsEvaluating(true);
    setTimeout(() => {
      const evalRes = evaluateUserAnswer(activeQuestion.question, userAnswer, cvData.metadata);
      setEvaluationResult(evalRes);
      setIsEvaluating(false);
    }, 600);
  };

  const handleResetAnswer = () => {
    setUserAnswer('');
    setEvaluationResult(null);
  };

  const handleCopyPolished = () => {
    if (!evaluationResult?.polishedAnswer) return;
    navigator.clipboard.writeText(evaluationResult.polishedAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-6 custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Simulator Wawancara Kerja Interaktif (Metode STAR)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pertanyaan disesuaikan secara dinamis untuk bidang <strong>{cvData.metadata?.detectedMajor || 'studi Anda'}</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowMethodology(v => !v)}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Dasar Penilaian Ini Apa?</span>
          </button>
          <Badge variant="emerald" className="text-xs px-3 py-1">
            Kandidat: {cvData.metadata?.nameCandidate}
          </Badge>
        </div>
      </div>

      {/* Panel transparansi metodologi -- supaya evaluasi tidak terkesan "ngarang AI" */}
      {showMethodology && (
        <Card className="p-5 space-y-3 bg-blue-50/60 dark:bg-slate-900 border-blue-200 dark:border-blue-900/40">
          <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
            Metodologi & Referensi Penilaian
          </h4>
          <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              <strong>1. Struktur pertanyaan & kriteria penilaian</strong> memakai metode <strong>STAR (Situation, Task, Action, Result)</strong>,
              juga dikenal sebagai <em>Behavioral Event Interview (BEI)</em> — teknik wawancara berbasis perilaku yang
              dikembangkan oleh Development Dimensions International (DDI) dan menjadi standar rekrutmen di banyak
              perusahaan global (termasuk Google & Amazon) sejak tahun 1970-an.
            </p>
            <p>
              <strong>2. Skor dihitung dari deteksi elemen STAR</strong> pada jawabanmu (apakah ada konteks situasi,
              tugas yang jelas, tindakan konkret, dan hasil terukur) — bukan menilai "benar/salah" isi jawaban secara
              subjektif. Jawaban yang tidak relevan dengan pertanyaan atau tidak tersusun sebagai kalimat bermakna
              akan mendapat skor rendah karena minim elemen STAR yang terdeteksi, bukan karena "AI menghukum" secara acak.
            </p>
            <p>
              <strong>3. Naskah "contoh jawaban lebih menjual"</strong> memakai format kalimat berorientasi hasil,
              sejalan dengan formula <em>Google's XYZ Resume/Interview Formula</em> ("Mencapai [X], diukur dengan [Y],
              melalui [Z]") yang dipopulerkan Laszlo Bock (mantan SVP People Operations Google) dalam buku <em>Work Rules!</em>.
            </p>
            <p className="text-slate-500 dark:text-slate-400 italic">
              Catatan jujur: ini alat bantu latihan struktur jawaban, bukan pengganti simulasi wawancara dengan
              manusia/recruiter sungguhan. Gunakan sebagai kerangka berpikir, bukan skor final yang mutlak.
            </p>
          </div>
        </Card>
      )}

      {/* Track Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tracks.map((track) => {
          const isSelected = track.id === selectedTrackId;
          return (
            <button
              key={track.id}
              onClick={() => {
                setSelectedTrackId(track.id);
                setSelectedQuestionIndex(0);
                handleResetAnswer();
              }}
              className={`p-4 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-400 dark:border-blue-500/70 text-slate-900 dark:text-white shadow-md ring-1 ring-blue-400/40 dark:ring-blue-500/30'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                Kategori Wawancara
              </span>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1 line-clamp-1">{track.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{track.description}</p>
            </button>
          );
        })}
      </div>

      {/* Main Interview Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        <Card className="lg:col-span-2 p-6 space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pertanyaan {selectedQuestionIndex + 1} dari {activeTrack.questions.length}
            </span>
            <div className="flex items-center gap-1.5">
              {activeTrack.questions.map((_, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => {
                    setSelectedQuestionIndex(qIdx);
                    handleResetAnswer();
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    qIdx === selectedQuestionIndex
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                >
                  {qIdx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-blue-200 dark:border-blue-900/40 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Pertanyaan Recruiter:</span>
            <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
              "{activeQuestion.question}"
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200 dark:border-slate-800/80">
              Kriteria yang Dinilai: {activeQuestion.criteria}
            </p>
          </div>

          <form onSubmit={handleEvaluate} className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Tuliskan Jawaban Anda (Simulasi Nyata):</label>
              <span>{userAnswer.split(/\s+/).filter(Boolean).length} kata</span>
            </div>

            <textarea
              rows={5}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Gunakan formula STAR: Ceritakan Situation (situasi), Task (tugas Anda), Action (tindakan nyata), dan Result (hasil terukur)..."
              className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 leading-relaxed shadow-xs"
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetAnswer}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              >
                Reset Jawaban
              </button>

              <button
                type="submit"
                disabled={!userAnswer.trim() || isEvaluating}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
              >
                {isEvaluating ? 'Mengevaluasi...' : 'Evaluasi Jawaban STAR'}
              </button>
            </div>
          </form>

        </Card>

        {/* Evaluation Output */}
        <Card className="p-5 space-y-4 flex flex-col">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Laporan Evaluasi & Skor STAR
            </h4>
          </div>

          {evaluationResult ? (
            <div className="space-y-4 flex-1">
              
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-center border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">Skor Kualitas Jawaban</span>
                <span className={`text-3xl font-extrabold ${evaluationResult.score >= 8 ? 'text-emerald-600 dark:text-emerald-400' : evaluationResult.score >= 6 ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {evaluationResult.score} / 10
                </span>
                <button
                  onClick={() => setShowMethodology(true)}
                  className="block mx-auto mt-1 text-[10px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Kenapa skornya segini?
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Kelengkapan Elemen STAR:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className={`p-2 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 ${evaluationResult.starChecklist.situation ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'}`}>
                    <span>Situation (S)</span>
                  </div>
                  <div className={`p-2 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 ${evaluationResult.starChecklist.task ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'}`}>
                    <span>Task (T)</span>
                  </div>
                  <div className={`p-2 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 ${evaluationResult.starChecklist.action ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'}`}>
                    <span>Action (A)</span>
                  </div>
                  <div className={`p-2 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 ${evaluationResult.starChecklist.result ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'}`}>
                    <span>Result (R)</span>
                  </div>
                </div>
              </div>

              {evaluationResult.feedbackPoints?.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Catatan Evaluasi:</span>
                  <ul className="space-y-1">
                    {evaluationResult.feedbackPoints.map((fp, i) => (
                      <li key={i} className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">{fp}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-blue-200 dark:border-blue-900/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-600 dark:text-blue-400">Contoh Kalimat Lebih Menjual:</span>
                  <button
                    onClick={handleCopyPolished}
                    className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white inline-flex items-center gap-1 text-[11px]"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  "{evaluationResult.polishedAnswer}"
                </p>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-400 dark:text-slate-500 text-xs space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700" />
              <p>Tuliskan jawaban Anda di sebelah kiri lalu klik tombol "Evaluasi Jawaban STAR".</p>
            </div>
          )}
        </Card>

      </div>

    </div>
  );
}