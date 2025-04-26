import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Estudiante from './Estudiante.js';
import HorarioClase from './HorarioClase.js';

const AsistenciaClase = sequelize.define('AsistenciaClase', {
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
  horario_clase_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: HorarioClase,
      key: 'id'
    }
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('PRESENTE', 'AUSENTE', 'TARDANZA', 'JUSTIFICADO'),
    defaultValue: 'PRESENTE'
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  validado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'asistencia_clase',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['estudiante_id', 'horario_clase_id', 'fecha']
    }
  ]
});

// Relaciones
AsistenciaClase.belongsTo(Estudiante, { foreignKey: 'estudiante_id' });
AsistenciaClase.belongsTo(HorarioClase, { foreignKey: 'horario_clase_id' });
Estudiante.hasMany(AsistenciaClase, { foreignKey: 'estudiante_id' });
HorarioClase.hasMany(AsistenciaClase, { foreignKey: 'horario_clase_id' });

export default AsistenciaClase;

