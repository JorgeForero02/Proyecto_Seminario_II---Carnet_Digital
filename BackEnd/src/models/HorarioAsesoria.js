import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Asesoria from './Asesoria.js';

const HorarioAsesoria = sequelize.define('HorarioAsesoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  asesoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Asesoria,
      key: 'id'
    }
  },
  dia_semana: {
    type: DataTypes.ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'),
    allowNull: false
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false
  },
  ubicacion: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'horario_asesoria',
  timestamps: false
});

// Relaciones
HorarioAsesoria.belongsTo(Asesoria, { foreignKey: 'asesoria_id' });
Asesoria.hasMany(HorarioAsesoria, { foreignKey: 'asesoria_id' });

export default HorarioAsesoria;

