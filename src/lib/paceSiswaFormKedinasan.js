// ============================================================
//  Konfigurasi Form Pendaftaran Siswa PACE
//  (PROGRAM PERSIAPAN SEKOLAH KEDINASAN)
//  Mengikuti struktur formulir resmi:
//  A. Identitas Calon Peserta
//  B. Identitas dan Status Orang Asli Papua (OAP)
//  C. Riwayat Pendidikan Formal
//  D. Rencana Pilihan Sekolah Kedinasan
//  E. Data Kesiapan Akademik dan Seleksi
//  F. Data Bimbingan Belajar (Bimbel)
//  G. Kondisi Sosial Ekonomi Keluarga
//  H. Riwayat Bantuan Pendidikan
//  I. Pernyataan Kesanggupan Peserta (unduh -> isi -> unggah)
//  Lampiran: Daftar Periksa Dokumen
//
//  Seluruh field disimpan flat pada kolom JSON `data_pendaftaran`.
// ============================================================

// Konstanta bersama (sama dengan SLB) diimpor ulang agar satu sumber kebenaran
export {
  JENIS_KELAMIN, AGAMA, PENGHASILAN, STATUS_RUMAH, STATUS_OAP, YA_TIDAK_VERIFIKASI,
} from './paceSiswaForm';

// A.13 Status tempat tinggal calon peserta
export const STATUS_TINGGAL_KEDINASAN = [
  'Bersama orang tua',
  'Bersama wali/keluarga',
  'Asrama',
  'Kos/kontrakan',
  'Lainnya',
];

// B.4 Dokumen pendukung status OAP
export const DASAR_OAP_KEDINASAN = [
  'Kartu Keluarga (KK)',
  'Akta Kelahiran',
  'Surat keterangan dari pihak berwenang sesuai ketentuan',
  'Dokumen pendukung lain yang sah',
];

// C.1 Status pendidikan saat mendaftar
export const STATUS_PENDIDIKAN = [
  'Siswa kelas XII SMA/MA',
  'Siswa kelas XII SMK',
  'Lulusan SMA/MA',
  'Lulusan SMK',
  'Lulusan Paket C',
  'Lainnya sesuai persyaratan sekolah kedinasan',
];

// D.8 Persyaratan khusus sekolah kedinasan
export const PERSYARATAN_KHUSUS = [
  'Persyaratan akademik',
  'Persyaratan kesehatan',
  'Persyaratan kesamaptaan/kebugaran jasmani',
  'Persyaratan psikotes',
  'Persyaratan administrasi',
  'Persyaratan lainnya',
];

// E.1 Mata pelajaran/kemampuan yang perlu ditingkatkan
export const MAPEL_DITINGKATKAN = [
  'Matematika',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'Penalaran umum dan kemampuan dasar',
  'Pengetahuan umum/wawasan kebangsaan',
  'Kemampuan akademik lainnya sesuai seleksi',
  'Lainnya',
];

export const PERNAH_TIDAK = ['Belum pernah', 'Pernah'];
export const YA_BELUM = ['Ya', 'Belum'];

// E.6 Kendala utama dalam persiapan seleksi
export const KENDALA_PERSIAPAN = [
  'Keterbatasan akses bimbingan belajar',
  'Keterbatasan biaya persiapan',
  'Keterbatasan akses internet atau bahan belajar',
  'Kesulitan pada materi akademik',
  'Kebutuhan latihan fisik/kesamaptaan',
  'Kendala lainnya',
];

// F.1 Status keikutsertaan bimbel
export const STATUS_BIMBEL = [
  'Belum mengikuti bimbel',
  'Sudah mengikuti bimbel',
  'Menunggu penempatan melalui program',
];

// F.6 Metode pembelajaran
export const METODE_BIMBEL = ['Tatap muka', 'Daring', 'Campuran (hybrid)'];

// F.7 Materi persiapan yang dibutuhkan
export const MATERI_BIMBEL = [
  'Tes kemampuan akademik',
  'Penalaran dan kemampuan dasar',
  'Wawasan kebangsaan atau materi lain sesuai seleksi',
  'Psikotes, apabila dipersyaratkan',
  'Latihan kesamaptaan/kebugaran jasmani, apabila relevan',
  'Simulasi/tryout seleksi',
  'Bimbingan administrasi pendaftaran sekolah kedinasan',
  'Materi lain sesuai persyaratan sekolah kedinasan',
];

// F.8 Kesediaan mengikuti jadwal bimbel
export const BERSEDIA_JADWAL = ['Ya', 'Tidak', 'Memerlukan penyesuaian jadwal'];

