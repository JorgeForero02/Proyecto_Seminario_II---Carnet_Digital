// controllers/asistenciaAmigoAcademicoController.js
import { AsistenciaAmigoAcademico, AmigoAcademico, Estudiante, Usuario } from '../models/index.js';
import sequelize from '../database/connection.js';

// Obtener todas las asistencias de amigos académicos
export const getAllAsistencias = async (req, res) => {
    try {
        const asistencias = await AsistenciaAmigoAcademico.findAll({
            include: [
                {
                    model: AmigoAcademico,
                    as: 'amigoAcademico',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: { exclude: ['password'] }
                        }
                    ]
                },
                {
                    model: Estudiante,
                    as: 'estudiante',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: { exclude: ['password'] }
                        }
                    ]
                }
            ]
        });

        return res.status(200).json(asistencias);
    } catch (error) {
        console.error('Error al obtener asistencias:', error);
        return res.status(500).json({ message: 'Error al obtener asistencias', error: error.message });
    }
};

// Obtener una asistencia por ID
export const getAsistenciaById = async (req, res) => {
    try {
        const { id } = req.params;

        const asistencia = await AsistenciaAmigoAcademico.findByPk(id, {
            include: [
                {
                    model: AmigoAcademico,
                    as: 'amigoAcademico',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: { exclude: ['password'] }
                        }
                    ]
                },
                {
                    model: Estudiante,
                    as: 'estudiante',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: { exclude: ['password'] }
                        }
                    ]
                }
            ]
        });

        if (!asistencia) {
            return res.status(404).json({ message: 'Asistencia no encontrada' });
        }

        return res.status(200).json(asistencia);
    } catch (error) {
        console.error('Error al obtener asistencia:', error);
        return res.status(500).json({ message: 'Error al obtener asistencia', error: error.message });
    }
};

// Obtener asistencias por amigo académico
export const getAsistenciasByAmigoAcademico = async (req, res) => {
    try {
        const { amigoAcademicoId } = req.params;

        const asistencias = await AsistenciaAmigoAcademico.findAll({
            where: { amigo_academico_id: amigoAcademicoId },
            include: [
                {
                    model: Estudiante,
                    as: 'estudiante',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: { exclude: ['password'] }
                        }
                    ]
                }
            ]
        });

        return res.status(200).json(asistencias);
    } catch (error) {
        console.error('Error al obtener asistencias por amigo académico:', error);
        return res.status(500).json({ message: 'Error al obtener asistencias', error: error.message });
    }
};

// Obtener asistencias por estudiante
export const getAsistenciasByEstudiante = async (req, res) => {
    try {
        const { estudianteId } = req.params;

        const asistencias = await AsistenciaAmigoAcademico.findAll({
            where: { estudiante_id: estudianteId },
            include: [
                {
                    model: AmigoAcademico,
                    as: 'amigoAcademico',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: { exclude: ['password'] }
                        }
                    ]
                }
            ]
        });

        return res.status(200).json(asistencias);
    } catch (error) {
        console.error('Error al obtener asistencias por estudiante:', error);
        return res.status(500).json({ message: 'Error al obtener asistencias', error: error.message });
    }
};

// Crear una nueva asistencia
export const createAsistencia = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            amigo_academico_id,
            estudiante_id,
            fecha_hora,
            comentarios,
            validado
        } = req.body;

        // Verificar si existe el amigo académico
        const amigoAcademico = await AmigoAcademico.findByPk(amigo_academico_id, { transaction });
        if (!amigoAcademico) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Amigo académico no encontrado' });
        }

        // Verificar si existe el estudiante
        const estudiante = await Estudiante.findByPk(estudiante_id, { transaction });
        if (!estudiante) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        // Verificar si ya existe una asistencia con los mismos datos (prevenir duplicados)
        const asistenciaExistente = await AsistenciaAmigoAcademico.findOne({
            where: {
                amigo_academico_id,
                estudiante_id,
                fecha_hora
            },
            transaction
        });

        if (asistenciaExistente) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Ya existe una asistencia registrada con estos datos' });
        }

        // Crear la asistencia
        const nuevaAsistencia = await AsistenciaAmigoAcademico.create({
            amigo_academico_id,
            estudiante_id,
            fecha_hora,
            comentarios,
            validado: validado !== undefined ? validado : false
        }, { transaction });

        await transaction.commit();

        // Obtener la asistencia creada con datos relacionados
        const asistenciaCreada = await AsistenciaAmigoAcademico.findByPk(nuevaAsistencia.id, {
            include: [
                {
                    model: AmigoAcademico,
                    as: 'amigoAcademico',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: { exclude: ['password'] }
                        }
                    ]
                },
                {
                    model: Estudiante,
                    as: 'estudiante',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: { exclude: ['password'] }
                        }
                    ]
                }
            ]
        });

        return res.status(201).json(asistenciaCreada);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al crear asistencia:', error);
        return res.status(500).json({ message: 'Error al crear asistencia', error: error.message });
    }
};

