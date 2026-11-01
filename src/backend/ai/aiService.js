/**
 * Unified AI Service Dispatcher
 * Manages resolution between Google Gemini, OpenAI, and Local Semantic RAG Fallback
 */
import { callGeminiApi, pingGemini, searchLiveJobs, GEMINI_MODELS, DEFAULT_GEMINI_MODEL } from './geminiProvider';
import { callOpenAiApi, pingOpenAi, OPENAI_MODELS } from './openaiProvider';
import { generateRAGConsultantResponse } from '../rag/ragEngine';

export const AVAILABLE_MODELS = {
  gemini: GEMINI_MODELS,
  openai: OPENAI_MODELS,
};

export { DEFAULT_GEMINI_MODEL };

export function resolveApiProvider(settings = {}) {
  const { openaiKey, geminiKey, openaiModel, geminiModel, preferredProvider } = settings;

  let activeGeminiModel = geminiModel || DEFAULT_GEMINI_MODEL;
  if (['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'].includes(activeGeminiModel)) {
    activeGeminiModel = DEFAULT_GEMINI_MODEL;
  }

  // 1. Explicit OpenAI
  if (preferredProvider === 'openai' && openaiKey && openaiKey.trim()) {
    return {
      provider: 'openai',
      apiKey: openaiKey.trim(),
      model: openaiModel || 'gpt-4o-mini',
      mode: 'OpenAI (Berbayar)'
    };
  }

  // 2. Default & Priority: Google Gemini Free Tier
  if (geminiKey && geminiKey.trim()) {
    return {
      provider: 'gemini',
      apiKey: geminiKey.trim(),
      model: activeGeminiModel,
      mode: 'Google Gemini (Free Tier)'
    };
  }

  // 3. Fallback OpenAI if only OpenAI key exists
  if (openaiKey && openaiKey.trim()) {
    return {
      provider: 'openai',
      apiKey: openaiKey.trim(),
      model: openaiModel || 'gpt-4o-mini',
      mode: 'OpenAI (Terdeteksi)'
    };
  }

  // 4. Client-Side RAG Engine (Zero API Key required)
  return {
    provider: 'rag-local',
    apiKey: '',
    model: 'Hybrid Semantic RAG Engine',
    mode: 'Local RAG Engine (Tanpa API Key)'
  };
}

export async function sendChatMessage({
  messages,
  cvText,
  metadata,
  apiSettings
}) {
  const resolution = resolveApiProvider(apiSettings);
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
  const userPrompt = lastUserMsg?.content || '';

  // 1. Google Gemini Cloud LLM
  if (resolution.provider === 'gemini') {
    try {
      const result = await callGeminiApi({
        apiKey: resolution.apiKey,
        model: resolution.model,
        messages,
        cvText,
        metadata
      });
      return { text: result, provider: 'gemini', model: resolution.model };
    } catch (err) {
      console.warn('Gemini API call failed, falling back to client-side RAG engine:', err);
      const fallbackResult = generateRAGConsultantResponse(userPrompt, cvText, metadata);
      return { 
        text: fallbackResult + `\n\n> *Respon dialihkan ke Mesin RAG Lokal karena kendala koneksi API: ${err.message}*`, 
        provider: 'rag-fallback', 
        model: 'Semantic RAG Engine' 
      };
    }
  }

  // 2. OpenAI Cloud LLM
  if (resolution.provider === 'openai') {
    try {
      const result = await callOpenAiApi({
        apiKey: resolution.apiKey,
        model: resolution.model,
        messages,
        cvText,
        metadata
      });
      return { text: result, provider: 'openai', model: resolution.model };
    } catch (err) {
      console.warn('OpenAI API call failed, falling back to client-side RAG engine:', err);
      const fallbackResult = generateRAGConsultantResponse(userPrompt, cvText, metadata);
      return { 
        text: fallbackResult + `\n\n> *Respon dialihkan ke Mesin RAG Lokal karena kendala koneksi API: ${err.message}*`, 
        provider: 'rag-fallback', 
        model: 'Semantic RAG Engine' 
      };
    }
  }

  // 3. Pure Client-Side Semantic RAG
  const localResult = generateRAGConsultantResponse(userPrompt, cvText, metadata);
  return { 
    text: localResult, 
    provider: 'rag-local', 
    model: 'Semantic RAG Engine' 
  };
}

export async function testApiConnection(provider, apiKey, model) {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, message: 'Kunci API belum diisi.' };
  }

  try {
    if (provider === 'gemini') {
      return await pingGemini(apiKey, model);
    }
    if (provider === 'openai') {
      return await pingOpenAi(apiKey, model);
    }
    return { success: false, message: 'Provider tidak dikenali.' };
  } catch (error) {
    return { success: false, message: error.message || 'Gagal menghubungi server API.' };
  }
}

/**
 * Cari lowongan pekerjaan aktif secara real-time lewat Google Search grounding.
 * Saat ini cuma didukung lewat Google Gemini API (OpenAI tidak punya fitur
 * grounding serupa yang tersambung di sini), dan RAG lokal jelas tidak bisa
 * mengakses internet sama sekali — jadi keduanya akan menolak dengan pesan jelas
 * daripada diam-diam mengarang hasil.
 */
export async function searchLiveJobsForRole({ roleName, majorText, apiSettings }) {
  const resolution = resolveApiProvider(apiSettings);

  if (resolution.provider !== 'gemini') {
    throw new Error('Pencarian lowongan real-time saat ini hanya didukung lewat Google Gemini API Key. Aktifkan Gemini di menu Pengaturan API untuk memakai fitur ini.');
  }

  return await searchLiveJobs({
    apiKey: resolution.apiKey,
    model: resolution.model,
    roleName,
    majorText
  });
}