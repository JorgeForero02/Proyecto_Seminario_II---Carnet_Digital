import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Materia from './Materia.js';
import ProgramaAcademico from './ProgramaAcademico.js';

const MateriaPrograma = sequelize.define('MateriaPrograma', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  materia_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Materia,
      key: 'id'
    }
  },
  programa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ProgramaAcademico,
      key: 'id'
    }
  },
  semestre: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  tableName: 'materia_programa',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['materia_id', 'programa_id']
    }
  ]
});

// Relaciones
Materia.belongsToMany(ProgramaAcademico, { through: MateriaPrograma, foreignKey: 'materia_id' });
ProgramaAcademico.belongsToMany(Materia, { through: MateriaPrograma, foreignKey: 'programa_id' });

export default MateriaPrograma;

