/**
 * PDF Cover Letter Generator
 * ------------------------------------------------------------------------
 * Menghasilkan file PDF surat lamaran yang benar-benar terformat sebagai
 * dokumen bisnis (bukan cuma teks polos di dalam file .txt), memakai jsPDF
 * -- library pihak ketiga yang ringan dan berjalan penuh di sisi client
 * (browser), tanpa perlu server backend sungguhan.
 *
 * Mendukung tanda tangan digital (gambar PNG dari canvas) yang ditanam
 * langsung ke PDF -- supaya user tidak perlu cetak, tanda tangan manual,
 * lalu scan ulang (dua kali kerja). Kalau signatureDataUrl tidak diisi,
 * sistem tetap menyisakan ruang kosong untuk tanda tangan manual seperti biasa.
 *
 * Install dulu di proyekmu:  npm install jspdf
 */
import { jsPDF } from 'jspdf';

const PAGE_WIDTH = 210; // A4 mm
const MARGIN = 22;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 6;

/**
 * @param {object} params
 * @param {string} params.candidateName
 * @param {string} params.email
 * @param {string} params.phone
 * @param {string} params.cityDate - contoh: "Yogyakarta, 26 September 2026"
 * @param {string} params.targetCompany
 * @param {string} params.targetRole
 * @param {string[]} params.bodyParagraphs - tiap elemen array = satu paragraf terpisah
 * @param {string} params.lang - 'id' | 'en'
 * @param {string|null} params.signatureDataUrl - data URL PNG dari canvas tanda tangan (opsional)
 * @returns {jsPDF} instance jsPDF, siap dipanggil .save(fileName) atau .output(...)
 */
export function buildCoverLetterPDF({
  candidateName,
  email,
  phone,
  cityDate,
  targetCompany,
  targetRole,
  bodyParagraphs = [],
  lang = 'id',
  signatureDataUrl = null
}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = MARGIN;

  const labels = lang === 'id'
    ? {
        subject: `Perihal: Lamaran Pekerjaan – ${targetRole}`,
        to: 'Kepada Yth.',
        recruitmentTeam: 'Tim Rekrutmen & Talent Acquisition',
        place: 'di Tempat',
        opening: 'Dengan hormat,',
        closingWord: 'Hormat saya,'
      }
    : {
        subject: `Subject: Application for ${targetRole}`,
        to: 'Dear Hiring Team,',
        recruitmentTeam: 'Talent Acquisition & Human Resources',
        place: '',
        opening: '',
        closingWord: 'Sincerely,'
      };

  // Header: nama & kontak kandidat
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(candidateName || 'Kandidat', MARGIN, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(90, 90, 90);
  doc.text(`${email || ''}   |   ${phone || ''}`, MARGIN, y);
  y += 10;

  // Tanggal & kota
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10.5);
  doc.text(cityDate || '', MARGIN, y);
  y += 9;

  // Subjek
  doc.setFont('helvetica', 'bold');
  doc.text(labels.subject, MARGIN, y);
  y += 9;

  // Blok penerima
  doc.setFont('helvetica', 'normal');
  doc.text(labels.to, MARGIN, y);
  y += LINE_HEIGHT;
  doc.text(labels.recruitmentTeam, MARGIN, y);
  y += LINE_HEIGHT;
  doc.setFont('helvetica', 'bold');
  doc.text(targetCompany || '', MARGIN, y);
  y += LINE_HEIGHT;
  if (labels.place) {
    doc.setFont('helvetica', 'normal');
    doc.text(labels.place, MARGIN, y);
    y += LINE_HEIGHT;
  }
  y += 4;

  // Pembuka
  if (labels.opening) {
    doc.setFont('helvetica', 'normal');
    doc.text(labels.opening, MARGIN, y);
    y += 9;
  }

  // Isi surat: tiap paragraf dibungkus rapi ke lebar halaman, dipisah spasi antar paragraf
  doc.setFontSize(10.5);
  bodyParagraphs.forEach((para) => {
    const lines = doc.splitTextToSize(para.trim(), CONTENT_WIDTH);
    lines.forEach((line) => {
      if (y > 270) {
        doc.addPage();
        y = MARGIN;
      }
      doc.text(line, MARGIN, y);
      y += LINE_HEIGHT;
    });
    y += 4; // jarak antar paragraf
  });

  // Penutup & tanda tangan
  y += 6;
  // Perkirakan ruang yang dibutuhkan: label penutup + (gambar tanda tangan ATAU ruang kosong) + nama
  const spaceNeeded = signatureDataUrl ? 34 : 24;
  if (y + spaceNeeded > 280) {
    doc.addPage();
    y = MARGIN;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.text(labels.closingWord, MARGIN, y);
  y += 8;

  if (signatureDataUrl) {
    // Tanam gambar tanda tangan digital langsung ke PDF -- user tidak perlu
    // cetak-tandatangan manual-scan ulang. Ukuran dijaga proporsional & wajar
    // untuk tanda tangan (bukan gambar besar sembarangan).
    try {
      const sigWidth = 45;
      const sigHeight = 18;
      doc.addImage(signatureDataUrl, 'PNG', MARGIN, y, sigWidth, sigHeight);
      y += sigHeight + 2;
    } catch (e) {
      // Kalau gambar gagal ditanam (format tidak valid dsb), tetap lanjut
      // tanpa bikin seluruh proses unduh PDF gagal -- cukup sisakan ruang kosong.
      console.warn('Gagal menanam tanda tangan ke PDF:', e.message);
      y += 18;
    }
  } else {
    y += 18; // ruang kosong untuk tanda tangan fisik/manual
  }

  doc.setFont('helvetica', 'bold');
  doc.text(candidateName || '', MARGIN, y);

  return doc;
}

/**
 * Helper langsung-pakai: bangun PDF lalu langsung trigger download di browser.
 */
export function downloadCoverLetterPDF(params, fileName = 'Surat_Lamaran.pdf') {
  const doc = buildCoverLetterPDF(params);
  doc.save(fileName);
}