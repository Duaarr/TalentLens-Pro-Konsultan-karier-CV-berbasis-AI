import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  ExternalLink,
  Loader2,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { searchLiveJobsForRole } from '../../../backend/ai/aiService';
import { searchCuratedCompanyJobs } from '../../../backend/jobs/liveJobBoardService';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * Bangun tautan pencarian LANGSUNG ke situs lowongan asli (bukan scraping/fetch).
 * Ini cuma menyusun URL lalu membuka tab baru — browser user sendiri yang
 * menavigasi ke sana secara normal, jadi tidak melanggar CORS/ToS apa pun,
 * dan hasilnya selalu 100% real-time & akurat karena langsung dari situs aslinya.
 * Tidak butuh API key apa pun -- berfungsi penuh di mode RAG lokal.
 *
 * Diurutkan sumber berbahasa Indonesia LEBIH DULU, supaya user yang kurang
 * nyaman dengan bahasa Inggris tetap terlayani dengan baik -- bukan cuma
 * kebagian opsi berbahasa Inggris di posisi utama.
 */
function buildJobSearchLinks(roleName) {
  const q = encodeURIComponent(roleName);
  // JobStreet Indonesia memakai format slug di path URL (bukan query param biasa),
  // contoh terverifikasi: id.jobstreet.com/android-developer-jobs-in-sales
  const slug = roleName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return [
    // Bahasa Indonesia penuh -- JobStreet adalah situs lowongan #1 di Indonesia
    { name: 'JobStreet Indonesia', lang: 'id', url: `https://id.jobstreet.com/${slug}-jobs` },
    { name: 'Glints Indonesia', lang: 'id', url: `https://glints.com/id/opportunities/jobs/explore?keyword=${q}&country=ID` },
    { name: 'Kalibrr', lang: 'id', url: `https://www.kalibrr.com/job-board?q=${q}` },
    // Berbahasa Inggris / internasional
    { name: 'Indeed Indonesia', lang: 'en', url: `https://id.indeed.com/jobs?q=${q}&l=Indonesia` },
    { name: 'LinkedIn Jobs', lang: 'en', url: `https://www.linkedin.com/jobs/search/?keywords=${q}&location=Indonesia` },
  ];
}

