import sequelize from '../lib/db.js';
import { DataTypes } from 'sequelize';

async function migrate() {
    try {
        await sequelize.authenticate();
        console.log('Connection established.');

        // Update User Enum
        const newRoles = ['super_admin', 'mace_kabkota', 'mace_provinsi', 'pace_slb', 'pace_snk', 'pace_atlit'];
        for (const role of newRoles) {
            try {
                await sequelize.query(`ALTER TYPE "enum_users_role" ADD VALUE '${role}';`);
                console.log(`Added ${role} to enum_users_role`);
            } catch (e) {
                console.log(`${role} might already exist:`, e.message);
            }
        }

        // Create SuratPermohonan
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS "surat_permohonan" (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES "users"(id),
                file_url VARCHAR(255) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                type VARCHAR(50) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created surat_permohonan table');

        // Create LembagaPengusul
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS "lembaga_pengusul" (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES "users"(id),
                nama_lembaga VARCHAR(255) NOT NULL,
                alamat TEXT NOT NULL,
                nama_operator VARCHAR(255) NOT NULL,
                hp_operator VARCHAR(50) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created lembaga_pengusul table');

        // Create PengaturanAkses
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS "pengaturan_akses" (
                id SERIAL PRIMARY KEY,
                edit_surat_permohonan BOOLEAN DEFAULT true,
                edit_data_sekolah BOOLEAN DEFAULT true,
                edit_siswa BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created pengaturan_akses table');
        
        // Initialize PengaturanAkses
        const [res] = await sequelize.query(`SELECT COUNT(*) as count FROM "pengaturan_akses"`);
        if (res[0].count === '0') {
            await sequelize.query(`INSERT INTO "pengaturan_akses" (edit_surat_permohonan, edit_data_sekolah, edit_siswa) VALUES (true, true, true);`);
        }

        // Alter Mahasiswa (MACE)
        const mhsColumns = [
            'ALTER TABLE "mahasiswa" ADD COLUMN program_type VARCHAR(50);',
            'ALTER TABLE "mahasiswa" ADD COLUMN stase VARCHAR(100);',
            'ALTER TABLE "mahasiswa" ADD COLUMN semester VARCHAR(50);'
        ];
        for (const col of mhsColumns) {
            try { await sequelize.query(col); } catch (e) { console.log(e.message); }
        }

        // Alter Pendaftaran (MACE documents)
        const docTypes = ['rekomendasi', 'pernyataan', 'rab', 'prestasi_akademik', 'prestasi_non_akademik'];
        for (const type of docTypes) {
            try {
                await sequelize.query(`ALTER TYPE "enum_dokumen_pendaftaran_jenis_dokumen" ADD VALUE '${type}';`);
            } catch (e) {
                console.log(`${type} enum might exist:`, e.message);
            }
        }

        // Alter PaceSekolah
        const sekolahColumns = [
            'ALTER TABLE "pace_sekolah" ADD COLUMN npsn VARCHAR(100);',
            'ALTER TABLE "pace_sekolah" ADD COLUMN no_rekening VARCHAR(100);'
        ];
        for (const col of sekolahColumns) {
            try { await sequelize.query(col); } catch (e) { console.log(e.message); }
        }

        // Alter PaceSiswa
        const siswaColumns = [
            'ALTER TABLE "pace_siswa" ADD COLUMN usulan_anggaran JSONB;',
            'ALTER TABLE "pace_siswa" ADD COLUMN ortu_nama VARCHAR(255);',
            'ALTER TABLE "pace_siswa" ADD COLUMN ortu_hp VARCHAR(50);',
            'ALTER TABLE "pace_siswa" ADD COLUMN file_prestasi_akademik VARCHAR(255);',
            'ALTER TABLE "pace_siswa" ADD COLUMN file_prestasi_non_akademik VARCHAR(255);'
        ];
        for (const col of siswaColumns) {
            try { await sequelize.query(col); } catch (e) { console.log(e.message); }
        }

        console.log('Migration completed.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

migrate();
