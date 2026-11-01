/**
 * Live Job Board Service
 * ------------------------------------------------------------------------
 * Mengambil lowongan kerja NYATA & SPESIFIK (nama perusahaan, judul posisi,
 * link apply langsung) langsung dari API publik resmi yang disediakan oleh
 * platform ATS (Applicant Tracking System) seperti Greenhouse dan Lever.
 *
 * PENTING soal legalitas & keandalan:
 * - Ini BUKAN scraping. Greenhouse & Lever memang mempublikasikan endpoint
 *   ini secara resmi dengan header CORS terbuka (Access-Control-Allow-Origin: *)
 *   supaya bisa diakses situs lain -- persis untuk kasus penggunaan ini.
 * - Tidak butuh API key sama sekali, jadi berfungsi penuh walau user
 *   memakai mode RAG lokal tanpa Gemini/OpenAI.
 * - CAKUPAN TERBATAS: hanya mencakup perusahaan yang memang memakai
 *   Greenhouse/Lever sebagai ATS -- didominasi perusahaan teknologi
 *   global/startup yang banyak membuka posisi remote. Ini BUKAN cakupan
 *   pasar kerja Indonesia secara umum (untuk itu, tetap pakai tombol
 *   "Buka Pencarian Langsung" ke LinkedIn/Indeed/Glints/Kalibrr).
 */

// Daftar slug perusahaan yang sudah diverifikasi punya board aktif.
// Kalau ada perusahaan yang gantiATS/menutup board, fetch-nya akan gagal
// dengan aman (dilewati), tidak akan meng-crash keseluruhan pencarian.
const GREENHOUSE_COMPANIES = [
  'gitlab', 'stripe', 'airbnb', 'dropbox', 'databricks', 'robinhood',
  'instacart', 'reddit', 'figma', 'asana', 'discord', 'gusto',
  'cloudflare', 'twitch', 'pinterest', 'datadog', 'mongodb', 'elastic',
  'affirm', 'flexport', 'amplitude', 'airtable', 'calendly', 'anthropic'
];

const LEVER_COMPANIES = [
  'palantir', 'spotify', 'gopuff'
];

async function fetchGreenhouseJobs(slug) {
  try {
    const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.jobs || []).map(j => ({
      company: slug,
      title: j.title,
      location: j.location?.name || 'Tidak disebutkan',
      url: j.absolute_url,
      updatedAt: j.updated_at,
      source: 'Greenhouse'
    }));
  } catch (e) {
    console.warn(`Gagal mengambil board Greenhouse untuk "${slug}":`, e.message);
    return [];
  }
}

async function fetchLeverJobs(slug) {
  try {
    const res = await fetch(`https://api.lever.co/v0/postings/${slug}?mode=json`);
    if (!res.ok) return [];
    const data = await res.json();
    return (Array.isArray(data) ? data : []).map(j => ({
      company: slug,
      title: j.text,
      location: j.categories?.location || 'Tidak disebutkan',
      url: j.hostedUrl,
      updatedAt: j.createdAt,
      source: 'Lever'
    }));
  } catch (e) {
    console.warn(`Gagal mengambil board Lever untuk "${slug}":`, e.message);
    return [];
  }
}

/**
 * Cari lowongan spesifik & real-time dari seluruh perusahaan terdaftar,
 * difilter berdasarkan kata kunci (dicocokkan ke judul posisi).
 * Semua permintaan dijalankan paralel (Promise.allSettled) supaya satu
 * board yang gagal/lambat tidak menghambat hasil dari board lain.
 */
export async function searchCuratedCompanyJobs(keyword, maxResults = 12) {
  const keywordLower = (keyword || '').toLowerCase().trim();

  const fetchPromises = [
    ...GREENHOUSE_COMPANIES.map(slug => fetchGreenhouseJobs(slug)),
    ...LEVER_COMPANIES.map(slug => fetchLeverJobs(slug))
  ];

  const settled = await Promise.allSettled(fetchPromises);
  const allJobs = settled
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value);

  const filtered = keywordLower
    ? allJobs.filter(j => j.title?.toLowerCase().includes(keywordLower))
    : allJobs;

  // Urutkan berdasarkan yang paling baru diupdate lebih dulu
  filtered.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

  return {
    jobs: filtered.slice(0, maxResults),
    totalFound: filtered.length,
    companiesSearched: GREENHOUSE_COMPANIES.length + LEVER_COMPANIES.length
  };
}