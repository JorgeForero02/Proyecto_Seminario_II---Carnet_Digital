import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import DocenteMateria from './DocenteMateria.js';

const HorarioClase = sequelize.define('HorarioClase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  docente_materia_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: DocenteMateria,
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
  tableName: 'horario_clase',
  timestamps: false
});

// Relaciones
HorarioClase.belongsTo(DocenteMateria, { foreignKey: 'docente_materia_id' });
DocenteMateria.hasMany(HorarioClase, { foreignKey: 'docente_materia_id' });

export default HorarioClase;