// G.9 Dokumen pendukung kondisi ekonomi
export const DOKUMEN_EKONOMI_KEDINASAN = [
  'Surat keterangan dari pihak berwenang',
  'Data pada basis data sosial ekonomi pemerintah',
  'Dokumen pendukung lainnya',
  'Belum tersedia',
];

// H.5 Bantuan membiayai komponen bimbel yang sama
export const BIAYAI_BIMBEL = ['Tidak', 'Ya', 'Belum diketahui'];

// Daftar periksa dokumen (Lampiran) Kedinasan. `key` = field pada data_pendaftaran.dokumen
export const LAMPIRAN_DOKUMEN_KEDINASAN = [
  { key: 'formulir', label: 'Formulir pendaftaran yang telah diisi lengkap', req: true },
  { key: 'kk', label: 'Fotokopi Kartu Keluarga (KK)', req: true },
  { key: 'ktp', label: 'Fotokopi KTP atau identitas calon peserta sesuai ketentuan', req: true },
  { key: 'akta', label: 'Fotokopi Akta Kelahiran, jika tersedia atau dipersyaratkan', req: false },
  { key: 'dok_oap', label: 'Dokumen pendukung status OAP sesuai mekanisme verifikasi', req: false },
  { key: 'sk_aktif', label: 'Surat keterangan siswa aktif dari sekolah, bagi calon peserta yang masih bersekolah', req: false },
  { key: 'ijazah', label: 'Fotokopi ijazah atau surat keterangan lulus, bagi lulusan', req: false },
  { key: 'rapor', label: 'Fotokopi rapor atau dokumen nilai akademik terakhir', req: true },
  { key: 'pasfoto', label: 'Pasfoto terbaru sesuai ketentuan pendaftaran', req: true },
  // "Surat pernyataan kesanggupan mengikuti program" dikelola terpisah pada bagian I
  { key: 'surat_ortu', label: 'Surat pernyataan orang tua/wali, apabila dipersyaratkan', req: false },
  { key: 'sk_ekonomi', label: 'Dokumen pendukung kondisi sosial ekonomi, jika dipersyaratkan', req: false },
  { key: 'surat_bantuan_ganda', label: 'Surat pernyataan tidak menerima bantuan ganda, apabila dipersyaratkan', req: false },
  { key: 'hasil_tryout', label: 'Hasil tryout atau tes diagnostik, jika tersedia atau dipersyaratkan', req: false },
  { key: 'dok_lain', label: 'Dokumen tambahan sesuai petunjuk teknis Beasiswa PACE Tahun Anggaran 2027', req: false },
];

// State awal form (nested sesuai bagian A-I)
export const initialFormKedinasan = () => ({
  identitas: {
    nama: '', nik: '', nisn: '', tempat_lahir: '', tanggal_lahir: '',
    jenis_kelamin: '', agama: '',
    alamat: '', kampung_kelurahan: '', distrik_kecamatan: '', kabupaten_kota: '',
    no_hp: '', email: '', status_tinggal: '', status_tinggal_lain: '',
  },
  oap: {
    status: '', asal_suku: '', asal_kampung: '',
    dasar_dokumen: [], dasar_dokumen_lain: '', keterangan: '',
  },
  pendidikan: {
    status_pendidikan: '', status_pendidikan_lain: '', nama_sekolah: '', npsn: '',
    alamat: '', kabupaten_kota: '', tahun_masuk: '', tahun_lulus: '', jurusan: '',
    rata_rapor: '', rata_ijazah: '', prestasi: '', mengikuti_pt: '', nama_pt: '',
  },
  rencana_kedinasan: {
    pilihan_1: '', prodi_1: '', pilihan_2: '', prodi_2: '', pilihan_3: '',
    alasan: '', mempelajari_persyaratan: '', persyaratan_khusus: [], persyaratan_lain: '',
  },
  kesiapan: {
    mapel: [], mapel_lain: '', pernah_tryout: '', tryout_hasil: '',
    diagnostik_nilai: '', diagnostik_tanggal: '', diagnostik_penyelenggara: '',
    pengalaman_seleksi: '', pengalaman_detail: '', kendala: [], kendala_lain: '',
    uraian_motivasi: '',
  },
  bimbel: {
    status: '', nama_lembaga: '', alamat: '', penanggung_jawab: '',
    periode_mulai: '', periode_selesai: '', metode: [], materi: [],
    bersedia_jadwal: '', keterangan: '',
  },
  sosial_ekonomi: {
    nama_ayah: '', pekerjaan_ayah: '', nama_ibu: '', pekerjaan_ibu: '',
    nama_wali: '', hubungan_wali: '', penghasilan: '',
    jml_tanggungan: '', jml_bersekolah: '', status_tinggal: '', status_tinggal_lain: '',
    kurang_mampu: '', dokumen_ekonomi: [], dokumen_ekonomi_lain: '', uraian_kondisi: '',
  },
  bantuan: {
    menerima: '', nama_program: '', sumber: '', periode_besaran: '',
    biayai_bimbel: '', keterangan: '',
  },
  pernyataan: { nama: '', nik: '', alamat: '', tempat: '', tanggal: '' },
  dokumen: {}, // key -> url (hasil upload)
});

