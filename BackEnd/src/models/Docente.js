import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Usuario from './Usuario.js';
import Departamento from './Departamento.js';
import TipoContrato from './TipoContrato.js';

const Docente = sequelize.define('Docente', {
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
  especialidad: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tipo_contrato_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TipoContrato,
      key: 'id'
    }
  }
}, {
  tableName: 'docente',
  timestamps: false
});

// Relaciones
Docente.belongsTo(Usuario, { foreignKey: 'id' });
Docente.belongsTo(Departamento, { foreignKey: 'departamento_id' });
Docente.belongsTo(TipoContrato, { foreignKey: 'tipo_contrato_id' });
Usuario.hasOne(Docente, { foreignKey: 'id' });
Departamento.hasMany(Docente, { foreignKey: 'departamento_id' });
TipoContrato.hasMany(Docente, { foreignKey: 'tipo_contrato_id' });

export default Docente;

