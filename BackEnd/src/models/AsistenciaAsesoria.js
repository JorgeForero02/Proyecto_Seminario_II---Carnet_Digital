import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import HorarioAsesoria from './HorarioAsesoria.js';
import Estudiante from './Estudiante.js';

const AsistenciaAsesoria = sequelize.define('AsistenciaAsesoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  horario_asesoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: HorarioAsesoria,
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
  tableName: 'asistencia_asesoria',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['horario_asesoria_id', 'estudiante_id', 'fecha_hora']
    }
  ]
});

// Relaciones
AsistenciaAsesoria.belongsTo(HorarioAsesoria, { foreignKey: 'horario_asesoria_id' });
AsistenciaAsesoria.belongsTo(Estudiante, { foreignKey: 'estudiante_id' });
HorarioAsesoria.hasMany(AsistenciaAsesoria, { foreignKey: 'horario_asesoria_id' });
Estudiante.hasMany(AsistenciaAsesoria, { foreignKey: 'estudiante_id' });

export default AsistenciaAsesoria;


