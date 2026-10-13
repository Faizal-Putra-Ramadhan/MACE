import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentLayout from './components/layout/StudentLayout';
import AdminLayout from './components/layout/AdminLayout';
import PaceSekolahLayout from './components/layout/PaceSekolahLayout';
import PaceSiswaLayout from './components/layout/PaceSiswaLayout';
import PaceAdminLayout from './components/layout/PaceAdminLayout';
import MaceOperatorLayout from './components/layout/MaceOperatorLayout';
import LandingPageProfile from './pages/LandingPageProfile';
import PacePortal from './pages/pace/PacePortal';
import MacePortal from './pages/mace/MacePortal';
import DashboardSekolah from './pages/pace/sekolah/Dashboard';
import KelolaSiswa from './pages/pace/sekolah/KelolaSiswa';
import DataSekolah from './pages/pace/sekolah/DataSekolah';
import PacePengumuman from './pages/pace/sekolah/Pengumuman';
import PaceDaftarLolos from './pages/pace/sekolah/DaftarLolos';
import DashboardSiswa from './pages/pace/siswa/Dashboard';
import AdminPaceDashboard from './pages/pace/admin/Dashboard';
import AdminPaceApproval from './pages/pace/admin/Approval';
import AdminPaceSiswa from './pages/pace/admin/Siswa';

// MACE Operator Pages
import OperatorDashboard from './pages/mace/operator/Dashboard';
import LembagaPengusul from './pages/mace/operator/LembagaPengusul';
import InputMahasiswa from './pages/mace/operator/InputMahasiswa';
import OperatorPengumuman from './pages/mace/operator/Pengumuman';
import DaftarLolos from './pages/mace/operator/DaftarLolos';

// Student (Mahasiswa) Pages
import Beranda from './pages/mahasiswa/Beranda';
import PendaftaranForm from './pages/mahasiswa/PendaftaranForm';
import Pengumuman from './pages/mahasiswa/Pengumuman';
import LaporanCard from './pages/mahasiswa/LaporanCard';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManagePendaftaran from './pages/admin/ManagePendaftaran';
import SeleksiBerkas from './pages/admin/SeleksiBerkas';
import ManagePenerima from './pages/admin/ManagePenerima';
import LaporanMahasiswa from './pages/admin/LaporanMahasiswa';
import ManageUsers from './pages/admin/ManageUsers';
import CreateAccount from './pages/admin/CreateAccount';
import AdminPaceApprovalPage from './pages/admin/pace/PaceApproval';
import AdminPaceDaftarLolos from './pages/admin/pace/PaceDaftarLolos';
import AdminMaceApproval from './pages/admin/mace/MaceApproval';
import AdminMaceDaftarLolos from './pages/admin/mace/MaceDaftarLolos';
import PengaturanAksesPage from './pages/admin/PengaturanAkses';
import SuratPermohonanPage from './pages/admin/SuratPermohonan';
import AdminSKGubernur from './pages/admin/SKGubernur';
import PengumumanPenerima from './pages/PengumumanPenerima';

const ProtectedRoute = ({ children, role, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  // Support array of allowed roles
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} />;
  }
  // Support single role (legacy)
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} />;
  }

  return children || <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Main Landing Page (Web Profile) */}
          <Route path="/" element={<LandingPageProfile />} />
          <Route path="/pengumuman-penerima" element={<PengumumanPenerima />} />

          {/* PACE Portal */}
          <Route path="/pace" element={<PacePortal />} />

          {/* PACE School Layout */}
          <Route path="/pace/sekolah" element={<ProtectedRoute role="sekolah_pace"><PaceSekolahLayout /></ProtectedRoute>}>
            <Route index element={<DashboardSekolah />} />
            <Route path="data-sekolah" element={<DataSekolah />} />
            <Route path="siswa" element={<KelolaSiswa />} />
            <Route path="pengumuman" element={<PacePengumuman />} />
            <Route path="daftar-lolos" element={<PaceDaftarLolos />} />
          </Route>

          {/* PACE Student Layout */}
          <Route path="/pace/siswa" element={<ProtectedRoute role="siswa_pace"><PaceSiswaLayout /></ProtectedRoute>}>
            <Route index element={<DashboardSiswa />} />
          </Route>

          {/* PACE Super Admin Layout */}
          <Route path="/pace/admin" element={<ProtectedRoute role="admin_pace"><PaceAdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminPaceDashboard />} />
            <Route path="approval" element={<AdminPaceApproval />} />
            <Route path="siswa" element={<AdminPaceSiswa />} />
          </Route>

          {/* MACE Portal - Selection Page (no auth needed) */}
          <Route path="/mace" element={<MacePortal />} />

          {/* MACE Public Registration (login-free) */}
          <Route path="/mace/daftar" element={<PendaftaranForm />} />

          {/* Hidden MACE Operator Login - akses hanya lewat URL, tidak di-link dari UI */}
          <Route path="/mace-operator" element={<LoginPage />} />

          {/* MACE Operator Layout (for kabkota and provinsi operators) */}
          <Route path="/mace/operator" element={<ProtectedRoute roles={['mace_kabkota', 'mace_provinsi']}><MaceOperatorLayout /></ProtectedRoute>}>
            <Route index element={<OperatorDashboard />} />
            <Route path="lembaga" element={<LembagaPengusul />} />
            <Route path="mahasiswa" element={<InputMahasiswa />} />
            <Route path="pengumuman" element={<OperatorPengumuman />} />
            <Route path="daftar-lolos" element={<DaftarLolos />} />
          </Route>

          {/* Mahasiswa (Student) Routes */}
          <Route path="/mahasiswa" element={<StudentLayout />}>
            <Route index element={<Beranda />} />
            <Route path="daftar/:program" element={<Navigate to="/mace/daftar" replace />} />
            <Route path="pengumuman" element={<ProtectedRoute role="mahasiswa"><Pengumuman /></ProtectedRoute>} />
            <Route path="laporan" element={<ProtectedRoute role="mahasiswa"><LaporanCard /></ProtectedRoute>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="pendaftaran" element={<ManagePendaftaran />} />
            <Route path="seleksi" element={<SeleksiBerkas />} />
            <Route path="penerima" element={<ManagePenerima />} />
            <Route path="laporan" element={<LaporanMahasiswa />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="create-account" element={<CreateAccount />} />
            <Route path="surat-permohonan" element={<SuratPermohonanPage />} />
            <Route path="sk-gubernur" element={<AdminSKGubernur />} />
            <Route path="pace-approval" element={<AdminPaceApprovalPage />} />
            <Route path="pace-daftar-lolos" element={<AdminPaceDaftarLolos />} />
            <Route path="mace-approval" element={<AdminMaceApproval />} />
            <Route path="mace-daftar-lolos" element={<AdminMaceDaftarLolos />} />
            <Route path="pengaturan-akses" element={<PengaturanAksesPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
