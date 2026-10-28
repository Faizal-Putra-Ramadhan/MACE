// ============================================================
//  Konfigurasi Form Pendaftaran Siswa PACE (SNK / Sekolah Negeri Khusus)
//  Mengikuti struktur formulir resmi:
//  A. Identitas Peserta Didik
//  B. Data Satuan Pendidikan
//  C. Data Status Orang Asli Papua (OAP)
//  D. Identitas Orang Tua/Wali
//  E. Kondisi Sosial Ekonomi Keluarga
//  F. Rencana Penggunaan Beasiswa
//  G. Data Rekening Penerima
//  H. Pernyataan Peserta Didik dan Orang Tua/Wali (unduh -> isi -> unggah)
//  I. Verifikasi Operator Dinas
//  Lampiran: Daftar Periksa Dokumen
//
//  Seluruh field disimpan flat pada kolom JSON `data_pendaftaran`.
// ============================================================

// Konstanta yang sama dengan SLB diimpor ulang agar satu sumber kebenaran
export {
  JENIS_KELAMIN, AGAMA, PENGHASILAN, JENIS_REKENING, STATUS_RUMAH, STATUS_OAP,
} from './paceSiswaForm';

// A.13 Status tempat tinggal peserta didik saat ini
export const STATUS_TINGGAL_SNK = [
  'Bersama orang tua',
  'Bersama wali/keluarga',
  'Asrama',
  'Kos/kontrakan',
  'Lainnya',
];

// B.5 Jenjang pendidikan SNK
export const JENJANG_SNK = [
  'Pendidikan menengah kejuruan',
  'Jenjang/bentuk pendidikan lainnya sesuai izin operasional',
];

// B.9 Status peserta didik
export const STATUS_PESERTA_SNK = ['Aktif', 'Status aktif sedang diverifikasi'];

// C.4 Dokumen pendukung status OAP
export const DASAR_OAP_SNK = [
  'Kartu Keluarga (KK)',
  'Akta Kelahiran',
  'Surat keterangan dari pihak berwenang sesuai ketentuan',
  'Dokumen pendukung lain yang sah',
];

// E.1 Pekerjaan utama orang tua/wali
export const PEKERJAAN_ORTU_SNK = [
  'Petani/pekebun',
  'Nelayan',
  'PNS/ASN',
  'TNI/Polri',
  'Pegawai swasta',
  'Wiraswasta/pedagang',
  'Buruh',
  'Tidak bekerja',
  'Pekerjaan lainnya',
];

// E.7 Dokumen pendukung kondisi ekonomi
export const DOKUMEN_EKONOMI = [
  'Surat keterangan kondisi ekonomi dari pihak berwenang',
  'Data pada basis data sosial ekonomi pemerintah',
  'Dokumen pendukung lain yang sah',
  'Belum tersedia',
];

// F. Kebutuhan pendidikan yang dihadapi peserta didik
export const KEBUTUHAN_BEASISWA = [
  'Perlengkapan dan kebutuhan pembelajaran',
  'Seragam atau pakaian praktik',
  'Peralatan praktik sesuai program keahlian',
  'Buku dan bahan pembelajaran',
  'Transportasi ke sekolah',
  'Kebutuhan tempat tinggal/asrama, apabila diperbolehkan',
  'Kebutuhan pendidikan lainnya sesuai ketentuan',
];

// I. Opsi hasil verifikasi operator
export const VERIF_IDENTITAS = ['Sesuai', 'Perlu perbaikan'];
export const VERIF_STATUS_AKTIF = ['Terverifikasi', 'Belum terverifikasi'];
export const VERIF_KETUASAN = ['Sesuai', 'Perlu klarifikasi'];
export const VERIF_OAP = ['Terverifikasi OAP', 'Belum terverifikasi', 'Non-OAP'];
export const VERIF_KELENGKAPAN = ['Lengkap', 'Belum lengkap', 'Memerlukan verifikasi lanjutan'];

