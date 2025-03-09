// models/docenteMateria.js
import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Docente from './docente.js';
import Materia from './materia.js';

const DocenteMateria = sequelize.define('DocenteMateria', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    docente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Docente,
            key: 'id'
        }
    },
    materia_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Materia,
            key: 'id'
        }
    },
    periodo_academico: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('ACTIVO', 'INACTIVO', 'TERMINADO'),
        defaultValue: 'ACTIVO',
        allowNull: false
    }
}, {
    tableName: 'docente_materia',
    timestamps: false
});

// Asociaciones
DocenteMateria.associate = (models) => {
    DocenteMateria.belongsTo(models.Docente, {
        foreignKey: 'docente_id',
        as: 'docente'
    });
    
    DocenteMateria.belongsTo(models.Materia, {
        foreignKey: 'materia_id',
        as: 'materia'
    });
};

export default DocenteMateria;