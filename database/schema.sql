-- ============================================================
--  MACE - MySQL Schema
--  Database: mace
--  Cara pakai: mysql -u root -p < database/schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS `mace`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `mace`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `laporan`;
DROP TABLE IF EXISTS `dokumen_pendaftaran`;
DROP TABLE IF EXISTS `pendaftaran`;
DROP TABLE IF EXISTS `pendidikan`;
DROP TABLE IF EXISTS `mahasiswa`;
DROP TABLE IF EXISTS `pace_siswa`;
DROP TABLE IF EXISTS `pace_sekolah`;
DROP TABLE IF EXISTS `surat_permohonan`;
DROP TABLE IF EXISTS `lembaga_pengusul`;
DROP TABLE IF EXISTS `pengaturan_akses`;
DROP TABLE IF EXISTS `sk_gubernur`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- users
-- ------------------------------------------------------------
CREATE TABLE `users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('mahasiswa','admin','sekolah_pace','siswa_pace','admin_pace','super_admin','mace_kabkota','mace_provinsi','pace_slb','pace_snk','pace_atlit')
        NOT NULL DEFAULT 'mahasiswa',
    `is_approved` TINYINT(1) NOT NULL DEFAULT 0,
    `pace_type` ENUM('SLB','SNK','Siswa Atlit Berprestasi') NULL,
    `mace_type` ENUM('kabkota','provinsi') NULL,
    `nama_display` VARCHAR(255) NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- mahasiswa
-- ------------------------------------------------------------
CREATE TABLE `mahasiswa` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `nim` VARCHAR(255) NOT NULL,
    `nik` VARCHAR(255) NOT NULL,
    `nama_lengkap` VARCHAR(255) NOT NULL,
    `nip` VARCHAR(255) NULL,
    `alamat_domisili` TEXT NULL,
    `alamat_ktp` TEXT NULL,
    `nama_orang_tua` VARCHAR(255) NULL,
    `perguruan_tinggi` VARCHAR(255) NULL,
    `program_studi` VARCHAR(255) NULL,
    `program_type` VARCHAR(255) NULL,
    `stase` VARCHAR(255) NULL,
    `semester` VARCHAR(255) NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `mahasiswa_nim_unique` (`nim`),
    UNIQUE KEY `mahasiswa_nik_unique` (`nik`),
    KEY `fk_mahasiswa_user` (`user_id`),
    CONSTRAINT `fk_mahasiswa_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- pendidikan
