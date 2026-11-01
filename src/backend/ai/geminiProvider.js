import { buildSystemInstruction } from './promptTemplates';

export const DEFAULT_GEMINI_MODEL = 'gemini-3.6-flash';

export const GEMINI_MODELS = [
  { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash (Direkomendasikan / Generasi 3.6)', isFreeTier: true, isRecommended: true },
  { id: 'gemini-3.6-pro', name: 'Gemini 3.6 Pro (Penalaran Kompleks 3.6)', isFreeTier: true, isRecommended: false },
  { id: 'gemini-3.1-flash', name: 'Gemini 3.1 Flash (Generasi 3.1 Flash)', isFreeTier: true, isRecommended: false },
  { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro (Generasi 3.1 Pro)', isFreeTier: true, isRecommended: false },
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash (Generasi 3 Flash)', isFreeTier: true, isRecommended: false },
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro (Generasi 3 Pro)', isFreeTier: true, isRecommended: false },
];

/**
 * Call Google Gemini REST API with system instruction and structured conversation
 */
export async function callGeminiApi({ apiKey, model, messages, cvText, metadata }) {
  let selectedModel = model || DEFAULT_GEMINI_MODEL;
  if (['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'].includes(selectedModel)) {
    selectedModel = DEFAULT_GEMINI_MODEL;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey.trim()}`;
  const systemInstruction = buildSystemInstruction(cvText, metadata);

  const contents = [];

  messages.forEach((msg) => {
    if (msg.role === 'user') {
      contents.push({
        role: 'user',
        parts: [{ text: msg.content }]
      });
    } else if (msg.role === 'assistant' && !msg.isWelcome && !msg.isError) {
      contents.push({
        role: 'model',
        parts: [{ text: msg.content }]
      });
    }
  });

  if (contents.length === 0) {
    contents.push({
      role: 'user',
      parts: [{ text: 'Halo! Mohon pelajari CV saya dan berikan analisis pendahuluan.' }]
    });
  }

  const requestBody = {
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 3500,
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || response.statusText;
    
    if (response.status === 400 && errorMessage.includes('API_KEY_INVALID')) {
      throw new Error('Kunci API Gemini tidak valid. Harap periksa di Pengaturan API.');
    }
    if (response.status === 404) {
      throw new Error(`Model '${selectedModel}' tidak ditemukan pada endpoint Gemini.`);
    }
    if (response.status === 429) {
      throw new Error('Batas kuota Gemini (Rate Limit) telah tercapai. Coba beberapa saat lagi.');
    }
    throw new Error(`Gemini API Error (${response.status}): ${errorMessage}`);
  }

  const data = await response.json();
  const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!answer) {
    throw new Error('Tidak ada respon teks yang diterima dari Gemini API.');
  }

  return answer;
}

export async function pingGemini(apiKey, model = DEFAULT_GEMINI_MODEL) {
  let selectedModel = model || DEFAULT_GEMINI_MODEL;
  if (['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'].includes(selectedModel)) {
    selectedModel = DEFAULT_GEMINI_MODEL;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey.trim()}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'Ping test 1 kata' }] }]
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { success: false, message: err.error?.message || `Error status ${res.status}` };
  }
  return { success: true, message: `Koneksi Google Gemini (${selectedModel}) berhasil!` };
}

/**
 * Pencarian lowongan kerja AKTIF & REAL-TIME menggunakan Google Search grounding.
 * Berbeda dari callGeminiApi biasa: di sini Gemini diberi akses tool "google_search"
 * sehingga jawabannya didasarkan pada hasil pencarian Google sungguhan saat itu juga,
 * bukan sekadar dari data training model yang bisa sudah usang / mengarang.
 */
export async function searchLiveJobs({ apiKey, model, roleName, majorText }) {
  let selectedModel = model || DEFAULT_GEMINI_MODEL;
  if (['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'].includes(selectedModel)) {
    selectedModel = DEFAULT_GEMINI_MODEL;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey.trim()}`;

  const prompt = `Carikan 5 lowongan pekerjaan yang benar-benar AKTIF SEKARANG di Indonesia untuk posisi "${roleName}"${majorText ? ` yang cocok untuk lulusan bidang ${majorText}` : ''}.

Untuk setiap lowongan yang kamu temukan lewat pencarian, sebutkan dengan format ringkas:
- Nama perusahaan
- Judul posisi persis
- Lokasi kerja (kota, atau remote/WFH)
- Sumber tempat lowongan ditemukan (LinkedIn, Glints, JobStreet, Kalibrr, website karier perusahaan, dsb.)

ATURAN PENTING: Jika kamu tidak yakin sebuah lowongan benar-benar masih aktif atau tidak menemukan cukup hasil pencarian, katakan itu secara jujur dan sebutkan berapa banyak yang benar-benar kamu temukan. JANGAN mengarang nama perusahaan, posisi, atau link yang tidak benar-benar muncul dari hasil pencarian.`;

  const requestBody = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    tools: [{ google_search: {} }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2000,
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || response.statusText;

    if (response.status === 400 && errorMessage.includes('API_KEY_INVALID')) {
      throw new Error('Kunci API Gemini tidak valid. Harap periksa di Pengaturan API.');
    }
    if (response.status === 429) {
      throw new Error('Batas kuota Gemini (Rate Limit) telah tercapai. Coba beberapa saat lagi.');
    }
    throw new Error(`Gagal mencari lowongan (${response.status}): ${errorMessage}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const answer = candidate?.content?.parts?.map(p => p.text).filter(Boolean).join('\n') || '';

  // Ambil sumber asli dari grounding metadata (kalau tersedia), supaya user bisa
  // klik langsung ke halaman sumbernya, bukan cuma percaya ringkasan AI.
  const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks
    .map(chunk => chunk.web ? { title: chunk.web.title || chunk.web.uri, uri: chunk.web.uri } : null)
    .filter(Boolean);

  if (!answer) {
    throw new Error('Tidak ada hasil pencarian lowongan yang diterima dari Gemini.');
  }

  return { text: answer, sources };
}