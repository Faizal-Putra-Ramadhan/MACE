import bcrypt from 'bcryptjs';
import User from '../../../models/User.js';
import PaceSekolah from '../../../models/PaceSekolah.js';
import { withMiddleware, verifyToken, adminOnly } from '../../../lib/auth.js';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const user = await verifyToken(req);
        adminOnly(user);

        const { email, password, role, pace_type, mace_type, nama_display, nama_sekolah } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Email, password, dan role wajib diisi' });
        }

        // Check if email already exists
        const existing = await User.findOne({ where: { email: email.trim().toLowerCase() } });
        if (existing) {
            return res.status(409).json({ message: 'Email sudah terdaftar' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Determine the actual role to store
        let actualRole = role;
        if (['pace_slb', 'pace_snk', 'pace_atlit'].includes(role)) {
            actualRole = 'sekolah_pace';
        }

        const newUser = await User.create({
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role: actualRole,
            pace_type: pace_type || null,
            mace_type: mace_type || null,
            nama_display: nama_display || null,
            is_approved: true // Admin-created accounts are auto-approved
        });

        // If PACE sekolah, create associated PaceSekolah record
        if (actualRole === 'sekolah_pace' && nama_sekolah) {
            let jenisSekolah = pace_type;
            if (pace_type === 'Siswa Atlit Berprestasi') {
                jenisSekolah = 'Siswa Atlit Berprestasi';
            }

            await PaceSekolah.create({
                user_id: newUser.id,
                nama_sekolah: nama_sekolah.toUpperCase(),
                jenis_sekolah: jenisSekolah || 'SLB',
                status_approval: 'pending'
            });
        }

        // Return user without password
        const userData = newUser.toJSON();
        delete userData.password;

        res.status(201).json({ message: 'Akun berhasil dibuat', user: userData });
    } catch (error) {
        console.error('[Create User Error]:', error);
        res.status(500).json({ message: error.message });
    }
}

export default withMiddleware(handler);
