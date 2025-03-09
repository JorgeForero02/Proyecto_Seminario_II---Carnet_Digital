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

    // Relación con docentes a través de docente_materia
    Materia.belongsToMany(models.Docente, {
        through: 'docente_materia', // Using string initially to avoid circular dependency
        foreignKey: 'materia_id',
        otherKey: 'docente_id',
        as: 'docentes'
    });
    
    // Relación directa con la tabla intermedia
    Materia.hasMany(models.DocenteMateria, {
        foreignKey: 'materia_id',
        as: 'asignaciones'
    });
    
    // Nueva relación con EstudianteMateria
    Materia.hasMany(models.EstudianteMateria, {
        foreignKey: 'materia_id',
        as: 'inscripciones'
    });
    
    // Relación muchos a muchos con Estudiante a través de EstudianteMateria
    Materia.belongsToMany(models.Estudiante, {
        through: models.EstudianteMateria,
        foreignKey: 'materia_id',
        otherKey: 'estudiante_id',
        as: 'estudiantes'
    });
};

export default Materia;