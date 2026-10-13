import SuratPermohonan from '../models/SuratPermohonan.js';
import User from '../models/User.js';
import PengaturanAkses from '../models/PengaturanAkses.js';
import jwt from 'jsonwebtoken';

const paceTypeToScope = (paceType) => {
    if (paceType === 'SNK') return 'pace_snk';
    if (paceType === 'Siswa Atlit Berprestasi') return 'pace_atlit';
    return 'pace_slb';
};

export default async function handler(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token required' });

    let decoded;
    try {
        decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    } catch (e) {
        return res.status(401).json({ message: 'Token invalid' });
    }

    const userId = decoded.id;

    if (req.method === 'GET') {
        try {
            const surat = await SuratPermohonan.findOne({
                where: { user_id: userId },
                order: [['created_at', 'DESC']]
            });
            return res.status(200).json(surat || null);
        } catch (error) {
            console.error('[SuratPermohonan GET Error]:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    if (req.method === 'POST') {
        try {
            // Check access control for surat permohonan
            let scope;
            if (decoded.role === 'sekolah_pace') {
                scope = paceTypeToScope(decoded.pace_type);
            } else if (decoded.role === 'mace_kabkota' || decoded.role === 'mace_provinsi') {
                scope = decoded.role; // mace_kabkota or mace_provinsi
            }
            if (scope) {
                const akses = await PengaturanAkses.findOne({ where: { scope } });
                if (akses && !akses.edit_surat_permohonan) {
                    return res.status(403).json({ message: 'Upload surat permohonan sedang ditutup oleh admin' });
                }
            }

            const { file_url, type } = req.body;
            
            if (!file_url || !type) {
                return res.status(400).json({ message: 'file_url and type are required' });
            }

            // Check if one already exists
            const existing = await SuratPermohonan.findOne({
                where: { user_id: userId }
            });

            if (existing) {
                existing.file_url = file_url;
                existing.type = type;
                existing.status = 'pending'; // Reset status on re-upload
                await existing.save();
                return res.status(200).json(existing);
            }

            const newSurat = await SuratPermohonan.create({
                user_id: userId,
                file_url,
                type,
                status: 'pending'
            });

            return res.status(201).json(newSurat);
        } catch (error) {
            console.error('[SuratPermohonan POST Error]:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
