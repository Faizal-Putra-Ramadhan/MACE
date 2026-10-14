// ============================================================
// Konfigurasi alur Pendaftaran Beasiswa Reguler Kabupaten/Kota (MACE)
//
// Alur 6 langkah (sesuai tabel isian yang diberikan):
//   1. Data Diri              (nomor 1-12)
//   2. Pilih Program          (Program A/B/C)
//   3. Pendidikan/Universitas (nomor 13-37)
//   4. Keluarga & Keuangan    (nomor 38-48)
//   5. Unggah Dokumen         (19 dokumen)
//   6. Unggah Surat           (2 surat: unduh template -> isi -> upload)
//
// Semua isian disimpan flat ke dalam pendaftaran.data_diri (JSON),
// jadi tidak perlu mengubah skema tabel untuk menambah field.
// ============================================================

export const STEP_LABELS = [
  'Data Diri',
  'Program',
  'Pendidikan',
  'Keluarga',
  'Dokumen',
  'Surat',
  'Selesai',
];

// Kabupaten/Kota asal (dipakai untuk dropdown item 6 + default wilayah).
export const KABUPATEN_LIST = [
  { id: 'kota_jayapura', name: 'Kota Jayapura', prefix: '9171' },
  { id: 'kab_jayapura', name: 'Kabupaten Jayapura', prefix: '9103' },
  { id: 'kab_yapen', name: 'Kabupaten Kepulauan Yapen', prefix: '9105' },
  { id: 'kab_biak', name: 'Kabupaten Biak Numfor', prefix: '9106' },
  { id: 'kab_sarmi', name: 'Kabupaten Sarmi', prefix: '9110' },
  { id: 'kab_keerom', name: 'Kabupaten Keerom', prefix: '9111' },
  { id: 'kab_supiori', name: 'Kabupaten Supiori', prefix: '9120' },
  { id: 'kab_mamberamo', name: 'Kabupaten Mamberamo Raya', prefix: '9128' },
  { id: 'kab_waropen', name: 'Kabupaten Waropen', prefix: '9115' },
];

// Program untuk jalur Kabupaten/Kota (hanya A, B, C).
export const PROGRAM_OPTIONS_KABKOTA = [
  { id: 'A', title: 'Studi Akhir', desc: 'Untuk mahasiswa yang sedang menyelesaikan tugas akhir / skripsi.', color: 'bg-blue-500' },
  { id: 'B', title: 'Koas', desc: 'Mahasiswa kedokteran yang sedang menjalani masa profesi dokter (Koas).', color: 'bg-rose-500' },
  { id: 'C', title: 'Spesialis', desc: 'Program bantuan pendidikan spesialisasi bagi dokter Orang Asli Papua.', color: 'bg-emerald-500' },
];

// ---- Definisi field -------------------------------------------------------
// Tipe: text | number | date | select | textarea
// special: 'nik' | 'nim'  -> dirender dengan tombol validasi
// full: true -> menempuh 2 kolom grid. required: true -> wajib diisi.
// prefix/suffix: label satuan (mis. "Rp", "orang").

export const DATA_DIRI_FIELDS = [
  { no: 1, name: 'nama', label: 'Nama lengkap sesuai KTP', type: 'text', required: true, full: true },
  { no: 2, name: 'nik', label: 'NIK', type: 'text', special: 'nik', required: true, placeholder: '16 digit NIK' },
  { no: 3, name: 'ttl', label: 'Tempat dan tanggal lahir', type: 'text', required: true, placeholder: 'Contoh: Jayapura, 01 Januari 2000' },
  { no: 4, name: 'jenis_kelamin', label: 'Jenis kelamin', type: 'select', required: true, options: ['Laki-laki', 'Perempuan'] },
  { no: 5, name: 'status_oap', label: 'Status OAP', type: 'select', required: true, options: ['Ya', 'Tidak'] },
  { no: 6, name: 'kabupaten_asal', label: 'Kabupaten/kota asal di Provinsi Papua', type: 'select', required: true, options: KABUPATEN_LIST.map(k => k.name) },
  { no: 7, name: 'alamat', label: 'Alamat domisili saat ini', type: 'textarea', required: true, full: true },
  { no: 8, name: 'no_hp', label: 'Nomor telepon/WhatsApp aktif', type: 'text', required: true, placeholder: '08xxxxxxxxxx' },
  { no: 9, name: 'email', label: 'Alamat email', type: 'text', required: true, placeholder: 'nama@email.com' },
  { no: 10, name: 'nama_orang_tua', label: 'Nama orang tua/wali', type: 'text', required: true },
  { no: 11, name: 'pekerjaan_orang_tua', label: 'Pekerjaan orang tua/wali', type: 'text', required: true },
  { no: 12, name: 'no_hp_orang_tua', label: 'Nomor telepon orang tua/wali', type: 'text', required: true, placeholder: '08xxxxxxxxxx' },
];

