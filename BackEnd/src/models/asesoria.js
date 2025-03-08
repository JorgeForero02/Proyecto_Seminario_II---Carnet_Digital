// models/asesoria.js
import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Asesoria = sequelize.define('Asesoria', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    docente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'docente',
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
    tipo_asesoria: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'asesoria',
    timestamps: false
});

// Asociaciones
Asesoria.associate = (models) => {
    Asesoria.belongsTo(models.Docente, {
        foreignKey: 'docente_id',
        as: 'docente'
    });

    Asesoria.belongsTo(models.Materia, {
        foreignKey: 'materia_id',
        as: 'materia'
    });

    Asesoria.hasMany(models.AsistenciaAsesoria, {
        foreignKey: 'asesoria_id',
        as: 'asistencias'
    });
};

export default Asesoria;