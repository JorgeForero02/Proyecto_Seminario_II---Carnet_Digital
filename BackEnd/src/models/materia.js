// models/materia.js
import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Materia = sequelize.define('Materia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    creditos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    semestre: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'materia',
    timestamps: false
});

// Asociaciones
Materia.associate = (models) => {

    Materia.hasMany(models.Asesoria, {
        foreignKey: 'materia_id',
        as: 'asesorias'
    });

    Materia.hasMany(models.AmigoAcademico, {
        foreignKey: 'materia_id',
        as: 'amigosAcademicos'
    });
};

export default Materia;