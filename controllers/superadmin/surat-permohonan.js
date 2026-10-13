import SuratPermohonan from '../../models/SuratPermohonan.js';
import User from '../../models/User.js';
import PaceSekolah from '../../models/PaceSekolah.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const letters = await SuratPermohonan.findAll({
                include: [{
                    model: User,
                    attributes: ['id', 'email', 'role', 'nama_display', 'pace_type', 'mace_type'],
                    include: [{ model: PaceSekolah, attributes: ['id', 'nama_sekolah', 'jenis_sekolah'] }]
                }],
                order: [['created_at', 'DESC']]
            });
            return res.status(200).json(letters);
        } catch (error) {
            console.error('[SuperAdmin SuratPermohonan GET Error]:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const { status } = req.body;

            if (!id || !status) {
                return res.status(400).json({ message: 'id and status are required' });
            }

            const surat = await SuratPermohonan.findByPk(id);
            if (!surat) {
                return res.status(404).json({ message: 'Surat Permohonan not found' });
            }

            surat.status = status;
            await surat.save();

            return res.status(200).json(surat);
        } catch (error) {
            console.error('[SuperAdmin SuratPermohonan PUT Error]:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
