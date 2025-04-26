import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Facultad from './Facultad.js';

const ProgramaAcademico = sequelize.define('ProgramaAcademico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  codigo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  facultad_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Facultad,
      key: 'id'
    }
  },
  modalidad: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'programa_academico',
  timestamps: false
});

// Relaciones
ProgramaAcademico.belongsTo(Facultad, { foreignKey: 'facultad_id' });
Facultad.hasMany(ProgramaAcademico, { foreignKey: 'facultad_id' });

export default ProgramaAcademico;

