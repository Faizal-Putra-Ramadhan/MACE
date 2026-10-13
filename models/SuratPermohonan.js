import { Sequelize } from 'sequelize';
import sequelize from '../lib/db.js';
import User from './User.js';

const { DataTypes } = Sequelize;

const SuratPermohonan = sequelize.define('surat_permohonan', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    file_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

User.hasMany(SuratPermohonan, { foreignKey: 'user_id' });
SuratPermohonan.belongsTo(User, { foreignKey: 'user_id' });

export default SuratPermohonan;