// Bangun isi Surat Pernyataan Kesanggupan Peserta (bagian I) sebagai HTML (.doc)
export function buildPernyataanKedinasanHtml(form) {
  const p = form?.pernyataan || {};
  const nama = p.nama || form?.identitas?.nama || '________________';
  const nik = p.nik || form?.identitas?.nik || '________________';
  const alamat = p.alamat || form?.identitas?.alamat || '________________';
  const tempat = p.tempat || form?.identitas?.kabupaten_kota || '________________';
  const tanggal = p.tanggal || '________________';

  return `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Surat Pernyataan Kesanggupan Peserta</title>
<style>
  body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
  h2 { text-align: center; text-transform: uppercase; letter-spacing: 1px; }
  h3 { text-align: center; margin-top: 0; }
  .underline { text-decoration: underline; }
  table.ttd { margin-top: 32px; width: 100%; }
  td.right { text-align: left; padding-left: 280px; }
</style></head>
<body>
  <h2>Surat Pernyataan Kesanggupan Peserta</h2>
  <h3>Pendaftaran Beasiswa PACE Program Persiapan Sekolah Kedinasan</h3>
  <p>Saya yang bertanda tangan di bawah ini:</p>
  <table>
    <tr><td width="180">Nama lengkap</td><td width="10">:</td><td>${nama}</td></tr>
    <tr><td>NIK</td><td>:</td><td>${nik}</td></tr>
    <tr><td>Alamat</td><td>:</td><td>${alamat}</td></tr>
  </table>
  <p>Dengan ini menyatakan bahwa:</p>
  <ol>
    <li>Seluruh data dan dokumen yang disampaikan dalam pendaftaran Beasiswa PACE adalah benar dan dapat dipertanggungjawabkan.</li>
    <li>Saya bersedia mengikuti seluruh tahapan seleksi, verifikasi, dan penempatan peserta sesuai ketentuan program.</li>
    <li>Saya bersedia mengikuti kegiatan bimbingan belajar, tryout, evaluasi, dan kegiatan pendukung lainnya sesuai jadwal yang ditetapkan.</li>
    <li>Saya bersedia menaati tata tertib penyelenggara bimbingan belajar dan menjaga nama baik Pemerintah Provinsi Papua.</li>
    <li>Saya bersedia mempersiapkan dan mengikuti seleksi sekolah kedinasan sesuai persyaratan instansi yang dituju.</li>
    <li>Saya bersedia memberikan informasi yang benar mengenai status OAP, riwayat pendidikan, kondisi sosial ekonomi, serta bantuan lain yang diterima.</li>
    <li>Saya tidak akan menyampaikan dokumen palsu atau informasi yang menyesatkan dalam seleksi sekolah kedinasan.</li>
    <li>Saya memahami bahwa keikutsertaan dalam bimbingan belajar tidak menjamin kelulusan dalam seleksi sekolah kedinasan.</li>
    <li>Saya memahami bahwa pendaftaran tidak secara otomatis menjamin penetapan sebagai penerima Beasiswa PACE.</li>
    <li>Saya bersedia mengikuti pemantauan dan evaluasi program serta memberikan laporan perkembangan apabila diminta secara sah.</li>
    <li>Saya memberikan persetujuan agar data yang diperlukan dapat diproses oleh Dinas Pendidikan Provinsi Papua dan petugas berwenang untuk keperluan pendaftaran, verifikasi, seleksi, penempatan, pemantauan, dan pelaporan sesuai ketentuan perlindungan data pribadi.</li>
  </ol>
  <p>Demikian pernyataan ini dibuat dengan sebenar-benarnya untuk digunakan sebagaimana mestinya.</p>
  <table class="ttd">
    <tr><td></td><td class="right">${tempat}, ${tanggal}</td></tr>
  </table>
  <table style="width:100%; margin-top:24px;">
    <tr>
      <td width="50%">Calon Peserta,<br/><br/><br/>( <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span> )<br/>Nama jelas: ${nama}</td>
      <td width="50%">Orang Tua/Wali,<br/><em>(jika belum dewasa atau dipersyaratkan)</em><br/><br/>( <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span> )<br/>Nama jelas: ________________</td>
    </tr>
  </table>
</body></html>`;
}