export default function CareerMatchView() {
  const { cvData, setActiveModal, setActiveTab, sendMessage, apiSettings } = useApp();
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [jobSearchState, setJobSearchState] = useState({}); // { [roleIndex]: { loading, result, error } }
  const [curatedJobState, setCuratedJobState] = useState({}); // { [roleIndex]: { loading, result, error } }

  // Sync selected index whenever cvData changes
  useEffect(() => {
    setSelectedRoleIndex(0);
  }, [cvData?.fileName, cvData?.metadata?.nameCandidate]);

  if (!cvData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Belum Ada Dokumen CV yang Terhubung</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mb-5">
          Unggah dokumen CV Anda untuk melihat pemetaan posisi kerja industri yang paling cocok, analisis kesenjangan skill, dan roadmap karier 6 bulan.
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

  const { careerMatch, metadata } = cvData;
  const roles = careerMatch?.roles || [];
  const activeRole = roles[selectedRoleIndex] || roles[0];

  const handleAskAboutRole = (role) => {
    setActiveTab('chat');
    sendMessage(`Saya tertarik dengan posisi **${role.roleName}** (Match: ${role.matchPercentage}%). Mohon berikan strategi lengkap untuk mempersiapkan diri melamar posisi ini berdasarkan CV saya.`);
  };

  const handleSearchLiveJobs = async (role, roleIdx) => {
    setJobSearchState(prev => ({ ...prev, [roleIdx]: { loading: true, result: null, error: null } }));
    try {
      const result = await searchLiveJobsForRole({
        roleName: role.roleName,
        majorText: metadata.detectedMajor,
        apiSettings
      });
      setJobSearchState(prev => ({ ...prev, [roleIdx]: { loading: false, result, error: null } }));
    } catch (err) {
      setJobSearchState(prev => ({ ...prev, [roleIdx]: { loading: false, result: null, error: err.message } }));
    }
  };

  // Ambil kata kunci sederhana dari nama role (potong di "&" supaya lebih general,
  // mis. "Backend Engineer & API Specialist" -> "Backend Engineer") supaya
  // pencocokan judul posisi di board Greenhouse/Lever lebih longgar & akurat.
  const handleSearchCuratedJobs = async (role, roleIdx) => {
    setCuratedJobState(prev => ({ ...prev, [roleIdx]: { loading: true, result: null, error: null } }));
    try {
      const keyword = role.roleName.split('&')[0].trim();
      const result = await searchCuratedCompanyJobs(keyword);
      setCuratedJobState(prev => ({ ...prev, [roleIdx]: { loading: false, result, error: null } }));
    } catch (err) {
      setCuratedJobState(prev => ({ ...prev, [roleIdx]: { loading: false, result: null, error: err.message || 'Gagal mengambil data lowongan.' } }));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-6 custom-scrollbar">
      
      {/* Header Profile Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Pemetaan Posisi Karier & Analisis Kesenjangan Keahlian
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Menganalisis kecocokan profil <strong>{metadata.nameCandidate}</strong> ({metadata.detectedMajor}) terhadap kualifikasi standar industri rekrutmen.
          </p>
        </div>
        <Badge variant="blue" className="self-start sm:self-auto text-xs px-3 py-1">
          {roles.length} Posisi Teranalisis
        </Badge>
      </div>

      {/* Role Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {roles.slice(0, 4).map((role, idx) => {
          const isSelected = idx === selectedRoleIndex;
          return (
            <div
              key={idx}
              onClick={() => setSelectedRoleIndex(idx)}
              className={`p-4 rounded-2xl cursor-pointer border transition-all flex flex-col justify-between shadow-xs ${
                isSelected
                  ? 'bg-blue-50 dark:bg-slate-900 border-blue-500 dark:border-blue-500 shadow-sm ring-1 ring-blue-500/30 scale-[1.01]'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Rekomendasi #{idx + 1}</span>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                    role.matchPercentage >= 85 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' 
                      : role.matchPercentage >= 70
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                        : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                  }`}>
                    {role.matchPercentage}% Match
                  </span>
                </div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block truncate mb-1">{role.category}</span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 mb-1">{role.roleName}</h4>
                <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 line-clamp-2 mb-1 leading-relaxed">{role.description}</p>
                <span className={`text-[10px] font-bold mb-2 block ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                  {isSelected ? 'Deskripsi lengkap ditampilkan di bawah ↓' : 'Klik untuk baca selengkapnya'}
                </span>
              </div>
              
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold truncate text-[11px]">{role.salaryRange.split('–')[0]}</span>
                <ArrowRight className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400 translate-x-0.5' : 'text-slate-400 dark:text-slate-600'} transition-transform`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Selected Role Deep Dive */}
      {activeRole && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Main Info */}
          <Card className="lg:col-span-2 p-6 space-y-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                  {activeRole.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{activeRole.roleName}</h3>
              </div>
              
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">Estimasi Gaji Masuk (Indonesia)</span>
                <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">{activeRole.salaryRange}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Deskripsi Peran Lengkap
              </span>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {activeRole.description}
              </p>
            </div>

            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {activeRole.rationale}
            </p>

            {/* Skill Matrix: Matched vs Missing Gap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Matched Skills */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-slate-950 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Keahlian Terpenuhi di CV ({activeRole.matchedSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeRole.matchedSkills.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800/50 text-[11px] font-bold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills Gap */}
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-slate-950 border border-amber-200 dark:border-amber-900/40 space-y-2">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  Kesenjangan Keahlian (Skill Gap) ({activeRole.missingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeRole.missingSkills.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800/50 text-[11px] font-bold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Industry and Companies */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-200">Sektor Industri Paling Potensial:</span>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{activeRole.industry}</p>
              </div>
            </div>

            <button
              onClick={() => handleAskAboutRole(activeRole)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Tanyakan Strategi Melamar Posisi Ini ke Konsultan AI</span>
            </button>

            {/* Lowongan SPESIFIK & REAL dari API resmi ATS (Greenhouse/Lever) -- nama
                perusahaan asli, posisi asli, link apply langsung. Tanpa API key,
                tanpa scraping. Cakupan terbatas ke perusahaan tech global/remote. */}
            <div className="pt-1 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Lowongan Spesifik dari Perusahaan Tech Global (Real-Time, Link Langsung)
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 flex-shrink-0">
                  English
                </span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 -mt-1">
                Perusahaan & lowongan di sini umumnya berbahasa Inggris. Kalau kamu lebih nyaman bahasa Indonesia, gunakan tombol "Bahasa Indonesia" di bawah.
              </p>
              <button
                onClick={() => handleSearchCuratedJobs(activeRole, selectedRoleIndex)}
                disabled={curatedJobState[selectedRoleIndex]?.loading}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {curatedJobState[selectedRoleIndex]?.loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memeriksa 27 board perusahaan secara langsung...</span>
                  </>
                ) : (
                  <>
                    <span>Cari Lowongan "{activeRole.roleName.split('&')[0].trim()}" Sekarang</span>
                  </>
                )}
              </button>

              {curatedJobState[selectedRoleIndex]?.error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-[11px] text-rose-800 dark:text-rose-300 font-medium">
                  {curatedJobState[selectedRoleIndex].error}
                </div>
              )}

              {curatedJobState[selectedRoleIndex]?.result && (
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    Ditemukan {curatedJobState[selectedRoleIndex].result.totalFound} lowongan cocok dari {curatedJobState[selectedRoleIndex].result.companiesSearched} perusahaan yang dicek langsung.
                  </p>

                  {curatedJobState[selectedRoleIndex].result.jobs.length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      Tidak ada lowongan yang cocok dengan kata kunci ini di antara perusahaan yang dicek saat ini. Coba tombol "Buka Pencarian Langsung" di bawah untuk cakupan pasar kerja Indonesia yang lebih luas.
                    </div>
                  ) : (
                    curatedJobState[selectedRoleIndex].result.jobs.map((job, i) => (
                      <a
                        key={i}
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-xl bg-emerald-50/70 dark:bg-slate-950 border border-emerald-200 dark:border-emerald-900/40 hover:border-emerald-400 dark:hover:border-emerald-700 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">{job.title}</span>
                            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 capitalize">{job.company}</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3 h-3" />
                          <span>{job.location}</span>
                          <span className="ml-auto px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-bold">{job.source}</span>
                        </div>
                      </a>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Buka Pencarian Langsung: selalu aktif, tanpa API key, tanpa scraping */}
            <div className="pt-1 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Buka Pencarian Lowongan Langsung (real-time, tanpa API key)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {buildJobSearchLinks(activeRole.roleName).map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-semibold transition-colors text-center"
                  >
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      link.lang === 'id'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {link.lang === 'id' ? 'Bahasa Indonesia' : 'English'}
                    </span>
                    <span className="truncate w-full">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Live Job Search via Google Search Grounding (butuh Gemini API Key) */}
            <div className="pt-1">
              <button
                onClick={() => handleSearchLiveJobs(activeRole, selectedRoleIndex)}
                disabled={jobSearchState[selectedRoleIndex]?.loading}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {jobSearchState[selectedRoleIndex]?.loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mencari lowongan aktif di internet...</span>
                  </>
                ) : (
                  <>
                    <span>Cari Lowongan Aktif Sekarang (Real-Time)</span>
                  </>
                )}
              </button>

              {jobSearchState[selectedRoleIndex]?.error && (
                <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-[11px] text-rose-800 dark:text-rose-300 font-medium">
                  {jobSearchState[selectedRoleIndex].error}
                </div>
              )}

              {jobSearchState[selectedRoleIndex]?.result && (
                <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Hasil pencarian langsung dari internet, bukan data statis
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                    {jobSearchState[selectedRoleIndex].result.text}
                  </p>
                  {jobSearchState[selectedRoleIndex].result.sources?.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Sumber:</span>
                      {jobSearchState[selectedRoleIndex].result.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{src.title}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* 6-Month Career Learning Roadmap */}
          <Card className="p-5 space-y-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Roadmap Akselerasi 6 Bulan</h4>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Rencana aksi penguasaan gap skills</p>
              </div>
            </div>

            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {activeRole.roadmap?.map((step, idx) => (
                <div key={idx} className="relative pl-7 space-y-1">
                  <div className="absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900"></div>
                  <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    {step.phase}
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                    {step.focus}
                  </p>
                </div>
              ))}
            </div>
          </Card>

        </div>
      )}

    </div>
  );
}