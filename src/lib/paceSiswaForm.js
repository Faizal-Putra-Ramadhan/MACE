// ============================================================
//  Konfigurasi Form Pendaftaran Siswa PACE (SLB)
//  Mengikuti struktur formulir resmi:
//  A. Identitas Peserta Didik
//  B. Identitas & Kondisi Kebutuhan Khusus
//  C. Identitas Orang Tua/Wali
//  D. Identitas & Status OAP
//  E. Kondisi Sosial Ekonomi Keluarga
//  F. Informasi Rekening Penerima
//  G. Pernyataan Orang Tua/Wali (unduh template -> isi -> unggah)
//  Lampiran: Daftar Periksa Dokumen
//
//  Seluruh field disimpan flat pada kolom JSON `data_pendaftaran`
//  (tidak perlu migrasi DB untuk menambah field baru).
// ============================================================

export const JENIS_KELAMIN = ['Laki-laki', 'Perempuan'];

export const AGAMA = [
  'Islam', 'Kristen (Protestan)', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Kepercayaan terhadap Tuhan YME',
];

export const JENJANG = [
  'TKLB', 'SDLB', 'SMPLB', 'SMALB', 'Bentuk layanan pendidikan khusus lainnya',
];

export const STATUS_PESERTA = ['Aktif', 'Lainnya'];

export const HAMBATAN = [
  'Hambatan penglihatan',
  'Hambatan pendengaran',
  'Hambatan intelektual',
  'Hambatan fisik/motorik',
  'Hambatan komunikasi atau bahasa',
  'Autisme',
  'Hambatan belajar atau perkembangan lainnya',
  'Hambatan/kebutuhan khusus lainnya',
];

export const DOKUMEN_KEBUTUHAN = [
  'Surat keterangan atau hasil asesmen dari tenaga/profesional yang berwenang',
  'Dokumen asesmen dari satuan pendidikan',
  'Dokumen pendukung lainnya',
  'Belum tersedia',
];

export const STATUS_TEMPAT_TINGGAL_DIDIK = [
  'Bersama ayah dan ibu',
  'Bersama ayah',
  'Bersama ibu',
  'Bersama wali/keluarga',
  'Asrama',
  'Lainnya',
];

export const STATUS_OAP = ['OAP', 'Non-OAP', 'Dalam proses verifikasi'];

export const DASAR_OAP = [
  'Kartu Keluarga',
  'Akta Kelahiran',
  'Surat keterangan dari pihak yang berwenang sesuai ketentuan',
  'Dokumen pendukung lain yang sah',
];

export const PEKERJAAN_ORTU = [
  'Petani/pekebun',
  'Nelayan',
  'PNS/ASN',
  'TNI/Polri',
  'Pegawai swasta',
  'Wiraswasta',
  'Tidak bekerja',
  'Pekerjaan lainnya',
];

export const PENGHASILAN = [
  'Tidak ada penghasilan tetap',
  'Kurang dari Rp1.000.000',
  'Rp1.000.000–Rp2.000.000',
  'Rp2.000.001–Rp3.000.000',
  'Lebih dari Rp3.000.000',
  'Tidak diketahui',
];

export const STATUS_RUMAH = [
  'Rumah milik sendiri',
  'Rumah keluarga',
  'Rumah sewa/kontrak',
  'Rumah dinas',
  'Lainnya',
];

export const YA_TIDAK_VERIFIKASI = ['Ya', 'Tidak', 'Dalam proses verifikasi'];

export const JENIS_REKENING = [
  'Rekening atas nama peserta didik',
  'Rekening atas nama orang tua/wali',
  'Belum memiliki rekening',
];

// Daftar periksa dokumen (Lampiran). `key` = nama field pada data_pendaftaran.dokumen
export const LAMPIRAN_DOKUMEN = [
  { key: 'formulir', label: 'Formulir pendaftaran yang telah diisi lengkap', req: true },
  { key: 'kk', label: 'Fotokopi Kartu Keluarga (KK)', req: true },
  { key: 'akta', label: 'Fotokopi Akta Kelahiran peserta didik, jika tersedia', req: false },
  { key: 'identitas_ortu', label: 'Identitas orang tua/wali yang sah, jika dipersyaratkan', req: false },
  { key: 'sk_aktif', label: 'Surat keterangan aktif sebagai peserta didik SLB dari kepala sekolah', req: true },
  { key: 'dok_oap', label: 'Surat keterangan atau dokumen pendukung status OAP sesuai ketentuan verifikasi', req: false },
  { key: 'dok_asesmen', label: 'Dokumen asesmen atau keterangan kebutuhan khusus yang tersedia dan relevan', req: false },
  { key: 'sk_ekonomi', label: 'Surat keterangan kondisi ekonomi atau dokumen pendukung keluarga kurang mampu, jika dipersyaratkan', req: false },
  // surat_pernyataan dikelola terpisah pada bagian G
  { key: 'dok_rekening', label: 'Dokumen rekening bank penerima, apabila dipersyaratkan', req: false },
  { key: 'dok_lain', label: 'Dokumen lain sesuai petunjuk teknis Beasiswa PACE Tahun Anggaran 2027', req: false },
];

