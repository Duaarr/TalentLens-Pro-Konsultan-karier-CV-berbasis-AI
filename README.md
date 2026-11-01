# KarierPath AI - Enterprise RAG & Career Consultant Platform

Aplikasi web konsultan karier dan audit kesiapan dokumen kerja berbasis AI yang dirancang secara profesional untuk mahasiswa dan *fresh graduate*. Aplikasi ini mengimplementasikan arsitektur modular yang memisahkan **Frontend (Presentation Layer)** dan **Backend/Core Logic (RAG, Domain Analytics, LLM Adapters, Document Ingestion)** secara tegas dan terstruktur.

---

## Arsitektur & Penataan Folder Proyek

```
RAG/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
├── src/
│   ├── main.jsx                            # React 18 Entry Point
│   ├── App.jsx                             # Executive Layout & View Switcher
│   ├── index.css                           # Adaptive Clean Light & Executive Dark Navy Theme
│   │
│   ├── backend/                            # Core Logic, RAG Engine, LLM Providers, Parsers & Domain Analytics
│   │   ├── ai/                             # LLM Provider Integrations & Adapters
│   │   │   ├── geminiProvider.js           # Google Gemini REST API Client (Free Tier & 3.x Models)
│   │   │   ├── openaiProvider.js           # OpenAI REST API Client
│   │   │   ├── promptTemplates.js          # Structured Career Consultant System Instructions
│   │   │   └── aiService.js                # Unified AI Dispatcher & Smart Fallback
│   │   ├── analysis/                       # Domain Business Logic & Scoring Engines
│   │   │   ├── atsScorer.js                # ATS Health & Compliance Engine (0-100, Quantified Metrics, Action Verbs)
│   │   │   ├── careerMatcher.js            # Job Role Matcher, Salary Range & Skill Gap Analyzer
│   │   │   └── interviewEngine.js          # Mock Interview Question Bank & STAR Method Rubric Evaluator
│   │   ├── data/                           # Preset Datasets & Benchmark Resumes
│   │   │   └── sampleCVs.js                # Realistic Sample Resumes (IT/Software, Business, Data Science)
│   │   ├── export/                         # Report Exporter
│   │   │   └── reportExporter.js           # Consultation & ATS Audit Markdown/Text Exporter
│   │   ├── parsers/                        # Document Processing & Metadata Ingestion
│   │   │   ├── metadataExtractor.js        # Heuristic Metadata & Section Detector
│   │   │   ├── pdfParser.js                # Client-Side PDF Text Extractor (PDF.js)
│   │   │   └── textParser.js               # Plain Text / Markdown Ingestion
│   │   └── rag/                            # Retrieval-Augmented Generation Core
│   │       ├── textSplitter.js             # Sliding-Window Document Chunking & Token Estimator
│   │       ├── semanticRetriever.js        # Hybrid Semantic & TF-IDF Vector Retriever
│   │       └── ragEngine.js                # Offline Reasoning & Diagnostic Generator
│   │
│   └── frontend/                           # Presentation Layer (UI, Components, Views, State)
│       ├── components/                     # Modular Reusable UI Components
│       │   ├── ats/                        # ATS Optimizer View & Action Verbs Polisher
│       │   │   └── ATSAnalysisView.jsx
│       │   ├── career/                     # Job Role Matcher & 6-Month Roadmap Timeline
│       │   │   └── CareerMatchView.jsx
│       │   ├── chat/                       # ChatGPT-Style Chat Interface & Attachment Box
│       │   │   ├── ChatContainer.jsx
│       │   │   └── ChatMessage.jsx
│       │   ├── common/                     # Base Primitives (Card, Badge, Button)
│       │   │   ├── Badge.jsx
│       │   │   └── Card.jsx
│       │   ├── coverletter/                # Cover Letter & Elevator Pitch Studio
│       │   │   └── CoverLetterView.jsx
│       │   ├── interview/                  # AI Mock Interview Simulator Interface
│       │   │   └── MockInterviewView.jsx
│       │   ├── layout/                     # Layout Structures
│       │   │   ├── Navbar.jsx              # Executive Header, Live Indicators & Tab Switcher
│       │   │   └── Sidebar.jsx             # Chat Session History & Profile Widget
│       │   ├── modals/                     # System Modals
│       │   │   ├── ApiSettingsModal.jsx    # Model Configuration & API Key Tester
│       │   │   └── CVUploaderModal.jsx     # Drag & Drop File Upload Modal
│       │   └── rag/                        # RAG Chunk Explorer Modal
│       │       └── RAGExplorerModal.jsx
│       └── context/                        # Global State Store
│           └── AppContext.jsx              # State Store (CV, Sessions, Settings, ATS Score, Theme)
```

---

## Fitur Utama & Fungsionalitas Platform

1. **ATS Optimizer & Resume Compliance Engine**:
   - Skoring otomatis 0-100 dengan rincian: Informasi Kontak, Kelengkapan Bagian, Metrik Kuantitatif (STAR/XYZ), Kedalaman Keahlian, dan Format ATS.
   - Deteksi kekuatan dokumen dan checklist perbaikan prioritas.
   - **STAR Resume Polisher**: Alat perombak poin tugas biasa menjadi kalimat aksi terukur.

2. **Pemetaan Karier & Skill Gap Radar**:
   - Rekomendasi peran industri dengan persentase kesesuaian (*Match Score*).
   - Analisis kesenjangan skill (*Matched Skills vs Missing Skills*).
   - Estimasi rentang gaji di Indonesia dan sektor industri potensial.
   - **Roadmap Akselerasi 6 Bulan** dengan panduan fokus bertahap.

3. **Simulator Wawancara Kerja Interaktif (Metode STAR)**:
   - 3 Kategori Wawancara: HR Behavioral, Kasus Teknis, dan Culture Fit.
   - Penilaian skor jawaban 1–10 secara real-time dengan ceklist kelengkapan Situation, Task, Action, dan Result.
   - Rekomendasi kalimat jawaban yang lebih menjual di mata recruiter.

4. **Studio Surat Lamaran Kerja & 60-Second Pitch**:
   - Draf Cover Letter profesional yang dapat disesuaikan nama perusahaan target dan posisi yang dilamar (Bahasa Indonesia & Bahasa Inggris).
   - Skrip *Elevator Pitch* siap latihan dengan fitur 1-klik salin dan unduh berkas.

5. **RAG Knowledge Context & Chunk Explorer**:
   - Inspeksi segmen chunking dokumen, visualisasi token, dan pengujian semantic keyword retriever secara transparan.

6. **Multi-Session Chat & Export Laporan**:
   - Dukungan banyak sesi obrolan (buat sesi baru, hapus, simpan di localStorage).
   - Ekspor laporan audit lengkap ke format Markdown/PDF.

7. **Dual-Theme Mode (Cerah & Dark Mode)**:
   - Tampilan awal default berlatar belakang cerah, bersih, dan elegan (*Light Mode* dengan pola mesh korporat modern).
   - Toggle instan ke *Executive Dark Navy Mode* dengan kontras tinggi.
   - Tanpa emotikon AI, menggunakan ikon **Lucide React SVG** presisi tinggi.

---

## Cara Menjalankan

```bash
# Instalasi dependensi
npm.cmd install

# Menjalankan server development
npm.cmd run dev

# Membangun versi produksi
npm.cmd run build
