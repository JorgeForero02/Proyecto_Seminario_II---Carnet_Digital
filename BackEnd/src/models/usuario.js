// models/usuario.js
import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cedula: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: true
    },
    nombres: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellidos: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    foto_perfil: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    rol: {
        type: DataTypes.ENUM('ESTUDIANTE', 'DOCENTE', 'ADMINISTRATIVO'),
        allowNull: false
    },
    tipo_sangre: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    fecha_registro: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'usuario',
    timestamps: false
});

// Relaciones (a definir más adelante con otros modelos)
Usuario.associate = models => {
    // Relación con Docente
    Usuario.hasOne(models.Docente, {
        foreignKey: 'usuario_id'
    });

    // Relación con Estudiante
    Usuario.hasOne(models.Estudiante, {
        foreignKey: 'usuario_id'
    });

    // Relación con Administrativo
    Usuario.hasOne(models.Administrativo, {
        foreignKey: 'usuario_id'
    });
};

export default Usuario;