-- ------------------------------------------------------------
CREATE TABLE `pendidikan` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `mahasiswa_id` INT NOT NULL,
    `nama_pt` VARCHAR(255) NOT NULL,
    `alamat_pt` TEXT NOT NULL,
    `fakultas` VARCHAR(255) NOT NULL,
    `jurusan` VARCHAR(255) NOT NULL,
    `prodi` VARCHAR(255) NOT NULL,
    `semester_stase` VARCHAR(255) NOT NULL,
    `judul_skripsi_disertasi` TEXT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_pendidikan_mahasiswa` (`mahasiswa_id`),
    CONSTRAINT `fk_pendidikan_mahasiswa` FOREIGN KEY (`mahasiswa_id`)
        REFERENCES `mahasiswa` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- pendaftaran
-- ------------------------------------------------------------
CREATE TABLE `pendaftaran` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `mahasiswa_id` INT NULL,
    `operator_id` INT NULL,
    `program` ENUM('A','B','C','D','E') NOT NULL,
    `status` ENUM('draft','submitted','lolos_berkas','ditolak','selesai') NOT NULL DEFAULT 'submitted',
    `alasan_penolakan` TEXT NULL,
    `kode_kartu` VARCHAR(255) NULL,
    `nominal_dana` BIGINT NULL DEFAULT 0,
    `saldo` BIGINT NULL DEFAULT 0,
    `data_diri` JSON NULL,
    `poin_otomatis` INT NOT NULL DEFAULT 0,
    `poin_nim_manual` INT NULL,
    `poin_nik_manual` INT NULL,
    `poin_dokumen` INT NULL,
    `poin_total` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `pendaftaran_kode_kartu_unique` (`kode_kartu`),
    KEY `fk_pendaftaran_mahasiswa` (`mahasiswa_id`),
    KEY `pendaftaran_poin_total_index` (`poin_total`),
    CONSTRAINT `fk_pendaftaran_mahasiswa` FOREIGN KEY (`mahasiswa_id`)
        REFERENCES `mahasiswa` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- dokumen_pendaftaran
-- ------------------------------------------------------------
CREATE TABLE `dokumen_pendaftaran` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `pendaftaran_id` INT NOT NULL,
    `jenis_dokumen` VARCHAR(100) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `poin` INT NULL,
    `uploaded_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_dokumen_pendaftaran` (`pendaftaran_id`),
    CONSTRAINT `fk_dokumen_pendaftaran` FOREIGN KEY (`pendaftaran_id`)
        REFERENCES `pendaftaran` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- laporan
-- ------------------------------------------------------------
CREATE TABLE `laporan` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `pendaftaran_id` INT NOT NULL,
    `surat_laporan_path` VARCHAR(255) NULL,
    `fc_rekening_path` VARCHAR(255) NULL,
    `bukti_pengeluaran_path` VARCHAR(255) NULL,
    `is_complete` TINYINT(1) NOT NULL DEFAULT 0,
    `status_verifikasi` ENUM('pending','verified','revisi') NOT NULL DEFAULT 'pending',
    `catatan_revisi` TEXT NULL,
    `submitted_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_laporan_pendaftaran` (`pendaftaran_id`),
    CONSTRAINT `fk_laporan_pendaftaran` FOREIGN KEY (`pendaftaran_id`)
        REFERENCES `pendaftaran` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- pengaturan_akses
-- ------------------------------------------------------------
CREATE TABLE `pengaturan_akses` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `scope` ENUM('mace_kabkota','mace_provinsi','pace_slb','pace_snk','pace_atlit') NOT NULL DEFAULT 'pace_slb',
    `edit_surat_permohonan` TINYINT(1) NULL DEFAULT 1,
    `edit_data_sekolah` TINYINT(1) NULL DEFAULT 1,
    `edit_siswa` TINYINT(1) NULL DEFAULT 1,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- sk_gubernur
-- ------------------------------------------------------------
CREATE TABLE `sk_gubernur` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `kategori` VARCHAR(100) NOT NULL,
    `file_url` VARCHAR(500) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `sk_gubernur_kategori_unique` (`kategori`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- pace_sekolah
-- ------------------------------------------------------------
CREATE TABLE `pace_sekolah` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `nama_sekolah` VARCHAR(255) NOT NULL,
    `jenis_sekolah` ENUM('SLB','SNK','Siswa Atlit Berprestasi') NOT NULL,
    `npsn` VARCHAR(255) NULL,
    `alamat` TEXT NULL,
    `no_rekening` VARCHAR(255) NULL,
    `surat_permohonan` VARCHAR(255) NULL,
    `status_approval` ENUM('pending','approved','rejected') NULL DEFAULT 'pending',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_pace_sekolah_user` (`user_id`),
    CONSTRAINT `fk_pace_sekolah_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- pace_siswa
-- ------------------------------------------------------------
CREATE TABLE `pace_siswa` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `sekolah_id` INT NOT NULL,
    `user_id` INT NULL,
    `nama` VARCHAR(255) NOT NULL,
    `nisn` VARCHAR(255) NOT NULL,
    `nik` VARCHAR(255) NOT NULL,
    `tempat_lahir` VARCHAR(255) NOT NULL,
    `tanggal_lahir` DATE NOT NULL,
    `kelas` VARCHAR(255) NOT NULL,
    `alamat` TEXT NOT NULL,
    `nama_orang_tua` VARCHAR(255) NOT NULL,
    `no_hp_orang_tua` VARCHAR(255) NOT NULL,
    `foto_profil` VARCHAR(255) NULL,
    `file_rapor` VARCHAR(255) NULL,
    `file_sktm` VARCHAR(255) NULL,
    `status_approval` ENUM('pending','approved','rejected') NULL DEFAULT 'pending',
    `usulan_anggaran` JSON NULL,
    `file_prestasi_akademik` VARCHAR(255) NULL,
    `file_prestasi_non_akademik` VARCHAR(255) NULL,
    `nominal_pendanaan` INT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `pace_siswa_nisn_unique` (`nisn`),
    UNIQUE KEY `pace_siswa_nik_unique` (`nik`),
    KEY `fk_pace_siswa_sekolah` (`sekolah_id`),
    KEY `fk_pace_siswa_user` (`user_id`),
    CONSTRAINT `fk_pace_siswa_sekolah` FOREIGN KEY (`sekolah_id`)
        REFERENCES `pace_sekolah` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pace_siswa_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- surat_permohonan
-- ------------------------------------------------------------
CREATE TABLE `surat_permohonan` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `file_url` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NULL DEFAULT 'pending',
    `type` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_surat_permohonan_user` (`user_id`),
    CONSTRAINT `fk_surat_permohonan_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- lembaga_pengusul
-- ------------------------------------------------------------
CREATE TABLE `lembaga_pengusul` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `nama_lembaga` VARCHAR(255) NOT NULL,
    `alamat` TEXT NOT NULL,
    `nama_operator` VARCHAR(255) NOT NULL,
    `hp_operator` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_lembaga_pengusul_user` (`user_id`),
    CONSTRAINT `fk_lembaga_pengusul_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
