import { buildSystemInstruction } from './promptTemplates';

export const OPENAI_MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Cepat & Efisien)', isRecommended: true },
  { id: 'gpt-4o', name: 'GPT-4o (Kemampuan Penalaran Tertinggi)', isRecommended: false },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Legacy)', isRecommended: false },
];

export async function callOpenAiApi({ apiKey, model, messages, cvText, metadata }) {
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const systemInstruction = buildSystemInstruction(cvText, metadata);

  const formattedMessages = [
    { role: 'system', content: systemInstruction },
    ...messages
      .filter(m => !m.isWelcome && !m.isError)
      .map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
  ];

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 3500
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || response.statusText;
    
    if (response.status === 401) {
      throw new Error('Kunci API OpenAI salah atau belum valid (401 Unauthorized).');
    }
    if (response.status === 429) {
      throw new Error('Batas penggunaan saldo / kuota OpenAI habis.');
    }
    throw new Error(`OpenAI Error (${response.status}): ${errorMessage}`);
  }

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content;

  if (!answer) {
    throw new Error('Tidak ada respon teks yang diterima dari model OpenAI.');
  }

  return answer;
}

export async function pingOpenAi(apiKey, model = 'gpt-4o-mini') {
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Ping' }],
      max_tokens: 5
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { success: false, message: err.error?.message || `Error status ${res.status}` };
  }
  return { success: true, message: 'Koneksi OpenAI API berhasil!' };
}
