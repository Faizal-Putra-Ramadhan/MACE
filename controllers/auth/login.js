import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Mahasiswa from '../../models/Mahasiswa.js';
import PaceSekolah from '../../models/PaceSekolah.js';
import User from '../../models/User.js';
import { withMiddleware } from '../../lib/auth.js';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { password } = req.body;
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';

    try {
        if (!process.env.DB_NAME || !process.env.JWT_SECRET) {
            throw new Error('Missing environment variables');
        }

        const user = await User.findOne({ 
            where: { email },
            include: [
                { model: Mahasiswa },
                { model: PaceSekolah }
            ]
        });

        if (!user) {
            return res.status(400).json({ message: 'Email tidak ditemukan' });
        }

        if (!user.is_approved) {
            return res.status(400).json({ message: 'Akun Anda belum disetujui oleh admin' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password salah' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, pace_type: user.pace_type, mace_type: user.mace_type },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                pace_type: user.pace_type,
                mace_type: user.mace_type,
                nama_display: user.nama_display,
                nama: user.role === 'admin' ? 'Admin' : (user.mahasiswa ? user.mahasiswa.nama_lengkap : (user.nama_display || 'User')),
                nim: user.mahasiswa ? user.mahasiswa.nim : null,
                pt: user.mahasiswa ? user.mahasiswa.pt : null,
                prodi: user.mahasiswa ? user.mahasiswa.prodi : null,
                pace_sekolah: user.pace_sekolah ? {
                    id: user.pace_sekolah.id,
                    nama_sekolah: user.pace_sekolah.nama_sekolah,
                    jenis_sekolah: user.pace_sekolah.jenis_sekolah,
                    status_approval: user.pace_sekolah.status_approval
                } : null
            }
        });
    } catch (error) {
        console.error('[Login Error]:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

export default withMiddleware(handler);
