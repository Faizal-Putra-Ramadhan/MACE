-- ============================================================
--  MACE - Migrasi Pendaftaran Tanpa Login (login-free)
--  Untuk database `mace` yang SUDAH ada.
--  Jalankan: mysql -u root -p mace < database/alter_mace_anon.sql
--  (DB baru cukup jalankan schema.sql, tidak perlu file ini)
-- ============================================================

USE `mace`;

-- mahasiswa_id menjadi nullable (pendaftaran anonim tidak punya akun)
ALTER TABLE `pendaftaran`
    MODIFY COLUMN `mahasiswa_id` INT NULL;

-- operator_id menandai pendaftaran yang dibuat oleh operator MACE
ALTER TABLE `pendaftaran`
    ADD COLUMN `operator_id` INT NULL AFTER `mahasiswa_id`;
