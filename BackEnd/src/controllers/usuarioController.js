// controllers/usuarioController.js
import { Usuario } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Obtener todos los usuarios
export const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['password'] } // Excluir contraseña por seguridad
        });

        return res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
};

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
    try {
        const {
            id,
            cedula,
            nombres,
            apellidos,
            email,
            password,
            telefono,
            foto_perfil,
            rol,
            tipo_sangre
        } = req.body;

        // Verificar si el ID ya existe (si se proporciona)
        if (id) {
            const idExists = await Usuario.findByPk(id);
            if (idExists) {
                return res.status(400).json({ message: 'El ID ya está registrado' });
            }
        }
        
        // Verificar si el email ya existe
        const emailExists = await Usuario.findOne({ where: { email } });
        if (emailExists) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Verificar si la cédula ya existe (si se proporciona)
        if (cedula) {
            const cedulaExists = await Usuario.findOne({ where: { cedula } });
            if (cedulaExists) {
                return res.status(400).json({ message: 'La cédula ya está registrada' });
            }
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear usuario
        const nuevoUsuario = await Usuario.create({
            id,
            cedula,
            nombres,
            apellidos,
            email,
            password: hashedPassword,
            telefono,
            foto_perfil,
            rol,
            tipo_sangre,
            fecha_registro: new Date()
        });

        // Excluir contraseña de la respuesta
        const usuarioCreado = nuevoUsuario.toJSON();
        delete usuarioCreado.password;

        return res.status(201).json(usuarioCreado);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return res.status(500).json({ message: 'Error al crear usuario', error: error.message });
    }
};

// Actualizar un usuario existente
export const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            cedula,
            nombres,
            apellidos,
            email,
            password,
            telefono,
            foto_perfil,
            rol,
            tipo_sangre,
            activo
        } = req.body;

        // Verificar si el usuario existe
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Si se está actualizando el email, verificar que no exista ya
        if (email && email !== usuario.email) {
            const emailExists = await Usuario.findOne({ where: { email } });
            if (emailExists) {
                return res.status(400).json({ message: 'El email ya está registrado por otro usuario' });
            }
        }

        // Si se está actualizando la cédula, verificar que no exista ya
        if (cedula && cedula !== usuario.cedula) {
            const cedulaExists = await Usuario.findOne({ where: { cedula } });
            if (cedulaExists) {
                return res.status(400).json({ message: 'La cédula ya está registrada por otro usuario' });
            }
        }

        // Preparar objeto de actualización
        const updateData = {};

        if (cedula) updateData.cedula = cedula;
        if (nombres) updateData.nombres = nombres;
        if (apellidos) updateData.apellidos = apellidos;
        if (email) updateData.email = email;
        if (telefono) updateData.telefono = telefono;
        if (foto_perfil) updateData.foto_perfil = foto_perfil;
        if (rol) updateData.rol = rol;
        if (tipo_sangre) updateData.tipo_sangre = tipo_sangre;
        if (activo !== undefined) updateData.activo = activo;

        // Si se proporciona una nueva contraseña, encriptarla
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // Actualizar usuario
        await usuario.update(updateData);

        // Obtener usuario actualizado (sin contraseña)
        const usuarioActualizado = await Usuario.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        return res.status(200).json(usuarioActualizado);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
};

// Eliminar un usuario (desactivación lógica)
export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Desactivar el usuario en lugar de eliminarlo físicamente
        await usuario.update({ activo: false });

        return res.status(200).json({ message: 'Usuario desactivado correctamente' });
    } catch (error) {
        console.error('Error al desactivar usuario:', error);
        return res.status(500).json({ message: 'Error al desactivar usuario', error: error.message });
    }
};

// Autenticación de usuario (login)
export const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(400).json({ message: 'Email o contraseña incorrectos' });
        }

        // Verificar si el usuario está activo
        if (!usuario.activo) {
            return res.status(403).json({ message: 'Usuario desactivado' });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Email o contraseña incorrectos' });
        }

        // Crear y firmar el token JWT
        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                role: usuario.rol
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Excluir contraseña de la respuesta
        const usuarioData = usuario.toJSON();
        delete usuarioData.password;

        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            usuario: usuarioData
        });
    } catch (error) {
        console.error('Error en inicio de sesión:', error);
        return res.status(500).json({ message: 'Error en inicio de sesión', error: error.message });
    }
};