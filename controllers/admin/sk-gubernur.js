import { withMiddleware, verifyToken, adminOnly } from '../../lib/auth.js';
import sequelize from '../../lib/db.js';

async function handler(req, res) {
    const user = await verifyToken(req);
    adminOnly(user);

    if (req.method === 'GET') {
        try {
            const [rows] = await sequelize.query('SELECT * FROM sk_gubernur ORDER BY created_at DESC');
            return res.status(200).json(rows);
        } catch (error) {
            console.error('[SK Gubernur GET Error]:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { kategori, file_url } = req.body;
            if (!kategori || !file_url) {
                return res.status(400).json({ message: 'kategori and file_url are required' });
            }

            const [result] = await sequelize.query(
                `INSERT INTO sk_gubernur (kategori, file_url, created_at) 
                 VALUES (:kategori, :file_url, NOW()) 
                 ON DUPLICATE KEY UPDATE file_url = VALUES(file_url), created_at = NOW()`,
                { replacements: { kategori, file_url } }
            );

            return res.status(201).json({ message: 'SK Gubernur berhasil diupload', kategori, file_url });
        } catch (error) {
            console.error('[SK Gubernur POST Error]:', error);
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { kategori } = req.query;
            if (!kategori) {
                return res.status(400).json({ message: 'kategori is required' });
            }
            await sequelize.query('DELETE FROM sk_gubernur WHERE kategori = :kategori', { replacements: { kategori } });
            return res.status(200).json({ message: 'SK Gubernur berhasil dihapus' });
        } catch (error) {
            console.error('[SK Gubernur DELETE Error]:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}

export default withMiddleware(handler);
