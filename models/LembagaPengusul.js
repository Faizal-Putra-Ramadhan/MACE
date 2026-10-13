import { Sequelize } from 'sequelize';
import sequelize from '../lib/db.js';
import User from './User.js';

const { DataTypes } = Sequelize;

const LembagaPengusul = sequelize.define('lembaga_pengusul', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    nama_lembaga: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    nama_operator: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hp_operator: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

User.hasOne(LembagaPengusul, { foreignKey: 'user_id' });
LembagaPengusul.belongsTo(User, { foreignKey: 'user_id' });

export default LembagaPengusul;
