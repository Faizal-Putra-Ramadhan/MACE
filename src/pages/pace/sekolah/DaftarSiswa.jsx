import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import api from '../../../api/axios';
import PaceSiswaFormByProgram from '../../../components/pace/PaceSiswaFormByProgram';

// Halaman penuh pendaftaran siswa PACE (mengikuti pola MACE, bukan modal)
const DaftarSiswa = () => {
  const navigate = useNavigate();

  const handleRegister = async (payload) => {
    const { _legacy, ...dataPendaftaran } = payload;
    try {
      await api.post('/pace/siswa', {
        ..._legacy,
        data_pendaftaran: dataPendaftaran,
      });
      navigate('/pace/sekolah/siswa', { state: { registered: true } });
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Terjadi kesalahan jaringan.');
    }
  };

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
            <UserPlus className="text-brand-blue" />
            Pendaftaran Siswa PACE
          </h2>
          <p className="text-slate-500 mt-1">Lengkapi formulir pendaftaran sesuai dokumen resmi Beasiswa PACE.</p>
        </div>
      </div>

      <PaceSiswaFormByProgram onCancel={() => navigate('/pace/sekolah/siswa')} onSubmit={handleRegister} />
    </div>
  );
};

export default DaftarSiswa;
