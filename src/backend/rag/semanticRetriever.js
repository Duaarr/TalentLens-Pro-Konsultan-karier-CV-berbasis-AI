/**
 * Semantic & Keyword Hybrid Retriever for Client-Side RAG
 */
import { splitTextIntoChunks } from './textSplitter';

export class SemanticRAGIndexer {
  constructor(rawText = '') {
    this.rawText = rawText;
    this.chunks = splitTextIntoChunks(rawText);
    this.vocabulary = new Set();
    this.idfMap = new Map();
    this.buildIndex();
  }

  tokenize(str) {
    return (str || '')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);
  }

  buildIndex() {
    const N = this.chunks.length;
    if (N === 0) return;

    const docFreq = new Map();

    this.chunks.forEach(chunk => {
      const tokens = this.tokenize(chunk.content);
      const uniqueTokens = new Set(tokens);
      chunk.tokens = tokens;
      chunk.tokenCount = tokens.length;

      uniqueTokens.forEach(token => {
        this.vocabulary.add(token);
        docFreq.set(token, (docFreq.get(token) || 0) + 1);
      });
    });

    docFreq.forEach((freq, token) => {
      // Smooth IDF
      const idf = Math.log(1 + (N - freq + 0.5) / (freq + 0.5));
      this.idfMap.set(token, idf);
    });
  }

  search(query, topK = 3) {
    if (!query || this.chunks.length === 0) return [];

    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) {
      return this.chunks.slice(0, topK).map(c => ({ ...c, score: 0.5 }));
    }

    const scored = this.chunks.map(chunk => {
      let score = 0;
      const termCount = {};
      chunk.tokens.forEach(t => {
        termCount[t] = (termCount[t] || 0) + 1;
      });

      queryTokens.forEach(qToken => {
        if (termCount[qToken]) {
          const tf = termCount[qToken] / (chunk.tokenCount || 1);
          const idf = this.idfMap.get(qToken) || 0.8;
          score += tf * idf * 10;
        }
      });

      // Bonus if exact phrase match
      if (chunk.content.toLowerCase().includes(query.toLowerCase())) {
        score += 2.0;
      }

      return {
        ...chunk,
        rawScore: score,
        similarityPercent: Math.min(99, Math.round((1 / (1 + Math.exp(-score * 2))) * 100))
      };
    });

    return scored
      .sort((a, b) => b.rawScore - a.rawScore)
      .slice(0, topK);
  }
}
