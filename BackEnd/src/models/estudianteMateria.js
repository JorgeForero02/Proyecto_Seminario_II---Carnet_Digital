import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Estudiante from './estudiante.js';
import Materia from './materia.js';

const EstudianteMateria = sequelize.define('EstudianteMateria', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    estudiante_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Estudiante,
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
        type: DataTypes.ENUM('ACTIVO', 'RETIRADO', 'TERMINADO'),
        defaultValue: 'ACTIVO'
    }
}, {
    tableName: 'estudiante_materia',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['estudiante_id', 'materia_id', 'periodo_academico'],
            name: 'estudiante_materia_unique'
        },
        {
            fields: ['materia_id'],
            name: 'materia_id'
        },
        {
            fields: ['periodo_academico'],
            name: 'idx_estudiante_materia_periodo'
        }
    ]
});

// Asociaciones
EstudianteMateria.associate = (models) => {
    EstudianteMateria.belongsTo(models.Estudiante, {
        foreignKey: 'estudiante_id',
        as: 'estudiante'
    });

    EstudianteMateria.belongsTo(models.Materia, {
        foreignKey: 'materia_id',
        as: 'materia'
    });
    
};

export default EstudianteMateria;