// Actualizar una asistencia existente
export const updateAsistencia = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;
        const {
            amigo_academico_id,
            estudiante_id,
            fecha_hora,
            comentarios,
            validado
        } = req.body;

        // Verificar si existe la asistencia
        const asistencia = await AsistenciaAmigoAcademico.findByPk(id, { transaction });
        if (!asistencia) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Asistencia no encontrada' });
        }

        // Si se están actualizando referencias, verificar que existan
        if (amigo_academico_id) {
            const amigoAcademico = await AmigoAcademico.findByPk(amigo_academico_id, { transaction });
            if (!amigoAcademico) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Amigo académico no encontrado' });
            }
        }

        if (estudiante_id) {
            const estudiante = await Estudiante.findByPk(estudiante_id, { transaction });
            if (!estudiante) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Estudiante no encontrado' });
            }
        }

        // Si se están cambiando las claves principales, verificar que no exista duplicado
        if ((amigo_academico_id && amigo_academico_id !== asistencia.amigo_academico_id) || 
            (estudiante_id && estudiante_id !== asistencia.estudiante_id) || 
            (fecha_hora && fecha_hora !== asistencia.fecha_hora)) {
            
            const asistenciaExistente = await AsistenciaAmigoAcademico.findOne({
                where: {
                    amigo_academico_id: amigo_academico_id || asistencia.amigo_academico_id,
                    estudiante_id: estudiante_id || asistencia.estudiante_id,
                    fecha_hora: fecha_hora || asistencia.fecha_hora
                },
                transaction
            });

            if (asistenciaExistente && asistenciaExistente.id !== parseInt(id)) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Ya existe una asistencia registrada con estos datos' });
            }
        }

        // Preparar objeto de actualización
        const updateData = {};

        if (amigo_academico_id) updateData.amigo_academico_id = amigo_academico_id;
        if (estudiante_id) updateData.estudiante_id = estudiante_id;
        if (fecha_hora) updateData.fecha_hora = fecha_hora;
        if (comentarios !== undefined) updateData.comentarios = comentarios;
        if (validado !== undefined) updateData.validado = validado;

        // Actualizar asistencia
        await asistencia.update(updateData, { transaction });

        await transaction.commit();

        // Obtener la asistencia actualizada con datos relacionados
        const asistenciaActualizada = await AsistenciaAmigoAcademico.findByPk(id, {
            include: [
                {
                    model: AmigoAcademico,
                    as: 'amigoAcademico',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: { exclude: ['password'] }
                        }
                    ]
                },
                {
                    model: Estudiante,
                    as: 'estudiante',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: { exclude: ['password'] }
                        }
                    ]
                }
            ]
        });

        return res.status(200).json(asistenciaActualizada);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al actualizar asistencia:', error);
        return res.status(500).json({ message: 'Error al actualizar asistencia', error: error.message });
    }
};

// Validar una asistencia
export const validarAsistencia = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;

        // Verificar si existe la asistencia
        const asistencia = await AsistenciaAmigoAcademico.findByPk(id, { transaction });
        if (!asistencia) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Asistencia no encontrada' });
        }

        // Actualizar estado de validación
        await asistencia.update({ validado: true }, { transaction });

        await transaction.commit();

        return res.status(200).json({ message: 'Asistencia validada correctamente' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error al validar asistencia:', error);
        return res.status(500).json({ message: 'Error al validar asistencia', error: error.message });
    }
};

// Eliminar una asistencia
export const deleteAsistencia = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;

        // Verificar si existe la asistencia
        const asistencia = await AsistenciaAmigoAcademico.findByPk(id, { transaction });
        if (!asistencia) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Asistencia no encontrada' });
        }

        // Eliminar la asistencia
        await asistencia.destroy({ transaction });

        await transaction.commit();

        return res.status(200).json({ message: 'Asistencia eliminada correctamente' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error al eliminar asistencia:', error);
        return res.status(500).json({ message: 'Error al eliminar asistencia', error: error.message });
    }
};