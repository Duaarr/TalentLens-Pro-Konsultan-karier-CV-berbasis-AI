/**
 * Job Role Matcher & Skill Gap Analysis Engine
 * Dynamically computes relevance, matched skills, skill gaps, and roadmaps for any academic discipline.
 */

const INDUSTRY_JOB_ROLES = [
  // --- BISNIS, MARKETING, PENJUALAN & MANAJEMEN ---
  {
    roleName: 'Digital Marketing & Growth Specialist',
    category: 'Pemasaran & Bisnis',
    targetMajors: ['manajemen', 'bisnis', 'marketing', 'pemasaran', 'komunikasi', 'ekonomi', 'dkv'],
    description: 'Merancang dan mengeksekusi strategi akuisisi pengguna, kampanye iklan digital (Meta/Google Ads), analitik konversi, dan optimasi funnel pemasaran.',
    requiredSkills: ['Google Analytics', 'Google Ads', 'Meta Ads', 'SEO', 'Content Strategy', 'Copywriting', 'Microsoft Excel'],
    optionalSkills: ['SEMrush', 'Canva', 'Figma', 'Looker Studio', 'Social Media Marketing', 'Performance Marketing', 'Influencer Marketing', 'KOL Management', 'Growth Hacking'],
    salaryRange: 'Rp 6.000.000 – Rp 11.500.000',
    industry: 'Agensi Kreatif, Perusahaan FMCG, E-Commerce, Startup Unicorn & B2B SaaS',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Sertifikasi Google Analytics 4 (GA4) & Meta Blueprint Certified' },
      { phase: 'Bulan 3-4', focus: 'Eksperimen Performance Marketing & Optimasi Landing Page (CRO / A/B Testing)' },
      { phase: 'Bulan 5-6', focus: 'Automasi Pemasaran, Funnel Retention, & Strategi Viral Social Media' }
    ]
  },
  {
    roleName: 'Brand, Content & Social Media Strategist',
    category: 'Pemasaran & Kreatif',
    targetMajors: ['manajemen', 'bisnis', 'marketing', 'komunikasi', 'public relations', 'dkv', 'desain'],
    description: 'Mengembangkan narasi brand, mengelola kalender konten lintas platform media sosial, dan mengoptimalkan interaksi audiens.',
    requiredSkills: ['Social Media Marketing', 'Content Strategy', 'Copywriting', 'Canva', 'Market Research', 'Branding'],
    optionalSkills: ['Figma', 'Video Editing', 'Looker Studio', 'Influencer Marketing', 'Public Speaking', 'KOL Management', 'Google Analytics'],
    salaryRange: 'Rp 5.500.000 – Rp 10.000.000',
    industry: 'Media Digital, Brand Retail, Creative Agencies, Consumer Tech',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Riset Audiens, Tren Konten TikTok/Reels, dan Perumusan Brand Voice' },
      { phase: 'Bulan 3-4', focus: 'Storytelling Visual & Manajemen Kolaborasi Influencer (KOL Campaign)' },
      { phase: 'Bulan 5-6', focus: 'Analisis Metrik Engagement & Pelaporan Kinerja Konten Eksekutif' }
    ]
  },
  {
    roleName: 'Business Development & Sales Specialist',
    category: 'Bisnis & Penjualan',
    targetMajors: ['manajemen', 'bisnis', 'marketing', 'ekonomi', 'komunikasi', 'hubungan internasional', 'teknik industri'],
    description: 'Mengidentifikasi peluang kemitraan baru, memimpin negosiasi B2B, dan memperluas jaringan pasar organisasi.',
    requiredSkills: ['Business Development', 'Negosiasi', 'Market Research', 'Microsoft Excel', 'Public Speaking', 'Komunikasi Efektif'],
    optionalSkills: ['Sales Strategy', 'B2B Sales', 'CRM', 'HubSpot', 'Financial Modeling', 'Lead Generation', 'Storytelling Data'],
    salaryRange: 'Rp 6.000.000 – Rp 13.000.000',
    industry: 'FinTech, Logistik, B2B SaaS, Korporasi Multinasional',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Penguasaan Sales Funnel, Cold Outreach B2B & Lead Qualification' },
      { phase: 'Bulan 3-4', focus: 'Teknik Negosiasi Kontrak & Penyusunan Proposal Bisnis Strategis' },
      { phase: 'Bulan 5-6', focus: 'Key Account Management & Manajemen Retensi Klien Korporat' }
    ]
  },
  {
    roleName: 'Business Analyst & Strategy Associate',
    category: 'Analisis Bisnis & Strategi',
    targetMajors: ['manajemen', 'bisnis', 'sistem informasi', 'teknik industri', 'ekonomi', 'statistika', 'akuntansi'],
    description: 'Menganalisis proses operasional bisnis, memetakan kebutuhan sistem organisasi, dan menerjemahkan data menjadi keputusan strategis.',
    requiredSkills: ['Business Analysis', 'Microsoft Excel', 'Problem Solving', 'Critical Thinking', 'Market Research', 'Process Optimization'],
    optionalSkills: ['SQL', 'Tableau', 'Power BI', 'Agile', 'Scrum', 'Figma', 'Wireframing', 'Financial Modeling'],
    salaryRange: 'Rp 7.000.000 – Rp 13.500.000',
    industry: 'Konsultan Manajemen, Perbankan, E-Commerce, Perusahaan Telekomunikasi',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Business Process Modeling (BPMN) & Analisis Kebutuhan Stakeholder' },
      { phase: 'Bulan 3-4', focus: 'Pengolahan Data Lanjut (Advanced Excel, SQL Dasar, & Dashboard BI)' },
      { phase: 'Bulan 5-6', focus: 'Financial Feasibility Analysis & Rekomendasi Solusi Efisiensi Bisnis' }
    ]
  },

  // --- KEUANGAN, AKUNTANSI & SDM ---
  {
    roleName: 'Financial Analyst & Accounting Associate',
    category: 'Keuangan & Akuntansi',
    targetMajors: ['akuntansi', 'keuangan', 'finance', 'ekonomi', 'manajemen', 'statistika'],
    description: 'Mengevaluasi kinerja keuangan, menyusun laporan laba rugi, memproyeksikan anggaran, dan menganalisis profitabilitas.',
    requiredSkills: ['Microsoft Excel', 'Financial Analysis', 'Financial Modeling', 'Accounting', 'Budgeting', 'Critical Thinking'],
    optionalSkills: ['Tax Compliance', 'Auditing', 'Cash Flow', 'SAP', 'Accurate', 'SQL', 'Tableau', 'Power BI'],
    salaryRange: 'Rp 6.500.000 – Rp 12.500.000',
    industry: 'Perbankan, Kantor Akuntan Publik (Big 4), FinTech, FMCG Corporates',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Advanced Financial Modeling (DCF, Three-Statement Model) di Excel' },
      { phase: 'Bulan 3-4', focus: 'Analisis Varians Anggaran & Standar Pelaporan Keuangan (PSAK/IFRS)' },
      { phase: 'Bulan 5-6', focus: 'Persiapan Sertifikasi Profesi Keuangan (CFA Level 1 / Brevet Pajak AB)' }
    ]
  },
  {
    roleName: 'Human Resources (HR) & Talent Acquisition Specialist',
    category: 'SDM & Organisasi',
    targetMajors: ['psikologi', 'manajemen', 'ilmu komunikasi', 'hukum', 'human resources'],
    description: 'Mengelola siklus rekrutmen talenta, merancang program retensi karyawan, dan mendukung pengembangan budaya kerja organisasi.',
    requiredSkills: ['Human Resources', 'Talent Acquisition', 'Recruitment', 'Komunikasi Efektif', 'Interpersonal Communication', 'Leadership'],
    optionalSkills: ['Employer Branding', 'Employee Engagement', 'Onboarding', 'Training & Development', 'Performance Management', 'Public Speaking'],
    salaryRange: 'Rp 5.500.000 – Rp 10.500.000',
    industry: 'Perusahaan Korporat, Tech Startups, Agensi Rekrutmen Headhunter',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Teknik Competency-Based Interview (BEI) & Talent Sourcing via LinkedIn' },
      { phase: 'Bulan 3-4', focus: 'Penyusunan Program Onboarding & Indikator Kinerja Karyawan (KPI/OKR)' },
      { phase: 'Bulan 5-6', focus: 'Employer Branding Strategy & Hubungan Industrial Ketenagakerjaan' }
    ]
  },

  // --- DATA, SAINS DATA & AI ---
  {
    roleName: 'Data Analyst & Business Intelligence',
    category: 'Data & Analitika',
    targetMajors: ['statistika', 'sains data', 'data science', 'matematika', 'teknik informatika', 'sistem informasi', 'ekonomi'],
    description: 'Mengolah data mentah menjadi wawasan bisnis yang dapat ditindaklanjuti serta menyusun dashboard analitik interaktif eksekutif.',
    requiredSkills: ['SQL', 'Python', 'Microsoft Excel', 'Tableau', 'Power BI', 'Problem Solving', 'Data Analytics'],
    optionalSkills: ['BigQuery', 'R', 'Looker Studio', 'Machine Learning', 'Pandas', 'Data Visualization', 'ETL'],
    salaryRange: 'Rp 6.500.000 – Rp 12.500.000',
    industry: 'Perbankan Digital, Retail, FMCG, Unicorn Startups, Telekomunikasi',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Advanced SQL Query (Window Functions, CTEs, Data Modeling di Data Warehouse)' },
      { phase: 'Bulan 3-4', focus: 'Pembuatan Dashboard Eksekutif di Tableau/Power BI & Data Storytelling' },
      { phase: 'Bulan 5-6', focus: 'Automasi Python (Pandas/NumPy) & Eksperimen A/B Testing Analysis' }
    ]
  },
  {
    roleName: 'Data Scientist & Machine Learning Specialist',
    category: 'Data Science & AI',
    targetMajors: ['sains data', 'statistika', 'teknik informatika', 'ilmu komputer', 'matematika', 'fisika'],
    description: 'Membangun model kecerdasan buatan, algoritma machine learning prediktif, dan pipeline NLP untuk menyelesaikan tantangan bisnis rumit.',
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Scikit-Learn', 'Pandas', 'NumPy', 'Data Science'],
    optionalSkills: ['Deep Learning', 'TensorFlow', 'PyTorch', 'BigQuery', 'NLP', 'Predictive Modeling', 'FastAPI', 'Statistical Modeling'],
    salaryRange: 'Rp 8.000.000 – Rp 16.000.000',
    industry: 'AI Labs, FinTech, E-Commerce, Kesehatan, Perusahaan Riset Global',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Feature Engineering Terapan & Validasi Model (Cross-Validation, F1-Score)' },
      { phase: 'Bulan 3-4', focus: 'Implementasi Deep Learning (PyTorch/TensorFlow) & Proyek NLP Terapan' },
      { phase: 'Bulan 5-6', focus: 'Deployment Model Machine Learning menjadi API dengan FastAPI & Docker' }
    ]
  },
  {
    roleName: 'Data Engineer & Big Data Associate',
    category: 'Data & Infrastruktur',
    targetMajors: ['teknik informatika', 'ilmu komputer', 'sistem informasi', 'sains data', 'teknik komputer'],
    description: 'Merancang arsitektur pipeline data (ETL/ELT), memastikan keandalan data warehouse, dan mengoptimalkan aliran data skala besar.',
    requiredSkills: ['SQL', 'Python', 'PostgreSQL', 'ETL', 'Git', 'Linux'],
    optionalSkills: ['BigQuery', 'Docker', 'AWS', 'Snowflake', 'Redis', 'CI/CD', 'RESTful API'],
    salaryRange: 'Rp 7.500.000 – Rp 15.000.000',
    industry: 'FinTech, E-Commerce, Perbankan, Perusahaan Big Data',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Optimasi Skema Database Relasional, Indexing, & Pipeline ETL Otomatis' },
      { phase: 'Bulan 3-4', focus: 'Pengelolaan Cloud Data Warehouse (Google BigQuery / Snowflake)' },
      { phase: 'Bulan 5-6', focus: 'Data Orchestration (Airflow) & Pipeline Streaming Data' }
    ]
  },

  // --- TEKNOLOGI INFORMASI & SOFTWARE ENGINEERING ---
  {
    roleName: 'Frontend Web & Mobile Engineer',
    category: 'Teknologi Informasi',
    targetMajors: ['teknik informatika', 'ilmu komputer', 'software engineering', 'sistem informasi', 'teknik komputer', 'rekayasa perangkat lunak'],
    description: 'Mengembangkan antarmuka aplikasi web dan mobile yang responsif, performan tinggi, dan ramah pengguna menggunakan framework modern.',
    requiredSkills: ['JavaScript', 'TypeScript', 'React.js', 'Tailwind CSS', 'HTML5', 'CSS3', 'Git', 'RESTful API'],
    optionalSkills: ['Next.js', 'Redux Toolkit', 'Jest', 'UI/UX Design', 'GraphQL', 'React Native', 'Flutter'],
    salaryRange: 'Rp 6.500.000 – Rp 13.000.000',
    industry: 'Startup Teknologi, Perusahaan E-Commerce, Software House & Konsultan IT',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Pendalaman TypeScript & State Management Modern (Zustand / Redux Toolkit)' },
      { phase: 'Bulan 3-4', focus: 'Membangun 2 Proyek Fullstack SSR dengan Next.js, Tailwind CSS & Server Components' },
      { phase: 'Bulan 5-6', focus: 'Testing Komprehensif (Vitest / Playwright) & Optimasi Core Web Vitals' }
    ]
  },
  {
    roleName: 'Fullstack Software Engineer',
    category: 'Teknologi Informasi',
    targetMajors: ['teknik informatika', 'ilmu komputer', 'software engineering', 'sistem informasi', 'teknik komputer'],
    description: 'Membangun arsitektur perangkat lunak end-to-end mulai dari frontend interaktif, API backend andal, hingga manajemen basis data.',
    requiredSkills: ['JavaScript', 'Node.js', 'React.js', 'SQL', 'PostgreSQL', 'Express.js', 'Git', 'RESTful API'],
    optionalSkills: ['Docker', 'AWS', 'MongoDB', 'TypeScript', 'Redis', 'Nest.js', 'CI/CD'],
    salaryRange: 'Rp 7.500.000 – Rp 15.000.000',
    industry: 'FinTech, Perbankan Digital, SaaS Company, Enterprise Tech',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Desain REST API Aman, Autentikasi JWT & Database Indexing (PostgreSQL)' },
      { phase: 'Bulan 3-4', focus: 'Containerization dengan Docker & CI/CD Pipeline GitHub Actions' },
      { phase: 'Bulan 5-6', focus: 'Microservices Fundamentals, Caching (Redis), & Cloud Deployment' }
    ]
  },
  {
    roleName: 'Backend Engineer & API Specialist',
    category: 'Teknologi Informasi',
    targetMajors: ['teknik informatika', 'ilmu komputer', 'software engineering', 'sistem informasi', 'teknik komputer'],
    description: 'Merancang arsitektur server, API berkecepatan tinggi, logika bisnis kompleks, dan integrasi sistem backend yang scalable.',
    requiredSkills: ['Node.js', 'Express.js', 'SQL', 'PostgreSQL', 'Git', 'RESTful API', 'Linux'],
    optionalSkills: ['Docker', 'Python', 'FastAPI', 'Go', 'Golang', 'Java', 'Spring Boot', 'Redis', 'Microservices'],
    salaryRange: 'Rp 7.000.000 – Rp 14.500.000',
    industry: 'FinTech, Payment Gateway, SaaS Platforms, Cloud Companies',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Clean Architecture, Desain Database Relasional Normalisasi, & Transaction Management' },
      { phase: 'Bulan 3-4', focus: 'Optimasi Query SQL Kompleks, Caching Strategy dengan Redis, & Message Broker' },
      { phase: 'Bulan 5-6', focus: 'Testing API Otomatis (Postman/Jest), Keamanan OWASP, & Monitoring Logging' }
    ]
  },
  {
    roleName: 'QA Engineer & Software Quality Specialist',
    category: 'Teknologi Informasi',
    targetMajors: ['teknik informatika', 'ilmu komputer', 'sistem informasi', 'software engineering'],
    description: 'Memastikan kualitas, reliabilitas, dan keamanan perangkat lunak melalui pengujian manual, automated testing, dan pelaporan bug.',
    requiredSkills: ['Git', 'Problem Solving', 'Critical Thinking', 'Unit Testing', 'Postman'],
    optionalSkills: ['Jest', 'Playwright', 'JavaScript', 'Python', 'SQL', 'CI/CD', 'RESTful API'],
    salaryRange: 'Rp 6.000.000 – Rp 11.500.000',
    industry: 'Software Houses, FinTech, E-Commerce, Enterprise IT',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Penyusunan Test Plan, Test Cases, & Pengujian API via Postman' },
      { phase: 'Bulan 3-4', focus: 'Automated E2E Testing menggunakan Playwright atau Cypress' },
      { phase: 'Bulan 5-6', focus: 'Integrasi Test Otomatis ke Pipeline CI/CD & Performance Testing' }
    ]
  },

  // --- PRODUK & DESAIN ---
  {
    roleName: 'Associate Product Manager (APM)',
    category: 'Manajemen Produk',
    targetMajors: ['manajemen', 'bisnis', 'teknik informatika', 'sistem informasi', 'teknik industri', 'dkv'],
    description: 'Menjembatani kebutuhan bisnis, teknologi, dan pengalaman pengguna untuk meluncurkan fitur produk digital bernilai tinggi.',
    requiredSkills: ['Product Management', 'Agile', 'Scrum', 'Problem Solving', 'Critical Thinking', 'Market Research'],
    optionalSkills: ['Figma', 'Wireframing', 'SQL', 'Data Analytics', 'Jira', 'Public Speaking', 'Google Analytics'],
    salaryRange: 'Rp 8.000.000 – Rp 15.000.000',
    industry: 'Platform Digital, Insurtech, EduTech, E-Commerce Unicorn',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Product Discovery, User Interview, & Penyusunan PRD (Product Requirement Document)' },
      { phase: 'Bulan 3-4', focus: 'Metrik Produk (North Star Metric, User Retention Curve, Funnel Analysis)' },
      { phase: 'Bulan 5-6', focus: 'Agile Sprint Planning & Prioritisasi Fitur (RICE Framework)' }
    ]
  },
  {
    roleName: 'UI/UX Designer & Product Designer',
    category: 'Desain & Produk',
    targetMajors: ['dkv', 'desain komunikasi visual', 'desain grafis', 'teknik informatika', 'sistem informasi', 'ilmu komunikasi'],
    description: 'Merancang pengalaman pengguna (UX) yang intuitif, arsitektur informasi, dan antarmuka visual (UI) aplikasi web dan mobile.',
    requiredSkills: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'User Research', 'Usability Testing'],
    optionalSkills: ['Design System', 'Adobe Illustrator', 'Adobe Photoshop', 'Canva', 'HTML5', 'CSS3', 'Notion'],
    salaryRange: 'Rp 6.000.000 – Rp 12.000.000',
    industry: 'Creative Tech Studios, Startups, E-Commerce, Software Houses',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'User Research, Empathy Mapping, User Flow, & Low-Fidelity Wireframing' },
      { phase: 'Bulan 3-4', focus: 'High-Fidelity Prototyping di Figma, Micro-Interactions, & Design System (Tokens)' },
      { phase: 'Bulan 5-6', focus: 'Usability Testing, Handoff ke Developer, & Penyusunan Portofolio Studi Kasus UI/UX' }
    ]
  },

  // --- OPERASIONAL, ADMINISTRASI & LAYANAN UMUM (level entry, realistis untuk berbagai latar belakang) ---
  {
    roleName: 'Staf Administrasi & Operasional Kantor',
    category: 'Administrasi & Operasional',
    targetMajors: ['manajemen', 'administrasi', 'sekretaris', 'tata usaha', 'ekonomi', 'ilmu komunikasi'],
    description: 'Mendukung kelancaran operasional harian kantor, pengelolaan dokumen, penjadwalan, dan koordinasi administratif lintas divisi.',
    requiredSkills: ['Administrasi', 'Microsoft Excel', 'Data Entry', 'Komunikasi Efektif', 'Disiplin Kerja'],
    optionalSkills: ['Kearsipan', 'Google Workspace', 'Microsoft PowerPoint', 'Time Management', 'Multitasking', 'Attention to Detail'],
    salaryRange: 'Rp 4.000.000 – Rp 6.500.000',
    industry: 'Perkantoran Umum, BUMN, Institusi Pendidikan, Perusahaan Manufaktur',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Penguasaan Administrasi Dokumen Digital & Microsoft Office Lanjutan' },
      { phase: 'Bulan 3-4', focus: 'Manajemen Jadwal & Korespondensi Bisnis Profesional' },
      { phase: 'Bulan 5-6', focus: 'Sertifikasi Administrasi Perkantoran & Dasar Manajemen Kearsipan Digital' }
    ]
  },
  {
    roleName: 'Customer Service & Layanan Pelanggan',
    category: 'Layanan Pelanggan',
    targetMajors: ['manajemen', 'ilmu komunikasi', 'psikologi', 'sastra', 'pariwisata'],
    description: 'Menangani pertanyaan, keluhan, dan kebutuhan pelanggan melalui telepon, chat, atau tatap muka dengan standar pelayanan yang ramah dan solutif.',
    requiredSkills: ['Customer Service', 'Komunikasi Efektif', 'Problem Solving', 'Disiplin Kerja'],
    optionalSkills: ['CRM', 'Bahasa Inggris Profesional', 'Multitasking', 'Adaptability', 'Public Speaking'],
    salaryRange: 'Rp 4.200.000 – Rp 7.000.000',
    industry: 'E-Commerce, Perbankan, Telekomunikasi, Retail, Perusahaan Jasa',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Standar Komunikasi Layanan Pelanggan & Penanganan Keluhan (Complaint Handling)' },
      { phase: 'Bulan 3-4', focus: 'Penggunaan Sistem CRM & Pengukuran Kepuasan Pelanggan (CSAT/NPS)' },
      { phase: 'Bulan 5-6', focus: 'Teknik De-eskalasi Situasi Sulit & Cross-selling Dasar' }
    ]
  },
  {
    roleName: 'Staf Gudang & Logistik',
    category: 'Logistik & Operasional',
    targetMajors: ['teknik industri', 'manajemen', 'logistik', 'supply chain'],
    description: 'Mengelola penerimaan, penyimpanan, pencatatan stok, dan pengiriman barang di gudang atau pusat distribusi secara akurat dan efisien.',
    requiredSkills: ['Inventory Management', 'Warehouse Management', 'Disiplin Kerja', 'Attention to Detail'],
    optionalSkills: ['Microsoft Excel', 'Driving License (SIM)', 'Teamwork', 'Time Management'],
    salaryRange: 'Rp 4.000.000 – Rp 6.500.000',
    industry: 'E-Commerce, Distribusi & Retail, Manufaktur, Perusahaan Ekspedisi',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Sistem Pencatatan Stok Manual & Digital (Stock Opname Dasar)' },
      { phase: 'Bulan 3-4', focus: 'Penggunaan Warehouse Management System (WMS) Dasar' },
      { phase: 'Bulan 5-6', focus: 'Optimasi Alur Barang & K3 (Keselamatan Kerja Gudang)' }
    ]
  },
  {
    roleName: 'Sales & Retail Associate',
    category: 'Penjualan & Retail',
    targetMajors: ['manajemen', 'bisnis', 'marketing', 'ekonomi'],
    description: 'Melayani pelanggan di toko/outlet, mencapai target penjualan, dan menjaga standar tampilan produk (visual merchandising).',
    requiredSkills: ['Customer Service', 'Komunikasi Efektif', 'Kasir / Point of Sale', 'Cash Handling'],
    optionalSkills: ['Negosiasi', 'Disiplin Kerja', 'Teamwork', 'Adaptability'],
    salaryRange: 'Rp 3.800.000 – Rp 6.000.000',
    industry: 'Retail Fashion, Supermarket, Elektronik, Food & Beverage Chain',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Teknik Penjualan Dasar & Product Knowledge Mendalam' },
      { phase: 'Bulan 3-4', focus: 'Pencapaian Target & Strategi Upselling/Cross-selling' },
      { phase: 'Bulan 5-6', focus: 'Persiapan menuju posisi Supervisor Toko / Team Leader Retail' }
    ]
  },
  {
    roleName: 'IT Support & Helpdesk Specialist',
    category: 'Teknologi Informasi (Dukungan Teknis)',
    targetMajors: ['teknik informatika', 'sistem informasi', 'ilmu komputer', 'teknik komputer'],
    description: 'Menangani troubleshooting perangkat, jaringan, dan sistem internal karyawan, serta mendukung operasional IT harian perusahaan.',
    requiredSkills: ['Problem Solving', 'Linux', 'Git', 'Komunikasi Efektif'],
    optionalSkills: ['Networking', 'Windows Server', 'RESTful API', 'SQL', 'Customer Service'],
    salaryRange: 'Rp 4.800.000 – Rp 8.000.000',
    industry: 'Perusahaan Korporat, BPO, Software House, Institusi Pendidikan',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Troubleshooting Hardware/Software & Dasar Jaringan Komputer' },
      { phase: 'Bulan 3-4', focus: 'Ticketing System & SOP Penanganan Insiden IT' },
      { phase: 'Bulan 5-6', focus: 'Persiapan Sertifikasi CompTIA A+ / Jaringan Dasar menuju jalur System Administrator' }
    ]
  },
  {
    roleName: 'Content Creator & Admin Media Sosial',
    category: 'Konten & Kreatif Digital',
    targetMajors: ['ilmu komunikasi', 'dkv', 'marketing', 'broadcasting'],
    description: 'Membuat konten foto/video harian, mengelola jadwal posting, dan berinteraksi dengan audiens di akun media sosial brand/personal.',
    requiredSkills: ['Content Writing', 'Video Editing', 'Social Media Marketing'],
    optionalSkills: ['Photography', 'Canva', 'Copywriting', 'Content Strategy'],
    salaryRange: 'Rp 4.500.000 – Rp 8.000.000',
    industry: 'UMKM Digital, Agensi Kreatif, Brand Lokal, Content Creator Independen',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Konsistensi Konten Harian & Tren Format Video Pendek (Reels/TikTok)' },
      { phase: 'Bulan 3-4', focus: 'Editing Video Lanjutan & Storytelling Visual Brand' },
      { phase: 'Bulan 5-6', focus: 'Analisis Performa Konten & Kolaborasi dengan Brand/UMKM' }
    ]
  },
  {
    roleName: 'Staf Pendukung Umum & Fasilitas (General Support)',
    category: 'Operasional Umum',
    targetMajors: [],
    description: 'Mendukung kelancaran operasional harian perusahaan/instansi dari sisi kebersihan, logistik ringan, distribusi dokumen internal, dan bantuan umum lintas divisi.',
    requiredSkills: ['Disiplin Kerja', 'Komunikasi Efektif'],
    optionalSkills: ['Housekeeping', 'Driving License (SIM)', 'Teamwork', 'Attention to Detail'],
    salaryRange: 'Rp 3.500.000 – Rp 5.000.000 (UMR/UMK setempat)',
    industry: 'Perkantoran Umum, Institusi Pendidikan, Fasilitas Kesehatan, Retail',
    roadmap: [
      { phase: 'Bulan 1-2', focus: 'Standar Kerja & Etika Profesional di Lingkungan Kerja' },
      { phase: 'Bulan 3-4', focus: 'Pengenalan Sistem Kerja Tim & Prosedur Keselamatan Kerja Dasar' },
      { phase: 'Bulan 5-6', focus: 'Kesempatan Rotasi/Promosi ke Peran Administratif atau Operasional yang Lebih Terstruktur' }
    ]
  }
];

