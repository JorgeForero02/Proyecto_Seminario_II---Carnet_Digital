// controllers/amigoAcademicoController.js
import { AmigoAcademico, Estudiante, Usuario, Materia, AsistenciaAmigoAcademico } from '../models/index.js';
import sequelize from '../database/connection.js';

// Obtener todos los amigos académicos
export const getAllAmigosAcademicos = async (req, res) => {
    try {
        const amigosAcademicos = await AmigoAcademico.findAll({
            include: [
                {
                    model: Estudiante,
                    as: 'monitor',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: { exclude: ['password'] }
                        }
                    ]
                },
                {
                    model: Materia,
                    as: 'materia'
                }
            ]
        });

        return res.status(200).json(amigosAcademicos);
    } catch (error) {
        console.error('Error al obtener amigos académicos:', error);
        return res.status(500).json({ message: 'Error al obtener amigos académicos', error: error.message });
    }
};

// Obtener amigos académicos activos
export const getActiveAmigosAcademicos = async (req, res) => {
    try {
        const amigosAcademicos = await AmigoAcademico.findAll({
            where: { activo: true },
            include: [
                {
                    model: Estudiante,
                    as: 'monitor',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: { exclude: ['password'] }
                        }
                    ]
                },
                {
                    model: Materia,
                    as: 'materia'
                }
            ]
        });

        return res.status(200).json(amigosAcademicos);
    } catch (error) {
        console.error('Error al obtener amigos académicos activos:', error);
        return res.status(500).json({ message: 'Error al obtener amigos académicos activos', error: error.message });
    }
};

// Obtener amigo académico por ID
export const getAmigoAcademicoById = async (req, res) => {
    try {
        const { id } = req.params;

        const amigoAcademico = await AmigoAcademico.findByPk(id, {
            include: [
                {
                    model: Estudiante,
                    as: 'monitor',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: { exclude: ['password'] }
                        }
                    ]
                },
                {
                    model: Materia,
                    as: 'materia'
                },
                {
                    model: AsistenciaAmigoAcademico,
                    as: 'asistencias'
                }
            ]
        });

        if (!amigoAcademico) {
            return res.status(404).json({ message: 'Amigo académico no encontrado' });
        }

        return res.status(200).json(amigoAcademico);
    } catch (error) {
        console.error('Error al obtener amigo académico:', error);
        return res.status(500).json({ message: 'Error al obtener amigo académico', error: error.message });
    }
};

// Obtener amigos académicos por estudiante monitor
export const getAmigoAcademicoByEstudianteId = async (req, res) => {
    try {
        const { estudianteId } = req.params;

        const amigosAcademicos = await AmigoAcademico.findAll({
            where: { estudiante_monitor_id: estudianteId },
            include: [
                {
                    model: Materia,
                    as: 'materia'
                }
            ]
        });

        return res.status(200).json(amigosAcademicos);
    } catch (error) {
        console.error('Error al obtener amigos académicos por estudiante:', error);
        return res.status(500).json({ message: 'Error al obtener amigos académicos por estudiante', error: error.message });
    }
};

// Obtener amigos académicos por materia
export const getAmigoAcademicoByMateriaId = async (req, res) => {
    try {
        const { materiaId } = req.params;

        const amigosAcademicos = await AmigoAcademico.findAll({
            where: { 
                materia_id: materiaId,
                activo: true 
            },
            include: [
                {
                    model: Estudiante,
                    as: 'monitor',
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

        return res.status(200).json(amigosAcademicos);
    } catch (error) {
        console.error('Error al obtener amigos académicos por materia:', error);
        return res.status(500).json({ message: 'Error al obtener amigos académicos por materia', error: error.message });
    }
};

// Crear un nuevo amigo académico
export const createAmigoAcademico = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            estudiante_monitor_id,
            materia_id,
            horario,
            ubicacion,
            cupo_maximo
        } = req.body;

        // Verificar si el estudiante monitor existe
        const estudiante = await Estudiante.findByPk(estudiante_monitor_id, { transaction });
        if (!estudiante) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Estudiante monitor no encontrado' });
        }

        // Verificar si la materia existe
        const materia = await Materia.findByPk(materia_id, { transaction });
        if (!materia) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        // Crear nuevo amigo académico
        const nuevoAmigoAcademico = await AmigoAcademico.create({
            estudiante_monitor_id,
            materia_id,
            horario,
            ubicacion,
            cupo_maximo,
            activo: true
        }, { transaction });

        await transaction.commit();

        // Obtener el amigo académico creado con información relacionada
        const amigoAcademicoCreado = await AmigoAcademico.findByPk(nuevoAmigoAcademico.id, {
            include: [
                {
                    model: Estudiante,
                    as: 'monitor',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: { exclude: ['password'] }
                        }
                    ]
                },
                {
                    model: Materia,
                    as: 'materia'
                }
            ]
        });

        return res.status(201).json(amigoAcademicoCreado);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al crear amigo académico:', error);
        return res.status(500).json({ message: 'Error al crear amigo académico', error: error.message });
    }
};

