import { Sequelize } from 'sequelize';
import sequelize from '../lib/db.js';
import Mahasiswa from './Mahasiswa.js';

const { DataTypes } = Sequelize;

const Pendaftaran = sequelize.define('pendaftaran', {
    mahasiswa_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    operator_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    program: {
        type: DataTypes.ENUM({
            values: ['A', 'B', 'C', 'D', 'E', 'F']
        }),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM({
            values: ['draft', 'submitted', 'lolos_berkas', 'ditolak', 'selesai']
        }),
        allowNull: false,
        defaultValue: 'submitted'
    },
    alasan_penolakan: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    kode_kartu: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    nominal_dana: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0
    },
    saldo: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0
    },
    data_diri: {
        type: DataTypes.JSON,
        allowNull: true
    },
    poin_otomatis: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    poin_nim_manual: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    poin_nik_manual: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    poin_dokumen: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    poin_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

Mahasiswa.hasMany(Pendaftaran, { foreignKey: 'mahasiswa_id' });
Pendaftaran.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_id' });

export default Pendaftaran;