export const PENDIDIKAN_FIELDS = [
  { no: 13, name: 'nama_pt', label: 'Nama perguruan tinggi', type: 'text', required: true, full: true },
  { no: 14, name: 'alamat_pt', label: 'Alamat perguruan tinggi', type: 'text', full: true },
  { no: 15, name: 'fakultas', label: 'Fakultas/sekolah, jika ada', type: 'text' },
  { no: 16, name: 'program_studi', label: 'Nama program studi', type: 'text', required: true },
  { no: 17, name: 'jenjang', label: 'Jenjang pendidikan', type: 'select', required: true, options: ['D3', 'D4', 'S1', 'S2', 'S3'], defaultValue: 'S1' },
  { no: 18, name: 'status_pt', label: 'Status perguruan tinggi', type: 'select', required: true, options: ['Negeri', 'Swasta'] },
  { no: 19, name: 'akreditasi_pt', label: 'Status akreditasi atau pengakuan program studi', type: 'text' },
  { no: 20, name: 'nim', label: 'Nomor induk mahasiswa (NIM), jika sudah tersedia', type: 'text', special: 'nim', placeholder: 'Nomor Induk Mahasiswa' },
  { no: 21, name: 'tahun_masuk', label: 'Tahun masuk', type: 'text', placeholder: 'Contoh: 2021' },
  { no: 22, name: 'semester', label: 'Semester saat ini, jika mahasiswa aktif', type: 'text', placeholder: 'Contoh: 7' },
  { no: 23, name: 'perkiraan_selesai', label: 'Perkiraan tahun penyelesaian studi', type: 'text' },
  { no: 24, name: 'kontak_akademik', label: 'Nama dan kontak bagian akademik perguruan tinggi', type: 'text', full: true },
  { no: 25, name: 'asal_sekolah', label: 'Asal sekolah', type: 'text' },
  { no: 26, name: 'tahun_lulus', label: 'Tahun lulus', type: 'text' },
  { no: 27, name: 'nilai_rapor', label: 'Nilai rata-rata rapor/ijazah, jika tersedia', type: 'text' },
  { no: 28, name: 'jalur_penerimaan', label: 'Jalur penerimaan mahasiswa', type: 'text' },
  { no: 29, name: 'surat_penerimaan', label: 'Nomor dan tanggal surat penerimaan', type: 'text' },
  { no: 30, name: 'prestasi', label: 'Prestasi akademik/nonakademik yang relevan', type: 'textarea', full: true },
  { no: 31, name: 'ipk', label: 'IPK terakhir (Bagi mahasiswa aktif)', type: 'text', placeholder: 'Contoh: 3.75' },
  { no: 32, name: 'jumlah_semester_ditempuh', label: 'Jumlah semester yang telah ditempuh (Bagi mahasiswa aktif)', type: 'text' },
  { no: 33, name: 'jumlah_sks', label: 'Jumlah SKS yang telah diselesaikan (Bagi mahasiswa aktif)', type: 'text' },
  { no: 34, name: 'status_akademik', label: 'Status akademik semester berjalan (Bagi mahasiswa aktif)', type: 'text' },
  { no: 35, name: 'waktu_perkiraan_selesai', label: 'Perkiraan waktu penyelesaian studi (Bagi mahasiswa aktif)', type: 'text' },
  { no: 36, name: 'prestasi_aktif', label: 'Prestasi akademik/nonakademik yang relevan (Bagi mahasiswa aktif)', type: 'textarea', full: true },
  { no: 37, name: 'kendala_akademik', label: 'Kendala akademik yang memerlukan dukungan (Bagi mahasiswa aktif)', type: 'textarea', full: true },
];

