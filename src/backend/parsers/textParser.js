import { extractMetadata } from './metadataExtractor';

/**
 * Extract and normalize plain text or markdown CV documents
 * @param {File | string} fileOrString
 * @returns {Promise<{text: string, pageCount: number, pagesText: string[], metadata: object}>}
 */
export async function extractTextFromTxt(fileOrString) {
  let text = '';
  if (typeof fileOrString === 'string') {
    text = fileOrString;
  } else if (fileOrString instanceof File || fileOrString instanceof Blob) {
    text = await fileOrString.text();
  }

  const cleanText = text.trim();
  const metadata = extractMetadata(cleanText);

  return {
    text: cleanText,
    pageCount: Math.max(1, Math.ceil(cleanText.split(/\s+/).length / 350)),
    pagesText: [cleanText],
    metadata
  };
}
