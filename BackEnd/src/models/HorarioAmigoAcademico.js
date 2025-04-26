import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import AmigoAcademico from './AmigoAcademico.js';

const HorarioAmigoAcademico = sequelize.define('HorarioAmigoAcademico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amigo_academico_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: AmigoAcademico,
      key: 'id'
    }
  },
  dia_semana: {
    type: DataTypes.ENUM('LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO'),
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
  tableName: 'horario_amigo_academico',
  timestamps: false
});

// Relaciones
HorarioAmigoAcademico.belongsTo(AmigoAcademico, { foreignKey: 'amigo_academico_id' });
AmigoAcademico.hasMany(HorarioAmigoAcademico, { foreignKey: 'amigo_academico_id' });

export default HorarioAmigoAcademico;


