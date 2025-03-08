// models/estudiante.js
import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Usuario from './usuario.js';

const Estudiante = sequelize.define('Estudiante', {
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
    programa_academico: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    facultad: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    modalidad: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    semestre: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableName: 'estudiante',
    timestamps: false
});

// Asociaciones
Estudiante.associate = (models) => {
    Estudiante.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
    });

    Estudiante.hasMany(models.AsistenciaAsesoria, {
        foreignKey: 'estudiante_id',
        as: 'asistenciasAsesorias'
    });

    Estudiante.hasMany(models.AsistenciaAmigoAcademico, {
        foreignKey: 'estudiante_id',
        as: 'asistenciasAmigoAcademico'
    });

    Estudiante.hasMany(models.AmigoAcademico, {
        foreignKey: 'estudiante_monitor_id',
        as: 'monitoriasRealizadas'
    });
};

export default Estudiante;