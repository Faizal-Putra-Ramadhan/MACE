import { Sequelize } from 'sequelize';
import sequelize from '../lib/db.js';

const { DataTypes } = Sequelize;

const User = sequelize.define('users', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('mahasiswa', 'admin', 'sekolah_pace', 'siswa_pace', 'admin_pace', 'super_admin', 'mace_kabkota', 'mace_provinsi', 'pace_slb', 'pace_snk', 'pace_atlit'),
        allowNull: false,
        defaultValue: 'mahasiswa'
    },
    is_approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    pace_type: {
        type: DataTypes.ENUM('SLB', 'SNK', 'Siswa Atlit Berprestasi', 'Kedinasan'),
        allowNull: true
    },
    mace_type: {
        type: DataTypes.ENUM('kabkota', 'provinsi'),
        allowNull: true
    },
    nama_display: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

export default User;
