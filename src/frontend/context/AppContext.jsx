import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { extractTextFromPDF } from '../../backend/parsers/pdfParser';
import { extractTextFromTxt } from '../../backend/parsers/textParser';
import { extractMetadata } from '../../backend/parsers/metadataExtractor';
import { sendChatMessage, resolveApiProvider, DEFAULT_GEMINI_MODEL } from '../../backend/ai/aiService';
import { calculateATSScore } from '../../backend/analysis/atsScorer';
import { matchCareerRoles } from '../../backend/analysis/careerMatcher';
import { SAMPLE_CVS } from '../../backend/data/sampleCVs';
import { exportReportToMarkdown, downloadFile } from '../../backend/export/reportExporter';

const AppContext = createContext();

const STORAGE_KEYS = {
  THEME: 'karierpath_theme_v2',
  API_SETTINGS: 'karierpath_api_settings_v2',
  CV_DATA: 'karierpath_cv_data_v2',
  CHAT_SESSIONS: 'karierpath_sessions_v2',
  CURRENT_SESSION: 'karierpath_current_session_v2',
};

const INITIAL_WELCOME_MESSAGE = {
  id: 'welcome-msg',
  role: 'assistant',
  isWelcome: true,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  content: `Selamat datang di **KarierPath AI** — Platform Konsultan Karier & Analisis Dokumen CV Mahasiswa.

Sistem dilengkapi dengan **Client-Side Retrieval-Augmented Generation (RAG)** untuk mengekstrak dan menganalisis data CV secara personal, mencakup:
- **Evaluasi & Kepatuhan ATS:** Audit skor kesiapan dokumen, kata kunci industri, dan format standar.
- **Pemetaan Karier & Analisis Kesenjangan Keahlian:** Rekomendasi peran industri yang paling cocok beserta roadmap pengembangan.
- **Simulasi Wawancara Kerja:** Latihan wawancara terarah dengan penilaian berbasis metode STAR.
- **Studio Surat Lamaran & Pitch:** Generator naskah perkenalan diri dan dokumen pengantar kerja.

**Langkah Memulai:**
1. Lampirkan dokumen CV Anda (**PDF / TXT**) menggunakan tombol klip di input chat atau tombol **Unggah Dokumen**.
2. Anda juga dapat langsung menguji sistem menggunakan **Contoh Preset CV Mahasiswa**.
3. Konfigurasikan **Google Gemini API Key** (Free Tier) di menu Pengaturan untuk respon yang lebih dinamis.`,
};

