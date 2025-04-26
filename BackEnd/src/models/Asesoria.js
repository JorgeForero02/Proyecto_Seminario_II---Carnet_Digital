import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Docente from './Docente.js';
import Materia from './Materia.js';
import TipoAsesoria from './TipoAsesoria.js';
import PeriodoAcademico from './PeriodoAcademico.js';

const Asesoria = sequelize.define('Asesoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  docente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Docente,
      key: 'id'
    }
  },
  materia_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Materia,
      key: 'id'
    }
  },
  tipo_asesoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TipoAsesoria,
      key: 'id'
    }
  },
  periodo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PeriodoAcademico,
      key: 'id'
    }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'asesoria',
  timestamps: false
});

// Relaciones
Asesoria.belongsTo(Docente, { foreignKey: 'docente_id' });
Asesoria.belongsTo(Materia, { foreignKey: 'materia_id' });
Asesoria.belongsTo(TipoAsesoria, { foreignKey: 'tipo_asesoria_id' });
Asesoria.belongsTo(PeriodoAcademico, { foreignKey: 'periodo_id' });
Docente.hasMany(Asesoria, { foreignKey: 'docente_id' });
Materia.hasMany(Asesoria, { foreignKey: 'materia_id' });
TipoAsesoria.hasMany(Asesoria, { foreignKey: 'tipo_asesoria_id' });
PeriodoAcademico.hasMany(Asesoria, { foreignKey: 'periodo_id' });

export default Asesoria;

