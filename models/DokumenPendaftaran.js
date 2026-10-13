import { Sequelize } from 'sequelize';
import sequelize from '../lib/db.js';
import Pendaftaran from './Pendaftaran.js';

const { DataTypes } = Sequelize;

const DokumenPendaftaran = sequelize.define('dokumen_pendaftaran', {
    pendaftaran_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    jenis_dokumen: {
        type: DataTypes.ENUM({
            values: [
                'surat_permohonan', 
                'rab', 
                'kartu_mahasiswa', 
                'ktp', 
                'sk_aktif', 
                'khs', 
                'kartu_keluarga', 
                'pasfoto', 
                'rekening',
                'khs_terakhir',
                'sktm',
                'surat_rekomendasi_rektor',
                'surat_rekomendasi_pimpinan',
                'rekomendasi',
                'pernyataan',
                'prestasi_akademik',
                'prestasi_non_akademik'
            ]
        }),
        allowNull: false
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    poin: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'uploaded_at',
    updatedAt: false
});

Pendaftaran.hasMany(DokumenPendaftaran, { foreignKey: 'pendaftaran_id' });
DokumenPendaftaran.belongsTo(Pendaftaran, { foreignKey: 'pendaftaran_id' });

export default DokumenPendaftaran;