export const KELUARGA_FIELDS = [
  { no: 38, name: 'nama_kepala_keluarga', label: 'Nama kepala keluarga/orang tua/wali', type: 'text', full: true },
  { no: 39, name: 'pekerjaan_kepala_keluarga', label: 'Pekerjaan kepala keluarga', type: 'text', full: true },
  { no: 40, name: 'penghasilan_per_bulan', label: 'Perkiraan penghasilan keluarga per bulan', type: 'number', prefix: 'Rp' },
  { no: 41, name: 'jumlah_anggota_keluarga', label: 'Jumlah anggota keluarga', type: 'number', suffix: 'orang' },
  { no: 42, name: 'jumlah_tanggungan_keluarga', label: 'Jumlah tanggungan keluarga', type: 'number', suffix: 'orang' },
  { no: 43, name: 'sumber_pembiayaan', label: 'Sumber pembiayaan pendidikan saat ini', type: 'text', full: true },
  { no: 44, name: 'biaya_pendidikan_per_semester', label: 'Perkiraan biaya pendidikan per semester/tahun', type: 'number', prefix: 'Rp' },
  { no: 45, name: 'biaya_pendidikan_tersededia', label: 'Biaya pendidikan yang telah tersedia', type: 'number', prefix: 'Rp' },
  { no: 46, name: 'kekurangan_biaya', label: 'Kekurangan biaya pendidikan', type: 'number', prefix: 'Rp' },
  { no: 47, name: 'jumlah_bantuan_dimohonkan', label: 'Jumlah bantuan yang dimohonkan', type: 'number', prefix: 'Rp' },
  { no: 48, name: 'bantuan_lain', label: 'Bantuan/beasiswa lain yang diterima atau sedang diajukan', type: 'textarea', full: true },
];

// ---- Program D: Pendidikan S3 (Doktoral) — khusus dosen -------------------
// Step detail 1: Data dosen & program doktoral (nomor 11-40 pada tabel).
export const D_DOSEN_FIELDS = [
  { no: 11, name: 'kontak_darurat', label: 'Kontak darurat', type: 'text' },
  { no: 12, name: 'nama_pt_asal', label: 'Nama perguruan tinggi asal', type: 'text', required: true, full: true },
  { no: 13, name: 'fakultas_asal', label: 'Fakultas/sekolah', type: 'text' },
  { no: 14, name: 'prodi_unit_kerja', label: 'Program studi/unit kerja', type: 'text' },
  { no: 15, name: 'status_pt_asal', label: 'Status perguruan tinggi', type: 'select', required: true, options: ['Negeri', 'Swasta'] },
  { no: 16, name: 'status_kepegawaian', label: 'Status kepegawaian dosen', type: 'text' },
  { no: 17, name: 'induk_dosen', label: 'Nomor Induk Dosen', type: 'text', placeholder: 'NIDN / NIDK / lainnya' },
  { no: 18, name: 'nomor_nidn', label: 'Nomor NIDN', type: 'text' },
  { no: 19, name: 'jabatan_fungsional', label: 'Jabatan fungsional akademik', type: 'text' },
  { no: 20, name: 'tahun_mulai_dosen', label: 'Tahun mulai bekerja sebagai dosen', type: 'text' },
  { no: 21, name: 'masa_kerja_dosen', label: 'Masa kerja sebagai dosen', type: 'number', suffix: 'tahun' },
  { no: 22, name: 'bkd_terakhir', label: 'Beban Kerja Dosen (BKD) terakhir', type: 'text' },
  { no: 23, name: 'nama_pimpinan_pt', label: 'Nama pimpinan perguruan tinggi', type: 'text' },
  { no: 24, name: 'sk_pengangkatan', label: 'Nomor dan tanggal SK pengangkatan', type: 'text' },
  { no: 25, name: 'kontak_institusi', label: 'Nomor telepon/email institusi', type: 'text' },
  { no: 26, name: 'status_s3', label: 'Status pendidikan S3', type: 'select', required: true, options: ['Mahasiswa baru', 'Sedang menempuh S3'] },
  { no: 27, name: 'nama_pt_tujuan', label: 'Nama perguruan tinggi tujuan', type: 'text', required: true, full: true },
  { no: 28, name: 'negara_pt', label: 'Negara/lokasi perguruan tinggi', type: 'text' },
  { no: 29, name: 'prodi_doktor', label: 'Nama program studi doktor', type: 'text', required: true },
  { no: 30, name: 'bidang_konsentrasi', label: 'Bidang ilmu/konsentrasi', type: 'text' },
  { no: 31, name: 'akreditasi_prodi_doktor', label: 'Akreditasi program studi/status pengakuan', type: 'text' },
  { no: 32, name: 'nomor_loa', label: 'Nomor dan tanggal LoA, jika mahasiswa baru', type: 'text' },
  { no: 33, name: 'tanggal_mulai_studi', label: 'Tanggal mulai studi', type: 'text' },
  { no: 34, name: 'semester_s3', label: 'Semester saat ini, jika sedang menempuh S3', type: 'text' },
  { no: 35, name: 'perkiraan_tanggal_selesai', label: 'Perkiraan tanggal penyelesaian studi', type: 'text' },
  { no: 36, name: 'persentase_progres', label: 'Persentase progres studi, jika sedang berjalan', type: 'number', suffix: '%' },
  { no: 37, name: 'judul_disertasi', label: 'Judul/topik rencana penelitian atau disertasi', type: 'textarea', full: true },
  { no: 38, name: 'pembimbing_promotor', label: 'Pembimbing/promotor, jika sudah ditetapkan', type: 'text', full: true },
  { no: 39, name: 'keterkaitan_bidang', label: 'Keterkaitan bidang studi dengan kebutuhan Papua', type: 'textarea', full: true },
  { no: 40, name: 'rencana_kontribusi', label: 'Rencana kontribusi setelah menyelesaikan studi', type: 'textarea', full: true },
];

