import { withMiddleware } from '../../lib/auth.js';
import Pendaftaran from '../../models/Pendaftaran.js';
import Mahasiswa from '../../models/Mahasiswa.js';
import User from '../../models/User.js';
import PaceSiswa from '../../models/PaceSiswa.js';
import PaceSekolah from '../../models/PaceSekolah.js';
import sequelize from '../../lib/db.js';

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // === MACE Recipients ===
        const maceList = await Pendaftaran.findAll({
            where: sequelize.literal("pendaftaran.status IN ('lolos_berkas', 'selesai')"),
            include: [{
                model: Mahasiswa,
                include: [{ model: User, attributes: ['mace_type'] }]
            }],
            order: [['created_at', 'ASC']]
        });

        // Satu kategori MACE (tanpa pemisahan Kab/Kota vs Provinsi) karena
        // pendaftaran kini bersifat login-free dan identitas disimpan di data_diri.
        const mace = maceList.map((p, i) => {
            const dd = p.data_diri || {};
            return {
                no: i + 1,
                nama: dd.nama || p.mahasiswa?.nama_lengkap || '-',
                nim: dd.nim || p.mahasiswa?.nim || '-',
                nik: dd.nik || p.mahasiswa?.nik || '-',
                kampus: dd.pt || p.mahasiswa?.perguruan_tinggi || '-',
            };
        });

        // === PACE Recipients ===
        const paceList = await PaceSiswa.findAll({
            where: sequelize.literal("pace_siswa.status_approval = 'approved'"),
            include: [{
                model: PaceSekolah,
                attributes: ['nama_sekolah', 'jenis_sekolah']
            }],
            order: [['created_at', 'ASC']]
        });

        const paceSLB = [];
        const paceSNK = [];
        const paceAtlit = [];

        paceList.forEach(s => {
            const entry = {
                no: 0,
                nama: s.nama || '-',
                nisn: s.nisn || '-',
                nik: s.nik || '-',
                sekolah: s.pace_sekolah?.nama_sekolah || '-',
            };
            const jenis = s.pace_sekolah?.jenis_sekolah || '';
            if (jenis === 'SLB') {
                entry.no = paceSLB.length + 1;
                paceSLB.push(entry);
            } else if (jenis === 'SNK') {
                entry.no = paceSNK.length + 1;
                paceSNK.push(entry);
            } else {
                entry.no = paceAtlit.length + 1;
                paceAtlit.push(entry);
            }
        });

        // === SK Gubernur files ===
        let skFiles = {};
        try {
            const [rows] = await sequelize.query('SELECT kategori, file_url FROM sk_gubernur ORDER BY created_at DESC');
            rows.forEach(r => {
                if (!skFiles[r.kategori]) skFiles[r.kategori] = r.file_url;
            });
        } catch (e) {
            // Table might not exist yet
        }

        res.status(200).json({
            mace,
            pace_slb: paceSLB,
            pace_snk: paceSNK,
            pace_atlit: paceAtlit,
            sk_gubernur: skFiles,
        });
    } catch (error) {
        console.error('[Pengumuman Penerima Error]:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default withMiddleware(handler);