// Actualizar un amigo académico
export const updateAmigoAcademico = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;
        const {
            estudiante_monitor_id,
            materia_id,
            horario,
            ubicacion,
            cupo_maximo,
            activo
        } = req.body;

        // Verificar si el amigo académico existe
        const amigoAcademico = await AmigoAcademico.findByPk(id, { transaction });
        if (!amigoAcademico) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Amigo académico no encontrado' });
        }

        // Si se cambia el estudiante monitor, verificar que exista
        if (estudiante_monitor_id && estudiante_monitor_id !== amigoAcademico.estudiante_monitor_id) {
            const estudiante = await Estudiante.findByPk(estudiante_monitor_id, { transaction });
            if (!estudiante) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Estudiante monitor no encontrado' });
            }
        }

        // Si se cambia la materia, verificar que exista
        if (materia_id && materia_id !== amigoAcademico.materia_id) {
            const materia = await Materia.findByPk(materia_id, { transaction });
            if (!materia) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Materia no encontrada' });
            }
        }

        // Preparar objeto de actualización
        const updateData = {};

        if (estudiante_monitor_id) updateData.estudiante_monitor_id = estudiante_monitor_id;
        if (materia_id) updateData.materia_id = materia_id;
        if (horario) updateData.horario = horario;
        if (ubicacion) updateData.ubicacion = ubicacion;
        if (cupo_maximo) updateData.cupo_maximo = cupo_maximo;
        if (activo !== undefined) updateData.activo = activo;

        // Actualizar amigo académico
        await amigoAcademico.update(updateData, { transaction });

        await transaction.commit();

        // Obtener el amigo académico actualizado con información relacionada
        const amigoAcademicoActualizado = await AmigoAcademico.findByPk(id, {
            include: [
                {
                    model: Estudiante,
                    as: 'monitor',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: { exclude: ['password'] }
                        }
                    ]
                },
                {
                    model: Materia,
                    as: 'materia'
                }
            ]
        });

        return res.status(200).json(amigoAcademicoActualizado);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al actualizar amigo académico:', error);
        return res.status(500).json({ message: 'Error al actualizar amigo académico', error: error.message });
    }
};

// Activar/Desactivar un amigo académico
export const toggleActivoAmigoAcademico = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;
        const { activo } = req.body;

        // Verificar si el amigo académico existe
        const amigoAcademico = await AmigoAcademico.findByPk(id, { transaction });
        if (!amigoAcademico) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Amigo académico no encontrado' });
        }

        // Actualizar estado
        await amigoAcademico.update({ activo }, { transaction });

        await transaction.commit();

        const estado = activo ? 'activado' : 'desactivado';
        return res.status(200).json({ 
            message: `Amigo académico ${estado} correctamente`,
            amigoAcademico: await AmigoAcademico.findByPk(id)
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Error al cambiar estado del amigo académico:', error);
        return res.status(500).json({ message: 'Error al cambiar estado del amigo académico', error: error.message });
    }
};

// Eliminar un amigo académico
export const deleteAmigoAcademico = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;

        // Verificar si el amigo académico existe
        const amigoAcademico = await AmigoAcademico.findByPk(id, { transaction });
        if (!amigoAcademico) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Amigo académico no encontrado' });
        }

        // Verificar si hay asistencias relacionadas
        const asistenciasCount = await AsistenciaAmigoAcademico.count({
            where: { amigo_academico_id: id },
            transaction
        });

        if (asistenciasCount > 0) {
            // Si hay asistencias, desactivar en lugar de eliminar
            await amigoAcademico.update({ activo: false }, { transaction });
            await transaction.commit();
            return res.status(200).json({ 
                message: 'Amigo académico desactivado correctamente (tiene asistencias registradas)',
                desactivado: true
            });
        }

        // Si no hay asistencias, eliminar completamente
        await amigoAcademico.destroy({ transaction });
        await transaction.commit();

        return res.status(200).json({ 
            message: 'Amigo académico eliminado correctamente',
            eliminado: true
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Error al eliminar amigo académico:', error);
        return res.status(500).json({ message: 'Error al eliminar amigo académico', error: error.message });
    }
};