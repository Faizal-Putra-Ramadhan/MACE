import { withMiddleware } from '../../../../lib/auth.js';
import Pendaftaran from '../../../../models/Pendaftaran.js';
import DokumenPendaftaran from '../../../../models/DokumenPendaftaran.js';
import { hitungPoinFinal } from '../../../../lib/points.js';

// PUT /api/admin/pendaftaran/:id/poin
// Admin menetapkan poin manual:
// - documents: [{ id, poin }]  -> poin per berkas (poin_dokumen = totalnya)
// - poin_nim_manual / poin_nik_manual -> menggantikan poin otomatis sumber tsb.
// Nilai null/'' menghapus poin manual sehingga otomatisnya berlaku kembali.
async function handler(req, res) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { id } = req.query;
    const { documents, poin_nim_manual, poin_nik_manual } = req.body || {};

    const hasDocScores = Array.isArray(documents) && documents.length > 0;
    if (!hasDocScores && poin_nim_manual === undefined && poin_nik_manual === undefined) {
        return res.status(400).json({ message: 'Minimal satu penilaian (berkas / poin NIM / poin NIK) diisi' });
    }

    try {
        const pendaftaran = await Pendaftaran.findByPk(id);
        if (!pendaftaran) {
            return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
        }

        // Simpan poin per berkas (hanya dokumen milik pendaftaran ini).
        if (hasDocScores) {
            const docs = await DokumenPendaftaran.findAll({ where: { pendaftaran_id: pendaftaran.id } });
            const owned = new Map(docs.map(d => [d.id, d]));
            for (const item of documents) {
                const doc = owned.get(Number(item.id));
                if (!doc) continue;
                doc.poin = item.poin === null || item.poin === undefined || item.poin === '' ? null : Number(item.poin) || 0;
                await doc.save();
            }
            const fresh = await DokumenPendaftaran.findAll({ where: { pendaftaran_id: pendaftaran.id } });
            pendaftaran.poin_dokumen = fresh.reduce((sum, d) => sum + (Number(d.poin) || 0), 0);
        }

        const toVal = (v) => (v === undefined ? undefined : (v === null || v === '' ? null : Number(v) || 0));
        const valNim = toVal(poin_nim_manual);
        const valNik = toVal(poin_nik_manual);
        if (valNim !== undefined) pendaftaran.poin_nim_manual = valNim;
        if (valNik !== undefined) pendaftaran.poin_nik_manual = valNik;

        const final = hitungPoinFinal(pendaftaran.data_diri || {}, pendaftaran);
        pendaftaran.poin_otomatis = final.auto.poin_otomatis;
        pendaftaran.poin_total = final.poin_total;
        await pendaftaran.save();

        const docsAfter = await DokumenPendaftaran.findAll({ where: { pendaftaran_id: pendaftaran.id } });
        res.status(200).json({
            message: 'Poin berhasil disimpan',
            rincian: {
                poin_nim: final.poin_nim,
                poin_nik: final.poin_nik,
                poin_dokumen: final.poin_dokumen,
                poin_total: final.poin_total,
                nim_manual: final.nim_manual,
                nik_manual: final.nik_manual,
                otomatis: final.auto,
                documents: docsAfter.map(d => ({ id: d.id, poin: d.poin }))
            }
        });
    } catch (error) {
        console.error('[Admin Poin Error]:', error);
        res.status(500).json({ message: error.message });
    }
}

export default withMiddleware(handler);
