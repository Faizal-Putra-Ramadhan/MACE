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
        // Dulu ENUM dengan daftar nilai tetap. Kini VARCHAR bebas supaya
        // dokumen pendaftaran bisa ditambah tanpa migrasi ENUM tiap kali.
        // (Jalankan scripts/alter_dokumen_jenis.js sekali untuk mengubah kolom DB.)
        type: DataTypes.STRING(100),
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
