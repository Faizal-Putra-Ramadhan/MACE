import React from 'react';
import { Building2, Users, CheckCircle, Clock } from 'lucide-react';

const AdminPaceDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Super Admin</h2>
        <p className="text-slate-500 mt-1">Ringkasan pendaftaran sekolah dan siswa dalam program PACE.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl premium-shadow border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-3 text-slate-500 mb-4">
            <Building2 className="text-brand-blue" />
            <span className="font-bold">Total Sekolah</span>
          </div>
          <p className="text-4xl font-extrabold text-slate-900">12</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl premium-shadow border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-3 text-slate-500 mb-4">
            <Users className="text-brand-gold" />
            <span className="font-bold">Total Siswa</span>
          </div>
          <p className="text-4xl font-extrabold text-slate-900">145</p>
        </div>

        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex flex-col justify-between">
          <div className="flex items-center gap-3 text-emerald-700 mb-4">
            <CheckCircle />
            <span className="font-bold">Disetujui</span>
          </div>
          <p className="text-4xl font-extrabold text-emerald-900">8</p>
        </div>

        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex flex-col justify-between">
          <div className="flex items-center gap-3 text-amber-700 mb-4">
            <Clock />
            <span className="font-bold">Menunggu</span>
          </div>
          <p className="text-4xl font-extrabold text-amber-900">4</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 premium-shadow border border-slate-100 mt-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Aktivitas Terbaru</h3>
        <div className="text-center py-12 text-slate-500">
          <Clock className="mx-auto mb-3 text-slate-300" size={32} />
          Belum ada aktivitas terbaru untuk saat ini.
        </div>
      </div>
    </div>
  );
};

export default AdminPaceDashboard;
