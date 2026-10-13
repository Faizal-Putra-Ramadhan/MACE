import { Sequelize } from 'sequelize';
import sequelize from '../lib/db.js';

const { DataTypes } = Sequelize;

const PengaturanAkses = sequelize.define('pengaturan_akses', {
    scope: {
        type: DataTypes.ENUM('mace_kabkota', 'mace_provinsi', 'pace_slb', 'pace_snk', 'pace_atlit'),
        allowNull: false,
        defaultValue: 'pace_slb'
    },
    edit_surat_permohonan: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    edit_data_sekolah: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    edit_siswa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default PengaturanAkses;
