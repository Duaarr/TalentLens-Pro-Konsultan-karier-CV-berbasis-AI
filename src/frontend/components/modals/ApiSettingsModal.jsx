import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  KeyRound, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Check, 
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AVAILABLE_MODELS, testApiConnection, DEFAULT_GEMINI_MODEL } from '../../../backend/ai/aiService';

export default function ApiSettingsModal() {
  const { 
    activeModal, 
    setActiveModal, 
    apiSettings, 
    updateApiSettings 
  } = useApp();

  const [formData, setFormData] = useState({
    openaiKey: apiSettings.openaiKey || '',
    openaiModel: apiSettings.openaiModel || 'gpt-4o-mini',
    geminiKey: apiSettings.geminiKey || '',
    geminiModel: apiSettings.geminiModel || DEFAULT_GEMINI_MODEL,
    preferredProvider: apiSettings.preferredProvider || 'gemini'
  });

  const [customGemini, setCustomGemini] = useState(false);

  const [testStatus, setTestStatus] = useState({
    openai: { loading: false, result: null },
    gemini: { loading: false, result: null }
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  if (activeModal !== 'api-settings') return null;

  const handleTestKey = async (provider) => {
    const key = provider === 'openai' ? formData.openaiKey : formData.geminiKey;
    const model = provider === 'openai' ? formData.openaiModel : formData.geminiModel;

    setTestStatus(prev => ({
      ...prev,
      [provider]: { loading: true, result: null }
    }));

    const result = await testApiConnection(provider, key, model);

    setTestStatus(prev => ({
      ...prev,
      [provider]: { loading: false, result }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateApiSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveModal(null);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Konfigurasi Model AI & API Keys</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Google Gemini (Free Tier) atau OpenAI Model Adapter</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Provider Selection */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Pilih Provider Model Utama:
            </label>
            <div className="grid grid-cols-2 gap-3">
              
              {/* Option Gemini */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, preferredProvider: 'gemini' })}
                className={`p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                  formData.preferredProvider === 'gemini'
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs dark:shadow-lg ring-1 ring-blue-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Google Gemini</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800/40">
                    Gratis / Free Tier
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Model Gemini 3.6 Flash / Pro</p>
              </button>

              {/* Option OpenAI */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, preferredProvider: 'openai' })}
                className={`p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                  formData.preferredProvider === 'openai'
                    ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-xs dark:shadow-lg ring-1 ring-indigo-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">OpenAI</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800/40">
                    Berbayar
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Model GPT-4o-mini / GPT-4o</p>
              </button>

            </div>
          </div>

          {/* Section 1: Google Gemini */}
          <div className={`border rounded-xl p-5 space-y-3.5 transition-all ${
            formData.preferredProvider === 'gemini'
              ? 'border-blue-300 dark:border-blue-800/60 bg-blue-50/30 dark:bg-slate-950/60 shadow-xs dark:shadow-md'
              : 'border-slate-200 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-950/20 opacity-70'
          }`}>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                Google Gemini API
              </h4>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Buat Key Gratis di AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Gemini API Key
                </label>
                <div className="relative flex items-center">
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={formData.geminiKey}
                    onChange={(e) => setFormData({ ...formData, geminiKey: e.target.value })}
                    className="w-full pl-3 pr-24 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleTestKey('gemini')}
                    disabled={!formData.geminiKey || testStatus.gemini.loading}
                    className="absolute right-1 px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {testStatus.gemini.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Tes Koneksi'}
                  </button>
                </div>
              </div>

              {testStatus.gemini.result && (
                <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                  testStatus.gemini.result.success ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                }`}>
                  {testStatus.gemini.result.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                  <span>{testStatus.gemini.result.message}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Pilihan Model Gemini
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomGemini(!customGemini)}
                    className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    {customGemini ? 'Pilih dari Daftar' : '+ Kustom Nama Model'}
                  </button>
                </div>

                {customGemini ? (
                  <input
                    type="text"
                    placeholder="gemini-3.6-flash, gemini-3.1-flash..."
                    value={formData.geminiModel}
                    onChange={(e) => setFormData({ ...formData, geminiModel: e.target.value.trim() })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <select
                    value={formData.geminiModel}
                    onChange={(e) => setFormData({ ...formData, geminiModel: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  >
                    {AVAILABLE_MODELS.gemini.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: OpenAI */}
          <div className={`border rounded-xl p-5 space-y-3.5 transition-all ${
            formData.preferredProvider === 'openai'
              ? 'border-indigo-300 dark:border-indigo-800/60 bg-indigo-50/30 dark:bg-slate-950/60 shadow-xs dark:shadow-md'
              : 'border-slate-200 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-950/20 opacity-70'
          }`}>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                OpenAI API
              </h4>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Platform OpenAI</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  OpenAI API Key
                </label>
                <div className="relative flex items-center">
                  <input
                    type="password"
                    placeholder="sk-proj-..."
                    value={formData.openaiKey}
                    onChange={(e) => setFormData({ ...formData, openaiKey: e.target.value })}
                    className="w-full pl-3 pr-24 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleTestKey('openai')}
                    disabled={!formData.openaiKey || testStatus.openai.loading}
                    className="absolute right-1 px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {testStatus.openai.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Tes Koneksi'}
                  </button>
                </div>
              </div>

              {testStatus.openai.result && (
                <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                  testStatus.openai.result.success ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                }`}>
                  {testStatus.openai.result.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                  <span>{testStatus.openai.result.message}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Model OpenAI
                </label>
                <select
                  value={formData.openaiModel}
                  onChange={(e) => setFormData({ ...formData, openaiModel: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                >
                  {AVAILABLE_MODELS.openai.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Keamanan Lokal:</strong> Seluruh kunci API disimpan secara aman di <code>localStorage</code> peramban Anda dan tidak pernah dikirim ke server pihak ketiga manapun selain endpoint resmi Google/OpenAI.
            </p>
          </div>

          {/* Buttons Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Tersimpan</span>
                </>
              ) : (
                'Simpan Konfigurasi'
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
