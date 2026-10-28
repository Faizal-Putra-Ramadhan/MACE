// ============================================================
//  Konfigurasi Form Pendaftaran Siswa PACE
//  (PROGRAM SISWA ATLET BERPRESTASI / PPLP)
//  Mengikuti struktur formulir resmi:
//  A. Identitas Peserta Didik/Atlet
//  B. Identitas Orang Tua/Wali
//  C. Data Status Orang Asli Papua (OAP)
//  D. Data Pendidikan Formal
//  E. Data Keanggotaan dan Pembinaan PPLP
//  F. Data Cabang Olahraga dan Prestasi
//  G. Kondisi Sosial Ekonomi Keluarga
//  H. Rencana Pemanfaatan Beasiswa
//  I. Informasi Bantuan Pendidikan Lain
//  J. Data Rekening Penerima
//  K. Pernyataan Peserta Didik/Atlet dan Orang Tua/Wali (unduh -> isi -> unggah)
//  L. Rekomendasi Pelatih dan Verifikasi Pengelola PPLP
//  Lampiran: Daftar Periksa Dokumen
//
//  Seluruh field disimpan flat pada kolom JSON `data_pendaftaran`.
// ============================================================

// Konstanta bersama (sama dengan SLB) diimpor ulang agar satu sumber kebenaran
export {
  JENIS_KELAMIN, AGAMA, PENGHASILAN, STATUS_RUMAH, STATUS_OAP, YA_TIDAK_VERIFIKASI, JENIS_REKENING,
} from './paceSiswaForm';

// A.13 Status tempat tinggal selama pembinaan PPLP
export const STATUS_TINGGAL_PPLP = [
  'Bersama orang tua/wali',
  'Asrama PPLP',
  'Kos/kontrakan',
  'Lainnya',
];

// C.4 Dokumen pendukung status OAP
export const DASAR_OAP_ATLIT = [
  'Kartu Keluarga (KK)',
  'Akta Kelahiran',
  'Surat keterangan dari pihak berwenang sesuai ketentuan',
  'Dokumen pendukung lain yang sah',
];

// D.5 Jenjang pendidikan
export const JENJANG_ATLIT = ['SD/MI', 'SMP/MTs', 'SMA/MA', 'SMK', 'Pendidikan kesetaraan', 'Lainnya'];

// D.8 Status peserta didik
export const STATUS_PESERTA_ATLIT = ['Aktif', 'Sedang diverifikasi'];

// E.1 Status keanggotaan/pembinaan
export const STATUS_KEANGGOTAAN_PPLP = [
  'Atlet aktif PPLP Provinsi Papua',
  'Lainnya sesuai ketentuan program',
];

// E.9 Status pembinaan
export const STATUS_PEMBINAAN = ['Aktif', 'Persiapan kejuaraan', 'Pemulihan cedera', 'Lainnya'];

// E.10 / F.5 Ada / Tidak
export const ADA_BELUM = ['Ada', 'Belum ada'];
export const BUKTI_PRESTASI = ['Ada', 'Tidak ada'];

// F.3 Kategori pertandingan
export const KATEGORI_OLAH = ['Perorangan', 'Beregu', 'Ganda/pasangan', 'Lainnya'];

// F.4 Tingkat kompetisi yang pernah diikuti
export const TINGKAT_KOMPETISI = ['Kabupaten/Kota', 'Provinsi', 'Nasional', 'Internasional'];

// F.6 Keikutsertaan seleksi/pemusatan latihan
export const SELEKASI_PEMUSATAN = [
  'Seleksi tingkat daerah',
  'Pemusatan latihan daerah',
  'Seleksi tingkat nasional',
  'Pemusatan latihan nasional',
  'Lainnya',
];

// G.1 Pekerjaan utama orang tua/wali
export const PEKERJAAN_ORTU_ATLIT = [
  'Petani/pekebun',
  'Nelayan',
  'PNS/ASN',
  'TNI/Polri',
  'Pegawai swasta',
  'Wiraswasta/pedagang',
  'Buruh',
  'Tidak bekerja',
  'Lainnya',
];

