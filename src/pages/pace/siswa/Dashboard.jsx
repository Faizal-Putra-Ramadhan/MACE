import React, { useRef } from 'react';
import { Download, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import PaceCard from '../../../components/pace/PaceCard';

const DashboardSiswa = () => {
  const cardRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: cardRef,
    documentTitle: 'Kartu_PACE_Pelajar',
  });

  // Simulated student data
  const student = {
    nama: 'ASEP RUMBIAK',
    nisn: '0123456789',
    foto_profil: '/placeholder-student.png',
    status: 'approved' // pending, approved, rejected
  };

  const school = {
    nama_sekolah: 'SMP NEGERI 1 BIAK',
    kota: 'KABUPATEN BIAK NUMFOR'
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Selamat Datang, {student.nama}</h2>
        <p className="text-xl text-slate-500">Ini adalah halaman portal siswa Pelajar Cerdas (PACE) Anda.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 premium-shadow border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Status Kepesertaan</h3>
            
            {student.status === 'approved' && (
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-center">
                <CheckCircle className="text-emerald-500 mx-auto mb-4" size={48} />
                <h4 className="font-bold text-emerald-900 text-lg mb-2">Pendaftaran Disetujui</h4>
                <p className="text-emerald-700 text-sm">Selamat! Anda resmi menjadi peserta program PACE. Anda dapat mengunduh atau mencetak Kartu Digital Anda.</p>
              </div>
            )}
            
            {student.status === 'pending' && (
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 text-center">
                <Clock className="text-amber-500 mx-auto mb-4" size={48} />
                <h4 className="font-bold text-amber-900 text-lg mb-2">Sedang Diproses</h4>
                <p className="text-amber-700 text-sm">Data Anda sedang diverifikasi oleh tim Admin PACE Provinsi. Mohon cek kembali secara berkala.</p>
              </div>
            )}

            {student.status === 'rejected' && (
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100 text-center">
                <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                <h4 className="font-bold text-red-900 text-lg mb-2">Pendaftaran Ditolak</h4>
                <p className="text-red-700 text-sm">Mohon maaf, pendaftaran Anda tidak disetujui. Silakan hubungi admin sekolah untuk informasi lebih lanjut.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-8 premium-shadow border border-slate-100 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Kartu Digital PACE</h3>
              <button 
                onClick={handlePrint}
                disabled={student.status !== 'approved'}
                className="flex items-center gap-2 bg-slate-900 text-white hover:bg-brand-blue px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={18} />
                Cetak Kartu
              </button>
            </div>
            
            <div className={`transition-opacity duration-500 ${student.status === 'approved' ? 'opacity-100' : 'opacity-50 grayscale blur-sm pointer-events-none select-none'}`}>
              <div className="inline-block transform scale-90 sm:scale-100 origin-top">
                <PaceCard ref={cardRef} student={student} school={school} />
              </div>
            </div>
            
            {student.status !== 'approved' && (
              <div className="mt-8 text-center text-slate-500 font-medium">
                Kartu digital baru dapat diakses setelah pendaftaran disetujui.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSiswa;