// Daftar periksa dokumen (Lampiran) SNK. `key` = field pada data_pendaftaran.dokumen
export const LAMPIRAN_DOKUMEN_SNK = [
  { key: 'formulir', label: 'Formulir pendaftaran yang telah diisi lengkap', req: true },
  { key: 'kk', label: 'Fotokopi Kartu Keluarga (KK)', req: true },
  { key: 'akta', label: 'Fotokopi Akta Kelahiran, jika tersedia atau dipersyaratkan', req: false },
  { key: 'identitas_siswa', label: 'Identitas peserta didik sesuai dokumen yang tersedia', req: true },
  { key: 'sk_aktif', label: 'Surat keterangan aktif sebagai peserta didik dari kepala sekolah', req: true },
  { key: 'dok_oap', label: 'Dokumen pendukung status OAP sesuai ketentuan verifikasi', req: false },
  { key: 'rapor', label: 'Fotokopi rapor atau rekam nilai terakhir, jika dipersyaratkan', req: false },
  { key: 'prestasi', label: 'Dokumen prestasi akademik/nonakademik yang menjadi kriteria seleksi', req: false },
  { key: 'sk_ekonomi', label: 'Dokumen pendukung kondisi sosial ekonomi keluarga, jika dipersyaratkan', req: false },
  // item "Surat pernyataan peserta didik dan orang tua/wali" dikelola terpisah pada bagian H
  { key: 'dok_rekening', label: 'Dokumen rekening penerima, apabila dipersyaratkan', req: false },
  { key: 'surat_bantuan_ganda', label: 'Surat pernyataan tidak menerima bantuan ganda, apabila dipersyaratkan dalam juknis', req: false },
  { key: 'dok_lain', label: 'Dokumen lain sesuai petunjuk teknis Beasiswa PACE Tahun Anggaran 2027', req: false },
];

// State awal form (nested sesuai bagian A-I)
export const initialFormSnk = () => ({
  identitas: {
    nama: '', nisn: '', nik: '', tempat_lahir: '', tanggal_lahir: '',
    jenis_kelamin: '', agama: '',
    alamat: '', kampung_kelurahan: '', distrik_kecamatan: '', kabupaten_kota: '',
    no_hp_siswa: '', no_hp_ortu: '', status_tinggal: '', status_tinggal_lain: '',
  },
  satuan_pendidikan: {
    nama_sekolah: '', npsn: '', alamat: '', kabupaten_kota: '',
    jenjang: '', jenjang_lain: '', program_keahlian: '', kelas: '', tahun_masuk: '',
    status_didik: '', rata_rapor: '', prestasi: '',
    menerima_bantuan: '', nama_bantuan: '', sumber_bantuan: '', periode_bantuan: '',
  },
  oap: {
    status: '', asal_suku: '', asal_kampung: '',
    dasar_dokumen: [], dasar_dokumen_lain: '', keterangan: '',
  },
  orang_tua: {
    ayah: { nama: '', nik: '', pekerjaan: '', pendidikan: '', telepon: '' },
    ibu: { nama: '', nik: '', pekerjaan: '', pendidikan: '', telepon: '' },
    wali: { nama: '', hubungan: '', nik: '', pekerjaan: '', alamat: '', telepon: '' },
  },
  sosial_ekonomi: {
    pekerjaan_ortu: '', pekerjaan_ortu_lain: '', penghasilan: '',
    jml_tanggungan: '', jml_anak_sekolah: '',
    status_tinggal: '', status_tinggal_lain: '', kurang_mampu: '',
    dokumen_ekonomi: [], dokumen_ekonomi_lain: '', penjelasan: '',
  },
  rencana_beasiswa: { kebutuhan: [], kebutuhan_lain: '', uraian: '' },
  rekening: { pemilik: '', nama_bank: '', nomor_rekening: '', hubungan: '', jenis: '' },
  pernyataan: { nama_siswa: '', nama_ortu: '', hubungan: '', tempat: '', tanggal: '' },
  verifikasi: {
    nama_sekolah: '', nama_operator: '', nip: '', jabatan: '',
    identitas_sesuai: '', status_aktif: '', kesesuaian_sekolah: '', status_oap: '', kelengkapan_dokumen: '',
    catatan: '', tempat: '', tanggal: '', nama_operator_ttd: '', nama_kepala_sekolah: '',
  },
  dokumen: {}, // key -> url (hasil upload)
});