export function AppProvider({ children }) {
  // Theme State ('light' | 'dark') - Default is 'light' (bright & clean)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {}
    return 'light';
  });

  // Apply theme to DOM
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Navigation View State
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'ats' | 'career' | 'interview' | 'coverletter'

  // API Settings State
  const [apiSettings, setApiSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.API_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'].includes(parsed.geminiModel)) {
          parsed.geminiModel = DEFAULT_GEMINI_MODEL;
        }
        return parsed;
      }
    } catch (e) {}
    return {
      openaiKey: '',
      openaiModel: 'gpt-4o-mini',
      geminiKey: '',
      geminiModel: DEFAULT_GEMINI_MODEL,
      preferredProvider: 'gemini',
    };
  });

  // CV Data State (always recalibrate from rawText on load to prevent stale legacy cache)
  const [cvData, setCvData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CV_DATA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.rawText) {
          const freshMeta = extractMetadata(parsed.rawText);
          const mergedMeta = {
            ...freshMeta,
            nameCandidate: parsed.metadata?.nameCandidate || freshMeta.nameCandidate,
            email: parsed.metadata?.email || freshMeta.email,
            phone: parsed.metadata?.phone || freshMeta.phone,
            extractedSkills: freshMeta.extractedSkills,
            detectedMajor: freshMeta.detectedMajor !== 'Akademik Umum' 
              ? freshMeta.detectedMajor 
              : (parsed.metadata?.detectedMajor || 'Akademik Umum')
          };
          return {
            ...parsed,
            metadata: mergedMeta,
            atsScore: calculateATSScore(parsed.rawText, mergedMeta),
            careerMatch: matchCareerRoles(parsed.rawText, mergedMeta)
          };
        }
        return parsed;
      }
    } catch (e) {}
    return null;
  });

  // Chat Sessions State (Multi-Session Support)
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 'session-main',
        title: 'Konsultasi Karier Umum',
        messages: [INITIAL_WELCOME_MESSAGE],
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      if (saved) return saved;
    } catch (e) {}
    return 'session-main';
  });

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'api-settings' | 'upload-cv' | 'rag-explorer' | null
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.API_SETTINGS, JSON.stringify(apiSettings));
    } catch (e) {}
  }, [apiSettings]);

  useEffect(() => {
    try {
      if (cvData) {
        localStorage.setItem(STORAGE_KEYS.CV_DATA, JSON.stringify(cvData));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CV_DATA);
      }
    } catch (e) {}
  }, [cvData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions));
      localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, currentSessionId);
    } catch (e) {}
  }, [sessions, currentSessionId]);

  // Current session & messages getter
  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0] || {
    id: 'session-main',
    title: 'Sesi Konsultasi',
    messages: [INITIAL_WELCOME_MESSAGE]
  };
  const messages = currentSession.messages;

  // Update messages in current session
  const updateCurrentSessionMessages = (updater) => {
    setSessions(prevSessions => {
      return prevSessions.map(sess => {
        if (sess.id === currentSessionId) {
          const newMessages = typeof updater === 'function' ? updater(sess.messages) : updater;
          return {
            ...sess,
            messages: newMessages,
            updatedAt: new Date().toISOString()
          };
        }
        return sess;
      });
    });
  };

  // Helper to parse file
  const parseFileContent = async (file) => {
    const fileExt = file.name.split('.').pop().toLowerCase();
    let result;
    if (fileExt === 'pdf') {
      result = await extractTextFromPDF(file);
    } else if (['txt', 'text', 'md'].includes(fileExt)) {
      result = await extractTextFromTxt(file);
    } else {
      throw new Error('Format file tidak didukung. Harap gunakan dokumen PDF (.pdf) atau Teks (.txt).');
    }

    if (!result.text || result.text.trim().length < 20) {
      throw new Error('Teks dokumen kosong atau tidak terbaca. Pastikan dokumen PDF berisi teks asli (bukan hasil scan foto tanpa OCR).');
    }

    const atsScore = calculateATSScore(result.text, result.metadata);
    const careerMatch = matchCareerRoles(result.text, result.metadata);

    return {
      fileName: file.name,
      fileSize: file.size,
      pageCount: result.pageCount,
      rawText: result.text,
      metadata: result.metadata,
      atsScore,
      careerMatch,
      uploadedAt: new Date().toISOString(),
    };
  };

  // Upload CV via modal or direct action
  const uploadCVFile = async (file) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const parsedData = await parseFileContent(file);
      setCvData(parsedData);

      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      const systemNotice = {
        id: 'cv-loaded-' + Date.now(),
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `**Dokumen CV Berhasil Dipelajari**\n\n- **Nama Berkas:** \`${file.name}\` (${parsedData.metadata.wordCount} kata, ${parsedData.pageCount} halaman)\n- **Kandidat:** **${parsedData.metadata.nameCandidate || 'Mahasiswa'}**\n- **Latar Belakang:** ${parsedData.metadata.detectedMajor || 'Akademik Umum'}\n- **Skor Kesiapan ATS:** **${parsedData.atsScore.overallScore}/100**\n\nSeluruh data dokumen telah tersimpan pada memori RAG sesi ini. Anda dapat mengeksplorasi tab **ATS Optimizer**, **Peta Karier**, **Simulasi Interview**, atau langsung berkonsultasi di chat.`
      };

      updateCurrentSessionMessages(prev => [...prev, systemNotice]);
      setActiveModal(null);
      return parsedData;
    } catch (err) {
      console.error('Error uploading CV:', err);
      setUploadError(err.message || 'Gagal memproses file CV.');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  // Load sample CV
  const loadSampleCV = (sampleId = 'informatika') => {
    const sample = SAMPLE_CVS.find(s => s.id === sampleId) || SAMPLE_CVS[0];
    const autoMeta = extractMetadata(sample.data);
    
    const metadata = {
      ...autoMeta,
      nameCandidate: sample.candidateName || autoMeta.nameCandidate,
      email: sample.email || autoMeta.email,
      phone: sample.phone || autoMeta.phone,
      detectedMajor: autoMeta.detectedMajor !== 'Akademik Umum' 
        ? autoMeta.detectedMajor 
        : (sample.id === 'informatika' 
          ? 'Teknik Informatika & Software Engineering' 
          : sample.id === 'manajemen' 
            ? 'Manajemen Bisnis & Pemasaran' 
            : 'Statistika & Sains Data'),
    };

    const atsScore = calculateATSScore(sample.data, metadata);
    const careerMatch = matchCareerRoles(sample.data, metadata);

    const newCvData = {
      fileName: sample.fileName,
      fileSize: 16400,
      pageCount: 2,
      rawText: sample.data,
      metadata,
      atsScore,
      careerMatch,
      uploadedAt: new Date().toISOString(),
    };

    setCvData(newCvData);

    const systemNotice = {
      id: 'sample-loaded-' + Date.now(),
      role: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: `**Profil CV Berhasil Dimuat: ${newCvData.metadata.nameCandidate}**\n\n- **Kandidat:** \`${newCvData.metadata.nameCandidate}\` (${sample.title})\n- **Latar Belakang:** ${metadata.detectedMajor}\n- **Skor Kepatuhan ATS:** **${atsScore.overallScore}/100**\n- **Rekomendasi Posisi Utama:** **${careerMatch.roles[0]?.roleName}** (${careerMatch.roles[0]?.matchPercentage}% match)\n\nSeluruh modul **ATS Optimizer**, **Peta Karier**, **Simulasi Interview**, dan **Surat Lamaran** telah disinkronkan sesuai profil CV ini.`
    };

    updateCurrentSessionMessages(prev => [...prev, systemNotice]);
    setActiveModal(null);
  };

  // Clear CV
  const clearCV = () => {
    setCvData(null);
    updateCurrentSessionMessages(prev => [
      ...prev,
      {
        id: 'cv-cleared-' + Date.now(),
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `**Data dokumen CV telah dihapus dari sesi.** Silakan lampirkan CV baru untuk analisis personalisasi berikutnya.`
      }
    ]);
  };

  // Send message to AI
  const sendMessage = async (text, attachedFile = null) => {
    if ((!text || !text.trim()) && !attachedFile) return;
    if (isLoading) return;

    let activeCv = cvData;
    let attachmentMeta = null;

    setIsLoading(true);

    try {
      if (attachedFile) {
        const parsed = await parseFileContent(attachedFile);
        setCvData(parsed);
        activeCv = parsed;
        attachmentMeta = {
          name: attachedFile.name,
          size: attachedFile.size,
          pageCount: parsed.pageCount
        };

        try {
          confetti({
            particleCount: 30,
            spread: 45,
            origin: { y: 0.7 }
          });
        } catch (e) {}
      }

      const promptContent = (text && text.trim()) 
        ? text.trim() 
        : `Halo KarierPath AI, saya melampirkan berkas CV saya (${attachmentMeta?.name || 'Dokumen PDF'}). Mohon pelajari seluruh isi dokumen tersebut dan berikan:\n1. Ringkasan keunggulan profil kandidat.\n2. Rekomendasi 3 posisi kerja/magang yang paling relevan.\n3. Poin evaluasi format dan isi yang perlu diperbaiki.`;

      const userMessage = {
        id: 'user-' + Date.now(),
        role: 'user',
        content: promptContent,
        attachment: attachmentMeta,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updatedMessages = [...messages, userMessage];
      updateCurrentSessionMessages(updatedMessages);

      const response = await sendChatMessage({
        messages: updatedMessages,
        cvText: activeCv?.rawText || '',
        metadata: activeCv?.metadata || {},
        apiSettings,
      });

      const assistantMessage = {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        content: response.text,
        provider: response.provider,
        model: response.model,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      updateCurrentSessionMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);

      const errorMessage = {
        id: 'error-' + Date.now(),
        role: 'assistant',
        isError: true,
        content: `**Kendala Pemrosesan Respon:**\n\n> *${err.message}*\n\n**Rekomendasi Penanganan:**\n- Pastikan kunci API telah dikonfigurasi dengan benar di menu **Pengaturan API**.\n- Anda dapat beralih menggunakan Google Gemini Free Tier secara gratis di Google AI Studio.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      updateCurrentSessionMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate last response
  const regenerateLastMessage = async () => {
    if (isLoading || messages.length < 2) return;
    
    const lastUserIndex = [...messages].reverse().findIndex(m => m.role === 'user');
    if (lastUserIndex === -1) return;

    const actualIndex = messages.length - 1 - lastUserIndex;
    const truncated = messages.slice(0, actualIndex + 1);
    updateCurrentSessionMessages(truncated);
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        messages: truncated,
        cvText: cvData?.rawText || '',
        metadata: cvData?.metadata || {},
        apiSettings,
      });

      const assistantMessage = {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        content: response.text,
        provider: response.provider,
        model: response.model,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      updateCurrentSessionMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Regenerate error:', err);
      const errorMessage = {
        id: 'error-' + Date.now(),
        role: 'assistant',
        isError: true,
        content: `**Gagal mengulang respon:** ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      updateCurrentSessionMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history in current session
  const clearChat = () => {
    updateCurrentSessionMessages([INITIAL_WELCOME_MESSAGE]);
  };

  // Create new session
  const createNewSession = () => {
    const newId = 'session-' + Date.now();
    const newSession = {
      id: newId,
      title: `Konsultasi ${sessions.length + 1}`,
      messages: [INITIAL_WELCOME_MESSAGE],
      createdAt: new Date().toISOString()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
  };

  // Switch session
  const switchSession = (sessionId) => {
    setCurrentSessionId(sessionId);
  };

  // Delete session
  const deleteSession = (sessionId) => {
    if (sessions.length <= 1) {
      clearChat();
      return;
    }
    const filtered = sessions.filter(s => s.id !== sessionId);
    setSessions(filtered);
    if (currentSessionId === sessionId) {
      setCurrentSessionId(filtered[0].id);
    }
  };

  // Export consultation report
  const handleExportReport = () => {
    const reportMd = exportReportToMarkdown({
      cvData,
      atsScore: cvData?.atsScore,
      careerMatch: cvData?.careerMatch,
      messages
    });
    const candidateName = cvData?.metadata?.nameCandidate?.replace(/\s+/g, '_') || 'Kandidat';
    downloadFile(reportMd, `Laporan_Konsultasi_${candidateName}_KarierPath.md`);
  };

  // Update API settings
  const updateApiSettings = (newSettings) => {
    setApiSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const activeResolution = resolveApiProvider(apiSettings);

  const value = {
    theme,
    setTheme,
    toggleTheme,
    activeTab,
    setActiveTab,
    apiSettings,
    updateApiSettings,
    activeResolution,
    cvData,
    uploadCVFile,
    loadSampleCV,
    clearCV,
    isUploading,
    uploadError,
    setUploadError,
    messages,
    sendMessage,
    clearChat,
    regenerateLastMessage,
    isLoading,
    activeModal,
    setActiveModal,
    isDrawerOpen,
    setIsDrawerOpen,
    sessions,
    currentSessionId,
    createNewSession,
    switchSession,
    deleteSession,
    handleExportReport,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
