import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Docente from './Docente.js';
import Materia from './Materia.js';
import PeriodoAcademico from './PeriodoAcademico.js';

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
  periodo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PeriodoAcademico,
      key: 'id'
    }
  },
  estado: {
    type: DataTypes.ENUM('ACTIVO', 'INACTIVO', 'TERMINADO'),
    defaultValue: 'ACTIVO'
  }
}, {
  tableName: 'docente_materia',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['docente_id', 'materia_id', 'periodo_id']
    }
  ]
});

// Relaciones
Docente.belongsToMany(Materia, { through: DocenteMateria, foreignKey: 'docente_id' });
Materia.belongsToMany(Docente, { through: DocenteMateria, foreignKey: 'materia_id' });
DocenteMateria.belongsTo(PeriodoAcademico, { foreignKey: 'periodo_id' });
PeriodoAcademico.hasMany(DocenteMateria, { foreignKey: 'periodo_id' });

export default DocenteMateria;

