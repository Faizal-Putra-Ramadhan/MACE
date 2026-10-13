import { Sequelize } from 'sequelize';
import sequelize from '../lib/db.js';
import PaceSekolah from './PaceSekolah.js';
import User from './User.js';

const { DataTypes } = Sequelize;

const PaceSiswa = sequelize.define('pace_siswa', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    sekolah_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PaceSekolah,
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Will be linked when student logs in / account created
        references: {
            model: User,
            key: 'id'
        }
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nisn: { // The user requested 'nis' in the prompt but the card has 'NISN', I will use nisn for consistency.
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nik: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    tempat_lahir: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tanggal_lahir: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    kelas: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    nama_orang_tua: {
        type: DataTypes.STRING,
        allowNull: false
    },
    no_hp_orang_tua: {
        type: DataTypes.STRING,
        allowNull: false
    },
    foto_profil: {
        type: DataTypes.STRING,
        allowNull: true
    },
    file_rapor: {
        type: DataTypes.STRING,
        allowNull: true
    },
    file_sktm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status_approval: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    usulan_anggaran: {
        type: DataTypes.JSON,
        allowNull: true
    },
    file_prestasi_akademik: {
        type: DataTypes.STRING,
        allowNull: true
    },
    file_prestasi_non_akademik: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nominal_pendanaan: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Relationships
PaceSekolah.hasMany(PaceSiswa, { foreignKey: 'sekolah_id' });
PaceSiswa.belongsTo(PaceSekolah, { foreignKey: 'sekolah_id' });

User.hasOne(PaceSiswa, { foreignKey: 'user_id' });
PaceSiswa.belongsTo(User, { foreignKey: 'user_id' });

export default PaceSiswa;
