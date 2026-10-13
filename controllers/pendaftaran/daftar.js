import Pendaftaran from '../../models/Pendaftaran.js';
import DokumenPendaftaran from '../../models/DokumenPendaftaran.js';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import { withMiddleware } from '../../lib/auth.js';
import { hitungPoinOtomatis } from '../../lib/points.js';

const VALID_PROGRAMS = ['A', 'B', 'C', 'D', 'E'];

// Coba ambil user dari token (untuk menandai operator). Tidak wajib.
async function resolveOptionalUser(req) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = (authHeader && authHeader.split(' ')[1]) || req.query.token;
    if (!token || token === 'null' || token === 'undefined') return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return await User.findByPk(decoded.id);
    } catch {
        return null;
    }
}

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { program, documents, data_diri } = req.body || {};

        if (!VALID_PROGRAMS.includes(program)) {
            return res.status(400).json({ message: 'Program tidak valid' });
        }
        if (!data_diri || !data_diri.nama || !data_diri.nim || !data_diri.nik) {
            return res.status(400).json({ message: 'Data diri (nama, NIM, NIK) wajib diisi' });
        }

        // Pendaftaran anonim: mahasiswa_id null. Jika pembuatnya operator login, catat operator_id.
        const actor = await resolveOptionalUser(req);
        const isOperator = actor && (actor.role === 'mace_kabkota' || actor.role === 'mace_provinsi');

        // Sistem perangkingan: poin otomatis (NIM & NIK terpisah) dihitung dari data_diri.
        const auto = hitungPoinOtomatis(data_diri);

        const pendaftaran = await Pendaftaran.create({
            mahasiswa_id: null,
            operator_id: isOperator ? actor.id : null,
            program,
            status: 'submitted',
            data_diri,
            poin_otomatis: auto.poin_otomatis,
            poin_total: auto.poin_otomatis
        });

        if (Array.isArray(documents) && documents.length) {
            const docsToCreate = documents
                .filter(doc => doc && doc.jenis && doc.url)
                .map(doc => ({
                    pendaftaran_id: pendaftaran.id,
                    jenis_dokumen: doc.jenis,
                    file_path: doc.url
                }));
            if (docsToCreate.length) await DokumenPendaftaran.bulkCreate(docsToCreate);
        }

        return res.status(201).json({
            message: 'Pendaftaran berhasil',
            id: pendaftaran.id,
            kode: `MACE-${new Date().getFullYear()}-${String(pendaftaran.id).padStart(4, '0')}`
        });
    } catch (error) {
        console.error('[Pendaftaran Daftar Error]:', error);
        return res.status(500).json({ message: error.message });
    }
}

export default withMiddleware(handler);
