import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Usuario from './Usuario.js';
import Departamento from './Departamento.js';

const Administrativo = sequelize.define('Administrativo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  departamento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Departamento,
      key: 'id'
    }
  },
  cargo: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'administrativo',
  timestamps: false
});

// Relaciones
Administrativo.belongsTo(Usuario, { foreignKey: 'id' });
Administrativo.belongsTo(Departamento, { foreignKey: 'departamento_id' });
Usuario.hasOne(Administrativo, { foreignKey: 'id' });
Departamento.hasMany(Administrativo, { foreignKey: 'departamento_id' });

export default Administrativo;

