import React from 'react';
import { Download, Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Navbar() {
  const { 
    cvData, 
    activeResolution, 
    setActiveModal, 
    activeTab, 
    setActiveTab, 
    handleExportReport,
    theme,
    toggleTheme
  } = useApp();

  const isConfigured = activeResolution.provider !== 'none' && activeResolution.provider !== 'rag-local';

  const NAV_TABS = [
    { id: 'chat', label: 'Konsultasi' },
    { id: 'ats', label: 'ATS Optimizer', score: cvData?.atsScore?.overallScore ?? null },
    { id: 'career', label: 'Peta Karier' },
    { id: 'interview', label: 'Simulasi Wawancara' },
    { id: 'coverletter', label: 'Surat Lamaran' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          
          {/* Brand Lockup: dua baris, tanpa ikon dan tanpa separator pipe */}
          <div className="flex flex-col justify-center flex-shrink-0 cursor-pointer leading-tight" onClick={() => setActiveTab('chat')}>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-[1.05rem] tracking-tight text-slate-900 dark:text-white">
                TalentLens
              </span>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                Pro
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Konsultan karier & CV berbasis AI
            </span>
          </div>

          {/* Center Navigation: underline tabs, bukan pill segmented control */}
          <nav className="hidden md:flex items-stretch gap-7 h-16 flex-1 justify-center">
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 text-[13px] transition-colors cursor-pointer ${
                    isActive
                      ? 'text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.score != null && (
                    <span className={isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400 dark:text-slate-500 font-semibold'}>
                      {tab.score}
                    </span>
                  )}
                  <span
                    className={`absolute -bottom-[1px] left-0 right-0 h-[2px] rounded-full transition-all ${
                      isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Action Center Right */}
          <div className="flex items-center gap-2 flex-shrink-0">
            
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* CV Status */}
            {cvData ? (
              <button
                onClick={() => setActiveModal('rag-explorer')}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs hover:border-blue-400 dark:hover:border-blue-700 transition-colors cursor-pointer"
                title="Klik untuk membuka data RAG CV"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="truncate max-w-[120px] font-semibold text-slate-800 dark:text-slate-200">{cvData.fileName}</span>
                <span className="text-slate-400 dark:text-slate-500">({cvData.metadata?.wordCount || 0} kata)</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveModal('upload-cv')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs font-semibold hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Belum Ada CV</span>
              </button>
            )}

            {/* API Key Status */}
            <button
              onClick={() => setActiveModal('api-settings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                isConfigured
                  ? 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-700'
                  : 'border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
              title="Konfigurasi Model AI & Kunci API"
            >
              <span className="truncate max-w-[120px]">{isConfigured ? activeResolution.model : 'Setel API Key'}</span>
            </button>

            {/* Upload CV */}
            <button
              onClick={() => setActiveModal('upload-cv')}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white transition-colors active:scale-[0.98] cursor-pointer"
            >
              <span className="hidden sm:inline">{cvData ? 'Ganti CV' : 'Unggah CV'}</span>
            </button>

            {/* Export */}
            {cvData && (
              <button
                onClick={handleExportReport}
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-colors cursor-pointer"
                title="Unduh Laporan Konsultasi (.md)"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>

        {/* Mobile Sub-Navigation */}
        <div className="md:hidden flex items-center gap-5 overflow-x-auto py-2.5 border-t border-slate-200 dark:border-slate-800 no-scrollbar">
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap text-xs transition-colors cursor-pointer ${
                  isActive
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-500 dark:text-slate-400 font-medium'
                }`}
              >
                <span>{tab.label}</span>
                {tab.score != null && (
                  <span className={isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'}>
                    {tab.score}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}