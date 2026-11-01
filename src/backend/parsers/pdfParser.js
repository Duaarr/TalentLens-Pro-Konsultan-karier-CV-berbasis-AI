import * as pdfjsLib from 'pdfjs-dist';
import { extractMetadata } from './metadataExtractor';

// Initialize PDF worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
} catch (e) {
  console.warn('PDF Worker fallback initialization:', e);
}

/**
 * Extract clean, ordered text from PDF documents supporting multi-column layouts
 * @param {File | ArrayBuffer} fileOrBuffer
 * @returns {Promise<{text: string, pageCount: number, pagesText: string[], metadata: object}>}
 */
export async function extractTextFromPDF(fileOrBuffer) {
  let arrayBuffer;

  if (fileOrBuffer instanceof File || fileOrBuffer instanceof Blob) {
    arrayBuffer = await fileOrBuffer.arrayBuffer();
  } else {
    arrayBuffer = fileOrBuffer;
  }

  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    useSystemFonts: true,
    isEvalSupported: false,
  });

  const pdfDoc = await loadingTask.promise;
  const pageCount = pdfDoc.numPages;
  let fullText = '';
  const pagesText = [];

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent({
      normalizeWhitespace: true,
      disableCombineTextItems: false,
    });

    const items = textContent.items.filter(item => item.str && item.str.trim().length > 0);

    if (items.length === 0) {
      pagesText.push('');
      continue;
    }

    // Sort items by vertical position (Y descending) and horizontal position (X ascending)
    items.sort((a, b) => {
      const yA = a.transform[5];
      const yB = b.transform[5];
      const xA = a.transform[4];
      const xB = b.transform[4];

      if (Math.abs(yA - yB) <= 4) {
        return xA - xB;
      }
      return yB - yA;
    });

    // Group items into coherent lines
    const lines = [];
    let currentLine = [];
    let currentY = null;

    for (const item of items) {
      const itemY = item.transform[5];

      if (currentY === null) {
        currentY = itemY;
        currentLine.push(item);
      } else if (Math.abs(itemY - currentY) <= 5) {
        currentLine.push(item);
      } else {
        currentLine.sort((a, b) => a.transform[4] - b.transform[4]);
        lines.push(currentLine.map(i => i.str.trim()).join(' '));
        currentLine = [item];
        currentY = itemY;
      }
    }

    if (currentLine.length > 0) {
      currentLine.sort((a, b) => a.transform[4] - b.transform[4]);
      lines.push(currentLine.map(i => i.str.trim()).join(' '));
    }

    const cleanPageText = lines.filter(l => l.trim().length > 0).join('\n');
    pagesText.push(cleanPageText);
    fullText += `\n--- [Halaman ${pageNum}] ---\n` + cleanPageText + '\n';
  }

  const cleanFullText = fullText.trim();

  // PENTING: cek panjang KONTEN ASLI (pagesText), bukan cleanFullText yang sudah
  // dibungkus penanda dekoratif "--- [Halaman N] ---". Sebelumnya pengecekan "PDF
  // kosong" di AppContext.jsx menghitung panjang cleanFullText, padahal penanda
  // halaman itu sendiri sudah >20 karakter walau isi halamannya kosong total —
  // akibatnya PDF hasil scan/foto tanpa OCR "lolos" dianggap berhasil dibaca,
  // padahal isinya nol, dan user tidak pernah diberi tahu kenapa hasilnya aneh.
  const realContentLength = pagesText.join('').trim().length;

  if (realContentLength < 20) {
    throw new Error(
      `Dokumen PDF ini tidak mengandung teks yang bisa diekstrak (kemungkinan besar berupa hasil pindai/scan foto tanpa lapisan teks asli). ` +
      `Silakan gunakan PDF yang dibuat langsung dari Word/Google Docs/Canva, atau proses OCR dokumen ini terlebih dahulu sebelum mengunggah.`
    );
  }

  const metadata = extractMetadata(cleanFullText);

  return {
    text: cleanFullText,
    pageCount,
    pagesText,
    metadata
  };
}