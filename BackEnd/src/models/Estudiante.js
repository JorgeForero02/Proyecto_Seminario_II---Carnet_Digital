import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import Usuario from './Usuario.js';
import ProgramaAcademico from './ProgramaAcademico.js';

const Estudiante = sequelize.define('Estudiante', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  programa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ProgramaAcademico,
      key: 'id'
    }
  },
  semestre: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  tableName: 'estudiante',
  timestamps: false
});

// Relaciones
Estudiante.belongsTo(Usuario, { foreignKey: 'id' });
Estudiante.belongsTo(ProgramaAcademico, { foreignKey: 'programa_id' });
ProgramaAcademico.hasMany(Estudiante, { foreignKey: 'programa_id' });
Usuario.hasOne(Estudiante, { foreignKey: 'id' });

export default Estudiante;