// Bangun isi Surat Pernyataan Peserta Didik dan Orang Tua/Wali (bagian H) sebagai HTML (.doc)
export function buildPernyataanSnkHtml(form) {
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
<head><meta charset="utf-8"><title>Surat Pernyataan Peserta Didik dan Orang Tua/Wali</title>
<style>
  body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
  h2 { text-align: center; text-transform: uppercase; letter-spacing: 1px; }
  h3 { text-align: center; margin-top: 0; }
  .underline { text-decoration: underline; }
  table.ttd { margin-top: 32px; width: 100%; }
  td.right { text-align: left; padding-left: 280px; }
</style></head>
<body>
  <h2>Pernyataan Peserta Didik dan Orang Tua/Wali</h2>
  <h3>Pendaftaran Beasiswa PACE bagi Peserta Didik Sekolah Negeri Khusus (SNK)</h3>
  <p>Saya yang bertanda tangan di bawah ini:</p>
  <table>
    <tr><td width="240">Nama peserta didik</td><td width="10">:</td><td>${siswa}</td></tr>
    <tr><td>Nama orang tua/wali</td><td>:</td><td>${namaOrtu}</td></tr>
    <tr><td>Hubungan dengan peserta didik</td><td>:</td><td>${hubungan}</td></tr>
  </table>
  <p>Dengan ini menyatakan bahwa:</p>
  <ol>
    <li>Data dan dokumen yang disampaikan dalam pendaftaran Beasiswa PACE adalah benar dan dapat dipertanggungjawabkan.</li>
    <li>Peserta didik benar terdaftar dan mengikuti pendidikan pada satuan pendidikan yang dicantumkan dalam formulir ini, sesuai hasil verifikasi sekolah.</li>
    <li>Saya bersedia mengikuti proses pemeriksaan dan verifikasi administrasi maupun substantif yang dilakukan oleh petugas berwenang.</li>
    <li>Saya bersedia melengkapi dokumen yang diperlukan apabila terdapat kekurangan berkas pendaftaran.</li>
    <li>Saya bersedia memberikan informasi yang benar mengenai status OAP, kondisi ekonomi, prestasi, dan bantuan pendidikan lain yang diterima.</li>
    <li>Saya tidak akan menyampaikan dokumen palsu atau informasi yang menyesatkan dalam proses pendaftaran.</li>
    <li>Saya memahami bahwa pendaftaran tidak secara otomatis menjamin penetapan sebagai penerima Beasiswa PACE.</li>
    <li>Apabila ditetapkan sebagai penerima, bantuan akan dimanfaatkan untuk mendukung kepentingan pendidikan sesuai petunjuk teknis program.</li>
    <li>Saya memberikan persetujuan agar data yang diperlukan dapat diproses oleh Dinas Pendidikan Provinsi Papua dan petugas yang berwenang untuk keperluan pendaftaran, verifikasi, seleksi, penetapan, penyaluran, pemantauan, dan pelaporan sesuai ketentuan perlindungan data pribadi.</li>
  </ol>
  <p>Demikian pernyataan ini dibuat dengan sebenar-benarnya untuk digunakan sebagaimana mestinya.</p>
  <table class="ttd">
    <tr><td></td><td class="right">${tempat}, ${tanggal}</td></tr>
  </table>
  <table style="width:100%; margin-top:24px;">
    <tr>
      <td width="50%">Peserta Didik,<br/><br/><br/>( <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span> )<br/>Nama jelas: ${siswa}</td>
      <td width="50%">Orang Tua/Wali,<br/><br/><br/>( <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span> )<br/>Nama jelas: ${namaOrtu}</td>
    </tr>
  </table>
</body></html>`;
}
