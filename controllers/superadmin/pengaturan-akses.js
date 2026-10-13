import PengaturanAkses from '../../models/PengaturanAkses.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { scope } = req.query;

            if (scope) {
                const pengaturan = await PengaturanAkses.findOne({ where: { scope } });
                return res.status(200).json(pengaturan);
            }

            // Return all scopes
            const allPengaturan = await PengaturanAkses.findAll();
            return res.status(200).json(allPengaturan);
        } catch (error) {
            console.error('[PengaturanAkses GET Error]:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { scope, edit_surat_permohonan, edit_data_sekolah, edit_siswa } = req.body;

            if (!scope) {
                return res.status(400).json({ message: 'scope is required' });
            }

            let pengaturan = await PengaturanAkses.findOne({ where: { scope } });
            if (!pengaturan) {
                pengaturan = await PengaturanAkses.create({
                    scope,
                    edit_surat_permohonan: edit_surat_permohonan !== undefined ? edit_surat_permohonan : true,
                    edit_data_sekolah: edit_data_sekolah !== undefined ? edit_data_sekolah : true,
                    edit_siswa: edit_siswa !== undefined ? edit_siswa : true
                });
            } else {
                if (edit_surat_permohonan !== undefined) pengaturan.edit_surat_permohonan = edit_surat_permohonan;
                if (edit_data_sekolah !== undefined) pengaturan.edit_data_sekolah = edit_data_sekolah;
                if (edit_siswa !== undefined) pengaturan.edit_siswa = edit_siswa;
                await pengaturan.save();
            }

            return res.status(200).json(pengaturan);
        } catch (error) {
            console.error('[PengaturanAkses PUT Error]:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