// Step detail 2: Rekam akademik, publikasi & keuangan (nomor 41-62).
export const D_AKADEMIK_KEU_FIELDS = [
  { no: 41, name: 'pt_s2', label: 'Perguruan tinggi jenjang S2', type: 'text' },
  { no: 42, name: 'prodi_tahun_s2', label: 'Program studi dan tahun lulus S2', type: 'text' },
  { no: 43, name: 'ipk', label: 'IPK pendidikan terakhir', type: 'text', placeholder: 'Contoh: 3.75' },
  { no: 44, name: 'jumlah_publikasi', label: 'Jumlah publikasi ilmiah', type: 'text' },
  { no: 45, name: 'daftar_penelitian', label: 'Daftar penelitian yang pernah dilakukan', type: 'textarea', full: true },
  { no: 46, name: 'buku_karya', label: 'Buku/karya ilmiah yang dihasilkan', type: 'textarea', full: true },
  { no: 47, name: 'seminar_diikuti', label: 'Seminar/konferensi ilmiah yang diikuti', type: 'textarea', full: true },
  { no: 48, name: 'pengabdian_masyarakat', label: 'Pengabdian kepada masyarakat', type: 'textarea', full: true },
  { no: 49, name: 'inovasi_penghargaan', label: 'Inovasi atau penghargaan akademik/profesional', type: 'textarea', full: true },
  { no: 50, name: 'pengalaman_relevan', label: 'Pengalaman relevan lainnya', type: 'textarea', full: true },
  { no: 51, name: 'total_biaya_sampai_selesai', label: 'Perkiraan total biaya pendidikan sampai selesai', type: 'number', prefix: 'Rp' },
  { no: 52, name: 'biaya_telah_dibayarkan', label: 'Biaya pendidikan yang telah dibayarkan', type: 'number', prefix: 'Rp' },
  { no: 53, name: 'biaya_masih_harus_dibayar', label: 'Biaya pendidikan yang masih harus dibayar', type: 'number', prefix: 'Rp' },
  { no: 54, name: 'biaya_penelitian_dibutuhkan', label: 'Biaya penelitian/disertasi yang dibutuhkan', type: 'number', prefix: 'Rp' },
  { no: 55, name: 'sumber_pembiayaan_tersedia', label: 'Sumber pembiayaan yang telah tersedia', type: 'text', full: true },
  { no: 56, name: 'beasiswa_lain_diterima', label: 'Beasiswa/bantuan lain yang sedang diterima', type: 'text', full: true },
  { no: 57, name: 'komponen_biaya_dimohonkan', label: 'Komponen biaya yang dimohonkan', type: 'textarea', full: true },
  { no: 58, name: 'jumlah_bantuan_dimohonkan', label: 'Jumlah bantuan yang dimohonkan', type: 'number', prefix: 'Rp' },
  { no: 59, name: 'pendapatan_per_bulan', label: 'Pendapatan pemohon per bulan', type: 'number', prefix: 'Rp' },
  { no: 60, name: 'sumber_penghasilan_utama', label: 'Sumber penghasilan utama', type: 'text' },
  { no: 61, name: 'tanggungan_keluarga', label: 'Tanggungan keluarga', type: 'number', suffix: 'orang' },
  { no: 62, name: 'penjelasan_sosial_ekonomi', label: 'Penjelasan kondisi sosial ekonomi dan kebutuhan bantuan', type: 'textarea', full: true },
];

