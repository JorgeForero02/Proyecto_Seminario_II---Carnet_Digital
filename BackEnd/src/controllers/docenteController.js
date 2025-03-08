// controllers/docenteController.js
import { Usuario, Docente } from '../models/index.js';
import bcrypt from 'bcrypt';

// Obtener todos los docentes
export const getAllDocentes = async (req, res) => {
    try {
        const docentes = await Docente.findAll({
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: { exclude: ['password'] }
                }
            ]
        });

        return res.status(200).json(docentes);
    } catch (error) {
        console.error('Error al obtener docentes:', error);
        return res.status(500).json({ message: 'Error al obtener docentes', error: error.message });
    }
};

// Obtener un docente por ID
export const getDocenteById = async (req, res) => {
    try {
        const { id } = req.params;

        const docente = await Docente.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: { exclude: ['password'] }
                }
            ]
        });

        if (!docente) {
            return res.status(404).json({ message: 'Docente no encontrado' });
        }

        return res.status(200).json(docente);
    } catch (error) {
        console.error('Error al obtener docente:', error);
        return res.status(500).json({ message: 'Error al obtener docente', error: error.message });
    }
};

// Crear un nuevo docente (también crea un usuario)
export const createDocente = async (req, res) => {
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
            // Datos específicos de docente
            departamento,
            especialidad,
            tipo_contrato
        } = req.body;

        // Verificar que se proporcione un ID
        if (!id) {
            await transaction.rollback();
            return res.status(400).json({ message: 'El ID es requerido' });
        }

        // Verificar si el ID ya existe
        const idExists = await Docente.findByPk(id, { transaction });
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

        // Crear usuario con rol DOCENTE
        const nuevoUsuario = await Usuario.create({
            id, // Usar el ID proporcionado
            cedula,
            nombres,
            apellidos,
            email,
            password: hashedPassword,
            telefono,
            foto_perfil,
            rol: 'DOCENTE',
            tipo_sangre,
            fecha_registro: new Date()
        }, { transaction });

        // Crear registro de docente
        const nuevoDocente = await Docente.create({
            id, // Usar el ID proporcionado
            usuario_id: nuevoUsuario.id,
            departamento,
            especialidad,
            tipo_contrato
        }, { transaction });

        await transaction.commit();

        // Obtener el docente creado con su información de usuario (sin contraseña)
        const docenteCreado = await Docente.findByPk(nuevoDocente.id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: { exclude: ['password'] }
                }
            ]
        });

        return res.status(201).json(docenteCreado);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al crear docente:', error);
        return res.status(500).json({ message: 'Error al crear docente', error: error.message });
    }
};

// Actualizar un docente existente
export const updateDocente = async (req, res) => {
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
            // Datos específicos de docente
            departamento,
            especialidad,
            tipo_contrato
        } = req.body;

        // Verificar si el docente existe
        const docente = await Docente.findByPk(id, { transaction });
        if (!docente) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Docente no encontrado' });
        }

        // Obtener el usuario asociado
        const usuario = await Usuario.findByPk(docente.usuario_id, { transaction });
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

        // Preparar objeto de actualización para docente
        const updateDocenteData = {};

        if (departamento) updateDocenteData.departamento = departamento;
        if (especialidad) updateDocenteData.especialidad = especialidad;
        if (tipo_contrato) updateDocenteData.tipo_contrato = tipo_contrato;

        // Actualizar usuario
        if (Object.keys(updateUsuarioData).length > 0) {
            await usuario.update(updateUsuarioData, { transaction });
        }

        // Actualizar docente
        if (Object.keys(updateDocenteData).length > 0) {
            await docente.update(updateDocenteData, { transaction });
        }

        await transaction.commit();

        // Obtener el docente actualizado con su información de usuario
        const docenteActualizado = await Docente.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: { exclude: ['password'] }
                }
            ]
        });

        return res.status(200).json(docenteActualizado);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al actualizar docente:', error);
        return res.status(500).json({ message: 'Error al actualizar docente', error: error.message });
    }
};

// Eliminar un docente (desactivación lógica)
export const deleteDocente = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;

        // Verificar si el docente existe
        const docente = await Docente.findByPk(id, { transaction });
        if (!docente) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Docente no encontrado' });
        }

        // Obtener el usuario asociado
        const usuario = await Usuario.findByPk(docente.usuario_id, { transaction });
        if (!usuario) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Usuario asociado no encontrado' });
        }

        // Desactivar el usuario (no eliminamos los registros)
        await usuario.update({ activo: false }, { transaction });

        await transaction.commit();

        return res.status(200).json({ message: 'Docente desactivado correctamente' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error al desactivar docente:', error);
        return res.status(500).json({ message: 'Error al desactivar docente', error: error.message });
    }
};