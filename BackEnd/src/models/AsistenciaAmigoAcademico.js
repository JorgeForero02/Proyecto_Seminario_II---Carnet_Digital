import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import HorarioAmigoAcademico from './HorarioAmigoAcademico.js';
import Estudiante from './Estudiante.js';

const AsistenciaAmigoAcademico = sequelize.define('AsistenciaAmigoAcademico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  horario_amigo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: HorarioAmigoAcademico,
      key: 'id'
    }
  },
  estudiante_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Estudiante,
      key: 'id'
    }
  },
  fecha_hora: {
    type: DataTypes.DATE,
    allowNull: false
  },
  comentarios: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  validado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'asistencia_amigo_academico',
  timestamps: false
});

// Relaciones
AsistenciaAmigoAcademico.belongsTo(HorarioAmigoAcademico, { foreignKey: 'horario_amigo_id' });
HorarioAmigoAcademico.hasMany(AsistenciaAmigoAcademico, { foreignKey: 'horario_amigo_id' });
AsistenciaAmigoAcademico.belongsTo(Estudiante, { foreignKey: 'estudiante_id' });
Estudiante.hasMany(AsistenciaAmigoAcademico, { foreignKey: 'estudiante_id' });

export default AsistenciaAmigoAcademico;