// G.7 Dokumen pendukung kondisi ekonomi
export const DOKUMEN_EKONOMI_ATLIT = [
  'Surat keterangan dari pihak berwenang',
  'Data pada basis data sosial ekonomi pemerintah',
  'Dokumen pendukung lainnya',
  'Belum tersedia',
];

// H. Kebutuhan yang relevan
export const KEBUTUHAN_ATLIT = [
  'Perlengkapan pendidikan',
  'Buku dan bahan pembelajaran',
  'Seragam atau perlengkapan sekolah',
  'Peralatan olahraga yang diperbolehkan dalam komponen bantuan',
  'Kebutuhan pendukung pendidikan dan pembinaan atlet sesuai juknis',
  'Transportasi pendidikan, apabila diperbolehkan',
  'Kebutuhan lain sesuai ketentuan',
];

// I.5 Bantuan membiayai komponen yang sama
export const BIAYAI_SAMA = ['Tidak', 'Ya', 'Belum diketahui'];

// L.1 Pernyataan pelatih (multi)
export const PELATIH_PERNYATAAN = [
  'Aktif mengikuti latihan',
  'Menunjukkan potensi dan perkembangan olahraga',
  'Memiliki prestasi yang dapat dibuktikan',
  'Memerlukan verifikasi lanjutan',
];

// L.2 Opsi hasil verifikasi pengelola PPLP
export const VERIF_IDENTITAS = ['Sesuai', 'Perlu perbaikan'];
export const VERIF_STATUS_PEMBINAAN = ['Terverifikasi', 'Belum terverifikasi'];
export const VERIF_PENDIDIKAN = ['Terverifikasi', 'Belum terverifikasi', 'Tidak ada dokumen'];
export const VERIF_PRESTASI = ['Terverifikasi', 'Belum terverifikasi', 'Tidak ada dokumen'];
export const VERIF_OAP = ['Terverifikasi OAP', 'Belum terverifikasi', 'Non-OAP'];
export const VERIF_KELENGKAPAN = ['Lengkap', 'Belum lengkap'];

// Daftar periksa dokumen (Lampiran) Atlit. `key` = field pada data_pendaftaran.dokumen
export const LAMPIRAN_DOKUMEN_ATLIT = [
  { key: 'formulir', label: 'Formulir pendaftaran yang telah diisi lengkap', req: true },
  { key: 'kk', label: 'Fotokopi Kartu Keluarga (KK)', req: true },
  { key: 'akta', label: 'Fotokopi Akta Kelahiran atau identitas pendukung peserta didik, jika tersedia', req: false },
  { key: 'sk_aktif', label: 'Surat keterangan aktif sebagai peserta didik dari kepala sekolah', req: true },
  { key: 'dok_oap', label: 'Dokumen pendukung status OAP sesuai ketentuan verifikasi', req: false },
  { key: 'sk_atlet', label: 'Surat keterangan atlet aktif dari pengelola PPLP', req: true },
  { key: 'rekomendasi_pelatih', label: 'Surat rekomendasi pelatih dan/atau pengelola PPLP', req: false },
  { key: 'bukti_prestasi', label: 'Sertifikat, piagam, surat keputusan, atau bukti prestasi olahraga yang relevan', req: true },
  { key: 'rapor', label: 'Rapor terakhir, apabila dipersyaratkan', req: false },
  { key: 'sk_ekonomi', label: 'Dokumen pendukung kondisi sosial ekonomi keluarga, jika dipersyaratkan', req: false },
  // "Surat pernyataan peserta didik dan orang tua/wali" dikelola terpisah pada bagian K
  { key: 'surat_bantuan_ganda', label: 'Surat pernyataan tidak menerima bantuan ganda, apabila dipersyaratkan', req: false },
  { key: 'dok_rekening', label: 'Dokumen rekening penerima, apabila dipersyaratkan', req: false },
  { key: 'dok_lain', label: 'Dokumen lain sesuai petunjuk teknis Beasiswa PACE Tahun Anggaran 2027', req: false },
];

