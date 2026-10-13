import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Megaphone, FileText, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

const PacePengumuman = () => {
  const { suratStatus, isApproved } = useOutletContext();

  const getStatusInfo = () => {
    switch (suratStatus) {
      case 'approved':
        return { icon: CheckCircle, color: 'emerald', text: 'Surat Permohonan Disetujui', desc: 'Semua menu sudah terbuka. Silakan lengkapi data sekolah dan data siswa.' };
      case 'pending':
        return { icon: Clock, color: 'amber', text: 'Surat Permohonan Sedang Ditinjau', desc: 'Admin sedang meninjau surat permohonan Anda. Mohon tunggu konfirmasi.' };
      case 'rejected':
        return { icon: XCircle, color: 'red', text: 'Surat Permohonan Ditolak', desc: 'Surat permohonan Anda ditolak. Silakan unggah ulang surat yang sesuai.' };
      default:
        return { icon: AlertCircle, color: 'slate', text: 'Belum Ada Surat Permohonan', desc: 'Silakan unggah surat permohonan di halaman Dashboard untuk memulai.' };
    }
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Megaphone className="text-brand-gold" />
          Pengumuman
        </h2>
        <p className="text-slate-500 mt-1">Informasi dan pengumuman terkait program PACE.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 premium-shadow border border-slate-100 max-w-2xl">
        <div className={`flex items-start gap-4 p-6 bg-${status.color}-50 rounded-2xl border border-${status.color}-100`}>
          <div className={`w-12 h-12 rounded-xl bg-${status.color}-100 flex items-center justify-center flex-shrink-0`}>
            <StatusIcon className={`text-${status.color}-500`} size={24} />
          </div>
          <div>
            <h3 className={`font-bold text-${status.color}-700 text-lg`}>{status.text}</h3>
            <p className={`text-${status.color}-600 text-sm mt-1`}>{status.desc}</p>
          </div>
        </div>

        {isApproved && (
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <FileText className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-blue-700 text-sm">Panduan Pengisian Data</h4>
                <p className="text-blue-600 text-xs mt-1">
                  Pastikan data sekolah (NPSN, alamat, no. rekening) sudah lengkap sebelum menambahkan data siswa.
                  Setiap siswa harus memiliki NISN dan NIK yang valid.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <Megaphone className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-amber-700 text-sm">Usulan Anggaran</h4>
                <p className="text-amber-600 text-xs mt-1">
                  Saat menambahkan data siswa, sertakan usulan anggaran (Biaya Lain-lain, SPP Per Semester, Komite Per Semester).
                  Admin akan menetapkan nominal pendanaan setelah verifikasi.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PacePengumuman;
