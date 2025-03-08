// models/asistenciaAsesoria.js
import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const AsistenciaAsesoria = sequelize.define('AsistenciaAsesoria', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    asesoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'asesoria',
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
    tableName: 'asistencia_asesoria',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['asesoria_id', 'estudiante_id', 'fecha_hora']
        }
    ]
});

// Asociaciones
AsistenciaAsesoria.associate = (models) => {
    AsistenciaAsesoria.belongsTo(models.Asesoria, {
        foreignKey: 'asesoria_id',
        as: 'asesoria'
    });

    AsistenciaAsesoria.belongsTo(models.Estudiante, {
        foreignKey: 'estudiante_id',
        as: 'estudiante'
    });
};

export default AsistenciaAsesoria;