// Struktur satu blok prestasi (F.5)
const kosongPrestasi = () => ({
  nama_kejuaraan: '', tingkat: '', tahun: '', nomor_cabang: '', hasil: '', penyelenggara: '', bukti: '',
});

// State awal form (nested sesuai bagian A-L)
export const initialFormAtlit = () => ({
  identitas: {
    nama: '', nik: '', nisn: '', tempat_lahir: '', tanggal_lahir: '',
    jenis_kelamin: '', agama: '',
    alamat: '', kampung_kelurahan: '', distrik_kecamatan: '', kabupaten_kota: '',
    no_hp_siswa: '', no_hp_ortu: '', status_tinggal: '', status_tinggal_lain: '',
  },
  orang_tua: {
    ayah: { nama: '', nik: '', pekerjaan: '', pendidikan: '', telepon: '' },
    ibu: { nama: '', nik: '', pekerjaan: '', pendidikan: '', telepon: '' },
    wali: { nama: '', hubungan: '', nik: '', pekerjaan: '', alamat: '', telepon: '' },
  },
  oap: {
    status: '', asal_suku: '', asal_kampung: '',
    dasar_dokumen: [], dasar_dokumen_lain: '', keterangan: '',
  },
  pendidikan: {
    nama_sekolah: '', npsn: '', alamat: '', kabupaten_kota: '',
    jenjang: '', jenjang_lain: '', kelas: '', tahun_masuk: '', status_didik: '',
    rata_rapor: '', prestasi_nonakademik: '', nama_kepala_sekolah: '', telepon_sekolah: '',
  },
  pplp: {
    status_keanggotaan: '', status_lain: '', nama_program: '', tanggal_mulai: '',
    pelatih_utama: '', telepon_pelatih: '', pelatih_pendamping: '', lokasi_latihan: '', jadwal_latihan: '',
    status_pembinaan: '', status_pembinaan_lain: '', surat_atlet_aktif: '',
  },
  olahraga: {
    cabang_utama: '', nomor_lomba: '', kategori: '', kategori_lain: '',
    tingkat_kompetisi: [],
    prestasi_1: kosongPrestasi(), prestasi_2: kosongPrestasi(), prestasi_3: kosongPrestasi(),
    seleksi_pemusatan: [], seleksi_pemusatan_lain: '',
    target_prestasi: '', rekomendasi_pelatih: '',
  },
  sosial_ekonomi: {
    pekerjaan_ortu: '', pekerjaan_ortu_lain: '', penghasilan: '',
    jml_tanggungan: '', jml_anak_sekolah: '', status_tinggal: '', status_tinggal_lain: '',
    kurang_mampu: '', dokumen_ekonomi: [], dokumen_ekonomi_lain: '', keterangan: '',
  },
  rencana_beasiswa: { kebutuhan: [], kebutuhan_lain: '', uraian_prioritas: '', target_pendidikan: '' },
  bantuan: { menerima: '', nama_program: '', sumber: '', periode_besaran: '', biayai_sama: '', keterangan: '' },
  rekening: { pemilik: '', nama_bank: '', nomor_rekening: '', hubungan: '', jenis: '' },
  pernyataan: { nama_siswa: '', nama_ortu: '', hubungan: '', tempat: '', tanggal: '' },
  verifikasi: {
    pelatih_pernyataan: [], catatan_pelatih: '', nama_pelatih: '', cabang_olahraga: '', tanggal_pelatih: '',
    nama_pengelola: '', jabatan: '',
    v_identitas: '', v_status_pembinaan: '', v_pendidikan: '', v_prestasi: '', v_status_oap: '', v_kelengkapan: '',
    catatan_verifikasi: '', tempat: '', tanggal: '', nama_operator: '', nama_pejabat: '',
  },
  dokumen: {}, // key -> url (hasil upload)
});

