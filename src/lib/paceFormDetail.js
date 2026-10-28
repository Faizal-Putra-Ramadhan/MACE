// ============================================================
//  Metadata tampilan DETAIL pendaftaran PACE (read-only)
//  Untuk halaman admin (PACE Approval) agar bisa menelaah isi
//  `data_pendaftaran` dari SEMUA program (SLB/SNK/Kedinasan/Atlit)
//  secara terbaca. Kunci label bersifat union antar-program; field
//  yang tidak terdaftar akan ditampilkan dengan nama kunci dirapikan.
// ============================================================

// Urutan bagian saat ditampilkan
export const SECTION_ORDER = [
  'identitas', 'kebutuhan_khusus', 'satuan_pendidikan', 'oap', 'orang_tua',
  'pendidikan', 'pplp', 'olahraga', 'rencana_kedinasan', 'kesiapan', 'bimbel',
  'sosial_ekonomi', 'rencana_beasiswa', 'bantuan', 'rekening', 'pernyataan', 'verifikasi',
];

export const SECTION_TITLES = {
  identitas: 'Identitas Peserta Didik',
  kebutuhan_khusus: 'Identitas & Kebutuhan Khusus',
  satuan_pendidikan: 'Data Satuan Pendidikan',
  oap: 'Data Status Orang Asli Papua (OAP)',
  orang_tua: 'Identitas Orang Tua/Wali',
  pendidikan: 'Data Pendidikan Formal',
  pplp: 'Keanggotaan & Pembinaan PPLP',
  olahraga: 'Cabang Olahraga & Prestasi',
  rencana_kedinasan: 'Rencana Pilihan Sekolah Kedinasan',
  kesiapan: 'Kesiapan Akademik & Seleksi',
  bimbel: 'Bimbingan Belajar (Bimbel)',
  sosial_ekonomi: 'Kondisi Sosial Ekonomi Keluarga',
  rencana_beasiswa: 'Rencana Pemanfaatan Beasiswa',
  bantuan: 'Informasi Bantuan Pendidikan Lain',
  rekening: 'Data Rekening Penerima',
  pernyataan: 'Pernyataan',
  verifikasi: 'Verifikasi / Rekomendasi Petugas',
};

// Sub-bagian bersarang (objek di dalam section) -> judul
export const SUBSECTION_TITLES = {
  ayah: 'Ayah', ibu: 'Ibu', wali: 'Wali',
  prestasi_1: 'Prestasi 1', prestasi_2: 'Prestasi 2', prestasi_3: 'Prestasi 3',
};

