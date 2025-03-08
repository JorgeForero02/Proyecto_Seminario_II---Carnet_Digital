// models/asistenciaClase.js
import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Estudiante from './estudiante.js';
import Materia from './materia.js';
import Docente from './docente.js';

const AsistenciaClase = sequelize.define('AsistenciaClase', {
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
    docente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Docente,
            key: 'id'
        }
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('PRESENTE', 'AUSENTE', 'TARDANZA', 'JUSTIFICADO'),
        defaultValue: 'PRESENTE'
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    validado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'asistencia_clase',
    timestamps: true,
    createdAt: 'fecha_registro',
    updatedAt: 'fecha_actualizacion'
});

// Asociaciones
AsistenciaClase.associate = (models) => {
    AsistenciaClase.belongsTo(models.Estudiante, {
        foreignKey: 'estudiante_id',
        as: 'estudiante'
    });

    AsistenciaClase.belongsTo(models.Materia, {
        foreignKey: 'materia_id',
        as: 'materia'
    });

    AsistenciaClase.belongsTo(models.Docente, {
        foreignKey: 'docente_id',
        as: 'docente'
    });
};

export default AsistenciaClase;