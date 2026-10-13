-- ============================================================
--  MACE - MySQL Seed Data
--  Diambil dari data tabel `users` dan `pace_sekolah`.
--  Semua password di bawah adalah hash bcrypt untuk:  password123
--  Cara pakai: mysql -u root -p mace < database/seed.sql
-- ============================================================

USE `mace`;

SET @pw = '$2b$10$BI70JlizI7Djm1nwpnL9J.IJuVTyPofCEV/UnnB868Nd8oAPAqlyK';

-- Hapus dulu agar seed bisa dijalankan berulang kali
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `laporan`;
TRUNCATE TABLE `dokumen_pendaftaran`;
TRUNCATE TABLE `pendaftaran`;
TRUNCATE TABLE `pendidikan`;
TRUNCATE TABLE `mahasiswa`;
TRUNCATE TABLE `pace_siswa`;
TRUNCATE TABLE `pace_sekolah`;
TRUNCATE TABLE `surat_permohonan`;
TRUNCATE TABLE `lembaga_pengusul`;
TRUNCATE TABLE `pengaturan_akses`;
TRUNCATE TABLE `sk_gubernur`;
TRUNCATE TABLE `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- users
-- ------------------------------------------------------------
INSERT INTO `users` (`id`, `email`, `password`, `role`, `is_approved`, `pace_type`, `mace_type`) VALUES
-- Akun khusus MACE
(2,  'john@gmail.com',                              @pw, 'mahasiswa',     1, NULL, NULL),
(7,  'faizal@gmail.com',                            @pw, 'mahasiswa',     1, NULL, NULL),
(20, 'lollipopsuper00@gmail.com',                   @pw, 'mahasiswa',     1, NULL, NULL),
(21, 'admin@mace.go.id',                            @pw, 'admin',         1, NULL, NULL),
(25, 'stefanus@gmail.com',                          @pw, 'mahasiswa',     1, NULL, NULL),
-- Akun sekolah PACE
(26, 'slbn1_jayapura@pace.go.id',                   @pw, 'sekolah_pace',  1, 'SLB', NULL),
(27, 'slbn_pembina_jayapura@pace.go.id',            @pw, 'sekolah_pace',  1, 'SLB', NULL),
(28, 'slbn_serui@pace.go.id',                       @pw, 'sekolah_pace',  1, 'SLB', NULL),
(29, 'slbn_uri_waren_waropen@pace.go.id',           @pw, 'sekolah_pace',  1, 'SLB', NULL),
(30, 'slbn_saireri_biak@pace.go.id',                @pw, 'sekolah_pace',  1, 'SLB', NULL),
(31, 'sdlb_subyaki_fyadi_biak@pace.go.id',          @pw, 'sekolah_pace',  1, 'SLB', NULL),
(32, 'slb_abc_tunas_harapan_biak@pace.go.id',       @pw, 'sekolah_pace',  1, 'SLB', NULL),
(33, 'snk_sains_bahasa@pace.go.id',                 @pw, 'sekolah_pace',  1, 'SNK', NULL),
(34, 'snk_olahraga@pace.go.id',                     @pw, 'sekolah_pace',  1, 'SNK', NULL),
(35, 'snk_pariwisata@pace.go.id',                   @pw, 'sekolah_pace',  1, 'SNK', NULL),
(36, 'snk_agribisnis_agroteknologi@pace.go.id',     @pw, 'sekolah_pace',  1, 'SNK', NULL),
(37, 'snk_kemaritiman@pace.go.id',                  @pw, 'sekolah_pace',  1, 'SNK', NULL),
-- Admin PACE & operator MACE
(38, 'superadmin@pace.go.id',                       @pw, 'admin_pace',    1, NULL, NULL),
(40, 'kampussarmi@gmail.com',                       @pw, 'mace_kabkota',  1, NULL, 'kabkota'),
(79, 'mace@provinsi.co.id',                         @pw, 'mace_provinsi', 1, NULL, 'provinsi'),
-- Akun mahasiswa berbasis NIM (120201001 .. 120201017)
(41, '120201001@mhs.mace.go.id',                    @pw, 'mahasiswa',     1, NULL, NULL),
(42, '120201002@mhs.mace.go.id',                    @pw, 'mahasiswa',     1, NULL, NULL),
(43, '120201003@mhs.mace.go.id',                    @pw, 'mahasiswa',     1, NULL, NULL),
(44, '120201004@mhs.mace.go.id',                    @pw, 'mahasiswa',     1, NULL, NULL),
(45, '120201005@mhs.mace.go.id',                    @pw, 'mahasiswa',     1, NULL, NULL),
(46, '120201006@mhs.mace.go.id',                    @pw, 'mahasiswa',     1, NULL, NULL),
(47, '120201007@mhs.mace.go.id',                    @pw, 'mahasiswa',     1, NULL, NULL),
(48, '120201008@mhs.mace.go.id',                    @pw, 'mahasiswa',     1, NULL, NULL),
(49, '120201009@mhs.mace.go.id',                    @pw, 'mahasiswa',     1, NULL, NULL),
(50, '120201010@mhs.mace.go.id',                    @pw, 'mahasiswa',     1, NULL, NULL),
(51, '120201011@mhs.mace.go.id',                    @pw, 'mahasiswa',     1, NULL, NULL),
(52, '120201012@mhs.mace.go.id',                    @pw, 'mahasiswa',     1, NULL, NULL),
(53, '120201013@mhs.mace.go.id',                    @pw, 'mahasiswa',     1, NULL, NULL),
(54, '120201014@mhs.mace.go.id',                    @pw, 'mahasiswa',     1, NULL, NULL),
(55, '120201015@mhs.mace.go.id',                    @pw, 'mahasiswa',     1, NULL, NULL),
(56, '120201016@mhs.mace.go.id',                    @pw, 'mahasiswa',     1, NULL, NULL),
(57, '120201017@mhs.mace.go.id',                    @pw, 'mahasiswa',     1, NULL, NULL),
-- Akun mahasiswa bernama
(58, 'margaritha.d.i.saroge@mahasiswa.mace.go.id',          @pw, 'mahasiswa', 1, NULL, NULL),
(59, 'ardilla.ds.binsyowl.abnir@mahasiswa.mace.go.id',      @pw, 'mahasiswa', 1, NULL, NULL),
(60, 'april.sury.roasana.dias.waromi@mahasiswa.mace.go.id', @pw, 'mahasiswa', 1, NULL, NULL),
(61, 'andarias.abisay@mahasiswa.mace.go.id',                @pw, 'mahasiswa', 1, NULL, NULL),
(62, 'imanuella.maryani.wakum@mahasiswa.mace.go.id',        @pw, 'mahasiswa', 1, NULL, NULL),
(63, 'dius.tabuni@mahasiswa.mace.go.id',                    @pw, 'mahasiswa', 1, NULL, NULL),
(64, 'josua.rumere@mahasiswa.mace.go.id',                   @pw, 'mahasiswa', 1, NULL, NULL),
(65, 'dolfince.a.baransano@mahasiswa.mace.go.id',           @pw, 'mahasiswa', 1, NULL, NULL),
(66, 'sampari.rumere@mahasiswa.mace.go.id',                 @pw, 'mahasiswa', 1, NULL, NULL),
(67, 'josua.inhuar@mahasiswa.mace.go.id',                   @pw, 'mahasiswa', 1, NULL, NULL),
(68, 'boy.ausa@mahasiswa.mace.go.id',                       @pw, 'mahasiswa', 1, NULL, NULL),
(69, 'yakob.ariyeri@mahasiswa.mace.go.id',                  @pw, 'mahasiswa', 1, NULL, NULL),
(70, 'sipora.epluviania.wambrauw@mahasiswa.mace.go.id',     @pw, 'mahasiswa', 1, NULL, NULL),
(71, 'fenl.ribka.rumbino@mahasiswa.mace.go.id',             @pw, 'mahasiswa', 1, NULL, NULL),
(72, 'sopranita.aronggear@mahasiswa.mace.go.id',            @pw, 'mahasiswa', 1, NULL, NULL),
(73, 'betty.ubertina.patay@mahasiswa.mace.go.id',           @pw, 'mahasiswa', 1, NULL, NULL),
(74, 'nehemia.rumayomi.jr@mahasiswa.mace.go.id',            @pw, 'mahasiswa', 1, NULL, NULL),
(75, 'inderlin.julistiana.bisay@mahasiswa.mace.go.id',      @pw, 'mahasiswa', 1, NULL, NULL),
(76, 'berth.berotabul@mahasiswa.mace.go.id',                @pw, 'mahasiswa', 1, NULL, NULL),
(77, 'nim.2300018199@mahasiswa.mace.go.id',                 @pw, 'mahasiswa', 1, NULL, NULL),
(78, 'nim.2604600364@mahasiswa.mace.go.id',                 @pw, 'mahasiswa', 1, NULL, NULL);

-- ------------------------------------------------------------
-- pace_sekolah (user_id 26 .. 37)
-- ------------------------------------------------------------
INSERT INTO `pace_sekolah` (`id`, `user_id`, `nama_sekolah`, `jenis_sekolah`, `status_approval`) VALUES
(1,  26, 'SLB N 1 JAYAPURA',              'SLB', 'approved'),
(2,  27, 'SLB N PEMBINA JAYAPURA',        'SLB', 'approved'),
(3,  28, 'SLB N SERUI',                   'SLB', 'approved'),
(4,  29, 'SLB N URI WAREN WAROPEN',       'SLB', 'approved'),
(5,  30, 'SLB N SAIRERI BIAK',            'SLB', 'approved'),
(6,  31, 'SDLB SUBYAKI FYADI BIAK',       'SLB', 'approved'),
(7,  32, 'SLB ABC TUNAS HARAPAN BIAK',    'SLB', 'approved'),
(8,  33, 'SNK SAINS DAN BAHASA',          'SNK', 'approved'),
(9,  34, 'SNK OLAHRAGA',                  'SNK', 'approved'),
(10, 35, 'SNK PARIWISATA',                'SNK', 'approved'),
(11, 36, 'SNK AGRIBISNIS DAN AGROTEKNOLOGI', 'SNK', 'approved'),
(12, 37, 'SNK KEMARITIMAN',               'SNK', 'approved');

-- ------------------------------------------------------------
-- pengaturan_akses (default, satu baris per scope)
-- ------------------------------------------------------------
INSERT INTO `pengaturan_akses` (`scope`, `edit_surat_permohonan`, `edit_data_sekolah`, `edit_siswa`) VALUES
('mace_kabkota',   1, 1, 1),
('mace_provinsi',  1, 1, 1),
('pace_slb',       1, 1, 1),
('pace_snk',       1, 1, 1),
('pace_atlit',     1, 1, 1);
