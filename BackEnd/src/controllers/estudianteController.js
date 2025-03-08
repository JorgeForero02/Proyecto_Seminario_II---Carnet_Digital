// controllers/estudianteController.js
import { Usuario, Estudiante } from '../models/index.js';
import bcrypt from 'bcrypt';
import sequelize from '../database/connection.js';

// Obtener todos los estudiantes
export const getAllEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.findAll({
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: { exclude: ['password'] }
                }
            ]
        });

        return res.status(200).json(estudiantes);
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        return res.status(500).json({ message: 'Error al obtener estudiantes', error: error.message });
    }
};

// Obtener un estudiante por ID
export const getEstudianteById = async (req, res) => {
    try {
        const { id } = req.params;

        const estudiante = await Estudiante.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: { exclude: ['password'] }
                }
            ]
        });

        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        return res.status(200).json(estudiante);
    } catch (error) {
        console.error('Error al obtener estudiante:', error);
        return res.status(500).json({ message: 'Error al obtener estudiante', error: error.message });
    }
};

// Crear un nuevo estudiante (también crea un usuario)
export const createEstudiante = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            // ID personalizado
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
            // Datos específicos de estudiante
            programa_academico,
            facultad,
            modalidad,
            semestre
        } = req.body;

        // Verificar si el ID ya existe (si se proporciona)
        if (id) {
            const idExists = await Usuario.findByPk(id, { transaction });
            if (idExists) {
                await transaction.rollback();
                return res.status(400).json({ message: 'El ID ya está registrado' });
            }
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

        // Crear usuario con rol ESTUDIANTE
        const nuevoUsuario = await Usuario.create({
            id,
            cedula,
            nombres,
            apellidos,
            email,
            password: hashedPassword,
            telefono,
            foto_perfil,
            rol: 'ESTUDIANTE',
            tipo_sangre,
            fecha_registro: new Date()
        }, { transaction });

        // Crear registro de estudiante
        const nuevoEstudiante = await Estudiante.create({
            id: nuevoUsuario.id,
            usuario_id: nuevoUsuario.id,
            programa_academico,
            facultad,
            modalidad,
            semestre
        }, { transaction });

        await transaction.commit();

        // Obtener el estudiante creado con su información de usuario (sin contraseña)
        const estudianteCreado = await Estudiante.findByPk(nuevoEstudiante.id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: { exclude: ['password'] }
                }
            ]
        });

        return res.status(201).json(estudianteCreado);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al crear estudiante:', error);
        return res.status(500).json({ message: 'Error al crear estudiante', error: error.message });
    }
};

// Actualizar un estudiante existente
export const updateEstudiante = async (req, res) => {
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
            // Datos específicos de estudiante
            programa_academico,
            facultad,
            modalidad,
            semestre
        } = req.body;

        // Verificar si el estudiante existe
        const estudiante = await Estudiante.findByPk(id, { transaction });
        if (!estudiante) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        // Obtener el usuario asociado
        const usuario = await Usuario.findByPk(estudiante.usuario_id, { transaction });
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

        // Preparar objeto de actualización para estudiante
        const updateEstudianteData = {};

        if (programa_academico) updateEstudianteData.programa_academico = programa_academico;
        if (facultad) updateEstudianteData.facultad = facultad;
        if (modalidad) updateEstudianteData.modalidad = modalidad;
        if (semestre) updateEstudianteData.semestre = semestre;

        // Actualizar usuario
        if (Object.keys(updateUsuarioData).length > 0) {
            await usuario.update(updateUsuarioData, { transaction });
        }

        // Actualizar estudiante
        if (Object.keys(updateEstudianteData).length > 0) {
            await estudiante.update(updateEstudianteData, { transaction });
        }

        await transaction.commit();

        // Obtener el estudiante actualizado con su información de usuario
        const estudianteActualizado = await Estudiante.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: { exclude: ['password'] }
                }
            ]
        });

        return res.status(200).json(estudianteActualizado);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al actualizar estudiante:', error);
        return res.status(500).json({ message: 'Error al actualizar estudiante', error: error.message });
    }
};

// Eliminar un estudiante (desactivación lógica)
export const deleteEstudiante = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;

        // Verificar si el estudiante existe
        const estudiante = await Estudiante.findByPk(id, { transaction });
        if (!estudiante) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        // Obtener el usuario asociado
        const usuario = await Usuario.findByPk(estudiante.usuario_id, { transaction });
        if (!usuario) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Usuario asociado no encontrado' });
        }

        // Desactivar el usuario (no eliminamos los registros)
        await usuario.update({ activo: false }, { transaction });

        await transaction.commit();

        return res.status(200).json({ message: 'Estudiante desactivado correctamente' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error al desactivar estudiante:', error);
        return res.status(500).json({ message: 'Error al desactivar estudiante', error: error.message });
    }
};