// State awal form (nested sesuai bagian A-G)
export const initialForm = () => ({
  identitas: {
    nama: '', nisn: '', nik: '', tempat_lahir: '', tanggal_lahir: '',
    jenis_kelamin: '', agama: '',
    alamat: '', kampung_kelurahan: '', distrik_kecamatan: '', kabupaten_kota: '',
    no_hp_ortu: '', jenjang: '', jenjang_lain: '', kelas: '',
    status_didik: '', status_didik_lain: '', tahun_masuk: '',
  },
  kebutuhan_khusus: {
    hambatan: [], hambatan_lain: '', keterangan_layanan: '',
    dokumen_pendukung: [], dokumen_pendukung_lain: '',
  },
  orang_tua: {
    ayah: { nama: '', nik: '', pekerjaan: '', pendidikan: '', telepon: '' },
    ibu: { nama: '', nik: '', pekerjaan: '', pendidikan: '', telepon: '' },
    wali: { nama: '', hubungan: '', nik: '', pekerjaan: '', alamat: '', telepon: '' },
    status_tempat_tinggal: '', status_tempat_tinggal_lain: '',
  },
  oap: {
    status: '', asal_suku: '', asal_kampung: '',
    dasar_dokumen: [], dasar_dokumen_lain: '', keterangan: '',
  },
  sosial_ekonomi: {
    pekerjaan_ortu: '', pekerjaan_ortu_lain: '', penghasilan: '',
    status_tinggal: '', status_tinggal_lain: '',
    jml_anggota: '', jml_anak_sekolah: '', jml_dukungan_khusus: '',
    kurang_mampu: '', menerima_bantuan: '',
    jenis_bantuan: '', sumber_bantuan: '', besaran_bantuan: '',
  },
  rekening: {
    pemilik: '', nama_bank: '', nomor_rekening: '', hubungan: '', jenis: '',
  },
  pernyataan: { nama: '', nik: '', hubungan: '', tempat: '', tanggal: '' },
  dokumen: {}, // key -> url (hasil upload)
});

// Bangun isi Surat Pernyataan Orang Tua/Wali (bagian G) sebagai HTML (.doc)
// Prefill nama/NIK/hubungan dari data yang sudah diisi.
export function buildPernyataanHtml(form) {
  const p = form?.pernyataan || {};
  const ayah = form?.orang_tua?.ayah || {};
  const wali = form?.orang_tua?.wali || {};
  const nama = p.nama || ayah.nama || wali.nama || '________________';
  const nik = p.nik || ayah.nik || wali.nik || '________________';
  const hubungan = p.hubungan || wali.hubungan || 'Orang Tua/Wali';
  const tempat = p.tempat || form?.identitas?.kabupaten_kota || '________________';
  const tanggal = p.tanggal || '________________';
  const siswa = form?.identitas?.nama || '________________';

  return `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Surat Pernyataan Orang Tua/Wali</title>
<style>
  body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
  h2 { text-align: center; text-transform: uppercase; letter-spacing: 1px; }
  h3 { text-align: center; margin-top: 0; }
  .underline { text-decoration: underline; }
  table.ttd { margin-top: 32px; width: 100%; }
  td.right { text-align: left; padding-left: 280px; }
</style></head>
<body>
  <h2>Surat Pernyataan Orang Tua/Wali</h2>
  <h3>Pendaftaran Beasiswa PACE bagi Peserta Didik SLB</h3>
  <p>Saya yang bertanda tangan di bawah ini:</p>
  <table>
    <tr><td width="220">Nama</td><td width="10">:</td><td>${nama}</td></tr>
    <tr><td>NIK (jika ada)</td><td>:</td><td>${nik}</td></tr>
    <tr><td>Hubungan dengan peserta didik</td><td>:</td><td>${hubungan}</td></tr>
    <tr><td>Anak dari peserta didik</td><td>:</td><td>${siswa}</td></tr>
  </table>
  <p>Dengan ini menyatakan bahwa:</p>
  <ol>
    <li>Seluruh data dan dokumen yang disampaikan dalam pendaftaran Beasiswa PACE bagi Peserta Didik SLB adalah benar sesuai keadaan yang sebenarnya.</li>
    <li>Saya memberikan izin kepada Dinas Pendidikan Provinsi Papua dan petugas yang berwenang untuk melakukan verifikasi data dan dokumen pendaftaran sesuai ketentuan yang berlaku.</li>
    <li>Saya bersedia melengkapi dokumen yang diperlukan apabila terdapat kekurangan dalam berkas pendaftaran.</li>
    <li>Saya bersedia memberitahukan apabila terdapat perubahan data yang berpengaruh terhadap kelayakan peserta didik sebagai penerima bantuan.</li>
    <li>Saya memahami bahwa pendaftaran tidak secara otomatis menjamin peserta didik ditetapkan sebagai penerima Beasiswa PACE.</li>
    <li>Saya bersedia mengikuti ketentuan pelaksanaan program dan menggunakan bantuan untuk kepentingan pendidikan peserta didik sesuai petunjuk teknis yang berlaku.</li>
    <li>Saya memahami bahwa data peserta didik, termasuk data kebutuhan khusus, hanya boleh digunakan dan diproses sesuai ketentuan perlindungan data pribadi dan keperluan pelaksanaan program.</li>
  </ol>
  <p>Demikian pernyataan ini dibuat dengan sebenar-benarnya untuk digunakan sebagaimana mestinya.</p>
  <table class="ttd">
    <tr><td></td><td class="right">${tempat}, ${tanggal}</td></tr>
    <tr><td></td><td class="right">Orang Tua/Wali,</td></tr>
    <tr><td></td><td class="right" style="padding-top:60px;">Materai sesuai ketentuan apabila dipersyaratkan</td></tr>
    <tr><td></td><td class="right" style="padding-top:60px;">( <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span> )</td></tr>
  </table>
</body></html>`;
}