export function matchCareerRoles(cvText, metadata = {}) {
  const extractedSkills = metadata.extractedSkills || [];
  const majorText = (metadata.detectedMajor || '').toLowerCase();

  const scoredRoles = INDUSTRY_JOB_ROLES.map(role => {
    let matchedRequiredCount = 0;
    let matchedOptionalCount = 0;
    const matchedSkills = [];
    const missingSkills = [];

    // Helper: normalisasi string skill supaya variasi penulisan kecil tidak dianggap "tidak cocok"
    // (mis. "React" vs "React.js", "PostgreSQL (basic)" vs "PostgreSQL", beda kapitalisasi, dsb).
    const normalizeSkill = (s) => (s || '')
      .toLowerCase()
      .replace(/\.js\b/g, '')
      .replace(/[().]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const checkSkill = (targetSkill) => {
      const targetNorm = normalizeSkill(targetSkill);
      return extractedSkills.some(s => {
        const sNorm = normalizeSkill(s);
        if (!sNorm || !targetNorm) return false;
        if (sNorm === targetNorm) return true;
        if (sNorm.startsWith(targetNorm + ' ') || targetNorm.startsWith(sNorm + ' ')) return true;
        // Containment dua arah: menangkap kasus seperti "sql" di dalam "postgresql",
        // atau "restful api" vs "rest api" yang penulisannya sedikit berbeda.
        if (targetNorm.length >= 3 && (sNorm.includes(targetNorm) || targetNorm.includes(sNorm))) return true;
        return false;
      });
    };

    // 1. Required skills match
    role.requiredSkills.forEach(skill => {
      if (checkSkill(skill)) {
        matchedRequiredCount++;
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    // 2. Optional skills match
    role.optionalSkills.forEach(skill => {
      if (checkSkill(skill)) {
        matchedOptionalCount++;
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    // 3. Academic major alignment score (only against candidate's verified major)
    let majorAlignmentBonus = 0;
    const isDirectMajorMatch = role.targetMajors?.some(m => majorText.includes(m));
    if (isDirectMajorMatch) {
      majorAlignmentBonus = 28;
    }

    // 4. Calculate weighted match percentage
    const maxSkillPoints = (role.requiredSkills.length * 16) + (role.optionalSkills.length * 7);
    const earnedSkillPoints = (matchedRequiredCount * 16) + (matchedOptionalCount * 7);
    const skillRatio = maxSkillPoints > 0 ? (earnedSkillPoints / maxSkillPoints) : 0;

    // Base score from skills (0 - 68 pts) + major bonus (0 - 28 pts)
    let calculatedScore = (skillRatio * 68) + majorAlignmentBonus;

    // Bonus for high volume of matched core skills
    if (matchedRequiredCount >= 3) {
      calculatedScore += 4;
    }

    // Strict clamping:
    // If a role has 0 matching skills AND no major match, it gets scored 15-20% (strictly lowest priority)
    let matchPercentage = Math.round(calculatedScore);
    if (matchedSkills.length === 0 && !isDirectMajorMatch) {
      matchPercentage = 15;
    } else if (matchedSkills.length === 0 && isDirectMajorMatch) {
      matchPercentage = 35;
    } else {
      matchPercentage = Math.min(97, Math.max(20, matchPercentage));
    }

    // Dynamic Rationale based purely on the active candidate's skills
    let rationale = '';
    if (matchPercentage >= 85) {
      rationale = `Kecocokan sangat kuat (${matchPercentage}%). Latar belakang ${metadata.detectedMajor || 'studi Anda'} dan penguasaan keahlian ${matchedSkills.slice(0, 3).join(', ')} memenuhi mayoritas kriteria utama yang dicari industri.`;
    } else if (matchPercentage >= 60) {
      rationale = `Kandidat memiliki fondasi pada skill ${matchedSkills.slice(0, 2).join(', ') || 'terkait'}. Rekomendasi: tingkatkan penguasaan ${missingSkills.slice(0, 2).join(' dan ')} untuk memperbesar peluang lolos seleksi.`;
    } else {
      rationale = `Kesesuaian rendah (${matchPercentage}%). Peran ini membutuhkan kompetensi utama seperti ${missingSkills.slice(0, 3).join(', ')} yang belum terdata pada profil CV ini.`;
    }

    return {
      ...role,
      matchPercentage,
      matchedSkills,
      missingSkills,
      rationale
    };
  });

  // Sort descending by match percentage
  scoredRoles.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    candidateName: metadata.nameCandidate || 'Kandidat',
    detectedMajor: metadata.detectedMajor || 'Akademik Umum',
    roles: scoredRoles
  };
}