// Bangun isi Surat Pernyataan Peserta Didik/Atlet dan Orang Tua/Wali (bagian K) sebagai HTML (.doc)
export function buildPernyataanAtlitHtml(form) {
  const p = form?.pernyataan || {};
  const ayah = form?.orang_tua?.ayah || {};
  const wali = form?.orang_tua?.wali || {};
  const siswa = p.nama_siswa || form?.identitas?.nama || '________________';
  const namaOrtu = p.nama_ortu || ayah.nama || wali.nama || '________________';
  const hubungan = p.hubungan || 'Orang Tua/Wali';
  const tempat = p.tempat || form?.identitas?.kabupaten_kota || '________________';
  const tanggal = p.tanggal || '________________';

  return `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Surat Pernyataan Peserta Didik/Atlet dan Orang Tua/Wali</title>
<style>
  body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
  h2 { text-align: center; text-transform: uppercase; letter-spacing: 1px; }
  h3 { text-align: center; margin-top: 0; }
  .underline { text-decoration: underline; }
  table.ttd { margin-top: 32px; width: 100%; }
  td.right { text-align: left; padding-left: 280px; }
</style></head>
<body>
  <h2>Pernyataan Peserta Didik/Atlet dan Orang Tua/Wali</h2>
  <h3>Pendaftaran Beasiswa PACE bagi Siswa Atlit Berprestasi (PPLP)</h3>
  <p>Saya yang bertanda tangan di bawah ini:</p>
  <table>
    <tr><td width="260">Nama peserta didik/atlet</td><td width="10">:</td><td>${siswa}</td></tr>
    <tr><td>Nama orang tua/wali</td><td>:</td><td>${namaOrtu}</td></tr>
    <tr><td>Hubungan dengan peserta didik/atlet</td><td>:</td><td>${hubungan}</td></tr>
  </table>
  <p>Dengan ini menyatakan bahwa:</p>
  <ol>
    <li>Seluruh data dan dokumen yang disampaikan dalam pendaftaran Beasiswa PACE adalah benar dan dapat dipertanggungjawabkan.</li>
    <li>Peserta didik/atlet benar terdaftar pada satuan pendidikan yang dicantumkan dalam formulir, sesuai hasil verifikasi sekolah.</li>
    <li>Data mengenai keanggotaan PPLP, cabang olahraga, prestasi, dan status pembinaan dapat diverifikasi oleh petugas yang berwenang.</li>
    <li>Saya bersedia melengkapi dokumen yang diperlukan apabila terdapat kekurangan berkas.</li>
    <li>Saya bersedia memberikan informasi yang benar mengenai status OAP, kondisi sosial ekonomi, dan bantuan pendidikan lain yang diterima.</li>
    <li>Saya tidak akan menyampaikan dokumen palsu atau informasi yang menyesatkan dalam proses pendaftaran.</li>
    <li>Saya memahami bahwa pendaftaran tidak secara otomatis menjamin penetapan sebagai penerima Beasiswa PACE.</li>
    <li>Apabila ditetapkan sebagai penerima, bantuan akan dimanfaatkan sesuai tujuan dan komponen bantuan yang ditetapkan dalam petunjuk teknis.</li>
    <li>Saya bersedia mengikuti ketentuan program serta proses pemantauan dan evaluasi yang sah.</li>
    <li>Saya memberikan persetujuan agar data yang diperlukan dapat diproses oleh Dinas Pendidikan Provinsi Papua dan petugas yang berwenang untuk pendaftaran, verifikasi, seleksi, penetapan, penyaluran, pemantauan, dan pelaporan sesuai ketentuan perlindungan data pribadi.</li>
  </ol>
  <p>Demikian pernyataan ini dibuat dengan sebenar-benarnya untuk digunakan sebagaimana mestinya.</p>
  <table class="ttd">
    <tr><td></td><td class="right">${tempat}, ${tanggal}</td></tr>
  </table>
  <table style="width:100%; margin-top:24px;">
    <tr>
      <td width="50%">Peserta Didik/Atlet,<br/><br/><br/>( <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span> )<br/>Nama jelas: ${siswa}</td>
      <td width="50%">Orang Tua/Wali,<br/><br/><br/>( <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span> )<br/>Nama jelas: ${namaOrtu}</td>
    </tr>
  </table>
</body></html>`;
}
