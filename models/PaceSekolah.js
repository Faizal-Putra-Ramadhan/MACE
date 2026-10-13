import { Sequelize } from 'sequelize';
import sequelize from '../lib/db.js';
import User from './User.js';

const { DataTypes } = Sequelize;

const PaceSekolah = sequelize.define('pace_sekolah', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    nama_sekolah: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jenis_sekolah: {
        type: DataTypes.ENUM('SLB', 'SNK', 'Siswa Atlit Berprestasi'),
        allowNull: false
    },
    npsn: {
        type: DataTypes.STRING,
        allowNull: true
    },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    no_rekening: {
        type: DataTypes.STRING,
        allowNull: true
    },
    surat_permohonan: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status_approval: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Relationships
User.hasOne(PaceSekolah, { foreignKey: 'user_id' });
PaceSekolah.belongsTo(User, { foreignKey: 'user_id' });

export default PaceSekolah;
