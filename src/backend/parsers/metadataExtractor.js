/**
 * Metadata & Semantic Extraction Engine for Resume / CV Documents
 */

const SKILL_RULES = [
  // Tech, Software & Web
  { name: 'JavaScript', regex: /\b(JavaScript|ES6\+?)\b/i },
  { name: 'TypeScript', regex: /\b(TypeScript|TS)\b/i },
  { name: 'React.js', regex: /\b(React\.js|ReactJS|React)\b/i },
  { name: 'Next.js', regex: /\b(Next\.js|NextJS)\b/i },
  { name: 'Node.js', regex: /\b(Node\.js|NodeJS)\b/i },
  { name: 'Express.js', regex: /\b(Express\.js|ExpressJS)\b/i },
  { name: 'Vue.js', regex: /\b(Vue\.js|VueJS)\b/i },
  { name: 'Angular', regex: /\b(Angular|AngularJS)\b/i },
  { name: 'Nest.js', regex: /\b(Nest\.js|NestJS)\b/i },
  { name: 'Python', regex: /\bPython\b/i },
  { name: 'Django', regex: /\bDjango\b/i },
  { name: 'Flask', regex: /\bFlask\b/i },
  { name: 'FastAPI', regex: /\bFastAPI\b/i },
  { name: 'Java', regex: /\bJava\b(?!\s*script|\s*barat|\s*timur|\s*tengah)/i },
  { name: 'Spring Boot', regex: /\b(Spring Boot|Spring Framework)\b/i },
  { name: 'PHP', regex: /\bPHP\b/i },
  { name: 'Laravel', regex: /\bLaravel\b/i },
  { name: 'C++', regex: /\bC\+\+\b/i },
  { name: 'C#', regex: /\bC#\b/i },
  { name: '.NET', regex: /\b(\.NET|DotNet)\b/i },
  { name: 'Golang', regex: /\b(Golang|Go\s*language|Go\s*programming)\b/i },
  { name: 'Rust', regex: /\bRust\b/i },
  { name: 'Swift', regex: /\bSwift\b/i },
  { name: 'Kotlin', regex: /\bKotlin\b/i },
  { name: 'Flutter', regex: /\bFlutter\b/i },
  { name: 'React Native', regex: /\bReact Native\b/i },
  { name: 'SQL', regex: /\bSQL\b/i },
  { name: 'PostgreSQL', regex: /\b(PostgreSQL|Postgres)\b/i },
  { name: 'MySQL', regex: /\bMySQL\b/i },
  { name: 'MongoDB', regex: /\bMongoDB\b/i },
  { name: 'Redis', regex: /\bRedis\b/i },
  { name: 'Docker', regex: /\bDocker\b/i },
  { name: 'Kubernetes', regex: /\b(Kubernetes|K8s)\b/i },
  { name: 'Git', regex: /\bGit\b(?!\s*hub|\s*lab)/i },
  { name: 'GitHub', regex: /\bGitHub\b/i },
  { name: 'GitLab', regex: /\bGitLab\b/i },
  { name: 'CI/CD', regex: /\bCI[\s/]*CD\b/i },
  { name: 'AWS', regex: /\b(AWS|Amazon Web Services)\b/i },
  { name: 'GCP', regex: /\b(GCP|Google Cloud Platform|Google Cloud)\b/i },
  { name: 'Azure', regex: /\b(Azure|Microsoft Azure)\b/i },
  { name: 'HTML5', regex: /\b(HTML5|HTML)\b/i },
  { name: 'CSS3', regex: /\b(CSS3|CSS)\b/i },
  { name: 'Tailwind CSS', regex: /\b(Tailwind CSS|Tailwind)\b/i },
  { name: 'Bootstrap', regex: /\bBootstrap\b/i },
  { name: 'GraphQL', regex: /\bGraphQL\b/i },
  { name: 'RESTful API', regex: /\b(RESTful API|REST API|RESTful)\b/i },
  { name: 'Linux', regex: /\bLinux\b/i },
  { name: 'Microservices', regex: /\bMicroservices\b/i },
  { name: 'Unit Testing', regex: /\bUnit Test(ing)?\b/i },
  { name: 'Jest', regex: /\bJest\b/i },
  { name: 'Playwright', regex: /\bPlaywright\b/i },
  { name: 'Postman', regex: /\bPostman\b/i },

  // Data Science, AI & Analytics
  { name: 'Machine Learning', regex: /\bMachine Learning\b/i },
  { name: 'Deep Learning', regex: /\bDeep Learning\b/i },
  { name: 'TensorFlow', regex: /\bTensorFlow\b/i },
  { name: 'PyTorch', regex: /\bPyTorch\b/i },
  { name: 'Scikit-Learn', regex: /\bScikit[- ]Learn\b/i },
  { name: 'Pandas', regex: /\bPandas\b/i },
  { name: 'NumPy', regex: /\bNumPy\b/i },
  { name: 'BigQuery', regex: /\bBigQuery\b/i },
  { name: 'Snowflake', regex: /\bSnowflake\b/i },
  { name: 'Tableau', regex: /\bTableau\b/i },
  { name: 'Power BI', regex: /\bPower BI\b/i },
  { name: 'Looker Studio', regex: /\b(Looker Studio|Google Data Studio)\b/i },
  { name: 'R Language', regex: /\b(Bahasa R|R Programming|R Studio|R Script|\bR\b(?=\s*[,|\n]|\s+dan\s+python))\b/i },
  { name: 'Data Science', regex: /\b(Data Science|Sains Data)\b/i },
  { name: 'Data Analytics', regex: /\b(Data Analytics|Analisis Data)\b/i },
  { name: 'Data Visualization', regex: /\b(Data Visualization|Visualisasi Data)\b/i },
  { name: 'ETL', regex: /\b(ETL|ELT|Data Pipeline)\b/i },
  { name: 'NLP', regex: /\b(NLP|Natural Language Processing)\b/i },

  // Design, Media & Product
  { name: 'Figma', regex: /\bFigma\b/i },
  { name: 'Adobe Photoshop', regex: /\b(Photoshop|Adobe Photoshop)\b/i },
  { name: 'Adobe Illustrator', regex: /\b(Illustrator|Adobe Illustrator)\b/i },
  { name: 'Canva', regex: /\bCanva\b/i },
  { name: 'UI/UX Design', regex: /\b(UI\/UX|UI UX|User Interface|User Experience)\b/i },
  { name: 'Wireframing', regex: /\bWirefram(ing|e)\b/i },
  { name: 'Prototyping', regex: /\bPrototyp(ing|e)\b/i },
  { name: 'User Research', regex: /\bUser Research\b/i },
  { name: 'Usability Testing', regex: /\bUsability Testing\b/i },
  { name: 'Design System', regex: /\bDesign System\b/i },
  { name: 'Product Management', regex: /\bProduct Management\b/i },
  { name: 'Agile', regex: /\bAgile\b/i },
  { name: 'Scrum', regex: /\bScrum\b/i },
  { name: 'Jira', regex: /\bJira\b/i },
  { name: 'Notion', regex: /\bNotion\b/i },

  // Business, Marketing & Growth
  { name: 'Google Analytics', regex: /\b(Google Analytics|GA4|Google Analytics 4)\b/i },
  { name: 'Google Ads', regex: /\bGoogle Ads\b/i },
  { name: 'Meta Ads', regex: /\b(Meta Ads|Facebook Ads|Meta Ads Manager)\b/i },
  { name: 'SEO', regex: /\bSEO\b/i },
  { name: 'SEM', regex: /\bSEM\b/i },
  { name: 'Content Strategy', regex: /\bContent Strategy\b/i },
  { name: 'Copywriting', regex: /\bCopywriting\b/i },
  { name: 'Social Media Marketing', regex: /\bSocial Media Marketing\b/i },
  { name: 'Performance Marketing', regex: /\bPerformance Marketing\b/i },
  { name: 'Influencer Marketing', regex: /\bInfluencer Marketing\b/i },
  { name: 'KOL Management', regex: /\bKOL Management\b/i },
  { name: 'Market Research', regex: /\b(Market Research|Riset Pasar)\b/i },
  { name: 'Branding', regex: /\bBranding\b/i },
  { name: 'Growth Hacking', regex: /\bGrowth Hacking\b/i },
  { name: 'E-Commerce', regex: /\b(E-Commerce|Ecommerce)\b/i },
  { name: 'CRM', regex: /\bCRM\b/i },
  { name: 'HubSpot', regex: /\bHubSpot\b/i },
  { name: 'SEMrush', regex: /\bSEMrush\b/i },
  { name: 'Digital Marketing', regex: /\bDigital Marketing\b/i },

  // Finance, Accounting & Business Operations
  { name: 'Microsoft Excel', regex: /\b(Microsoft Excel|Excel|MS Excel)\b/i },
  { name: 'Microsoft PowerPoint', regex: /\b(PowerPoint|PPT|MS PowerPoint)\b/i },
  { name: 'Financial Modeling', regex: /\bFinancial Modeling\b/i },
  { name: 'Financial Analysis', regex: /\b(Financial Analysis|Analisis Keuangan)\b/i },
  { name: 'Auditing', regex: /\b(Auditing|Audit)\b/i },
  { name: 'Tax Compliance', regex: /\b(Tax|Perpajakan|Brevet Pajak)\b/i },
  { name: 'Budgeting', regex: /\b(Budgeting|Penganggaran)\b/i },
  { name: 'Business Development', regex: /\b(Business Development|BizDev)\b/i },
  { name: 'B2B Sales', regex: /\bB2B Sales\b/i },
  { name: 'Negosiasi', regex: /\b(Negosiasi|Negotiation)\b/i },
  { name: 'Supply Chain', regex: /\bSupply Chain\b/i },
  { name: 'Operations Management', regex: /\bOperations Management\b/i },
  { name: 'Process Optimization', regex: /\bProcess Optimization\b/i },
  { name: 'SAP', regex: /\bSAP\b/i },
  { name: 'Accurate', regex: /\bAccurate\b/i },

  // HR & People Operations
  { name: 'Human Resources', regex: /\b(Human Resources|HRD|Sumber Daya Manusia)\b/i },
  { name: 'Talent Acquisition', regex: /\bTalent Acquisition\b/i },
  { name: 'Recruitment', regex: /\b(Recruitment|Rekrutmen)\b/i },
  { name: 'Employer Branding', regex: /\bEmployer Branding\b/i },
  { name: 'Employee Engagement', regex: /\bEmployee Engagement\b/i },
  { name: 'Onboarding', regex: /\bOnboarding\b/i },

  // Soft Skills
  { name: 'Public Speaking', regex: /\bPublic Speaking\b/i },
  { name: 'Leadership', regex: /\b(Leadership|Kepemimpinan)\b/i },
  { name: 'Problem Solving', regex: /\bProblem Solving\b/i },
  { name: 'Critical Thinking', regex: /\bCritical Thinking\b/i },
  { name: 'Komunikasi Efektif', regex: /\b(Komunikasi Efektif|Komunikasi Interpersonal)\b/i },
  { name: 'Time Management', regex: /\b(Time Management|Manajemen Waktu)\b/i },
  { name: 'Teamwork', regex: /\b(Teamwork|Kerja Sama Tim)\b/i },
  { name: 'Analytical Thinking', regex: /\bAnalytical Thinking\b/i },
  { name: 'Adaptability', regex: /\b(Adaptability|Adaptasi|Fleksibilitas)\b/i },
  { name: 'Attention to Detail', regex: /\b(Attention to Detail|Teliti|Ketelitian)\b/i },
  { name: 'Multitasking', regex: /\bMultitasking\b/i },
  { name: 'Disiplin Kerja', regex: /\b(Disiplin|Discipline|Tanggung Jawab|Responsibility)\b/i },

  // Administrasi, Customer Service & Operasional Umum (dunia kerja entry-level/vokasional)
  { name: 'Customer Service', regex: /\b(Customer Service|Pelayanan Pelanggan|Layanan Pelanggan)\b/i },
  { name: 'Administrasi', regex: /\b(Administrasi|Administrative|Tata Usaha|Office Administration)\b/i },
  { name: 'Kearsipan', regex: /\b(Kearsipan|Filing|Document Management|Pengarsipan)\b/i },
  { name: 'Data Entry', regex: /\b(Data Entry|Entri Data|Input Data)\b/i },
  { name: 'Operasional Kantor', regex: /\b(Operasional Kantor|Office Operations)\b/i },
  { name: 'Cash Handling', regex: /\b(Cash Handling|Pengelolaan Kas|Handling Uang)\b/i },
  { name: 'Kasir / Point of Sale', regex: /\b(Point of Sale|Sistem Kasir|\bPOS\b|Kasir)\b/i },
  { name: 'Housekeeping', regex: /\b(Housekeeping|Perawatan Gedung|Kebersihan Area)\b/i },
  { name: 'Warehouse Management', regex: /\b(Warehouse Management|Manajemen Gudang|Pergudangan)\b/i },
  { name: 'Inventory Management', regex: /\b(Inventory Management|Manajemen Inventaris|Stok Barang|Stock Opname)\b/i },
  { name: 'Hospitality', regex: /\b(Hospitality|Keramahtamahan|Perhotelan)\b/i },
  { name: 'Food & Beverage Service', regex: /\b(Food and Beverage|F&B Service|Pelayanan Restoran|Barista)\b/i },
  { name: 'Driving License (SIM)', regex: /\bSIM\s*[ABC]\b/i },
  { name: 'Teknisi & Maintenance', regex: /\b(Maintenance|Perawatan Mesin|Teknisi)\b/i },
  { name: 'Keamanan (Security)', regex: /\b(Satpam|Security Officer|Keamanan)\b/i },

  // Konten, Kreatif & Kolaborasi Digital Umum
  { name: 'Content Writing', regex: /\b(Content Writing|Penulisan Konten|Copywriter)\b/i },
  { name: 'Video Editing', regex: /\b(Video Editing|Adobe Premiere|CapCut|Final Cut Pro|DaVinci Resolve)\b/i },
  { name: 'Photography', regex: /\b(Photography|Fotografi)\b/i },
  { name: 'WordPress', regex: /\bWordPress\b/i },
  { name: 'Shopify', regex: /\bShopify\b/i },
  { name: 'Salesforce', regex: /\bSalesforce\b/i },
  { name: 'Slack', regex: /\bSlack\b/i },
  { name: 'Trello', regex: /\bTrello\b/i },
  { name: 'Google Workspace', regex: /\b(Google Workspace|Google Docs|Google Sheets|Google Suite)\b/i },
  { name: 'Bahasa Inggris Profesional', regex: /\b(TOEFL|IELTS|Fluent English|Bahasa Inggris Aktif)\b/i }
];

export function extractMetadata(rawText) {
  const text = (rawText || '').trim();
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const wordCount = text ? text.split(/\s+/).length : 0;
  const charCount = text.length;

  // 1. Identify Candidate Name
  let nameCandidate = '';
  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const line = lines[i];
    if (
      line.length > 2 && 
      line.length < 50 && 
      !line.includes('@') && 
      !line.includes('http') && 
      !line.includes('---') &&
      !line.toLowerCase().startsWith('curriculum') &&
      !line.toLowerCase().startsWith('resume') &&
      !line.toLowerCase().startsWith('halaman')
    ) {
      nameCandidate = line.replace(/^[#*\s-]+/, '').trim();
      break;
    }
  }

  // 2. Identify Contact Info
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : null;

  const phoneMatch = text.match(/(\+62|08)[0-9\s-]{8,15}/);
  const phone = phoneMatch ? phoneMatch[0] : null;

  const linkedInMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const linkedIn = linkedInMatch ? linkedInMatch[0] : null;

  const githubMatch = text.match(/github\.com\/[a-zA-Z0-9_-]+/i);
  const github = githubMatch ? githubMatch[0] : null;

  // 3. Identify Sections
  const detectedSections = [];
  const lower = text.toLowerCase();
  
  if (lower.includes('pendidikan') || lower.includes('education') || lower.includes('akademik') || lower.includes('universitas') || lower.includes('sekolah')) {
    detectedSections.push('Pendidikan');
  }
  if (lower.includes('pengalaman') || lower.includes('experience') || lower.includes('magang') || lower.includes('internship') || lower.includes('kerja')) {
    detectedSections.push('Pengalaman Kerja & Magang');
  }
  if (lower.includes('keahlian') || lower.includes('skill') || lower.includes('kemampuan') || lower.includes('kompetensi') || lower.includes('tools')) {
    detectedSections.push('Keahlian & Tools');
  }
  if (lower.includes('proyek') || lower.includes('project') || lower.includes('portofolio') || lower.includes('karya')) {
    detectedSections.push('Proyek & Karya');
  }
  if (lower.includes('sertifikasi') || lower.includes('certification') || lower.includes('pelatihan') || lower.includes('kursus') || lower.includes('lisensi')) {
    detectedSections.push('Sertifikasi');
  }
  if (lower.includes('organisasi') || lower.includes('organization') || lower.includes('kepanitiaan') || lower.includes('volunteer')) {
    detectedSections.push('Organisasi & Kepemimpinan');
  }
  if (lower.includes('bahasa') || lower.includes('language') || lower.includes('toefl') || lower.includes('ielts')) {
    detectedSections.push('Bahasa');
  }

  // 4. Identify Degree, University & Major
  let detectedUniversity = null;
  const uniMatch = text.match(/(universitas|institut|politeknik|stie|sekolah tinggi|university|institute)\s+([a-zA-Z\s]+)/i);
  if (uniMatch) {
    detectedUniversity = uniMatch[0].split('\n')[0].trim().replace(/[-|,].*$/, '').trim();
  }

  let detectedMajor = null;
  const majorPatterns = [
    { name: 'Teknik Informatika & Software Engineering', regex: /(informatika|ilmu komputer|software engineering|sistem informasi|informatics|information technology|information system|computer engineering|teknik komputer|rekayasa perangkat lunak|computer science|s\.kom)/i },
    { name: 'Manajemen Bisnis & Pemasaran', regex: /(manajemen bisnis|sarjana manajemen|s\.m\b|marketing|pemasaran|digital marketing|business administration|business management|management studies|kewirausahaan|entrepreneurship|manajemen)/i },
    { name: 'Statistika & Sains Data', regex: /(statistika|sains data|data science|data analytics|actuarial science|aktuaria|s\.si.*stat|statistics|matematika|mathematics)/i },
    { name: 'Akuntansi & Keuangan', regex: /(akuntansi|accounting|keuangan|finance|financial management|perbankan|banking|s\.e\b|sarjana ekonomi|economics)/i },
    { name: 'Desain Komunikasi Visual & UI/UX', regex: /(dkv|desain komunikasi visual|desain grafis|ui\/ux|graphic design|visual communication design|desain produk|product design)/i },
    { name: 'Ilmu Komunikasi & Public Relations', regex: /(ilmu komunikasi|public relations|humas|broadcasting|jurnalistik|journalism|communication science|communication studies|communications\b)/i },
    { name: 'Psikologi & Sumber Daya Manusia (HR)', regex: /(psikologi|psychology|human resources|psikolog|human resource management|\bsdm\b)/i },
    { name: 'Teknik Industri & Operasional', regex: /(teknik industri|industrial engineering|supply chain|logistik|logistics)/i },
    { name: 'Teknik Elektro & Mekatronika', regex: /(teknik elektro|electrical engineering|mekatronika|mechatronics|robotika|robotics)/i },
    { name: 'Teknik Sipil & Arsitektur', regex: /(teknik sipil|arsitektur|architecture|civil engineering)/i },
    { name: 'Hukum & Legal', regex: /(ilmu hukum|fakultas hukum|sarjana hukum|legal studies|law\b)/i },
    { name: 'Farmasi & Kesehatan', regex: /(kedokteran|farmasi|pharmacy|keperawatan|nursing|kesehatan masyarakat|public health|gizi|nutrition|medicine)/i }
  ];

  /**
   * PENTING: deteksi jurusan HARUS dibatasi ke bagian EDUCATION/PENDIDIKAN saja.
   * Sebelumnya regex dijalankan ke SELURUH teks CV — akibatnya kata yang muncul di
   * bagian Pengalaman Kerja/Proyek (mis. sebuah proyek REST API "untuk Human Resources"
   * milik klien) bisa salah "membajak" deteksi jurusan kandidat, meski kandidatnya
   * sebenarnya lulusan bidang lain sama sekali.
   */
  const extractSectionText = (fullText, headerRegex) => {
    const secLines = fullText.split(/\r?\n/);
    const startIdx = secLines.findIndex(l => headerRegex.test(l.trim()));
    if (startIdx === -1) return null;

    const OTHER_HEADERS = /^(PENGALAMAN|WORK EXPERIENCE|EXPERIENCE|PROYEK|PROJECTS?|KEAHLIAN|SKILLS?|SERTIFIKASI|CERTIFICATIONS?|ORGANISASI|BAHASA|LANGUAGES?)\b/i;
    let endIdx = Math.min(startIdx + 25, secLines.length);
    for (let i = startIdx + 1; i < endIdx; i++) {
      const trimmed = secLines[i].trim();
      if (trimmed && OTHER_HEADERS.test(trimmed)) {
        endIdx = i;
        break;
      }
    }
    return secLines.slice(startIdx, endIdx).join('\n');
  };

  const educationSectionText = extractSectionText(text, /^(PENDIDIKAN|EDUCATION|AKADEMIK)\b/i);

  if (educationSectionText) {
    for (const m of majorPatterns) {
      if (m.regex.test(educationSectionText)) {
        detectedMajor = m.name;
        break;
      }
    }
  }

  // Fallback: kalau bagian EDUCATION tidak ketemu / tidak mengandung kata kunci apa pun,
  // baru coba cari di seluruh teks — lebih baik daripada langsung menyerah ke "Akademik Umum".
  if (!detectedMajor) {
    for (const m of majorPatterns) {
      if (m.regex.test(text)) {
        detectedMajor = m.name;
        break;
      }
    }
  }

  // Find GPA / IPK
  let detectedGpa = null;
  const gpaMatch = text.match(/(ipk|gpa)\s*[:=]?\s*([0-4][.,]\d{1,2})/i);
  if (gpaMatch) {
    detectedGpa = gpaMatch[2].replace(',', '.');
  }

  // 5. Extract Skills accurately using explicit regex rules (zero substring bleeding)
  const extractedSkills = [];
  SKILL_RULES.forEach(rule => {
    if (rule.regex.test(text)) {
      if (!extractedSkills.includes(rule.name)) {
        extractedSkills.push(rule.name);
      }
    }
  });

  // 6. Check Quantified Impact (Metrics)
  const metricMatches = text.match(/\d+(\s*%|\s*user|\s*pengguna|\s*mahasiswa|\s*klien|\s*brand|\s*juta|\s*milyar|\s*kali|\s*responden|\s*merchant|\s*transaksi)/gi) || [];

  return {
    wordCount,
    charCount,
    nameCandidate: nameCandidate || 'Mahasiswa',
    email,
    phone,
    linkedIn,
    github,
    detectedSections,
    detectedUniversity,
    detectedMajor: detectedMajor || 'Akademik Umum',
    detectedGpa,
    extractedSkills: extractedSkills.length > 0 ? extractedSkills : ['Komunikasi Efektif', 'Problem Solving', 'Microsoft Excel'],
    hasMetrics: metricMatches.length > 0,
    metricCount: metricMatches.length
  };
}