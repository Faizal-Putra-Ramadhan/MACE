import PaceSekolah from '../../models/PaceSekolah.js';
import PaceSiswa from '../../models/PaceSiswa.js';
import User from '../../models/User.js';
import PengaturanAkses from '../../models/PengaturanAkses.js';
import jwt from 'jsonwebtoken';

const paceTypeToScope = (paceType) => {
    if (paceType === 'SNK') return 'pace_snk';
    if (paceType === 'Siswa Atlit Berprestasi') return 'pace_atlit';
    return 'pace_slb';
};

export default async function handler(req, res) {
    const authHeader = req.headers.authorization;
    let decoded = null;

    if (authHeader) {
        try {
            decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        } catch (e) {
            return res.status(401).json({ message: 'Token invalid' });
        }
    }

    if (req.method === 'GET') {
        try {
            if (decoded && (decoded.role === 'admin_pace' || decoded.role === 'admin')) {
                // Admin sees all schools with student counts and details
                const where = {};
                if (req.query.jenis_sekolah) {
                    where.jenis_sekolah = req.query.jenis_sekolah;
                }

                const schools = await PaceSekolah.findAll({
                    where,
                    include: [
                        { model: PaceSiswa, attributes: ['id', 'nama', 'nisn', 'kelas', 'status_approval', 'file_rapor', 'file_sktm', 'file_prestasi_akademik', 'file_prestasi_non_akademik', 'usulan_anggaran', 'nominal_pendanaan'] },
                        { model: User, attributes: ['id', 'email', 'nama_display'] }
                    ],
                    order: [['jenis_sekolah', 'ASC'], ['nama_sekolah', 'ASC']]
                });
                return res.status(200).json(schools);
            }

            if (decoded && decoded.role === 'sekolah_pace') {
                // School sees their own profile
                const school = await PaceSekolah.findOne({
                    where: { user_id: decoded.id },
                    include: [{ model: User, attributes: ['id', 'email', 'nama_display'] }]
                });
                if (!school) return res.status(404).json({ message: 'Sekolah tidak ditemukan' });
                return res.status(200).json(school);
            }

            // Public: list schools for portal
            const schools = await PaceSekolah.findAll({
                attributes: ['id', 'nama_sekolah', 'jenis_sekolah'],
                order: [['jenis_sekolah', 'ASC'], ['nama_sekolah', 'ASC']]
            });
            return res.status(200).json(schools);
        } catch (error) {
            console.error('Error fetching schools:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    if (req.method === 'PUT') {
        if (!decoded) return res.status(401).json({ message: 'Token required' });

        // Admin can approve sekolah and update data
        if (decoded.role === 'admin' || decoded.role === 'admin_pace') {
            try {
                const schoolId = req.body.id || req.query.id;
                if (!schoolId) return res.status(400).json({ message: 'ID sekolah wajib diisi' });

                const school = await PaceSekolah.findByPk(schoolId);
                if (!school) return res.status(404).json({ message: 'Sekolah tidak ditemukan' });

                const { status_approval, npsn, alamat, no_rekening } = req.body;
                if (status_approval !== undefined) school.status_approval = status_approval;
                if (npsn !== undefined) school.npsn = npsn;
                if (alamat !== undefined) school.alamat = alamat;
                if (no_rekening !== undefined) school.no_rekening = no_rekening;

                await school.save();
                return res.status(200).json(school);
            } catch (error) {
                console.error('Error updating school (admin):', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        }

        // School updates their own profile
        if (decoded.role === 'sekolah_pace') {
            try {
                // Check access control
                const scope = paceTypeToScope(decoded.pace_type);
                const akses = await PengaturanAkses.findOne({ where: { scope } });
                if (akses && !akses.edit_data_sekolah) {
                    return res.status(403).json({ message: 'Edit data sekolah sedang ditutup oleh admin' });
                }

                const school = await PaceSekolah.findOne({ where: { user_id: decoded.id } });
                if (!school) return res.status(404).json({ message: 'Sekolah tidak ditemukan' });

                const { npsn, alamat, no_rekening, surat_permohonan } = req.body;
                if (npsn !== undefined) school.npsn = npsn;
                if (alamat !== undefined) school.alamat = alamat;
                if (no_rekening !== undefined) school.no_rekening = no_rekening;
                if (surat_permohonan !== undefined) school.surat_permohonan = surat_permohonan;
                
                await school.save();
                return res.status(200).json(school);
            } catch (error) {
                console.error('Error updating school:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        }

        return res.status(403).json({ message: 'Forbidden' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
