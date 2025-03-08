// models/administrativo.js
import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Usuario from './usuario.js';

const Administrativo = sequelize.define('Administrativo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Usuario,
            key: 'id'
        }
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        }
    },
    departamento: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cargo: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'administrativo',
    timestamps: false
});

// Asociaciones
Administrativo.associate = (models) => {
    Administrativo.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
    });
};

export default Administrativo;