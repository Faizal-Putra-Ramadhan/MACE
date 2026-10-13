import { withMiddleware } from '../../../../lib/auth.js';
import Pendaftaran from '../../../../models/Pendaftaran.js';
import { hitungPoinFinal } from '../../../../lib/points.js';

async function handler(req, res) {
    const { id } = req.query;

    console.log(`[Admin Update Status] ID: ${id}, Body:`, req.body);

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { status, alasan_penolakan, nominal_dana, poin_dokumen, poin_nim_manual, poin_nik_manual } = req.body;

    try {
        const pendaftaran = await Pendaftaran.findByPk(id);
        if (!pendaftaran) {
            return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
        }

        console.log(`[Admin Update Status] Current Status: ${pendaftaran.status} -> New Status: ${status}`);

        pendaftaran.status = status;
        pendaftaran.alasan_penolakan = alasan_penolakan || null;
        pendaftaran.nominal_dana = nominal_dana || pendaftaran.nominal_dana;

        // Poin manual ditetapkan admin per sumber: NIM (IPK dkk), NIK, dan dokumen.
        const applyManual = (field, value) => {
            if (value === undefined) return;
            pendaftaran[field] = value === null || value === '' ? null : Number(value) || 0;
        };
        applyManual('poin_dokumen', poin_dokumen);
        applyManual('poin_nim_manual', poin_nim_manual);
        applyManual('poin_nik_manual', poin_nik_manual);

        // Poin otomatis dihitung ulang dari data_diri, lalu total = manual per sumber + dokumen.
        const final = hitungPoinFinal(pendaftaran.data_diri || {}, pendaftaran);
        pendaftaran.poin_otomatis = final.auto.poin_otomatis;
        pendaftaran.poin_total = final.poin_total;
        
        if (status === 'lolos_berkas') {
            pendaftaran.saldo = pendaftaran.nominal_dana;
            if (!pendaftaran.kode_kartu) {
                pendaftaran.kode_kartu = `MACE-2026-${pendaftaran.id.toString().padStart(4, '0')}`;
            }
        }
        await pendaftaran.save();

        res.status(200).json({ message: 'Status berhasil diperbarui' });
    } catch (error) {
        console.error('[Admin Update Status Error]:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

export default withMiddleware(handler);
