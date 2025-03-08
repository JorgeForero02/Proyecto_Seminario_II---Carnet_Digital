// models/amigoAcademico.js
import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const AmigoAcademico = sequelize.define('AmigoAcademico', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    estudiante_monitor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'estudiante',
            key: 'id'
        }
    },
    materia_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'materia',
            key: 'id'
        }
    },
    horario: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    ubicacion: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cupo_maximo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'amigo_academico',
    timestamps: false
});

// Asociaciones
AmigoAcademico.associate = (models) => {
    AmigoAcademico.belongsTo(models.Estudiante, {
        foreignKey: 'estudiante_monitor_id',
        as: 'monitor'
    });

    AmigoAcademico.belongsTo(models.Materia, {
        foreignKey: 'materia_id',
        as: 'materia'
    });

    AmigoAcademico.hasMany(models.AsistenciaAmigoAcademico, {
        foreignKey: 'amigo_academico_id',
        as: 'asistencias'
    });
};

export default AmigoAcademico;