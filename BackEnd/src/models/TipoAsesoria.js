import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const TipoAsesoria = sequelize.define('TipoAsesoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'tipo_asesoria',
  timestamps: false
});

export default TipoAsesoria;

