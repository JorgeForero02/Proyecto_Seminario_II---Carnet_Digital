// models/docente.js
import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Usuario from './usuario.js';

const Docente = sequelize.define('Docente', {
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
    especialidad: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    tipo_contrato: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'docente',
    timestamps: false
});

// Asociaciones
Docente.associate = (models) => {
    Docente.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
    });
    
    Docente.hasMany(models.Asesoria, {
        foreignKey: 'docente_id',
        as: 'asesorias'
    });
    
    // Relación con materias a través de docente_materia
    Docente.belongsToMany(models.Materia, {
        through: models.DocenteMateria, // Match the exact name in your models object
        foreignKey: 'docente_id',
        otherKey: 'materia_id',
        as: 'materias'
    });
    
    // Also update
    Docente.hasMany(models.DocenteMateria, {
        foreignKey: 'docente_id',
        as: 'asignaciones'
    });
};

export default Docente;