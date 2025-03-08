// models/asistenciaAmigoAcademico.js
import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const AsistenciaAmigoAcademico = sequelize.define('AsistenciaAmigoAcademico', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amigo_academico_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'amigo_academico',
            key: 'id'
        }
    },
    estudiante_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'estudiante',
            key: 'id'
        }
    },
    fecha_hora: {
        type: DataTypes.DATE,
        allowNull: false
    },
    comentarios: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    validado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'asistencia_amigo_academico',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['amigo_academico_id', 'estudiante_id', 'fecha_hora'],
            name: 'aaaa_unique_idx' 
        }
    ]
});

// Asociaciones
AsistenciaAmigoAcademico.associate = (models) => {
    AsistenciaAmigoAcademico.belongsTo(models.AmigoAcademico, {
        foreignKey: 'amigo_academico_id',
        as: 'amigoAcademico'
    });

    AsistenciaAmigoAcademico.belongsTo(models.Estudiante, {
        foreignKey: 'estudiante_id',
        as: 'estudiante'
    });
};

export default AsistenciaAmigoAcademico;