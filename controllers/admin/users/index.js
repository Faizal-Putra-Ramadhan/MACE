import User from '../../../models/User.js';
import Mahasiswa from '../../../models/Mahasiswa.js';
import PaceSekolah from '../../../models/PaceSekolah.js';
import { withMiddleware, verifyToken, adminOnly } from '../../../lib/auth.js';

async function handler(req, res) {
    try {
        const user = await verifyToken(req);
        adminOnly(user);

        const { role, pace_type, mace_type } = req.query;

        const where = {};
        if (role) where.role = role;
        if (pace_type) where.pace_type = pace_type;
        if (mace_type) where.mace_type = mace_type;

        const list = await User.findAll({
            where,
            include: [
                { model: Mahasiswa },
                { model: PaceSekolah }
            ]
        });
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default withMiddleware(handler);