// ---- Dokumen wajib diunggah (19) ------------------------------------------
export const DOKUMEN_LIST = [
  { name: 'ktp', label: 'KTP/identitas resmi', desc: 'JPG/PDF, Maks 2MB' },
  { name: 'bukti_oap', label: 'Dokumen bukti status OAP', desc: 'JPG/PDF, Maks 2MB' },
  { name: 'kartu_keluarga', label: 'Kartu Keluarga (KK), sebagai dokumen pendukung', desc: 'JPG/PDF, Maks 2MB' },
  { name: 'surat_penerimaan_mhs', label: 'Surat penerimaan mahasiswa baru, jika mahasiswa baru', desc: 'PDF, Maks 2MB', conditional: 'baru' },
  { name: 'sk_aktif', label: 'Surat keterangan aktif kuliah, jika mahasiswa aktif', desc: 'PDF, Maks 2MB', conditional: 'aktif' },
  { name: 'kartu_mahasiswa', label: 'KTM, jika telah diterbitkan', desc: 'JPG/PDF, Maks 2MB' },
  { name: 'khs', label: 'KHS/transkrip nilai terbaru, jika mahasiswa aktif', desc: 'PDF, Maks 2MB', conditional: 'aktif' },
  { name: 'bukti_akreditasi', label: 'Bukti akreditasi/pengakuan program studi', desc: 'PDF, Maks 2MB' },
  { name: 'ijazah_terakhir', label: 'Ijazah terakhir atau surat keterangan lulus', desc: 'PDF, Maks 2MB' },
  { name: 'rapor_nilai', label: 'Rapor/nilai ijazah/hasil seleksi masuk, bagi mahasiswa baru', desc: 'PDF, Maks 2MB', conditional: 'baru' },
  { name: 'sertifikat_prestasi', label: 'Sertifikat prestasi yang relevan, jika ada', desc: 'PDF, Maks 2MB', optional: true },
  { name: 'khs_progress', label: 'Dokumen kemajuan studi/KHS, jika mahasiswa aktif', desc: 'PDF, Maks 2MB', conditional: 'aktif' },
  { name: 'dTKS', label: 'Kartu DTKS (Data Terpadu Kesejahteraan Sosial)', desc: 'JPG/PDF, Maks 2MB' },
  { name: 'rincian_biaya', label: 'Rincian biaya pendidikan atau tagihan resmi', desc: 'PDF, Maks 2MB' },
  { name: 'pernyataan_kebenaran', label: 'Surat pernyataan kebenaran data', desc: 'PDF, Maks 2MB' },
  { name: 'pakta_integritas', label: 'Pakta integritas', desc: 'PDF, Maks 2MB' },
  { name: 'pernyataan_tidak_ganda', label: 'Surat pernyataan tidak menerima pembiayaan ganda', desc: 'PDF, Maks 2MB' },
  { name: 'surat_komitmen_kontribusi', label: 'Surat komitmen menyelesaikan studi dan berkontribusi bagi Papua', desc: 'PDF, Maks 2MB' },
  { name: 'pasfoto', label: 'Pasfoto', desc: 'JPG, Maks 2MB' },
];

// Dokumen wajib untuk program reguler (A/B/C).
export const WAJIB_DOKUMEN = ['ktp', 'bukti_oap', 'kartu_keluarga', 'pasfoto'];

