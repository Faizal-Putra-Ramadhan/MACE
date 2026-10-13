import PaceSiswa from '../../../models/PaceSiswa.js';
import PaceSekolah from '../../../models/PaceSekolah.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token required' });
    
    let decoded;
    try {
        decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    } catch (e) {
        return res.status(401).json({ message: 'Token invalid' });
    }

    if (decoded.role !== 'admin_pace' && decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Hanya Admin yang dapat menyetujui/menolak siswa' });
    }

    try {
        const { status, nominal_pendanaan } = req.body; // 'approved' or 'rejected'
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status harus approved atau rejected' });
        }

        const student = await PaceSiswa.findByPk(req.query.id);
        if (!student) return res.status(404).json({ message: 'Siswa tidak ditemukan' });

        student.status_approval = status;
        if (status === 'approved' && nominal_pendanaan !== undefined) {
            student.nominal_pendanaan = nominal_pendanaan;
        }
        await student.save();

        return res.status(200).json(student);
    } catch (error) {
        console.error('Error updating student status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
