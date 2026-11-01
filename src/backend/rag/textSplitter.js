/**
 * RAG Document Splitter & Token Estimator
 */

export function splitTextIntoChunks(text, chunkSize = 180, overlap = 35) {
  if (!text || text.trim().length === 0) return [];

  const paragraphs = text.split(/\n{2,}/);
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];

  let startIdx = 0;
  let chunkId = 1;

  while (startIdx < words.length) {
    const endIdx = Math.min(startIdx + chunkSize, words.length);
    const chunkWords = words.slice(startIdx, endIdx);
    const chunkContent = chunkWords.join(' ');

    // Guess chunk section
    let header = 'Umum';
    const lower = chunkContent.toLowerCase();
    if (lower.includes('pendidikan') || lower.includes('education')) header = 'Pendidikan';
    else if (lower.includes('pengalaman') || lower.includes('experience') || lower.includes('magang')) header = 'Pengalaman';
    else if (lower.includes('skill') || lower.includes('keahlian') || lower.includes('tools')) header = 'Keahlian';
    else if (lower.includes('proyek') || lower.includes('project')) header = 'Proyek';
    else if (lower.includes('sertifikasi') || lower.includes('sertifikat')) header = 'Sertifikasi';

    chunks.push({
      id: `chunk-${chunkId}`,
      index: chunkId,
      section: header,
      content: chunkContent,
      wordCount: chunkWords.length,
      estimatedTokens: Math.round(chunkWords.length * 1.3),
    });

    chunkId++;
    if (endIdx >= words.length) break;
    startIdx += chunkSize - overlap;
  }

  return chunks;
}
