import { withMiddleware } from '../../lib/auth.js';
import fs from 'fs';
import path from 'path';

// Allowed upload buckets (folder names under public/uploads)
const ALLOWED_BUCKETS = new Set([
    'dokumen-pendaftaran',
    'laporan',
    'foto-profil',
    'rekening',
    'sk-gubernur',
    'surat-permohonan'
]);

function sanitizeName(name = '') {
    return String(name)
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_{2,}/g, '_')
        .slice(-120);
}

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { file, filename, bucket = 'dokumen-pendaftaran' } = req.body || {};

        if (!file || !filename) {
            return res.status(400).json({ message: 'file (base64) and filename are required' });
        }

        const safeBucket = ALLOWED_BUCKETS.has(bucket) ? bucket : 'dokumen-pendaftaran';

        // Accept both raw base64 and data URLs (data:application/pdf;base64,xxxx)
        const base64Data = file.includes(',') ? file.split(',')[1] : file;
        const buffer = Buffer.from(base64Data, 'base64');

        const uniqueName = `${Date.now()}-${sanitizeName(filename)}`;
        const targetDir = path.join(process.cwd(), 'public', 'uploads', safeBucket);
        fs.mkdirSync(targetDir, { recursive: true });

        const targetPath = path.join(targetDir, uniqueName);
        fs.writeFileSync(targetPath, buffer);

        const publicUrl = `/uploads/${safeBucket}/${uniqueName}`;
        return res.status(201).json({ url: publicUrl, path: publicUrl });
    } catch (error) {
        console.error('[Upload Error]:', error);
        return res.status(500).json({ message: 'Gagal mengunggah file' });
    }
}

export default withMiddleware(handler);
