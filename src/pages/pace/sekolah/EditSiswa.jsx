import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Loader2 } from 'lucide-react';
import api from '../../../api/axios';
import PaceSiswaFormByProgram from '../../../components/pace/PaceSiswaFormByProgram';

// Halaman penuh edit siswa PACE — memakai formulir resmi sesuai program sekolah,
// dimuat dari kolom JSON data_pendaftaran (fallback ke kolom legasi).
const EditSiswa = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/pace/siswa');
        const found = res.data.find(s => String(s.id) === String(id));
        if (!found) { setNotFound(true); return; }
        setStudent(found);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const initialValue = (() => {
    if (!student) return null;
    if (student.data_pendaftaran) return student.data_pendaftaran;
    // Rekaman lama tanpa JSON: prefill dari kolom legasi
    return {
      identitas: {
        nama: student.nama || '', nisn: student.nisn || '', nik: student.nik || '',
        tempat_lahir: student.tempat_lahir || '', tanggal_lahir: student.tanggal_lahir || '',
        kelas: student.kelas || '', alamat: student.alamat || '',
        no_hp_ortu: student.no_hp_orang_tua || '',
      },
      orang_tua: { ayah: { nama: student.nama_orang_tua || '' } },
    };
  })();

  const handleSave = async (payload) => {
    const { _legacy, ...dataPendaftaran } = payload;
    try {
      await api.put(`/pace/siswa/${id}`, { ..._legacy, data_pendaftaran: dataPendaftaran });
      navigate('/pace/sekolah/siswa', { state: { updated: true } });
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Gagal menyimpan perubahan.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-slate-500 py-24">
        <Loader2 className="animate-spin" size={20} /> Memuat data siswa...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center py-24">
        <p className="text-slate-500 mb-4">Data siswa tidak ditemukan.</p>
        <button onClick={() => navigate('/pace/sekolah/siswa')} className="font-bold text-brand-blue">← Kembali ke daftar siswa</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/pace/sekolah/siswa')}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-brand-blue hover:border-brand-blue/40 transition-colors premium-shadow"
          title="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Pencil className="text-brand-blue" />
            Edit Data Siswa PACE
          </h2>
          <p className="text-slate-500 mt-1">Perbarui formulir pendaftaran siswa. Berkas lama ditandai "Terunggah".</p>
        </div>
      </div>

      <PaceSiswaFormByProgram initialValue={initialValue} submitLabel="Simpan Perubahan" onCancel={() => navigate('/pace/sekolah/siswa')} onSubmit={handleSave} />
    </div>
  );
};

export default EditSiswa;