// ---- Dokumen Program D: S3/Doktoral (23) ----------------------------------
export const DOKUMEN_D_LIST = [
  { name: 'ktp', label: 'KTP', desc: 'JPG/PDF, Maks 2MB' },
  { name: 'surat_oap_lma', label: 'Surat Keterangan sebagai OAP yang diterbitkan LMA/MRP', desc: 'PDF, Maks 2MB' },
  { name: 'sk_pengangkatan_dosen', label: 'SK pengangkatan sebagai dosen atau dokumen kepegawaian lain', desc: 'PDF, Maks 2MB' },
  { name: 'bukti_nidn', label: 'Bukti NIDN, NIDK, atau nomor/status kepegawaian lain', desc: 'PDF, Maks 2MB' },
  { name: 'skt_aktif_dosen', label: 'Surat keterangan aktif sebagai dosen', desc: 'PDF, Maks 2MB' },
  { name: 'sk_jabatan_fungsional', label: 'SK jabatan fungsional akademik, jika ada', desc: 'PDF, Maks 2MB', conditional: 'ada' },
  { name: 'bkd_terakhir_dok', label: 'Dokumen Beban Kerja Dosen (BKD) terakhir', desc: 'PDF, Maks 2MB' },
  { name: 'bukti_kinerja', label: 'Dokumen penilaian kinerja atau bukti kontribusi kepada perguruan tinggi', desc: 'PDF, Maks 2MB' },
  { name: 'surat_rekomendasi_pimpinan', label: 'Surat rekomendasi pimpinan perguruan tinggi atau pejabat berwenang', desc: 'PDF, Maks 2MB' },
  { name: 'ijazah_terakhir_dosen', label: 'Ijazah pendidikan terakhir yang dipersyaratkan untuk program doktor', desc: 'PDF, Maks 2MB' },
  { name: 'loa_doktor', label: 'Letter of Acceptance (LoA) / surat diterima program doktor, bagi mahasiswa baru', desc: 'PDF, Maks 2MB', conditional: 'baru' },
  { name: 'sk_aktif_kuliah_s3', label: 'Surat keterangan aktif kuliah, bagi mahasiswa S3 yang sedang berjalan', desc: 'PDF, Maks 2MB', conditional: 'aktif' },
  { name: 'bukti_akreditasi_doktor', label: 'Bukti akreditasi program studi doktor atau dokumen pengakuan yang relevan', desc: 'PDF, Maks 2MB' },
  { name: 'transkrip_s3', label: 'Kartu hasil studi/transkrip S3 terbaru, jika sudah menempuh studi', desc: 'PDF, Maks 2MB', conditional: 'aktif' },
  { name: 'skt_semester_s3', label: 'Surat keterangan semester, masa studi, atau status akademik terkini', desc: 'PDF, Maks 2MB' },
  { name: 'proposal_disertasi', label: 'Proposal penelitian/rencana disertasi sesuai tahapan studi', desc: 'PDF, Maks 2MB' },
  { name: 'bukti_progres_disertasi', label: 'Bukti progres studi / laporan kemajuan disertasi, bagi mahasiswa S3 aktif', desc: 'PDF, Maks 2MB', conditional: 'aktif' },
  { name: 'transkrip_terakhir_dosen', label: 'Transkrip nilai pendidikan terakhir', desc: 'PDF, Maks 2MB' },
  { name: 'daftar_publikasi', label: 'Daftar publikasi, penelitian, buku/karya, seminar, pengabdian, inovasi, dan penghargaan (opsional)', desc: 'PDF, Maks 2MB', optional: true },
  { name: 'bukti_publikasi', label: 'Bukti publikasi, sertifikat, atau dokumen prestasi yang diakui (opsional)', desc: 'PDF, Maks 2MB', optional: true },
  { name: 'rincian_biaya_resmi', label: 'Surat resmi rincian biaya pendidikan dari perguruan tinggi', desc: 'PDF, Maks 2MB' },
  { name: 'pernyataan_tidak_ganda', label: 'Surat pernyataan tidak menerima pembiayaan ganda/double funding', desc: 'PDF, Maks 2MB' },
  { name: 'pernyataan_kesanggupan', label: 'Surat Pernyataan Kesanggupan Kembali dan Berkontribusi bagi Pendidikan Tinggi di Papua', desc: 'PDF, Maks 2MB' },
];

// Dokumen wajib untuk program D (sisanya kondisional/opsional).
export const WAJIB_DOKUMEN_D = [
  'ktp', 'surat_oap_lma', 'sk_pengangkatan_dosen', 'bukti_nidn', 'skt_aktif_dosen',
  'ijazah_terakhir_dosen', 'bukti_akreditasi_doktor', 'skt_semester_s3', 'proposal_disertasi',
  'transkrip_terakhir_dosen', 'rincian_biaya_resmi', 'pernyataan_tidak_ganda', 'pernyataan_kesanggupan',
];