// Label field (union antar program). Fallback: prettify kunci.
export const FIELD_LABELS = {
  // identitas / umum
  nama: 'Nama lengkap', nik: 'NIK', nisn: 'NISN',
  tempat_lahir: 'Tempat lahir', tanggal_lahir: 'Tanggal lahir',
  jenis_kelamin: 'Jenis kelamin', agama: 'Agama',
  alamat: 'Alamat', kampung_kelurahan: 'Kampung/Kelurahan',
  distrik_kecamatan: 'Distrik/Kecamatan', kabupaten_kota: 'Kabupaten/Kota',
  no_hp: 'No. HP', no_hp_siswa: 'No. HP peserta didik', no_hp_ortu: 'No. HP orang tua/wali',
  email: 'Email', telepon: 'No. telepon',
  jenjang: 'Jenjang pendidikan', jenjang_lain: 'Jenjang lainnya',
  kelas: 'Kelas', tahun_masuk: 'Tahun masuk', tahun_lulus: 'Tahun lulus',
  status_didik: 'Status peserta didik', status_didik_lain: 'Status lainnya',
  status_tinggal: 'Status tempat tinggal', status_tinggal_lain: 'Status tempat tinggal (lain)',
  status_tempat_tinggal: 'Status tempat tinggal', status_tempat_tinggal_lain: 'Status tempat tinggal (lain)',
  // kebutuhan khusus (SLB)
  hambatan: 'Hambatan/kebutuhan khusus', hambatan_lain: 'Hambatan lainnya',
  keterangan_layanan: 'Keterangan layanan',
  dokumen_pendukung: 'Dokumen pendukung kebutuhan khusus', dokumen_pendukung_lain: 'Dokumen pendukung lainnya',
  // satuan pendidikan / pendidikan
  nama_sekolah: 'Nama sekolah', npsn: 'NPSN', program_keahlian: 'Program keahlian',
  jurusan: 'Jurusan', rata_rapor: 'Rata-rata nilai rapor', rata_ijazah: 'Rata-rata nilai ijazah',
  prestasi: 'Prestasi', prestasi_nonakademik: 'Prestasi di luar olahraga',
  nama_kepala_sekolah: 'Nama kepala sekolah', telepon_sekolah: 'No. telepon sekolah/operator',
  status_pendidikan: 'Status pendidikan', status_pendidikan_lain: 'Status pendidikan (lain)',
  mengikuti_pt: 'Mengikuti perguruan tinggi', nama_pt: 'Nama perguruan tinggi',
  // OAP
  status: 'Status', asal_suku: 'Nama suku/keret', asal_kampung: 'Asal kampung/wilayah adat',
  dasar_dokumen: 'Dokumen pendukung status OAP', dasar_dokumen_lain: 'Dokumen lain yang sah',
  keterangan: 'Keterangan',
  // orang tua
  pekerjaan: 'Pekerjaan', pendidikan_terakhir: 'Pendidikan terakhir', hubungan: 'Hubungan',
  // PPLP
  status_keanggotaan: 'Status keanggotaan', status_lain: 'Status lainnya',
  nama_program: 'Lembaga/program pembinaan', tanggal_mulai: 'Tanggal mulai pembinaan',
  pelatih_utama: 'Pelatih utama', telepon_pelatih: 'No. telepon pelatih',
  pelatih_pendamping: 'Pelatih pendamping', lokasi_latihan: 'Lokasi latihan', jadwal_latihan: 'Jadwal latihan',
  status_pembinaan: 'Status pembinaan', status_pembinaan_lain: 'Status pembinaan (lain)',
  surat_atlet_aktif: 'Surat keterangan atlet aktif',
  // olahraga
  cabang_utama: 'Cabang olahraga utama', nomor_lomba: 'Nomor pertandingan/lomba',
  kategori: 'Kategori', kategori_lain: 'Kategori lainnya',
  tingkat_kompetisi: 'Tingkat kompetisi', seleksi_pemusatan: 'Seleksi/pemusatan latihan',
  seleksi_pemusatan_lain: 'Seleksi/pemusatan (lain)', target_prestasi: 'Target prestasi',
  rekomendasi_pelatih: 'Rekomendasi pelatih',
  nama_kejuaraan: 'Nama kejuaraan', tingkat: 'Tingkat', tahun: 'Tahun',
  nomor_cabang: 'Nomor/cabang olahraga', hasil: 'Hasil/peringkat',
  penyelenggara: 'Penyelenggara', bukti: 'Bukti sertifikat/piagam',
  // rencana kedinasan
  pilihan_1: 'Pilihan 1', prodi_1: 'Program studi 1', pilihan_2: 'Pilihan 2',
  prodi_2: 'Program studi 2', pilihan_3: 'Pilihan 3', alasan: 'Alasan',
  mempelajari_persyaratan: 'Mempelajari persyaratan', persyaratan_khusus: 'Persyaratan khusus',
  persyaratan_lain: 'Persyaratan lainnya',
  // kesiapan
  mapel: 'Mapel/kemampuan ditingkatkan', mapel_lain: 'Mapel lainnya',
  pernah_tryout: 'Pernah tryout', tryout_hasil: 'Hasil tryout',
  diagnostik_nilai: 'Nilai diagnostik', diagnostik_tanggal: 'Tanggal diagnostik',
  diagnostik_penyelenggara: 'Penyelenggara diagnostik',
  pengalaman_seleksi: 'Pengalaman seleksi', pengalaman_detail: 'Detail pengalaman',
  kendala: 'Kendala persiapan', kendala_lain: 'Kendala lainnya', uraian_motivasi: 'Motivasi',
  // bimbel
  nama_lembaga: 'Lembaga bimbel', penanggung_jawab: 'Penanggung jawab',
  periode_mulai: 'Periode mulai', periode_selesai: 'Periode selesai',
  metode: 'Metode', materi: 'Materi', bersedia_jadwal: 'Bersedia mengikuti jadwal',
  // sosial ekonomi
  pekerjaan_ortu: 'Pekerjaan orang tua/wali', pekerjaan_ortu_lain: 'Pekerjaan lainnya',
  penghasilan: 'Penghasilan per bulan', jml_tanggungan: 'Jumlah tanggungan',
  jml_anggota: 'Jumlah anggota keluarga', jml_anak_sekolah: 'Jumlah anak bersekolah',
  jml_bersekolah: 'Jumlah anak bersekolah', jml_dukungan_khusus: 'Anggota dukungan kebutuhan khusus',
  kurang_mampu: 'Keluarga kurang mampu', dokumen_ekonomi: 'Dokumen pendukung ekonomi',
  dokumen_ekonomi_lain: 'Dokumen ekonomi lainnya', penjelasan: 'Penjelasan', uraian_kondisi: 'Uraian kondisi',
  nama_ayah: 'Nama ayah', pekerjaan_ayah: 'Pekerjaan ayah', nama_ibu: 'Nama ibu',
  pekerjaan_ibu: 'Pekerjaan ibu', nama_wali: 'Nama wali', hubungan_wali: 'Hubungan wali',
  menerima_bantuan: 'Menerima bantuan lain', jenis_bantuan: 'Jenis bantuan',
  sumber_bantuan: 'Sumber bantuan', besaran_bantuan: 'Besaran bantuan',
  nama_bantuan: 'Nama bantuan', periode_bantuan: 'Periode bantuan',
  // rencana beasiswa
  kebutuhan: 'Kebutuhan', kebutuhan_lain: 'Kebutuhan lainnya', uraian: 'Uraian',
  uraian_prioritas: 'Uraian kebutuhan prioritas', target_pendidikan: 'Target pendidikan & olahraga',
  // bantuan
  sumber: 'Sumber bantuan', periode_besaran: 'Periode & besaran',
  biayai_sama: 'Membiayai komponen yang sama', biayai_bimbel: 'Membiayai komponen bimbel yang sama',
  // rekening
  pemilik: 'Nama pemilik rekening', nama_bank: 'Nama bank', nomor_rekening: 'Nomor rekening', jenis: 'Jenis rekening',
  // pernyataan
  nama_siswa: 'Nama peserta didik', nama_ortu: 'Nama orang tua/wali', tempat: 'Tempat', tanggal: 'Tanggal',
  // verifikasi
  nama_operator: 'Nama operator', nip: 'NIP', jabatan: 'Jabatan',
  identitas_sesuai: 'Identitas sesuai', status_aktif: 'Status aktif',
  kesesuaian_sekolah: 'Kesesuaian sekolah', status_oap: 'Status OAP',
  kelengkapan_dokumen: 'Kelengkapan dokumen', catatan: 'Catatan',
  nama_operator_ttd: 'Nama operator (ttd)', nama_kepala_sekolah_ttd: 'Nama kepala sekolah',
  pelatih_pernyataan: 'Pernyataan pelatih', catatan_pelatih: 'Catatan/rekomendasi pelatih',
  nama_pelatih: 'Nama pelatih', cabang_olahraga: 'Cabang olahraga', tanggal_pelatih: 'Tanggal (pelatih)',
  nama_pengelola: 'Nama pengelola', v_identitas: 'Identitas atlet', v_status_pembinaan: 'Status pembinaan PPLP',
  v_pendidikan: 'Data pendidikan', v_prestasi: 'Data prestasi', v_status_oap: 'Status OAP',
  v_kelengkapan: 'Kelengkapan berkas', catatan_verifikasi: 'Catatan hasil verifikasi',
  nama_pejabat: 'Mengetahui, pejabat berwenang',
};

