import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Estudiante from './Estudiante.js';
import Materia from './Materia.js';
import PeriodoAcademico from './PeriodoAcademico.js';

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
  periodo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PeriodoAcademico,
      key: 'id'
    }
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
      fields: ['estudiante_id', 'materia_id', 'periodo_id']
    }
  ]
});

// Relaciones
Estudiante.belongsToMany(Materia, { through: EstudianteMateria, foreignKey: 'estudiante_id' });
Materia.belongsToMany(Estudiante, { through: EstudianteMateria, foreignKey: 'materia_id' });
EstudianteMateria.belongsTo(PeriodoAcademico, { foreignKey: 'periodo_id' });
PeriodoAcademico.hasMany(EstudianteMateria, { foreignKey: 'periodo_id' });

export default EstudianteMateria;

