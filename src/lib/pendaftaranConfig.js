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

// Program untuk jalur Kabupaten/Kota.
export const PROGRAM_OPTIONS_KABKOTA = [
  { id: 'A', title: 'Beasiswa Reguler', desc: 'Bantuan biaya pendidikan reguler untuk mahasiswa S1/D4 Orang Asli Papua.', color: 'bg-indigo-500' },
  { id: 'B', title: 'Studi Akhir', desc: 'Untuk mahasiswa yang sedang menyelesaikan tugas akhir / skripsi.', color: 'bg-blue-500' },
  { id: 'C', title: 'Koas', desc: 'Mahasiswa kedokteran yang sedang menjalani masa profesi dokter (Koas).', color: 'bg-rose-500' },
  { id: 'D', title: 'Spesialis', desc: 'Program bantuan pendidikan spesialisasi bagi dokter Orang Asli Papua.', color: 'bg-emerald-500' },
  { id: 'F', title: 'Bantuan Pembiayaan Pendidikan Profesi', desc: 'Bantuan biaya pendidikan profesi (Ners, Apoteker, Akuntan, Guru/PPG, dll.) bagi OAP.', color: 'bg-teal-500' },
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

// ---- Field khusus Program B: Studi Akhir (Bantuan Penyelesaian Studi) -----
// Melanjutkan data diri umum (1-12). Nomor mengikuti tabel pemohon.
export const STUDI_AKHIR_FIELDS = [
  { no: 12, name: 'nim', label: 'NIM', type: 'text', special: 'nim', required: true, placeholder: 'Nomor Induk Mahasiswa' },
  { no: 13, name: 'jenjang', label: 'Jenjang Pendidikan', type: 'select', required: true, options: ['D3', 'D4', 'S1', 'S2', 'S3'] },
  { no: 14, name: 'nama_pt', label: 'Perguruan Tinggi', type: 'text', required: true },
  { no: 14, name: 'program_studi', label: 'Program Studi (Prodi)', type: 'text', required: true },
  { no: 15, name: 'ipk', label: 'Indeks Prestasi Kumulatif (IPK)', type: 'text', placeholder: 'Contoh: 3.50' },
  { no: 16, name: 'sks_lulus', label: 'Jumlah SKS Lulus', type: 'text' },
  { no: 17, name: 'tahap_akhir', label: 'Tahap Akhir Saat Ini', type: 'select', required: true, full: true, options: [
    'Sudah selesai kuliah, sedang menyusun skripsi/TA menjelang ujian akhir',
    'Sedang menyusun skripsi/TA dan telah selesai penelitian',
    'Telah memasuki tahap penelitian atau penyusunan TA',
    'Sedang mempersiapkan rencana tugas akhir (proposal)',
  ] },
  { no: 18, name: 'kewajiban_belum_selesai', label: 'Kewajiban Akhir Belum Selesai', type: 'textarea', full: true, placeholder: 'Sebutkan: skripsi, tugas akhir, laporan akhir, seminar proposal, dll.' },
  { no: 19, name: 'target_waktu', label: 'Target Waktu Kelulusan', type: 'select', required: true, full: true, options: [
    'Rencana sangat jelas & realistis selesai dalam ≤ 6 bulan',
    'Rencana jelas dengan target selesai ≤ 12 bulan',
    'Memiliki target tetapi memerlukan perbaikan',
  ] },
  { no: 23, name: 'penghasilan_ortu', label: 'Penghasilan Ortu Total', type: 'number', prefix: 'Rp' },
  { no: 24, name: 'tanggungan_ortu', label: 'Jumlah Tanggungan Ortu', type: 'number', suffix: 'orang' },
  { no: 25, name: 'penerima_bansos', label: 'Penerima Bantuan Sosial', type: 'select', options: ['Ya', 'Tidak'] },
  { no: 25, name: 'jenis_bansos', label: 'Jenis Bansos (jika menerima)', type: 'text' },
  { no: 26, name: 'kondisi_khusus', label: 'Kondisi Khusus (Jika Ada)', type: 'select', full: true, options: [
    'Penyandang Disabilitas',
    'Anak Yatim / Piatu / Yatim Piatu',
    'Tidak Memiliki Kondisi Khusus',
  ] },
];

// ---- Field khusus Program C: Koas (Bantuan Kepaniteraan Klinik) -----------
// Melanjutkan data diri umum (nama, NIK, TTL, jenis kelamin, wilayah, OAP,
// alamat, HP, email). Nomor mengikuti tabel pemohon Koas.
export const COAS_FIELDS = [
  { no: 3, name: 'nim', label: 'NIM', type: 'text', special: 'nim', required: true, placeholder: 'Nomor Induk Mahasiswa' },
  { no: 11, name: 'nama_pt', label: 'Nama Perguruan Tinggi', type: 'text', required: true },
  { no: 12, name: 'akreditasi_pt', label: 'Status Akreditasi PT', type: 'select', options: ['Unggul', 'Baik Sekali', 'Baik', 'Cukup', 'Belum/Tidak Terakreditasi'] },
  { no: 13, name: 'ipk', label: 'IPK Terakhir', type: 'text', placeholder: 'Contoh: 3.50' },
  { no: 14, name: 'rumah_sakit_pendidikan', label: 'Rumah Sakit Pendidikan', type: 'text', full: true },
  { no: 15, name: 'progres_koas', label: 'Progres KOAS Saat Ini', type: 'select', required: true, full: true, options: [
    'Baru Mulai KOAS',
    'Telah menjalani 25% – 49%',
    'Telah menjalani 50% – 74%',
    'Telah menjalani ≥ 75%',
  ] },
  { no: 16, name: 'proyeksi_sisa_waktu', label: 'Proyeksi Sisa Waktu KOAS', type: 'select', required: true, full: true, options: [
    '≤ 6 Bulan',
    '7–9 Bulan',
    '10–12 Bulan',
    '> 12 Bulan',
  ] },
  { no: 17, name: 'status_dtks', label: 'Status DTKS Dinas Sosial', type: 'select', options: ['Terdaftar', 'Tidak'] },
  { no: 17, name: 'no_dtks', label: 'No. DTKS (jika terdaftar)', type: 'text' },
  { no: 18, name: 'kondisi_ekonomi', label: 'Kondisi Kemampuan Ekonomi', type: 'select', required: true, full: true, options: [
    'Sangat Rentan / Tidak Mampu membiayai KOAS',
    'Terbatas / Mengalami Kesulitan Pembiayaan',
    'Menengah dengan Keterbatasan Pembiayaan',
    'Mampu Sebagian Besar / Mandiri',
  ] },
];

// ---- Field Program D: Spesialis (Dokter Spesialis) ------------------------
// Item 1-9 identitas diambil dari langkah Data Diri umum. Nomor ikut tabel.
export const SP_DOKTER_FIELDS = [
  { no: 11, name: 'status_perkawinan', label: 'Status Perkawinan (jika dipersyaratkan)', type: 'select', options: ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'] },
  { no: 12, name: 'nomor_ijazah_dokter', label: 'Nomor Ijazah Dokter', type: 'text' },
  { no: 13, name: 'pt_penerbit_ijazah', label: 'Perguruan Tinggi Penerbit Ijazah', type: 'text' },
  { no: 14, name: 'tahun_lulus_dokter', label: 'Tahun Lulus Pendidikan Dokter', type: 'text', placeholder: 'Contoh: 2020' },
  { no: 15, name: 'nomor_str', label: 'Nomor Surat Tanda Registrasi (STR) Dokter', type: 'text' },
  { no: 16, name: 'masa_berlaku_str', label: 'Masa Berlaku STR', type: 'text', placeholder: 'Contoh: sampai 2027' },
  { no: 17, name: 'instansi_kerja', label: 'Instansi/Tempat Bekerja Saat Ini', type: 'text', full: true },
  { no: 18, name: 'status_kepegawaian_sp', label: 'Status Kepegawaian atau Status Pekerjaan', type: 'text', full: true },
  { no: 19, name: 'pengalaman_pelayanan', label: 'Pengalaman Pelayanan Kesehatan', type: 'textarea', full: true },
  { no: 20, name: 'pengalaman_pengabdian', label: 'Pengalaman Pengabdian kepada Masyarakat', type: 'textarea', full: true },
];

export const SP_PROGRAM_FIELDS = [
  { no: 21, name: 'nama_pt_kedokteran', label: 'Nama Perguruan Tinggi/Fakultas Kedokteran', type: 'text', full: true },
  { no: 22, name: 'nama_rs_pendidikan', label: 'Nama Rumah Sakit Pendidikan', type: 'text', full: true },
  { no: 23, name: 'program_spesialisasi', label: 'Program/Bidang Spesialisasi', type: 'text', required: true },
  { no: 24, name: 'status_pendidikan_sp', label: 'Status Pendidikan', type: 'select', required: true, options: ['Calon peserta baru', 'Sedang mengikuti PPDS'] },
  { no: 25, name: 'tanggal_mulai_pendidikan', label: 'Tanggal Mulai Pendidikan', type: 'text' },
  { no: 26, name: 'semester_saat_ini', label: 'Semester/Tahap Pendidikan Saat Ini', type: 'text' },
  { no: 27, name: 'perkiraan_selesai_pendidikan', label: 'Perkiraan Tanggal Penyelesaian Pendidikan', type: 'text' },
  { no: 28, name: 'persentase_progres_sp', label: 'Persentase/Tahapan Pendidikan yang Telah Diselesaikan', type: 'text', suffix: '%' },
  { no: 29, name: 'nomor_loa', label: 'Nomor dan Tanggal LoA/Surat Diterima (jika calon peserta baru)', type: 'text', full: true },
  { no: 30, name: 'nomor_skt_aktif', label: 'Nomor dan Tanggal Surat Keterangan Aktif (jika sedang PPDS)', type: 'text', full: true },
  { no: 31, name: 'status_akreditasi_program', label: 'Status Akreditasi atau Pemenuhan Ketentuan Program Pendidikan', type: 'text', full: true },
  { no: 32, name: 'kendala_pendidikan', label: 'Kendala yang Dihadapi dalam Penyelesaian Pendidikan, jika ada', type: 'textarea', full: true },
  { no: 33, name: 'bidang_spesialisasi_diajukan', label: 'Bidang Spesialisasi yang Diajukan', type: 'text', full: true },
  { no: 34, name: 'alasan_bidang', label: 'Alasan Memilih Bidang Spesialisasi Tersebut', type: 'textarea', full: true },
  { no: 35, name: 'keterkaitan_kebutuhan', label: 'Keterkaitan Bidang Spesialisasi dengan Kebutuhan Pelayanan Kesehatan di Provinsi Papua', type: 'textarea', full: true },
  { no: 36, name: 'sasaran_pengabdian', label: 'Kabupaten/Kota atau Fasilitas Pelayanan Kesehatan Sasaran Pengabdian', type: 'text', full: true },
  { no: 37, name: 'rencana_kontribusi_sp', label: 'Rencana Kontribusi Setelah Menyelesaikan Pendidikan', type: 'textarea', full: true },
];

export const SP_FINANCE_FIELDS = [
  { no: 39, name: 'total_biaya_sp', label: 'Total Biaya Pendidikan yang Harus Ditanggung', type: 'number', prefix: 'Rp' },
  { no: 40, name: 'biaya_per_semester_sp', label: 'Biaya Pendidikan per Semester/Tahap', type: 'number', prefix: 'Rp' },
  { no: 41, name: 'biaya_dibayar', label: 'Biaya yang Telah Dibayar', type: 'number', prefix: 'Rp' },
  { no: 42, name: 'sisa_biaya', label: 'Sisa Biaya yang Belum Dibayar', type: 'number', prefix: 'Rp' },
  { no: 43, name: 'komponen_biaya_dimohonkan_sp', label: 'Komponen Biaya yang Dimohonkan Bantuannya', type: 'textarea', full: true },
  { no: 44, name: 'sumber_pembiayaan_sp', label: 'Sumber Pembiayaan Pendidikan Saat Ini', type: 'text', full: true },
  { no: 45, name: 'jumlah_bantuan_dimohonkan_sp', label: 'Jumlah Bantuan yang Dimohonkan', type: 'number', prefix: 'Rp' },
  { no: 46, name: 'menerima_bantuan_lain', label: 'Apakah Sedang Menerima Bantuan/Beasiswa Lain?', type: 'select', options: ['Ya', 'Tidak'] },
  { no: 47, name: 'detail_bantuan_lain', label: 'Jika Ya, Nama Pemberi Bantuan dan Komponen yang Dibiayai', type: 'text', full: true },
  { no: 48, name: 'menerima_apbd_sama', label: 'Apakah Menerima Bantuan APBD Provinsi Papua untuk Komponen Biaya yang Sama?', type: 'select', options: ['Ya', 'Tidak'] },
  { no: 49, name: 'pekerjaan_sumber_penghasilan', label: 'Pekerjaan dan Sumber Penghasilan Utama', type: 'text', full: true },
  { no: 50, name: 'penghasilan_bulanan', label: 'Perkiraan Penghasilan Bulanan', type: 'number', prefix: 'Rp' },
  { no: 51, name: 'sumber_pembiayaan_selama_ini', label: 'Sumber Pembiayaan Pendidikan Selama Ini', type: 'text', full: true },
  { no: 52, name: 'tanggungan_keluarga_sp', label: 'Tanggungan Keluarga, jika Relevan', type: 'text', full: true },
  { no: 53, name: 'kendala_utama_biaya', label: 'Kendala Utama dalam Membiayai Pendidikan Spesialis', type: 'textarea', full: true },
  { no: 54, name: 'bantuan_diperlukan', label: 'Bantuan Pembiayaan yang Diperlukan dan Alasannya', type: 'textarea', full: true },
];

// ---- Field Program F: Bantuan Pembiayaan Pendidikan Profesi ---------------
// Item identitas (nama, NIK, TTL, jenis kelamin, OAP, alamat, HP, email) dari
// Data Diri umum. Nomor mengikuti tabel pemohon Profesi.
export const PROFESI_FIELDS = [
  { no: 2, name: 'nim', label: 'Nomor Induk Mahasiswa', type: 'text', special: 'nim', required: true, placeholder: 'Nomor Induk Mahasiswa' },
  { no: 10, name: 'nama_pt', label: 'Nama Perguruan Tinggi/Lembaga', type: 'text', required: true, full: true },
  { no: 11, name: 'alamat_pt', label: 'Alamat Perguruan Tinggi/Lembaga', type: 'textarea', full: true },
  { no: 12, name: 'program_studi', label: 'Program Studi Profesi', type: 'text', required: true, full: true, placeholder: 'Contoh: Ners, Apoteker, Akuntan, Guru/PPG, dll.' },
  { no: 13, name: 'ipk', label: 'IPK / Indeks Prestasi Terakhir', type: 'text', placeholder: 'Contoh: 3.50' },
  { no: 14, name: 'tahapan_progres', label: 'Tahapan / Progres Pendidikan', type: 'select', required: true, full: true, options: [
    'Baru Memulai Pendidikan Profesi',
    'Telah menyelesaikan 25% – 49%',
    'Telah menyelesaikan 50% – 74%',
    'Telah menyelesaikan ≥ 75%',
  ] },
  { no: 15, name: 'proyeksi_sisa_waktu_profesi', label: 'Proyeksi Sisa Waktu Studi', type: 'select', required: true, full: true, options: [
    '≤ 6 Bulan',
    '7–9 Bulan',
    '10–12 Bulan',
    '> 12 Bulan',
  ] },
  { no: 16, name: 'kebutuhan_biaya', label: 'Kebutuhan Biaya Profesi (Riil)', type: 'number', prefix: 'Rp', full: true },
  { no: 17, name: 'status_dtks', label: 'Status DTKS Dinas Sosial', type: 'select', options: ['Terdaftar', 'Tidak'] },
  { no: 17, name: 'no_dtks', label: 'No. DTKS (jika terdaftar)', type: 'text' },
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

// ---- Dokumen Program B: Studi Akhir (10) ----------------------------------
export const DOKUMEN_B_LIST = [
  { name: 'ktp_kk', label: 'KTP & KK', desc: 'JPG/PDF, Maks 2MB' },
  { name: 'dokumen_oap_lma', label: 'Dokumen OAP (jika OAP) yang diterbitkan oleh LMA', desc: 'PDF, Maks 2MB', conditional: 'oap' },
  { name: 'sk_aktif_kuliah', label: 'Surat Keterangan Aktif Kuliah', desc: 'PDF, Maks 2MB' },
  { name: 'rekomendasi_tahap_akhir', label: 'Surat Rekomendasi Tahap Akhir dari Kampus', desc: 'PDF, Maks 2MB' },
  { name: 'bukti_progres_ta', label: 'Bukti Progres Fisik Tugas Akhir/Skripsi', desc: 'PDF, Maks 2MB' },
  { name: 'surat_target_waktu', label: 'Surat Target Waktu Kelulusan Rekomendasi Dosen Pembimbing', desc: 'PDF, Maks 2MB' },
  { name: 'transkrip_khs', label: 'Transkrip Nilai / KHS Terakhir', desc: 'PDF, Maks 2MB' },
  { name: 'berkas_ekonomi', label: 'Berkas Pendukung Ekonomi (Slip Gaji/Pernyataan Penghasilan)', desc: 'PDF, Maks 2MB' },
  { name: 'bukti_kondisi_khusus', label: 'Bukti Kondisi Khusus Disabilitas/Yatim (Jika Ada)', desc: 'PDF, Maks 2MB', conditional: 'khusus' },
  { name: 'pakta_integritas', label: 'Pakta Integritas Ter-meterai', desc: 'PDF, Maks 2MB' },
];

// Dokumen wajib Program B (dokumen OAP & kondisi khusus bersifat kondisional).
export const WAJIB_DOKUMEN_B = [
  'ktp_kk', 'sk_aktif_kuliah', 'rekomendasi_tahap_akhir', 'bukti_progres_ta',
  'surat_target_waktu', 'transkrip_khs', 'berkas_ekonomi', 'pakta_integritas',
];

// ---- Dokumen Program C: Koas (8; Pakta Integritas via langkah Surat) -------
export const DOKUMEN_C_LIST = [
  { name: 'ktp_kk', label: 'Salinan KTP & KK', desc: 'JPG/PDF, Maks 2MB' },
  { name: 'dokumen_oap_mrp', label: 'Dokumen OAP dari MRP/Dewan Adat', desc: 'PDF, Maks 2MB', conditional: 'oap' },
  { name: 'sk_aktif_kuliah', label: 'Surat Keterangan Aktif Kuliah', desc: 'PDF, Maks 2MB' },
  { name: 'pengantar_koas_progres', label: 'Surat Pengantar KOAS & Bukti Progres Stase dari FK', desc: 'PDF, Maks 2MB' },
  { name: 'transkrip_ipk', label: 'Transkrip IPK Terakhir', desc: 'PDF, Maks 2MB' },
  { name: 'surat_dtks', label: 'Surat DTKS dari Dinas Sosial', desc: 'PDF, Maks 2MB', conditional: 'dtks' },
  { name: 'komitmen_pengabdian', label: 'Surat Pernyataan Komitmen Pengabdian', desc: 'PDF, Maks 2MB' },
  { name: 'buku_tabungan', label: 'Salinan Buku Tabungan', desc: 'PDF, Maks 2MB' },
];

// Dokumen wajib Program C (OAP & DTKS bersifat kondisional).
export const WAJIB_DOKUMEN_C = [
  'ktp_kk', 'sk_aktif_kuliah', 'pengantar_koas_progres', 'transkrip_ipk',
  'komitmen_pengabdian', 'buku_tabungan',
];

// ---- Dokumen Program D: Spesialis (20; pernyataan via langkah Surat) -------
export const DOKUMEN_SP_LIST = [
  { name: 'formulir_pendaftaran', label: 'Formulir pendaftaran yang telah diisi lengkap dan ditandatangani', desc: 'PDF, Maks 2MB' },
  { name: 'ktp', label: 'Kartu Tanda Penduduk (KTP) yang masih berlaku', desc: 'JPG/PDF, Maks 2MB' },
  { name: 'kartu_keluarga', label: 'Kartu Keluarga (KK), apabila diperlukan untuk verifikasi identitas dan wilayah asal', desc: 'JPG/PDF, Maks 2MB', conditional: 'perlu' },
  { name: 'dokumen_oap_lma', label: 'Dokumen resmi pendukung status Orang Asli Papua (OAP) yang diterbitkan oleh LMA', desc: 'PDF, Maks 2MB' },
  { name: 'pasfoto', label: 'Pasfoto terbaru, apabila dipersyaratkan dalam pengumuman pendaftaran', desc: 'JPG, Maks 2MB', conditional: 'perlu' },
  { name: 'ijazah_dokter', label: 'Ijazah dokter yang sah', desc: 'PDF, Maks 2MB' },
  { name: 'str_dokter', label: 'Surat Tanda Registrasi (STR) Dokter yang masih berlaku atau dokumen lain yang dipersyaratkan', desc: 'PDF, Maks 2MB' },
  { name: 'pengalaman_profesional', label: 'Dokumen pendukung pengalaman profesional, pelayanan kesehatan, atau pengabdian (jika tersedia)', desc: 'PDF, Maks 2MB', conditional: 'ada' },
  { name: 'loa_spesialis', label: 'LoA atau surat keterangan diterima sebagai peserta pendidikan spesialis (khusus calon peserta baru)', desc: 'PDF, Maks 2MB', conditional: 'baru' },
  { name: 'skt_aktif_ppds', label: 'Surat keterangan aktif dari institusi pendidikan (bagi yang sedang mengikuti PPDS)', desc: 'PDF, Maks 2MB', conditional: 'ppds' },
  { name: 'surat_status_progres', label: 'Surat keterangan resmi mengenai status dan progres pendidikan spesialis dari perguruan tinggi', desc: 'PDF, Maks 2MB' },
  { name: 'surat_tahap_kelulusan', label: 'Surat keterangan tahap pendidikan yang telah diselesaikan dan perkiraan waktu kelulusan', desc: 'PDF, Maks 2MB' },
  { name: 'transkrip_akademik', label: 'Ijazah, transkrip akademik, atau dokumen akademik pendukung lainnya', desc: 'PDF, Maks 2MB' },
  { name: 'surat_tagihan_biaya', label: 'Surat tagihan resmi atau rincian biaya pendidikan dari institusi penyelenggara', desc: 'PDF, Maks 2MB' },
  { name: 'rincian_komponen_biaya', label: 'Rincian komponen biaya yang harus ditanggung pelamar dari perguruan tinggi', desc: 'PDF, Maks 2MB' },
  { name: 'bukti_pembayaran', label: 'Bukti pembayaran biaya pendidikan yang telah dibayarkan, jika ada', desc: 'PDF, Maks 2MB', conditional: 'ada' },
  { name: 'perhitungan_sisa_biaya', label: 'Perhitungan sisa biaya pendidikan yang belum dibayar', desc: 'PDF, Maks 2MB' },
  { name: 'dokumen_kondisi_ekonomi', label: 'Dokumen pendukung kondisi ekonomi dan kemampuan pembiayaan pelamar', desc: 'PDF, Maks 2MB' },
  { name: 'surat_keterangan_penghasilan', label: 'Surat keterangan penghasilan atau dokumen pendukung sumber penghasilan', desc: 'PDF, Maks 2MB', conditional: 'ada' },
  { name: 'pernyataan_selesai_pendidikan', label: 'Surat pernyataan kesanggupan menyelesaikan pendidikan sesuai ketentuan program', desc: 'PDF, Maks 2MB' },
];

// Dokumen wajib Program D (sisanya kondisional).
export const WAJIB_DOKUMEN_SP = [
  'formulir_pendaftaran', 'ktp', 'dokumen_oap_lma', 'ijazah_dokter', 'str_dokter',
  'surat_status_progres', 'surat_tahap_kelulusan', 'transkrip_akademik',
  'surat_tagihan_biaya', 'rincian_komponen_biaya', 'perhitungan_sisa_biaya',
  'dokumen_kondisi_ekonomi', 'pernyataan_selesai_pendidikan',
];

// ---- Dokumen Program F: Profesi (9; pernyataan via langkah Surat) ----------
export const DOKUMEN_F_LIST = [
  { name: 'ktp_kk', label: 'Salinan KTP & KK', desc: 'JPG/PDF, Maks 2MB' },
  { name: 'dokumen_oap_mrp', label: 'Surat Keterangan OAP dari MRP / Dewan Adat', desc: 'PDF, Maks 2MB', conditional: 'oap' },
  { name: 'ijazah_sebelumnya', label: 'Ijazah/Dokumen Akademik Kelulusan Sebelumnya', desc: 'PDF, Maks 2MB' },
  { name: 'skt_aktif_profesi', label: 'Surat Keterangan Aktif Mahasiswa Profesi', desc: 'PDF, Maks 2MB' },
  { name: 'surat_progres_profesi', label: 'Surat Keterangan Progres/Tahapan Pendidikan Profesi dari Kampus', desc: 'PDF, Maks 2MB' },
  { name: 'transkrip_akademik_profesi', label: 'Transkrip Nilai Akademik Terakhir', desc: 'PDF, Maks 2MB' },
  { name: 'rincian_biaya_profesi', label: 'Dokumen Rincian Besaran Biaya Pendidikan Profesi', desc: 'PDF, Maks 2MB' },
  { name: 'surat_dtks_profesi', label: 'Surat Keterangan DTKS dari Dinas Sosial', desc: 'PDF, Maks 2MB', conditional: 'dtks' },
  { name: 'rekening_bank', label: 'Salinan Rekening Bank', desc: 'JPG/PDF, Maks 2MB' },
];

// Dokumen wajib Program F (OAP & DTKS bersifat kondisional).
export const WAJIB_DOKUMEN_F = [
  'ktp_kk', 'ijazah_sebelumnya', 'skt_aktif_profesi', 'surat_progres_profesi',
  'transkrip_akademik_profesi', 'rincian_biaya_profesi', 'rekening_bank',
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

// ---- Surat Program B: Studi Akhir (template kustom, render HTML penuh) ----
const SURAT_B_STYLE = `
  body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #000; }
  h2 { text-align: center; text-decoration: underline; margin: 0 0 6px; }
  .center { text-align: center; }
  .sub { text-align: center; font-weight: bold; margin-bottom: 24px; }
  .field { margin: 6px 0; }
  .line { display: inline-block; border-bottom: 1px solid #000; min-width: 260px; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0; }
  td, th { border: 1px solid #000; padding: 6px 8px; font-size: 11pt; }
  .sig { margin-top: 48px; }
`;

export const SURAT_B_LIST = [
  {
    name: 'rencana_target_waktu',
    title: 'Rencana Target Waktu Penyelesaian Studi',
    desc: 'Unduh template, isi & tanda tangani, lalu unggah kembali.',
    render: (d) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Rencana Target Waktu Penyelesaian Studi</title>
<style>${SURAT_B_STYLE}</style></head>
<body>
  <h2>RENCANA TARGET WAKTU PENYELESAIAN STUDI</h2>
  <p class="sub">PROGRAM MACE &ndash; BANTUAN PENYELESAIAN STUDI</p>
  <p>Saya yang bertanda tangan di bawah ini:</p>
  <div class="field">Nama Lengkap&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span class="line">${d.nama || ''}</span></div>
  <div class="field">NIM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span class="line">${d.nim || ''}</span></div>
  <div class="field">Program Studi / Jenjang&nbsp;: <span class="line">${d.program_studi || ''}</span>&nbsp;&nbsp;[&nbsp;&nbsp;] Diploma&nbsp;&nbsp;[&nbsp;&nbsp;] S1</div>
  <div class="field">Perguruan Tinggi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span class="line">${d.nama_pt || ''}</span></div>
  <div class="field">Judul Tugas Akhir / Skripsi&nbsp;: <span class="line"></span></div>
  <p>Dengan ini menyusun rencana dan lini masa (timeline) penyelesaian studi akhir saya dengan target kelulusan dalam waktu:</p>
  <p>[&nbsp;&nbsp;] &le; 6 Bulan (Sangat Prioritas - Skor Maksimal)<br>[&nbsp;&nbsp;] &le; 12 Bulan (Prioritas)</p>
  <p>Rincian Target Capaian Bulanan:</p>
  <table>
    <tr><th>Bulan</th><th>Tahapan Akademik</th><th>Target Penyelesaian</th></tr>
    <tr><td>Bulan 1</td><td>Penyusunan Proposal / Bab I&ndash;III</td><td>Selesai</td></tr>
    <tr><td>Bulan 2</td><td>Seminar Proposal &amp; Perbaikan</td><td>Selesai</td></tr>
    <tr><td>Bulan 3</td><td>Pengumpulan Data / Penelitian Lapangan</td><td>Selesai</td></tr>
    <tr><td>Bulan 4</td><td>Pengolahan Data &amp; Penyusunan Bab IV&ndash;V</td><td></td></tr>
    <tr><td>Bulan 5</td><td>Seminar Hasil Penelitian</td><td></td></tr>
    <tr><td>Bulan 6</td><td>Ujian Sidang Skripsi / Tugas Akhir &amp; Wisuda</td><td>Lulus &amp; Yudisium</td></tr>
    <tr><td></td><td></td><td></td></tr>
    <tr><td></td><td></td><td></td></tr>
  </table>
  <p>Demikian rencana target ini saya susun dengan realistis sebagai komitmen penyelesaian studi saya melalui Program MACE.</p>
  <p class="sig">........................, ........................ 2026<br>Mahasiswa Pendaftar,<br><br><br>( .......................................... )<br><strong>Nama Jelas &amp; NIM</strong></p>
</body></html>`,
  },
  {
    name: 'surat_rekomendasi_dosen',
    title: 'Surat Rekomendasi dan Keterangan Tahap Studi Akhir',
    desc: 'Template untuk diisi &amp; ditandatangani dosen pembimbing, lalu unggah.',
    render: (d) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Surat Rekomendasi dan Keterangan Tahap Studi Akhir</title>
<style>${SURAT_B_STYLE}</style></head>
<body>
  <p class="center"><strong>KOP SURAT FAKULTAS / PROGRAM STUDI PERGURUAN TINGGI</strong></p>
  <p class="center">..........................................................................................</p>
  <h2>SURAT REKOMENDASI DAN KETERANGAN TAHAP STUDI AKHIR</h2>
  <p><strong>Nomor:</strong> <span class="line"></span></p>
  <p>Yang bertanda tangan di bawah ini:</p>
  <div class="field">Nama Dosen / NIDN&nbsp;&nbsp;&nbsp;&nbsp;: <span class="line"></span></div>
  <div class="field">Jabatan / Sasi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span class="line">Dosen Pembimbing Tugas Akhir / Skripsi</span></div>
  <div class="field">Program Studi / Fakultas&nbsp;: <span class="line">................................ / ................................</span></div>
  <div class="field">Perguruan Tinggi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span class="line"></span></div>
  <p>dengan ini memberikan rekomendasi dan menerangkan bahwa mahasiswa berikut:</p>
  <div class="field">Nama Mahasiswa&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span class="line">${d.nama || ''}</span></div>
  <div class="field">NIM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span class="line">${d.nim || ''}</span></div>
  <div class="field">Program Studi / Jenjang&nbsp;: <span class="line">${d.program_studi || ''}</span>&nbsp;&nbsp;/&nbsp;&nbsp;[&nbsp;&nbsp;] Diploma&nbsp;&nbsp;[&nbsp;&nbsp;] S1</div>
  <p>Adalah benar mahasiswa aktif yang berada di bawah bimbingan saya dan saat ini telah berada pada <strong>TAHAP AKHIR</strong> penyelesaian studi dengan rincian status progres sebagai berikut (beri tanda centang):</p>
  <p>[&nbsp;&nbsp;] Telah menyelesaikan seluruh mata kuliah dan sedang menyusun skripsi/tugas akhir menjelang ujian akhir (sidang meja hijau).</p>
  <p>[&nbsp;&nbsp;] Sedang menyelesaikan skripsi/tugas akhir dan telah melalui tahapan pengambilan data/penelitian.</p>
  <p>[&nbsp;&nbsp;] Telah memasuki tahap penelitian awal atau penyusunan proposal tugas akhir.</p>
  <p>[&nbsp;&nbsp;] Telah memenuhi sebagian besar kewajiban akademik dan sedang mempersiapkan rencana tugas akhir.</p>
  <p>Berdasarkan evaluasi bimbingan berkala, mahasiswa yang bersangkutan memiliki rencana studi yang jelas, kelayakan rencana yang baik, serta diproyeksikan dapat menyelesaikan seluruh kewajiban studi akademiknya hingga lulus dalam kurun waktu:</p>
  <p>[&nbsp;&nbsp;] &le; 6 Bulan<br>[&nbsp;&nbsp;] &le; 12 Bulan</p>
  <p>Demikian surat rekomendasi dan keterangan ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagai dokumen pendukung penilaian scoring seleksi Program MACE &ndash; Bantuan Penyelesaian Studi.</p>
  <p class="sig">........................, ........................ 2026<br>Dosen Pembimbing,<br><br><br>( .......................................... )<br><strong>Nama Jelas &amp; NIDN</strong></p>
</body></html>`,
  },
];

// ---- Surat Program C: Koas (Pakta Integritas / Surat Pernyataan) ----------
export const SURAT_C_LIST = [
  {
    name: 'pakta_integritas',
    title: 'Pakta Integritas / Surat Pernyataan',
    desc: 'Unduh template, isi & tanda tangani di atas materai, lalu unggah kembali.',
    render: (d) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Pakta Integritas - Koas</title>
<style>${SURAT_B_STYLE}</style></head>
<body>
  <h2>PAKTA INTEGRITAS / SURAT PERNYATAAN</h2>
  <p class="sub">PROGRAM MACE &ndash; BANTUAN PEMBIAYAAN KEPANITERAAN KLINIK (KOAS)<br>BAGI MAHASISWA KEDOKTERAN ORANG ASLI PAPUA (OAP)</p>
  <p>Yang bertanda tangan di bawah ini:</p>
  <ul>
    <li>Nama Lengkap : ${d.nama || '_________________________________'}</li>
    <li>NIM / No. Mahasiswa : ${d.nim || '_________________________________'}</li>
    <li>Fakultas / Program Studi : Kedokteran / Pendidikan Dokter</li>
    <li>Perguruan Tinggi : ${d.nama_pt || '_________________________________'}</li>
    <li>Alamat Rumah / Domisili : ${d.alamat || '_________________________________'}</li>
    <li>No. HP / WhatsApp : ${d.no_hp || '_________________________________'}</li>
  </ul>
  <p>Dengan ini menyatakan dengan sebenar-benarnya dan penuh tanggung jawab bahwa dalam rangka pengajuan dan penerimaan <strong>Bantuan Pembiayaan Kepaniteraan Klinik (KOAS) Program MACE</strong>, saya:</p>
  <ol>
    <li><strong>Keabsahan Status OAP:</strong> Benar merupakan Orang Asli Papua (OAP) yang dibuktikan dengan dokumen resmi yang sah dari Majelis Rakyat Papua (MRP) atau Dewan Adat sesuai ketentuan peraturan perundang-undangan.</li>
    <li><strong>Bebas Beasiswa Ganda (Double Funding):</strong> Tidak sedang menerima bantuan pembiayaan KOAS dari sumber pendanaan Pemerintah Daerah lainnya, serta tidak sedang menerima beasiswa atau bantuan pendidikan lain yang menyebabkan terjadinya duplikasi pembiayaan ganda (double funding) untuk komponen pembiayaan yang sama.</li>
    <li><strong>Kepatuhan Regulasi:</strong> Bersedia mematuhi seluruh ketentuan, prosedur, tata tertib, dan aturan hukum yang berlaku dalam Petunjuk Teknis Program MACE Dinas Pendidikan Provinsi Papua.</li>
    <li><strong>Pertanggungjawaban Penggunaan Dana:</strong> Bersedia menggunakan dana bantuan tersebut secara akuntabel hanya untuk kebutuhan tahapan profesi dokter/KOAS serta berkomitmen untuk menyampaikan laporan dan dokumen pertanggungjawaban penggunaan bantuan sesuai periode yang ditentukan.</li>
    <li><strong>Kemajuan Studi:</strong> Bersedia memberikan informasi, dokumen perkembangan stase akademik, serta bukti capaian kemajuan pelaksanaan KOAS secara jujur dan berkala kepada Tim Seleksi/Monitoring dan Evaluasi Dinas Pendidikan Provinsi Papua.</li>
    <li><strong>Sanksi Administratif:</strong> Apabila di kemudian hari ditemukan bahwa data, dokumen, atau pernyataan yang saya berikan tidak benar, memuat manipulasi, atau saya melanggar poin-poin di atas, maka saya bersedia menerima sanksi administratif berupa pembatalan sebagai penerima bantuan, penghentian penyaluran dana, mengembalikan dana yang telah diterima ke kas daerah, serta dituntut sesuai ketentuan hukum yang berlaku.</li>
  </ol>
  <p>Demikian Pakta Integritas ini saya buat dengan kesadaran penuh, sukarela, dan tanpa paksaan dari pihak mana pun untuk digunakan sebagaimana mestinya.</p>
  <p class="sig">........................, ........................ 2026<br>Yang Membuat Pernyataan,<br><br><em>Materai dan Tanda Tangan</em>&nbsp;&nbsp;<strong>Rp10.000</strong><br><br>( .......................................... )<br><strong>Nama Jelas &amp; NIM Mahasiswa</strong></p>
</body></html>`,
  },
];

// ---- Surat Program D: Spesialis (3 template kustom) -----------------------
const spIdentitas = (d, extra = []) => {
  const rows = [
    ['Nama lengkap', d.nama],
    ['NIK', d.nik],
    ['Tempat/Tanggal Lahir', d.ttl],
    ['Alamat', d.alamat],
    ['Kabupaten/Kota Asal di Provinsi Papua', d.kabupaten_asal],
    ['Nomor Telepon/WhatsApp', d.no_hp],
    ['Perguruan Tinggi/Fakultas Kedokteran', d.nama_pt_kedokteran],
    ['Program Pendidikan Dokter Spesialis', d.program_spesialisasi],
    ['Rumah Sakit Pendidikan', d.nama_rs_pendidikan],
    ...extra,
  ];
  return rows.map(([k, v]) => `<li>${k} : ${v || '_________________________________________'}</li>`).join('\n    ');
};
const SP_TUTUP = (pernyataan) => `<p>${pernyataan}</p>
  <p class="sig">........................, ........................ 20......<br>Yang membuat pernyataan,<br><br><em>Materai sesuai ketentuan</em><br><br>Tanda tangan&nbsp;: ______________________________<br>Nama lengkap&nbsp;: ______________________________</p>`;

export const SURAT_SP_LIST = [
  {
    name: 'pakta_integritas_sp',
    title: 'Pakta Integritas',
    desc: 'Unduh template, isi & tanda tangani di atas materai, lalu unggah kembali.',
    render: (d) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Pakta Integritas</title>
<style>${SURAT_B_STYLE}</style></head>
<body>
  <h2>PAKTA INTEGRITAS</h2>
  <p class="center">Nomor: ........................................</p>
  <p>Saya yang bertanda tangan di bawah ini:</p>
  <ol>
    ${spIdentitas(d)}
  </ol>
  <p>Dalam rangka mengikuti seleksi calon penerima <strong>Bantuan Pembiayaan Pendidikan Program Spesialis bagi Dokter Orang Asli Papua (OAP) melalui Program MACE pada Dinas Pendidikan Provinsi Papua</strong>, dengan ini menyatakan dan berkomitmen:</p>
  <ol>
    <li>Akan mengikuti seluruh tahapan pendaftaran, verifikasi administrasi, verifikasi dan validasi substantif, serta seleksi secara jujur, tertib, transparan, dan bertanggung jawab.</li>
    <li>Akan memberikan data, informasi, dan dokumen yang benar, sah, lengkap, serta dapat dipertanggungjawabkan.</li>
    <li>Tidak akan melakukan pemalsuan dokumen, memberikan keterangan yang tidak benar, melakukan manipulasi data, atau melakukan tindakan lain yang bertentangan dengan ketentuan program.</li>
    <li>Tidak akan melakukan tindakan yang bertujuan memengaruhi proses seleksi secara tidak sah, termasuk memberikan atau menjanjikan imbalan dalam bentuk apa pun kepada pihak yang terlibat dalam proses seleksi.</li>
    <li>Bersedia mengikuti proses verifikasi dan validasi terhadap identitas, status Orang Asli Papua (OAP), status profesi dokter, status pendidikan spesialis, kemampuan akademik, kebutuhan pembiayaan, dan dokumen pendukung lainnya.</li>
    <li>Apabila ditetapkan sebagai penerima bantuan, akan menggunakan bantuan sesuai peruntukan dan ketentuan yang ditetapkan serta menyampaikan laporan perkembangan pendidikan dan penggunaan bantuan apabila dipersyaratkan.</li>
    <li>Tidak akan melakukan pembiayaan ganda atas komponen biaya pendidikan yang sama dan akan mengungkapkan secara benar setiap bantuan atau beasiswa lain yang diterima.</li>
    <li>Bersedia menyelesaikan pendidikan sesuai ketentuan program pendidikan spesialis dan memenuhi komitmen kembali serta mengabdi di Provinsi Papua sesuai ketentuan yang berlaku.</li>
    <li>Bersedia mematuhi Petunjuk Teknis, ketentuan penyaluran, monitoring dan evaluasi, serta ketentuan lain yang ditetapkan dalam pelaksanaan Program MACE.</li>
    <li>Bersedia menerima sanksi administratif atau konsekuensi lain sesuai ketentuan peraturan perundang-undangan dan ketentuan program apabila terbukti memberikan keterangan palsu, memalsukan dokumen, menyalahgunakan bantuan, atau melanggar komitmen yang telah dinyatakan.</li>
  </ol>
  ${SP_TUTUP('Pakta Integritas ini dibuat dengan sebenar-benarnya, dalam keadaan sadar, tanpa paksaan dari pihak mana pun, untuk digunakan sebagai persyaratan dalam proses seleksi dan/atau pelaksanaan Bantuan Pembiayaan Pendidikan Program Spesialis bagi Dokter OAP melalui Program MACE.')}
</body></html>`,
  },
  {
    name: 'pernyataan_tidak_ganda',
    title: 'Surat Pernyataan Tidak Menerima Bantuan Ganda',
    desc: 'Unduh template, isi & tanda tangani di atas materai, lalu unggah kembali.',
    render: (d) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Surat Pernyataan Tidak Menerima Bantuan Ganda</title>
<style>${SURAT_B_STYLE}</style></head>
<body>
  <h2>SURAT PERNYATAAN TIDAK MENERIMA BANTUAN GANDA</h2>
  <p class="center">Nomor: ........................................</p>
  <p>Saya yang bertanda tangan di bawah ini:</p>
  <ol>
    ${spIdentitas(d)}
  </ol>
  <p>Dengan ini menyatakan dengan sebenar-benarnya bahwa:</p>
  <ol>
    <li>Saya tidak sedang menerima bantuan pembiayaan pendidikan dari APBD Provinsi Papua untuk komponen biaya pendidikan spesialis yang sama dengan komponen biaya yang saya ajukan melalui Program MACE.</li>
    <li>Saya tidak sedang menerima beasiswa atau bantuan pembiayaan lain yang mengakibatkan pembayaran ganda (double funding) atas komponen biaya pendidikan yang sama.</li>
    <li>Saya bersedia mengungkapkan secara lengkap dan benar setiap beasiswa, bantuan pendidikan, bantuan biaya hidup, atau sumber pembiayaan lain yang sedang atau akan saya terima, apabila relevan dengan penilaian dan penetapan bantuan.</li>
    <li>Apabila saya menerima bantuan dari sumber lain setelah menyampaikan pernyataan ini, saya bersedia melaporkannya kepada Dinas Pendidikan Provinsi Papua untuk dilakukan pemeriksaan terhadap kemungkinan tumpang tindih komponen pembiayaan.</li>
    <li>Saya memahami bahwa bantuan yang diajukan melalui Program MACE harus digunakan sesuai peruntukan dan ketentuan yang ditetapkan oleh Pemerintah Provinsi Papua.</li>
    <li>Saya bersedia mengikuti verifikasi dan validasi atas informasi pembiayaan yang saya sampaikan.</li>
    <li>Apabila di kemudian hari terbukti bahwa pernyataan ini tidak benar atau terdapat pembiayaan ganda atas komponen biaya yang sama, saya bersedia menjalani pemeriksaan dan menerima konsekuensi sesuai ketentuan peraturan perundang-undangan serta ketentuan Program MACE yang berlaku.</li>
  </ol>
  <p>Adapun informasi mengenai bantuan atau beasiswa lain yang sedang saya terima adalah sebagai berikut:</p>
  <ul>
    <li>Nama pemberi bantuan/beasiswa&nbsp;: ______________________________</li>
    <li>Jenis atau bentuk bantuan&nbsp;: ______________________________</li>
    <li>Komponen biaya yang dibiayai&nbsp;: ______________________________</li>
    <li>Periode pemberian bantuan&nbsp;: ______________________________</li>
    <li>Besaran bantuan, jika diketahui: Rp ______________________________</li>
  </ul>
  <p>Apabila tidak ada bantuan atau beasiswa lain yang sedang saya terima, bagian tersebut diisi dengan keterangan <strong>&ldquo;Tidak ada.&rdquo;</strong></p>
  ${SP_TUTUP('Demikian surat pernyataan ini saya buat dengan sebenar-benarnya, dalam keadaan sadar dan tanpa paksaan dari pihak mana pun, untuk digunakan sebagai persyaratan pendaftaran Bantuan Pembiayaan Pendidikan Program Spesialis bagi Dokter OAP melalui Program MACE.')}
</body></html>`,
  },
  {
    name: 'pernyataan_kesanggupan_mengabdi',
    title: 'Surat Pernyataan Kesanggupan Kembali dan Mengabdi di Papua',
    desc: 'Unduh template, isi & tanda tangani di atas materai, lalu unggah kembali.',
    render: (d) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Surat Pernyataan Kesanggupan Kembali dan Mengabdi di Papua</title>
<style>${SURAT_B_STYLE}</style></head>
<body>
  <h2>SURAT PERNYATAAN KESANGGUPAN KEMBALI DAN MENGABDI DI PAPUA</h2>
  <p class="center">Nomor: ........................................</p>
  <p>Saya yang bertanda tangan di bawah ini:</p>
  <ol>
    ${spIdentitas(d, [['Perkiraan Tahun Penyelesaian Pendidikan', d.perkiraan_selesai_pendidikan]])}
  </ol>
  <p>Dalam rangka mengajukan diri sebagai calon penerima <strong>Bantuan Pembiayaan Pendidikan Program Spesialis bagi Dokter Orang Asli Papua (OAP) melalui Program MACE pada Dinas Pendidikan Provinsi Papua</strong>, dengan ini menyatakan bahwa saya:</p>
  <ol>
    <li>Bersedia menyelesaikan pendidikan dokter spesialis sesuai dengan ketentuan program pendidikan dan ketentuan yang berlaku pada institusi pendidikan penyelenggara.</li>
    <li>Bersedia kembali ke Provinsi Papua setelah menyelesaikan pendidikan dokter spesialis.</li>
    <li>Bersedia mengabdi kompetensi dan keahlian sebagai dokter spesialis untuk mendukung peningkatan mutu dan pemerataan pelayanan kesehatan di Provinsi Papua.</li>
    <li>Bersedia ditempatkan atau melaksanakan pengabdian sesuai kebutuhan pelayanan kesehatan daerah, berdasarkan ketentuan dan mekanisme penempatan yang sah serta kesepakatan atau perjanjian yang ditetapkan oleh pihak berwenang.</li>
    <li>Bersedia mendukung penguatan pelayanan kesehatan, rumah sakit rujukan, dan ketersediaan tenaga dokter spesialis di Provinsi Papua sesuai bidang keahlian yang saya miliki.</li>
    <li>Bersedia menyampaikan informasi perkembangan pendidikan dan rencana penyelesaian studi kepada Dinas Pendidikan Provinsi Papua apabila dipersyaratkan.</li>
    <li>Bersedia menandatangani perjanjian atau dokumen tambahan mengenai kewajiban pengabdian apabila ditetapkan sebagai penerima bantuan, sesuai ketentuan peraturan perundang-undangan dan ketentuan Program MACE.</li>
    <li>Memahami bahwa bantuan pendidikan melalui Program MACE merupakan dukungan Pemerintah Provinsi Papua bagi peningkatan kualitas sumber daya manusia kesehatan dan penguatan pelayanan kesehatan di daerah.</li>
  </ol>
  <p>Rencana pengabdian setelah menyelesaikan pendidikan:</p>
  <ul>
    <li>Bidang spesialisasi&nbsp;: ______________________________</li>
    <li>Kabupaten/kota atau wilayah tujuan pengabdian&nbsp;: ______________________________</li>
    <li>Rencana fasilitas pelayanan kesehatan, jika telah diketahui&nbsp;: ______________________________</li>
    <li>Bentuk kontribusi yang direncanakan&nbsp;: ______________________________</li>
  </ul>
  <p>Saya memahami bahwa pelaksanaan kewajiban pengabdian, termasuk jangka waktu, penempatan, dan tata cara pelaksanaannya, mengikuti ketentuan yang berlaku dan/atau perjanjian yang ditetapkan secara sah oleh pihak berwenang.</p>
  <p>Apabila saya tidak memenuhi komitmen yang telah disepakati tanpa alasan yang dapat dibenarkan berdasarkan ketentuan yang berlaku, saya bersedia menjalani evaluasi dan menerima konsekuensi sesuai ketentuan peraturan perundang-undangan serta perjanjian yang telah saya tandatangani.</p>
  ${SP_TUTUP('Demikian surat pernyataan ini saya buat dengan sebenar-benarnya, dalam keadaan sadar, tanpa paksaan dari pihak mana pun, dan dengan penuh tanggung jawab untuk digunakan sebagai persyaratan pendaftaran Bantuan Pembiayaan Pendidikan Program Spesialis bagi Dokter OAP melalui Program MACE.')}
</body></html>`,
  },
];

// ---- Surat Program F: Profesi (Pakta Integritas) --------------------------
export const SURAT_F_LIST = [
  {
    name: 'pakta_integritas_profesi',
    title: 'Pakta Integritas',
    desc: 'Unduh template, isi & tanda tangani di atas materai, lalu unggah kembali.',
    render: (d) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Pakta Integritas - Profesi</title>
<style>${SURAT_B_STYLE}</style></head>
<body>
  <h2>PAKTA INTEGRITAS</h2>
  <p class="sub">PROGRAM MACE &ndash; BANTUAN PEMBIAYAAN PENDIDIKAN PROFESI<br>DINAS PENDIDIKAN PROVINSI PAPUA</p>
  <p>Yang bertanda tangan di bawah ini:</p>
  <div class="field">Nama Lengkap&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span class="line">${d.nama || ''}</span></div>
  <div class="field">Nomor Induk Mahasiswa&nbsp;: <span class="line">${d.nim || ''}</span></div>
  <div class="field">Program Studi Profesi&nbsp;&nbsp;&nbsp;&nbsp;: <span class="line">${d.program_studi || ''}</span></div>
  <div class="field">Perguruan Tinggi/Lembaga&nbsp;: <span class="line">${d.nama_pt || ''}</span></div>
  <p>Menyatakan dengan sebenar-benarnya bahwa dalam rangka pengajuan <strong>Bantuan Pembiayaan Pendidikan Profesi melalui Program MACE Dinas Pendidikan Provinsi Papua</strong>, saya bersedia mengikatkan diri pada poin-poin integritas berikut:</p>
  <ol>
    <li>Saya menjamin bahwa seluruh data identitas, status Orang Asli Papua (OAP), dokumen akademik, serta berkas finansial (termasuk surat DTKS dan rincian biaya kuliah) yang saya unggah/serahkan adalah benar, sah, dan sesuai dengan kondisi yang sebenarnya.</li>
    <li>Saya menyatakan tidak sedang menerima bantuan pembiayaan dari Pemerintah Provinsi Papua untuk komponen pendidikan yang sama, dan tidak sedang menerima beasiswa atau bantuan pendidikan lain yang menyebabkan terjadinya pembiayaan ganda (double funding).</li>
    <li>Saya bersedia mengikuti dan mematuhi seluruh rangkaian ketentuan, aturan, dan mekanisme yang ditetapkan dalam Petunjuk Teknis Program MACE.</li>
    <li>Saya berkomitmen untuk menggunakan dana bantuan ini secara akuntabel, tepat sasaran hanya untuk keperluan biaya pendidikan profesi, serta wajib menyampaikan laporan perkembangan studi dan bukti penggunaan dana secara berkala sesuai periode yang ditentukan.</li>
    <li>Apabila saya melanggar pakta integritas ini atau memberikan informasi palsu, saya bersedia menerima sanksi administratif berupa pembatalan hak sebagai penerima, penghentian penyaluran bantuan, mengembalikan dana yang telah diterima ke kas daerah, serta diproses hukum sesuai undang-undang yang berlaku.</li>
  </ol>
  <p>Demikian Pakta Integritas ini dibuat secara sadar untuk dipergunakan sebagaimana mestinya.</p>
  <p class="sig">........................, ........................ 2026<br>Mengetahui/Menyetujui,<br>Yang Membuat Pernyataan,<br><br><em>Materai Rp10.000</em><br>Tanda Tangan,<br><br>( .......................................... )<br><strong>Nama Jelas &amp; NIM</strong></p>
</body></html>`,
  },
];

// Bangun isi surat sebagai dokumen HTML (dibuka di MS Word) yang bisa diedit.
export function buildSuratHtml(surat, dataDiri = {}) {
  // Template kustom (mis. Program B) menyediakan HTML penuh lewat render().
  if (typeof surat.render === 'function') return surat.render(dataDiri);
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
  ...D_DOSEN_FIELDS, ...D_AKADEMIK_KEU_FIELDS, ...STUDI_AKHIR_FIELDS, ...COAS_FIELDS,
  ...SP_DOKTER_FIELDS, ...SP_PROGRAM_FIELDS, ...SP_FINANCE_FIELDS, ...PROFESI_FIELDS,
].reduce((acc, f) => { acc[f.name] = f.label; return acc; }, {});

// State data diri awal (semua field + flag validasi).
export const buildInitialDataDiri = (kabupatenAsal = '') => {
  const base = {};
  for (const f of [
    ...DATA_DIRI_FIELDS, ...PENDIDIKAN_FIELDS, ...KELUARGA_FIELDS,
    ...D_DOSEN_FIELDS, ...D_AKADEMIK_KEU_FIELDS, ...STUDI_AKHIR_FIELDS, ...COAS_FIELDS,
    ...SP_DOKTER_FIELDS, ...SP_PROGRAM_FIELDS, ...SP_FINANCE_FIELDS, ...PROFESI_FIELDS,
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

const STUDI_AKHIR_FORM = {
  detailSteps: [
    { key: 'studi_akhir', shortTitle: 'Studi Akhir', title: 'Detail Tahap Akhir Studi', banner: 'Isi data akademik dan rencana penyelesaian tugas akhir / skripsi Anda.', fields: STUDI_AKHIR_FIELDS },
  ],
  dokumenList: DOKUMEN_B_LIST,
  wajibDokumen: WAJIB_DOKUMEN_B,
  suratList: SURAT_B_LIST,
};

const COAS_FORM = {
  detailSteps: [
    { key: 'koas', shortTitle: 'Koas', title: 'Detail Kepaniteraan Klinik (KOAS)', banner: 'Isi data rumah sakit pendidikan, progres KOAS, dan kondisi pembiayaan Anda.', fields: COAS_FIELDS },
  ],
  dokumenList: DOKUMEN_C_LIST,
  wajibDokumen: WAJIB_DOKUMEN_C,
  suratList: SURAT_C_LIST,
};

const SPESIALIS_FORM = {
  detailSteps: [
    { key: 'dokter', shortTitle: 'Data Dokter', title: 'Data Dokter & Pengalaman', banner: 'Isi data ijazah dokter, STR, instansi kerja, dan pengalaman pelayanan/pengabdian.', fields: SP_DOKTER_FIELDS },
    { key: 'program', shortTitle: 'Program', title: 'Program Pendidikan Spesialis', banner: 'Isi data program/bidang spesialisasi dan status pendidikan Anda.', fields: SP_PROGRAM_FIELDS },
    { key: 'pembiayaan', shortTitle: 'Pembiayaan', title: 'Pembiayaan & Kondisi Ekonomi', banner: 'Isi rincian biaya pendidikan, sumber pembiayaan, dan kebutuhan bantuan.', fields: SP_FINANCE_FIELDS },
  ],
  dokumenList: DOKUMEN_SP_LIST,
  wajibDokumen: WAJIB_DOKUMEN_SP,
  suratList: SURAT_SP_LIST,
};

const PROFESI_FORM = {
  detailSteps: [
    { key: 'profesi', shortTitle: 'Profesi', title: 'Detail Pendidikan Profesi', banner: 'Isi data perguruan tinggi/lembaga, program studi profesi, progres, dan kebutuhan biaya.', fields: PROFESI_FIELDS },
  ],
  dokumenList: DOKUMEN_F_LIST,
  wajibDokumen: WAJIB_DOKUMEN_F,
  suratList: SURAT_F_LIST,
};

export const PROGRAM_FORMS = {
  A: REGULER_FORM, // Beasiswa Reguler
  B: STUDI_AKHIR_FORM, // Studi Akhir
  C: COAS_FORM, // Koas
  D: SPESIALIS_FORM, // Spesialis
  E: DOKTORAL_FORM, // Pendidikan S3 (Doktoral)
  F: PROFESI_FORM, // Bantuan Pembiayaan Pendidikan Profesi
};

// Pilihan program jalur Provinsi (lengkap A-E).
export const PROGRAM_OPTIONS_PROVINSI = [
  { id: 'A', title: 'Beasiswa Reguler', desc: 'Bantuan biaya pendidikan reguler untuk mahasiswa S1/D4 Orang Asli Papua.', color: 'bg-indigo-500' },
  { id: 'B', title: 'Studi Akhir / Tugas Akhir / Skripsi', desc: 'Untuk mahasiswa yang sedang menyelesaikan tugas akhir atau skripsi.', color: 'bg-blue-500' },
  { id: 'C', title: 'Koas (Khusus Kedokteran)', desc: 'Mahasiswa kedokteran yang sedang menjalani masa profesi dokter (Koas).', color: 'bg-rose-500' },
  { id: 'D', title: 'Spesialis (Dokter Spesialis)', desc: 'Program bantuan pendidikan spesialisasi bagi dokter Orang Asli Papua.', color: 'bg-emerald-500' },
  { id: 'E', title: 'Pendidikan S3 (Doktoral)', desc: 'Bantuan studi doktoral khusus untuk dosen Orang Asli Papua.', color: 'bg-amber-500' },
  { id: 'F', title: 'Bantuan Pembiayaan Pendidikan Profesi', desc: 'Bantuan biaya pendidikan profesi (Ners, Apoteker, Akuntan, Guru/PPG, dll.) bagi OAP.', color: 'bg-teal-500' },
];
