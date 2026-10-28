import React from 'react';
import { useAuth } from '../../context/AuthContext';
import PaceSiswaForm from './PaceSiswaForm';
import PaceSiswaFormSnk from './PaceSiswaFormSnk';
import PaceSiswaFormKedinasan from './PaceSiswaFormKedinasan';
import PaceSiswaFormAtlit from './PaceSiswaFormAtlit';

/* ============================================================
 *  Pilih formulir pendaftaran/edit siswa PACE sesuai program
 *  sekolah yang sedang login (berdasarkan user.pace_type).
 *  - SNK                     -> PaceSiswaFormSnk
 *  - Kedinasan               -> PaceSiswaFormKedinasan
 *  - Siswa Atlit Berprestasi -> PaceSiswaFormAtlit
 *  - lainnya (SLB)           -> PaceSiswaForm
 * ============================================================ */
const PaceSiswaFormByProgram = (props) => {
  const { user } = useAuth();
  const program =
    user?.pace_type ||
    user?.pace_sekolah?.jenis_sekolah ||
    user?.PaceSekolah?.jenis_sekolah;

  if (program === 'SNK') return <PaceSiswaFormSnk {...props} />;
  if (program === 'Kedinasan') return <PaceSiswaFormKedinasan {...props} />;
  if (program === 'Siswa Atlit Berprestasi') return <PaceSiswaFormAtlit {...props} />;
  return <PaceSiswaForm {...props} />;
};

export default PaceSiswaFormByProgram;