// ---- Surat yang harus diunduh templatenya, diisi, lalu diunggah (2) ------
// Konten template dibuat dari fungsi builder agar bisa otomatis terisi
// identitas yang sudah diinput pemohon (nama, NIK, perguruan tinggi, program).
export const SURAT_LIST = [
  {
    name: 'surat_komitmen_pemohon',
    title: 'Surat Komitmen Pemohon',
    desc: 'Unduh template, isi & tanda tangani, lalu unggah kembali.',
    build: (d) => ({
      pembuka: 'Dengan ini menyatakan bahwa saya bersedia:',
      points: [
        'Menyelesaikan pendidikan sesuai ketentuan dan masa pendidikan yang berlaku.',
        'Menjaga status akademik dan mengikuti proses pendidikan secara bertanggung jawab.',
        'Menggunakan bantuan sesuai peruntukan yang ditetapkan.',
        'Menyampaikan laporan perkembangan akademik dan bukti kelulusan sesuai jadwal.',
        'Mengungkapkan secara benar seluruh beasiswa atau bantuan pendidikan lain yang diterima.',
        'Tidak mengajukan pembiayaan ganda untuk komponen biaya pendidikan yang sama.',
        'Memanfaatkan ilmu, keterampilan, dan kompetensi yang diperoleh untuk mendukung pembangunan Papua melalui pekerjaan, kewirausahaan, pengabdian masyarakat, atau bentuk kontribusi lain yang relevan.',
      ],
      penutup: 'Demikian pernyataan ini dibuat dengan sebenar-benarnya untuk digunakan dalam proses seleksi Beasiswa Pendidikan Reguler Mahasiswa Program MACE.',
    }),
  },
  {
    name: 'surat_pernyataan_benar',
    title: 'Surat Pernyataan Kebenaran Data dan Tanggung Jawab Pemohon',
    desc: 'Unduh template, isi & tanda tangani, lalu unggah kembali.',
    build: (d) => ({
      pembuka: 'Dengan ini menyatakan bahwa:',
      points: [
        'Seluruh data dan dokumen yang saya sampaikan dalam pendaftaran Beasiswa Pendidikan Reguler Mahasiswa Program MACE adalah benar, sah, lengkap, dan dapat dipertanggungjawabkan.',
        'Saya merupakan Orang Asli Papua sesuai ketentuan yang berlaku dan bersedia mengikuti proses verifikasi status OAP.',
        'Saya benar telah diterima atau terdaftar sebagai mahasiswa pada perguruan tinggi dan program studi sebagaimana tercantum dalam formulir pendaftaran.',
        'Saya telah mengungkapkan secara benar bantuan atau beasiswa lain yang sedang diterima maupun yang sedang diajukan.',
        'Saya tidak sedang menerima bantuan pembiayaan untuk komponen biaya pendidikan yang sama, kecuali diperbolehkan berdasarkan ketentuan program.',
        'Saya bersedia mematuhi petunjuk teknis, ketentuan, dan kewajiban penerima Beasiswa Program MACE.',
        'Saya bersedia menyampaikan dokumen perkembangan akademik, penggunaan bantuan apabila dipersyaratkan, dan bukti kelulusan sesuai ketentuan.',
        'Saya bersedia menerima penanganan sesuai ketentuan yang berlaku apabila terbukti memberikan data palsu, menggunakan dokumen tidak sah, atau melanggar kewajiban penerima bantuan.',
      ],
      penutup: 'Demikian pernyataan ini dibuat dengan sebenar-benarnya untuk digunakan dalam proses seleksi Beasiswa Pendidikan Reguler Mahasiswa Program MACE.',
    }),
  },
];

