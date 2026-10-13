import PaceSiswa from '../../../models/PaceSiswa.js';
import PaceSekolah from '../../../models/PaceSekolah.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    const { id } = req.query;

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token required' });
    
    let decoded;
    try {
        decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    } catch (e) {
        return res.status(401).json({ message: 'Token invalid' });
    }

    if (decoded.role !== 'sekolah_pace' && decoded.role !== 'admin_pace' && decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        const student = await PaceSiswa.findByPk(id);
        if (!student) return res.status(404).json({ message: 'Siswa tidak ditemukan' });

        // If sekolah_pace, verify they own this student
        if (decoded.role === 'sekolah_pace') {
            const school = await PaceSekolah.findOne({ where: { user_id: decoded.id } });
            if (!school || student.sekolah_id !== school.id) {
                return res.status(403).json({ message: 'Bukan siswa dari sekolah Anda' });
            }
        }

        if (req.method === 'DELETE') {
            await student.destroy();
            return res.status(200).json({ message: 'Siswa berhasil dihapus' });
        }

        if (req.method === 'PUT') {
            const { nama, nisn, nik, tempat_lahir, tanggal_lahir, kelas, alamat, nama_orang_tua, no_hp_orang_tua, file_rapor, file_sktm, file_prestasi_akademik, file_prestasi_non_akademik, biaya_lain_lain, spp_per_semester, komite_per_semester } = req.body;
            
            const updateData = {
                nama: nama?.toUpperCase() || student.nama,
                nisn: nisn || student.nisn,
                nik: nik || student.nik,
                tempat_lahir: tempat_lahir || student.tempat_lahir,
                tanggal_lahir: tanggal_lahir || student.tanggal_lahir,
                kelas: kelas || student.kelas,
                alamat: alamat || student.alamat,
                nama_orang_tua: nama_orang_tua || student.nama_orang_tua,
                no_hp_orang_tua: no_hp_orang_tua || student.no_hp_orang_tua,
                file_rapor: file_rapor !== undefined ? file_rapor : student.file_rapor,
                file_sktm: file_sktm !== undefined ? file_sktm : student.file_sktm,
                file_prestasi_akademik: file_prestasi_akademik !== undefined ? file_prestasi_akademik : student.file_prestasi_akademik,
                file_prestasi_non_akademik: file_prestasi_non_akademik !== undefined ? file_prestasi_non_akademik : student.file_prestasi_non_akademik,
            };

            // Update usulan_anggaran if provided
            if (biaya_lain_lain !== undefined || spp_per_semester !== undefined || komite_per_semester !== undefined) {
                const currentAnggaran = student.usulan_anggaran || {};
                updateData.usulan_anggaran = {
                    ...currentAnggaran,
                    ...(biaya_lain_lain !== undefined && { biaya_lain_lain }),
                    ...(spp_per_semester !== undefined && { spp_per_semester }),
                    ...(komite_per_semester !== undefined && { komite_per_semester }),
                };
            }

            await student.update(updateData);

            return res.status(200).json(student);
        }

        return res.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        console.error('Error in siswa/[id]:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
