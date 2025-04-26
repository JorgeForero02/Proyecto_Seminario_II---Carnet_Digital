import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Estudiante from './Estudiante.js';
import Materia from './Materia.js';
import PeriodoAcademico from './PeriodoAcademico.js';

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

// Relaciones
AmigoAcademico.belongsTo(Estudiante, { foreignKey: 'estudiante_monitor_id' });
Estudiante.hasMany(AmigoAcademico, { foreignKey: 'estudiante_monitor_id' });
AmigoAcademico.belongsTo(Materia, { foreignKey: 'materia_id' });
Materia.hasMany(AmigoAcademico, { foreignKey: 'materia_id' });
AmigoAcademico.belongsTo(PeriodoAcademico, { foreignKey: 'periodo_id' });
PeriodoAcademico.hasMany(AmigoAcademico, { foreignKey: 'periodo_id' });

export default AmigoAcademico;


