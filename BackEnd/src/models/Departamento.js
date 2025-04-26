import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Facultad from './Facultad.js';

const Departamento = sequelize.define('Departamento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  facultad_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Facultad,
      key: 'id'
    }
  },
  codigo: {
    type: DataTypes.STRING(20), 
    allowNull: false,
    unique: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'departamento',
  timestamps: false
});

// Relaciones
Departamento.belongsTo(Facultad, { foreignKey: 'facultad_id' });
Facultad.hasMany(Departamento, { foreignKey: 'facultad_id' });

export default Departamento;

