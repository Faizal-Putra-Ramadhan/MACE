import adminLaporan from '../controllers/admin/laporan.js';
import adminPendaftaran from '../controllers/admin/pendaftaran.js';
import adminStatistik from '../controllers/admin/statistik.js';
import adminPendaftaranStatus from '../controllers/admin/pendaftaran/[id]/status.js';
import adminPendaftaranPoin from '../controllers/admin/pendaftaran/[id]/poin.js';
import adminUsersApprove from '../controllers/admin/users/approve.js';
import adminUsersIndex from '../controllers/admin/users/index.js';
import adminUsersCreate from '../controllers/admin/users/create.js';

import authLogin from '../controllers/auth/login.js';
import authMe from '../controllers/auth/me.js';
import authRegister from '../controllers/auth/register.js';

import kartuGenerate from '../controllers/kartu/generate.js';

import laporanIndex from '../controllers/laporan/index.js';
import laporanSaya from '../controllers/laporan/saya.js';

import mahasiswaDataDiri from '../controllers/mahasiswa/data-diri.js';

import pendaftaranIndex from '../controllers/pendaftaran/index.js';
import pendaftaranDaftar from '../controllers/pendaftaran/daftar.js';
import pendaftaranStatus from '../controllers/pendaftaran/[id]/status.js';

import validateNik from '../controllers/validate/nik/[nik].js';
import validateNim from '../controllers/validate/nim/[nim].js';

// PACE
import paceSekolah from '../controllers/pace/sekolah.js';
import paceSekolahStatus from '../controllers/pace/sekolah/status.js';
import paceSiswa from '../controllers/pace/siswa.js';
import paceSiswaId from '../controllers/pace/siswa/[id].js';
import paceSiswaStatus from '../controllers/pace/siswa/status.js';

import uploadFile from '../controllers/upload/index.js';

/**
 * Express 5 makes req.query a getter — you can't do req.query.x = y.
 * This helper safely merges additional params into req.query.
 */
function mergeQuery(req, extras) {
    const current = req.query || {};
    Object.defineProperty(req, 'query', {
        value: { ...current, ...extras },
        writable: true,
        configurable: true,
        enumerable: true,
    });
}

