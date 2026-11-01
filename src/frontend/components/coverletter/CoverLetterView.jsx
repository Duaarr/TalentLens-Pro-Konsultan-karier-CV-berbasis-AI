import React, { useState, useEffect, useRef } from 'react';
import { 
  FileSignature, 
  Download, 
  Eraser
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { downloadCoverLetterPDF } from '../../../backend/export/pdfLetterGenerator';
import Card from '../common/Card';

/**
 * Panel tanda tangan digital: user menggambar langsung dengan mouse/jari di
 * atas canvas HTML5, lalu hasilnya (PNG data URL) ditanam ke PDF surat lamaran.
 * Tidak ada library pihak ketiga -- canvas API bawaan browser sudah cukup.
 * Canvas sengaja selalu berlatar putih (bukan ikut dark mode) karena hasilnya
 * akan jadi gambar yang ditempel di PDF berlatar putih.
 */
function SignaturePad({ onChange }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const hasDrawn = useRef(false);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    isDrawing.current = true;
    hasDrawn.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const endDraw = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (hasDrawn.current) {
      onChange(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawn.current = false;
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        className="w-full h-[130px] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-white touch-none cursor-crosshair"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
      <button
        type="button"
        onClick={clear}
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
      >
        <Eraser className="w-3 h-3" />
        <span>Hapus & Gambar Ulang</span>
      </button>
    </div>
  );
}

export default function CoverLetterView() {
  const { cvData, setActiveModal } = useApp();
  const [targetCompany, setTargetCompany] = useState('PT Teknologi Nusantara Bersama');
  const [targetRole, setTargetRole] = useState('Professional Associate');
  const [activeLang, setActiveLang] = useState('id'); // 'id' | 'en'

  // Field surat lamaran dipecah per BAGIAN supaya user bisa menyunting tiap
  // bagian sesuai kebutuhan spesifik lamarannya -- dipakai pdfLetterGenerator
  // untuk menyusun PDF surat yang rapi.
  const [openingParagraph, setOpeningParagraph] = useState('');
  const [bodyParagraph, setBodyParagraph] = useState('');
  const [closingParagraph, setClosingParagraph] = useState('');
  const [cityDate, setCityDate] = useState('');
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);

  useEffect(() => {
    if (!cvData) return;
    const meta = cvData.metadata || {};
    const skillsSnippet = meta.extractedSkills?.slice(0, 4).join(', ') || 'analisis strategis dan eksekusi terukur';

    if (cvData?.careerMatch?.roles?.[0]?.roleName) {
      setTargetRole(cvData.careerMatch.roles[0].roleName);
    }

    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    setCityDate(`${today}`);

    if (activeLang === 'id') {
      setOpeningParagraph(`Sehubungan dengan informasi kesempatan berkarier yang dibuka, melalui surat ini saya bermaksud mengajukan diri untuk bergabung dengan tim profesional Bapak/Ibu.`);
      setBodyParagraph(`Saya merupakan lulusan dari bidang ${meta.detectedMajor || 'Akademik'}${meta.detectedUniversity ? ' di ' + meta.detectedUniversity : ''}. Selama masa studi dan pengalaman proyek praktis, saya telah terbiasa bekerja dengan keahlian ${skillsSnippet}, serta memiliki rekam jejak nyata dalam menyelesaikan masalah secara sistematis dan berorientasi pada hasil terukur.`);
      setClosingParagraph(`Bersama surat ini, saya lampirkan dokumen Curriculum Vitae dan portofolio sebagai bahan pertimbangan. Besar harapan saya untuk diberikan kesempatan wawancara agar dapat memaparkan kualifikasi dan motivasi kerja saya secara lebih mendalam. Atas perhatian yang diberikan, saya ucapkan terima kasih.`);
    } else {
      setOpeningParagraph(`I am writing to express my strong enthusiasm for this position. With a strong background in ${meta.detectedMajor || 'academic studies'}${meta.detectedUniversity ? ' from ' + meta.detectedUniversity : ''}, I am eager to leverage my skills to drive impactful outcomes for your organization.`);
      setBodyParagraph(`I have proven practical capabilities in ${skillsSnippet}, demonstrated through structured problem-solving, cross-functional collaboration, and delivering high-quality deliverables throughout my academic journey and internship projects.`);
      setClosingParagraph(`Thank you for your time and consideration. I welcome the opportunity to discuss my qualifications in greater detail during an interview.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvData?.fileName, cvData?.metadata?.nameCandidate, activeLang]);

  if (!cvData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Belum Ada Dokumen CV yang Terhubung</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mb-5">
          Unggah dokumen CV Anda untuk menghasilkan draf surat lamaran kerja profesional secara instan.
        </p>
        <button
          onClick={() => setActiveModal('upload-cv')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          Unggah Dokumen CV
        </button>
      </div>
    );
  }

  const meta = cvData.metadata || {};
  const matchedRoles = cvData.careerMatch?.roles || [];

  const handleDownloadPDF = () => {
    const fileName = `Surat_Lamaran_${targetCompany.replace(/\s+/g, '_')}_${(meta.nameCandidate || 'Kandidat').replace(/\s+/g, '_')}.pdf`;
    downloadCoverLetterPDF({
      candidateName: meta.nameCandidate,
      email: meta.email,
      phone: meta.phone,
      cityDate,
      targetCompany,
      targetRole,
      bodyParagraphs: [openingParagraph, bodyParagraph, closingParagraph].filter(p => p.trim()),
      lang: activeLang,
      signatureDataUrl
    }, fileName);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-6 custom-scrollbar">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Studio Surat Lamaran Kerja
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Isi tiap bagian, tanda tangani langsung di layar, lalu unduh sebagai PDF yang sudah terformat rapi.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveLang('id')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeLang === 'id' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Bahasa Indonesia
          </button>
          <button
            onClick={() => setActiveLang('en')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeLang === 'en' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Target Customizer */}
      <Card className="p-5 space-y-3 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Nama Perusahaan Target
            </label>
            <input
              type="text"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Posisi yang Dilamar
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Kota, Tanggal
            </label>
            <input
              type="text"
              value={cityDate}
              onChange={(e) => setCityDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {matchedRoles.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 flex-shrink-0">Pilih Cepat Posisi:</span>
            {matchedRoles.slice(0, 4).map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setTargetRole(r.roleName)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                  targetRole === r.roleName
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                {r.roleName} ({r.matchPercentage}%)
              </button>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Form Terstruktur per Bagian Surat */}
        <Card className="lg:col-span-2 p-6 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Isi Surat Lamaran (per bagian)
            </h4>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh sebagai PDF</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Paragraf Pembuka
            </label>
            <textarea
              rows={3}
              value={openingParagraph}
              onChange={(e) => setOpeningParagraph(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Paragraf Isi (Kualifikasi & Pengalaman)
            </label>
            <textarea
              rows={4}
              value={bodyParagraph}
              onChange={(e) => setBodyParagraph(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Paragraf Penutup
            </label>
            <textarea
              rows={3}
              value={closingParagraph}
              onChange={(e) => setClosingParagraph(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Draf tiap bagian sudah diisi otomatis berdasarkan CV-mu — silakan sunting sesuai lowongan spesifik yang kamu lamar.
          </p>
        </Card>

        {/* Tanda Tangan Digital */}
        <Card className="p-5 space-y-3 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 flex flex-col shadow-xs">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Tanda Tangan Digital
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              Gambar tanda tanganmu di bawah ini  otomatis tertanam ke PDF saat diunduh.
            </p>
          </div>

          <SignaturePad onChange={setSignatureDataUrl} />

          <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            {signatureDataUrl ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">✓ Tanda tangan siap, akan otomatis ditempel di PDF.</span>
            ) : (
              <span>Belum ada tanda tangan. Kalau dilewati, PDF tetap diunduh dengan ruang kosong untuk tanda tangan manual seperti biasa.</span>
            )}
          </div>
        </Card>

      </div>

    </div>
  );
}