// Bangun isi surat sebagai dokumen HTML (dibuka di MS Word) yang bisa diedit.
export function buildSuratHtml(surat, dataDiri = {}) {
  const { pembuka, points, penutup } = surat.build(dataDiri);
  const dotted = (v) => `${v || '............................................'}`;
  const listItems = points.map((p, i) => `<li>${p}</li>`).join('\n');
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${surat.title}</title>
<style>
  body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #000; }
  h2 { text-align: center; text-decoration: underline; margin-bottom: 28px; }
  .field { margin: 10px 0; }
  ol { margin: 14px 0 14px 28px; }
  ol li { margin-bottom: 8px; text-align: justify; }
  .sign { margin-top: 40px; }
  .materai { color: #888; margin: 26px 0; }
</style></head>
<body>
  <h2>${surat.title.toUpperCase()}</h2>
  <p>Saya yang bertanda tangan di bawah ini:</p>
  <div class="field">Nama lengkap&nbsp;: ${dotted(dataDiri.nama)}</div>
  <div class="field">NIK&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${dotted(dataDiri.nik)}</div>
  <div class="field">Perguruan tinggi&nbsp;: ${dotted(dataDiri.nama_pt)}</div>
  <div class="field">Program studi/jenjang&nbsp;: ${dotted([dataDiri.program_studi, dataDiri.jenjang].filter(Boolean).join(' / '))}</div>
  <p>${pembuka}</p>
  <ol>
    ${listItems}
  </ol>
  <p style="text-align: justify">${penutup}</p>
  <div class="sign">
    <p>........................, ........................ 20....</p>
    <p>Yang membuat pernyataan,</p>
    <p class="materai">Materai</p>
    <p>Nama lengkap&nbsp;: ............................................................</p>
  </div>
</body></html>`;
}

// Gabungkan semua field menjadi satu peta name -> label (untuk tampilan admin).
export const ALL_FIELD_LABELS = [
  ...DATA_DIRI_FIELDS, ...PENDIDIKAN_FIELDS, ...KELUARGA_FIELDS,
  ...D_DOSEN_FIELDS, ...D_AKADEMIK_KEU_FIELDS,
].reduce((acc, f) => { acc[f.name] = f.label; return acc; }, {});

// State data diri awal (semua field + flag validasi).
export const buildInitialDataDiri = (kabupatenAsal = '') => {
  const base = {};
  for (const f of [
    ...DATA_DIRI_FIELDS, ...PENDIDIKAN_FIELDS, ...KELUARGA_FIELDS,
    ...D_DOSEN_FIELDS, ...D_AKADEMIK_KEU_FIELDS,
  ]) {
    base[f.name] = f.defaultValue || '';
  }
  if (kabupatenAsal) base.kabupaten_asal = kabupatenAsal;
  // Flag untuk sistem poin (diisi oleh tombol validasi).
  base.nim_terdaftar = false;
  base.nik_terdaftar = false;
  base.ktp_papua = false;
  base.is_oap = false;
  return base;
};

// ---- Registry form per program --------------------------------------------
// Tiap program punya langkah detail, daftar dokumen, dan daftar surat sendiri.
// Wizard membaca ini untuk merender langkah secara dinamis.
const REGULER_FORM = {
  detailSteps: [
    { key: 'pendidikan', shortTitle: 'Pendidikan', title: 'Pendidikan / Universitas', banner: 'Isi data pendidikan / perguruan tinggi Anda. Verifikasi NIM akan otomatis mengisi nama, PT, prodi, dan IPK.', fields: PENDIDIKAN_FIELDS },
    { key: 'keluarga', shortTitle: 'Keluarga', title: 'Keluarga & Keuangan', banner: 'Isi data keluarga dan kondisi keuangan pendidikan.', fields: KELUARGA_FIELDS },
  ],
  dokumenList: DOKUMEN_LIST,
  wajibDokumen: WAJIB_DOKUMEN,
  suratList: SURAT_LIST,
};

const DOKTORAL_FORM = {
  detailSteps: [
    { key: 'dosen', shortTitle: 'Dosen & S3', title: 'Data Dosen & Program Doktoral', banner: 'Isi data kepegawaian sebagai dosen dan rencana program doktoral (S3) Anda.', fields: D_DOSEN_FIELDS },
    { key: 'akademik', shortTitle: 'Akademik & Biaya', title: 'Rekam Akademik, Publikasi & Keuangan', banner: 'Isi rekam jejak akademik/publikasi serta rincian biaya dan kondisi ekonomi.', fields: D_AKADEMIK_KEU_FIELDS },
  ],
  dokumenList: DOKUMEN_D_LIST,
  wajibDokumen: WAJIB_DOKUMEN_D,
  // Program D tetap punya langkah Surat: unduh template -> isi -> unggah.
  // Isinya sama dengan reguler (Surat Komitmen Pemohon & Surat Pernyataan Kebenaran Data).
  suratList: SURAT_LIST,
};

export const PROGRAM_FORMS = {
  A: REGULER_FORM,
  B: REGULER_FORM,
  C: REGULER_FORM,
  D: DOKTORAL_FORM,
};

// Pilihan program jalur Provinsi (menambah Program D: Doktoral).
export const PROGRAM_OPTIONS_PROVINSI = [
  { id: 'A', title: 'Studi Akhir / Tugas Akhir / Skripsi', desc: 'Untuk mahasiswa yang sedang menyelesaikan tugas akhir atau skripsi.', color: 'bg-blue-500' },
  { id: 'B', title: 'Koas (Khusus Kedokteran)', desc: 'Mahasiswa kedokteran yang sedang menjalani masa profesi dokter (Koas).', color: 'bg-rose-500' },
  { id: 'C', title: 'Spesialis (Dokter Spesialis)', desc: 'Program bantuan pendidikan spesialisasi bagi dokter Orang Asli Papua.', color: 'bg-emerald-500' },
  { id: 'D', title: 'Pendidikan S3 (Doktoral)', desc: 'Bantuan studi doktoral khusus untuk dosen Orang Asli Papua.', color: 'bg-amber-500' },
];
