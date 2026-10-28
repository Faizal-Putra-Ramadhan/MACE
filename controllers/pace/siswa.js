import PaceSiswa from '../../models/PaceSiswa.js';
import PaceSekolah from '../../models/PaceSekolah.js';
import PengaturanAkses from '../../models/PengaturanAkses.js';
import jwt from 'jsonwebtoken';

const paceTypeToScope = (paceType) => {
    if (paceType === 'SNK') return 'pace_snk';
    if (paceType === 'Siswa Atlit Berprestasi') return 'pace_atlit';
    if (paceType === 'Kedinasan') return 'pace_kedinasan';
    return 'pace_slb';
};

export default async function handler(req, res) {
    // Verify JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token required' });
    
    let decoded;
    try {
        decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    } catch (e) {
        return res.status(401).json({ message: 'Token invalid' });
    }

    if (req.method === 'GET') {
        try {
            // If admin or admin_pace, get ALL students
            if (decoded.role === 'admin_pace' || decoded.role === 'admin') {
                const where = {};
                if (req.query.jenis_sekolah) {
                    where['$pace_sekolah.jenis_sekolah$'] = req.query.jenis_sekolah;
                }

                const students = await PaceSiswa.findAll({
                    where,
                    include: [{ model: PaceSekolah, attributes: ['id', 'nama_sekolah', 'jenis_sekolah', 'status_approval', 'npsn', 'alamat', 'no_rekening'] }],
                    order: [['created_at', 'DESC']]
                });
                return res.status(200).json(students);
            }
            
            // If sekolah_pace, get only students from their school
            if (decoded.role === 'sekolah_pace') {
                const school = await PaceSekolah.findOne({ where: { user_id: decoded.id } });
                if (!school) return res.status(404).json({ message: 'Sekolah tidak ditemukan' });

                const students = await PaceSiswa.findAll({
                    where: { sekolah_id: school.id },
                    order: [['created_at', 'DESC']]
                });
                return res.status(200).json(students);
            }

            return res.status(403).json({ message: 'Forbidden' });
        } catch (error) {
            console.error('Error fetching students:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        // Only sekolah_pace can add students
        if (decoded.role !== 'sekolah_pace') {
            return res.status(403).json({ message: 'Hanya Admin Sekolah yang dapat mendaftarkan siswa' });
        }

        try {
            // Check access control
            const scope = paceTypeToScope(decoded.pace_type);
            const akses = await PengaturanAkses.findOne({ where: { scope } });
            if (akses && !akses.edit_siswa) {
                return res.status(403).json({ message: 'Pendaftaran siswa sedang ditutup oleh admin' });
            }

            const school = await PaceSekolah.findOne({ where: { user_id: decoded.id } });
            if (!school) return res.status(404).json({ message: 'Sekolah tidak ditemukan' });

            const {
                nama, nisn, nik, tempat_lahir, tanggal_lahir, kelas, alamat,
                nama_orang_tua, no_hp_orang_tua,
                file_rapor, file_sktm, file_prestasi_akademik, file_prestasi_non_akademik,
                biaya_lain_lain, spp_per_semester, komite_per_semester,
                data_pendaftaran
            } = req.body;

            // Validate required fields (hanya nama yang wajib; sisanya opsional sesuai formulir)
            if (!nama) {
                return res.status(400).json({ message: 'Nama lengkap peserta didik wajib diisi' });
            }

            const usulan_anggaran = {};
            if (biaya_lain_lain !== undefined) usulan_anggaran.biaya_lain_lain = biaya_lain_lain;
            if (spp_per_semester !== undefined) usulan_anggaran.spp_per_semester = spp_per_semester;
            if (komite_per_semester !== undefined) usulan_anggaran.komite_per_semester = komite_per_semester;

            // Kosongkan string kosong pada field unik agar tidak bertabrakan
            const clean = (v) => (v === undefined || v === null || v === '' ? null : v);

            const student = await PaceSiswa.create({
                sekolah_id: school.id,
                nama: nama.toUpperCase(),
                nisn: clean(nisn),
                nik: clean(nik),
                tempat_lahir: clean(tempat_lahir),
                tanggal_lahir: clean(tanggal_lahir),
                kelas: clean(kelas),
                alamat: clean(alamat),
                nama_orang_tua: clean(nama_orang_tua),
                no_hp_orang_tua: clean(no_hp_orang_tua),
                file_rapor: file_rapor || null,
                file_sktm: file_sktm || null,
                file_prestasi_akademik: file_prestasi_akademik || file_rapor || null,
                file_prestasi_non_akademik: file_prestasi_non_akademik || null,
                usulan_anggaran: Object.keys(usulan_anggaran).length > 0 ? usulan_anggaran : null,
                data_pendaftaran: data_pendaftaran || null,
                status_approval: 'pending'
            });

            return res.status(201).json(student);
        } catch (error) {
            console.error('Error creating student:', error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ message: 'NISN atau NIK sudah terdaftar' });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
