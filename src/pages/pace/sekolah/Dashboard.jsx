import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Upload, FileText, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';
import api from '../../../api/axios';
import { uploadDokumen } from '../../../lib/upload';

const DashboardSekolah = () => {
  const { suratStatus, setSuratStatus, isApproved } = useOutletContext();
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUploadClick = () => {
    document.getElementById('surat-upload').click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setMessage('Mohon unggah file dalam format PDF.');
      return;
    }
    
    setIsUploading(true);
    setMessage('');
    
    try {
      // Unggah file ke Supabase Storage (bucket dokumen-pendaftaran)
      const fileUrl = await uploadDokumen(file);

      // Simpan URL dari Supabase ke database melalui backend
      await api.post('/surat-permohonan', {
        file_url: fileUrl,
        type: 'pace_sekolah'
      });
      setSuratStatus('pending');
      setMessage('Surat permohonan berhasil diunggah. Menunggu persetujuan admin.');
    } catch (err) {
      setMessage('Gagal mengunggah surat: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = () => {
    switch (suratStatus) {
      case 'approved':
        return (
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl flex items-center gap-2 font-bold border border-emerald-100">
            <CheckCircle size={20} />
            Disetujui Admin
          </div>
        );
      case 'pending':
        return (
          <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl flex items-center gap-2 font-bold border border-amber-100">
            <Clock size={20} />
            Menunggu Persetujuan
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl flex items-center gap-2 font-bold border border-red-100">
            <XCircle size={20} />
            Ditolak - Unggah Ulang
          </div>
        );
      default:
        return (
          <div className="bg-slate-50 text-slate-500 px-4 py-2 rounded-xl flex items-center gap-2 font-bold border border-slate-200">
            <AlertCircle size={20} />
            Belum Ada Surat
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Sekolah</h2>
          <p className="text-slate-500 mt-1">
            {isApproved 
              ? 'Selamat datang! Anda sudah bisa mengakses semua menu.'
              : 'Silakan unggah Surat Permohonan Sekolah untuk membuka akses menu.'}
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {message && (
        <div className="bg-brand-blue/10 text-brand-blue px-4 py-3 rounded-xl border border-brand-blue/20 font-medium">
          {message}
        </div>
      )}

      {/* Upload Section - Always visible unless approved */}
      {!isApproved && (
        <div className="bg-white rounded-3xl p-8 premium-shadow border border-slate-100 max-w-2xl">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="text-brand-gold" />
            Upload Surat Permohonan Sekolah
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Unggah surat permohonan resmi dari sekolah yang ditandatangani oleh Kepala Sekolah dalam format PDF. 
            Setelah disetujui oleh Admin Sistem, semua menu akan terbuka.
          </p>

          <input
            type="file"
            id="surat-upload"
            className="hidden"
            accept=".pdf"
            onChange={handleFileChange}
          />

          <div 
            className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center mb-4 hover:border-brand-gold/40 transition-colors cursor-pointer" 
            onClick={handleUploadClick}
          >
            <Upload className="text-slate-400 mx-auto mb-3" size={40} />
            <p className="text-slate-600 font-medium mb-1">Klik untuk memilih file PDF</p>
            <p className="text-xs text-slate-400">Maksimal 10MB - Format PDF</p>
          </div>

          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="w-full flex justify-center items-center gap-2 gradient-gold text-white py-3 rounded-xl font-bold transition-all hover:opacity-90 premium-shadow disabled:opacity-70"
          >
            {isUploading ? 'Mengunggah...' : (
              <>
                <Upload size={18} />
                Unggah Surat Permohonan
              </>
            )}
          </button>
        </div>
      )}

      {/* Stats cards when approved */}
      {isApproved && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 premium-shadow border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                <FileText size={24} />
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">Aktif</span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">0</p>
            <p className="text-slate-500 text-sm mt-1">Total Siswa Terdaftar</p>
          </div>
          <div className="bg-white rounded-3xl p-6 premium-shadow border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Clock size={24} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">0</p>
            <p className="text-slate-500 text-sm mt-1">Menunggu Verifikasi</p>
          </div>
          <div className="bg-white rounded-3xl p-6 premium-shadow border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CheckCircle size={24} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">0</p>
            <p className="text-slate-500 text-sm mt-1">Lolos Seleksi</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSekolah;
