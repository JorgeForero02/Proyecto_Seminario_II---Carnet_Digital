import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Departamento from './Departamento.js';

const Materia = sequelize.define('Materia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  creditos: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  departamento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Departamento,
      key: 'id'
    }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'materia',
  timestamps: false
});

// Relaciones
Materia.belongsTo(Departamento, { foreignKey: 'departamento_id' });
Departamento.hasMany(Materia, { foreignKey: 'departamento_id' });

export default Materia;