export default async function handler(req, res) {
    try {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        let path = url.pathname;
        
        // Remove trailing slash if present
        if (path.endsWith('/') && path.length > 1) {
            path = path.slice(0, -1);
        }

        // AUTH
        if (path === '/api/auth/login') return authLogin(req, res);
        if (path === '/api/auth/me') return authMe(req, res);
        if (path === '/api/auth/register') return authRegister(req, res);

        // KARTU
        if (path === '/api/kartu/generate') return kartuGenerate(req, res);

        // LAPORAN
        if (path === '/api/laporan') return laporanIndex(req, res);
        if (path === '/api/laporan/saya') return laporanSaya(req, res);

        // MAHASISWA
        if (path === '/api/mahasiswa/data-diri') return mahasiswaDataDiri(req, res);

        // PENDAFTARAN
        if (path === '/api/pendaftaran') return pendaftaranIndex(req, res);
        if (path === '/api/pendaftaran/daftar') return pendaftaranDaftar(req, res);
        
        // Dynamic Route: /api/pendaftaran/[id]/status
        const pendaftaranStatusMatch = path.match(/^\/api\/pendaftaran\/([^\/]+)\/status$/);
        if (pendaftaranStatusMatch) {
            mergeQuery(req, { id: pendaftaranStatusMatch[1] });
            return pendaftaranStatus(req, res);
        }

        // ADMIN
        if (path === '/api/admin/laporan') return adminLaporan(req, res);
        if (path === '/api/admin/pendaftaran') return adminPendaftaran(req, res);
        if (path === '/api/admin/statistik') return adminStatistik(req, res);
        if (path === '/api/admin/users') return adminUsersIndex(req, res);
        if (path === '/api/admin/users/approve') return adminUsersApprove(req, res);
        if (path === '/api/admin/users/create') return adminUsersCreate(req, res);

        // Dynamic Route: /api/admin/pendaftaran/[id]/status
        const adminPendaftaranStatusMatch = path.match(/^\/api\/admin\/pendaftaran\/([^\/]+)\/status$/);
        if (adminPendaftaranStatusMatch) {
            mergeQuery(req, { id: adminPendaftaranStatusMatch[1] });
            return adminPendaftaranStatus(req, res);
        }

        // Dynamic Route: /api/admin/pendaftaran/[id]/poin (penetapan poin per berkas/NIM/NIK)
        const adminPendaftaranPoinMatch = path.match(/^\/api\/admin\/pendaftaran\/([^\/]+)\/poin$/);
        if (adminPendaftaranPoinMatch) {
            mergeQuery(req, { id: adminPendaftaranPoinMatch[1] });
            return adminPendaftaranPoin(req, res);
        }

        // VALIDATE NIK/NIM (Dynamic Routes)
        const validateNimMatch = path.match(/^\/api\/validate\/nim\/([^\/]+)$/);
        if (validateNimMatch) {
            mergeQuery(req, { nim: validateNimMatch[1] });
            return validateNim(req, res);
        }

        const validateNikMatch = path.match(/^\/api\/validate\/nik\/([^\/]+)$/);
        if (validateNikMatch) {
            mergeQuery(req, { nik: validateNikMatch[1] });
            return validateNik(req, res);
        }

        // PACE Routes
        if (path === '/api/pace/sekolah') return paceSekolah(req, res);
        if (path === '/api/pace/siswa') return paceSiswa(req, res);

        // Dynamic: /api/pace/sekolah/:id/status
        const paceSekolahStatusMatch = path.match(/^\/api\/pace\/sekolah\/(\d+)\/status$/);
        if (paceSekolahStatusMatch) {
            mergeQuery(req, { id: paceSekolahStatusMatch[1] });
            return paceSekolahStatus(req, res);
        }

        // Dynamic: /api/pace/siswa/:id/status
        const paceSiswaStatusMatch = path.match(/^\/api\/pace\/siswa\/(\d+)\/status$/);
        if (paceSiswaStatusMatch) {
            mergeQuery(req, { id: paceSiswaStatusMatch[1] });
            return paceSiswaStatus(req, res);
        }

        // Dynamic: /api/pace/siswa/:id (for PUT/DELETE)
        const paceSiswaIdMatch = path.match(/^\/api\/pace\/siswa\/(\d+)$/);
        if (paceSiswaIdMatch) {
            mergeQuery(req, { id: paceSiswaIdMatch[1] });
            return paceSiswaId(req, res);
        }

        // SURAT PERMOHONAN
        if (path === '/api/surat-permohonan') return (await import('../controllers/surat-permohonan.js')).default(req, res);

        // SUPERADMIN
        if (path === '/api/superadmin/pengaturan-akses') return (await import('../controllers/superadmin/pengaturan-akses.js')).default(req, res);
        if (path === '/api/superadmin/surat-permohonan') return (await import('../controllers/superadmin/surat-permohonan.js')).default(req, res);
        const superAdminSuratMatch = path.match(/^\/api\/superadmin\/surat-permohonan\/(\d+)$/);
        if (superAdminSuratMatch) {
            mergeQuery(req, { id: superAdminSuratMatch[1] });
            return (await import('../controllers/superadmin/surat-permohonan.js')).default(req, res);
        }

        // PENGUMUMAN (public)
        if (path === '/api/pengumuman/penerima') return (await import('../controllers/pengumuman/penerima.js')).default(req, res);

        // ADMIN SK GUBERNUR
        if (path === '/api/admin/sk-gubernur') return (await import('../controllers/admin/sk-gubernur.js')).default(req, res);

        // UPLOAD (local disk storage)
        if (path === '/api/upload') return uploadFile(req, res);

        // 404 Not Found for any other API route
        return res.status(404).json({ message: 'API Endpoint Not Found' });

    } catch (error) {
        console.error('[API Router Error]:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
