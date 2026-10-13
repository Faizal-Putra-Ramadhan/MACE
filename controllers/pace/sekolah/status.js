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
        return res.status(403).json({ message: 'Hanya Admin yang dapat menyetujui/menolak sekolah' });
    }

    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status harus approved atau rejected' });
        }

        const school = await PaceSekolah.findByPk(req.query.id);
        if (!school) return res.status(404).json({ message: 'Sekolah tidak ditemukan' });

        school.status_approval = status;
        await school.save();

        return res.status(200).json(school);
    } catch (error) {
        console.error('Error updating school status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
