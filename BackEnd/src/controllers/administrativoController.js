// controllers/administrativoController.js
import { Usuario, Administrativo } from '../models/index.js';
import bcrypt from 'bcrypt';
import sequelize from '../database/connection.js';

// Obtener todos los administrativos
export const getAllAdministrativos = async (req, res) => {
    try {
        const administrativos = await Administrativo.findAll({
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: { exclude: ['password'] }
                }
            ]
        });

        return res.status(200).json(administrativos);
    } catch (error) {
        console.error('Error al obtener administrativos:', error);
        return res.status(500).json({ message: 'Error al obtener administrativos', error: error.message });
    }
};

// Obtener un administrativo por ID
export const getAdministrativoById = async (req, res) => {
    try {
        const { id } = req.params;

        const administrativo = await Administrativo.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: { exclude: ['password'] }
                }
            ]
        });

        if (!administrativo) {
            return res.status(404).json({ message: 'Administrativo no encontrado' });
        }

        return res.status(200).json(administrativo);
    } catch (error) {
        console.error('Error al obtener administrativo:', error);
        return res.status(500).json({ message: 'Error al obtener administrativo', error: error.message });
    }
};

// Crear un nuevo administrativo (también crea un usuario)
export const createAdministrativo = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            // ID explícito
            id,
            // Datos de usuario
            cedula,
            nombres,
            apellidos,
            email,
            password,
            telefono,
            foto_perfil,
            tipo_sangre,
            // Datos específicos de administrativo
            departamento,
            cargo
        } = req.body;

        // Verificar que se proporcione un ID
        if (!id) {
            await transaction.rollback();
            return res.status(400).json({ message: 'El ID es requerido' });
        }

        // Verificar si el ID ya existe
        const idExists = await Administrativo.findByPk(id, { transaction });
        if (idExists) {
            await transaction.rollback();
            return res.status(400).json({ message: 'El ID ya está en uso' });
        }

        // Verificar si el email ya existe
        const emailExists = await Usuario.findOne({
            where: { email },
            transaction
        });

        if (emailExists) {
            await transaction.rollback();
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Verificar si la cédula ya existe (si se proporciona)
        if (cedula) {
            const cedulaExists = await Usuario.findOne({
                where: { cedula },
                transaction
            });

            if (cedulaExists) {
                await transaction.rollback();
                return res.status(400).json({ message: 'La cédula ya está registrada' });
            }
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear usuario con rol ADMINISTRATIVO
        const nuevoUsuario = await Usuario.create({
            id, // Usar el ID proporcionado
            cedula,
            nombres,
            apellidos,
            email,
            password: hashedPassword,
            telefono,
            foto_perfil,
            rol: 'ADMINISTRATIVO',
            tipo_sangre,
            fecha_registro: new Date()
        }, { transaction });

        // Crear registro de administrativo
        const nuevoAdministrativo = await Administrativo.create({
            id, // Usar el ID proporcionado
            usuario_id: nuevoUsuario.id,
            departamento,
            cargo
        }, { transaction });

        await transaction.commit();

        // Obtener el administrativo creado con su información de usuario (sin contraseña)
        const administrativoCreado = await Administrativo.findByPk(nuevoAdministrativo.id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: { exclude: ['password'] }
                }
            ]
        });

        return res.status(201).json(administrativoCreado);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al crear administrativo:', error);
        return res.status(500).json({ message: 'Error al crear administrativo', error: error.message });
    }
};

// Actualizar un administrativo existente
export const updateAdministrativo = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;
        const {
            // Datos de usuario
            cedula,
            nombres,
            apellidos,
            email,
            password,
            telefono,
            foto_perfil,
            tipo_sangre,
            activo,
            // Datos específicos de administrativo
            departamento,
            cargo
        } = req.body;

        // Verificar si el administrativo existe
        const administrativo = await Administrativo.findByPk(id, { transaction });
        if (!administrativo) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Administrativo no encontrado' });
        }

        // Obtener el usuario asociado
        const usuario = await Usuario.findByPk(administrativo.usuario_id, { transaction });
        if (!usuario) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Usuario asociado no encontrado' });
        }

        // Si se está actualizando el email, verificar que no exista ya
        if (email && email !== usuario.email) {
            const emailExists = await Usuario.findOne({
                where: { email },
                transaction
            });

            if (emailExists) {
                await transaction.rollback();
                return res.status(400).json({ message: 'El email ya está registrado por otro usuario' });
            }
        }

        // Si se está actualizando la cédula, verificar que no exista ya
        if (cedula && cedula !== usuario.cedula) {
            const cedulaExists = await Usuario.findOne({
                where: { cedula },
                transaction
            });

            if (cedulaExists) {
                await transaction.rollback();
                return res.status(400).json({ message: 'La cédula ya está registrada por otro usuario' });
            }
        }

        // Preparar objeto de actualización para usuario
        const updateUsuarioData = {};

        if (cedula) updateUsuarioData.cedula = cedula;
        if (nombres) updateUsuarioData.nombres = nombres;
        if (apellidos) updateUsuarioData.apellidos = apellidos;
        if (email) updateUsuarioData.email = email;
        if (telefono) updateUsuarioData.telefono = telefono;
        if (foto_perfil) updateUsuarioData.foto_perfil = foto_perfil;
        if (tipo_sangre) updateUsuarioData.tipo_sangre = tipo_sangre;
        if (activo !== undefined) updateUsuarioData.activo = activo;

        // Si se proporciona una nueva contraseña, encriptarla
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateUsuarioData.password = await bcrypt.hash(password, salt);
        }

        // Preparar objeto de actualización para administrativo
        const updateAdministrativoData = {};

        if (departamento) updateAdministrativoData.departamento = departamento;
        if (cargo) updateAdministrativoData.cargo = cargo;

        // Actualizar usuario
        if (Object.keys(updateUsuarioData).length > 0) {
            await usuario.update(updateUsuarioData, { transaction });
        }

        // Actualizar administrativo
        if (Object.keys(updateAdministrativoData).length > 0) {
            await administrativo.update(updateAdministrativoData, { transaction });
        }

        await transaction.commit();

        // Obtener el administrativo actualizado con su información de usuario
        const administrativoActualizado = await Administrativo.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: { exclude: ['password'] }
                }
            ]
        });

        return res.status(200).json(administrativoActualizado);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al actualizar administrativo:', error);
        return res.status(500).json({ message: 'Error al actualizar administrativo', error: error.message });
    }
};

// Eliminar un administrativo (desactivación lógica)
export const deleteAdministrativo = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;

        // Verificar si el administrativo existe
        const administrativo = await Administrativo.findByPk(id, { transaction });
        if (!administrativo) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Administrativo no encontrado' });
        }

        // Obtener el usuario asociado
        const usuario = await Usuario.findByPk(administrativo.usuario_id, { transaction });
        if (!usuario) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Usuario asociado no encontrado' });
        }

        // Desactivar el usuario (no eliminamos los registros)
        await usuario.update({ activo: false }, { transaction });

        await transaction.commit();

        return res.status(200).json({ message: 'Administrativo desactivado correctamente' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error al desactivar administrativo:', error);
        return res.status(500).json({ message: 'Error al desactivar administrativo', error: error.message });
    }
};