// Label dokumen lampiran (union semua program) -> key pada data_pendaftaran.dokumen
export const DOKUMEN_LABELS = {
  formulir: 'Formulir pendaftaran', kk: 'Kartu Keluarga (KK)', akta: 'Akta Kelahiran',
  identitas_ortu: 'Identitas orang tua/wali', identitas_siswa: 'Identitas peserta didik',
  sk_aktif: 'Surat keterangan aktif sekolah', dok_oap: 'Dokumen pendukung status OAP',
  dok_asesmen: 'Dokumen asesmen kebutuhan khusus', sk_ekonomi: 'Dokumen kondisi ekonomi',
  dok_rekening: 'Dokumen rekening penerima', dok_lain: 'Dokumen lain sesuai juknis',
  rapor: 'Rapor / nilai terakhir', prestasi: 'Dokumen prestasi',
  surat_bantuan_ganda: 'Surat pernyataan tidak menerima bantuan ganda',
  ktp: 'KTP / identitas calon peserta', ijazah: 'Ijazah / keterangan lulus',
  pasfoto: 'Pasfoto terbaru', surat_ortu: 'Surat pernyataan orang tua/wali',
  hasil_tryout: 'Hasil tryout / tes diagnostik',
  sk_atlet: 'Surat keterangan atlet aktif PPLP', rekomendasi_pelatih: 'Surat rekomendasi pelatih',
  bukti_prestasi: 'Bukti prestasi olahraga',
  surat_pernyataan: 'Surat Pernyataan (ditandatangani)',
};

// Nilai kosong? (string kosong, null, array kosong, objek kosong)
export const isEmptyValue = (v) => {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string') return v.trim() === '';
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.keys(v).length === 0;
  return false;
};

// Rapikan kunci -> "Nama human readable"
export const prettifyKey = (key) =>
  key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export const fieldLabel = (key) => FIELD_LABELS[key] || prettifyKey(key);
