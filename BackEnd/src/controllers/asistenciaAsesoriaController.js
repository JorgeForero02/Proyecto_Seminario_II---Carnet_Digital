// controllers/asistenciaAsesoriaController.js
import { AsistenciaAsesoria, Asesoria, Estudiante, Usuario } from '../models/index.js';
import sequelize from '../database/connection.js';

// Obtener todas las asistencias a asesorías
export const getAllAsistenciasAsesorias = async (req, res) => {
    try {
        const asistencias = await AsistenciaAsesoria.findAll({
            include: [
                {
                    model: Asesoria,
                    as: 'asesoria'
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
        console.error('Error al obtener asistencias a asesorías:', error);
        return res.status(500).json({ message: 'Error al obtener asistencias a asesorías', error: error.message });
    }
};

// Obtener asistencias por ID de asesoría
export const getAsistenciasByAsesoriaId = async (req, res) => {
    try {
        const { asesoriaId } = req.params;

        const asistencias = await AsistenciaAsesoria.findAll({
            where: { asesoria_id: asesoriaId },
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
        console.error('Error al obtener asistencias por asesoría:', error);
        return res.status(500).json({ message: 'Error al obtener asistencias por asesoría', error: error.message });
    }
};

// Obtener asistencias por ID de estudiante
export const getAsistenciasByEstudianteId = async (req, res) => {
    try {
        const { estudianteId } = req.params;

        const asistencias = await AsistenciaAsesoria.findAll({
            where: { estudiante_id: estudianteId },
            include: [
                {
                    model: Asesoria,
                    as: 'asesoria'
                }
            ]
        });

        return res.status(200).json(asistencias);
    } catch (error) {
        console.error('Error al obtener asistencias por estudiante:', error);
        return res.status(500).json({ message: 'Error al obtener asistencias por estudiante', error: error.message });
    }
};

// Obtener una asistencia por ID
export const getAsistenciaAsesoriaById = async (req, res) => {
    try {
        const { id } = req.params;

        const asistencia = await AsistenciaAsesoria.findByPk(id, {
            include: [
                {
                    model: Asesoria,
                    as: 'asesoria'
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

// Crear una nueva asistencia a asesoría
export const createAsistenciaAsesoria = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            asesoria_id,
            estudiante_id,
            fecha_hora,
            comentarios
        } = req.body;

        // Verificar si la asesoría existe
        const asesoria = await Asesoria.findByPk(asesoria_id, { transaction });
        if (!asesoria) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Asesoría no encontrada' });
        }

        // Verificar si el estudiante existe
        const estudiante = await Estudiante.findByPk(estudiante_id, { transaction });
        if (!estudiante) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        // Verificar si ya existe una asistencia para esa asesoría, estudiante y fecha/hora
        const existingAsistencia = await AsistenciaAsesoria.findOne({
            where: {
                asesoria_id,
                estudiante_id,
                fecha_hora
            },
            transaction
        });

        if (existingAsistencia) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Ya existe un registro de asistencia para esta asesoría, estudiante y fecha/hora' });
        }

        // Crear nueva asistencia
        const nuevaAsistencia = await AsistenciaAsesoria.create({
            asesoria_id,
            estudiante_id,
            fecha_hora,
            comentarios,
            validado: false
        }, { transaction });

        await transaction.commit();

        // Obtener la asistencia creada con información relacionada
        const asistenciaCreada = await AsistenciaAsesoria.findByPk(nuevaAsistencia.id, {
            include: [
                {
                    model: Asesoria,
                    as: 'asesoria'
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
        console.error('Error al crear asistencia a asesoría:', error);
        return res.status(500).json({ message: 'Error al crear asistencia a asesoría', error: error.message });
    }
};

// Actualizar una asistencia a asesoría
export const updateAsistenciaAsesoria = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;
        const {
            asesoria_id,
            estudiante_id,
            fecha_hora,
            comentarios,
            validado
        } = req.body;

        // Verificar si la asistencia existe
        const asistencia = await AsistenciaAsesoria.findByPk(id, { transaction });
        if (!asistencia) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Asistencia no encontrada' });
        }

        // Si se cambia la asesoría, verificar que exista
        if (asesoria_id && asesoria_id !== asistencia.asesoria_id) {
            const asesoria = await Asesoria.findByPk(asesoria_id, { transaction });
            if (!asesoria) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Asesoría no encontrada' });
            }
        }

        // Si se cambia el estudiante, verificar que exista
        if (estudiante_id && estudiante_id !== asistencia.estudiante_id) {
            const estudiante = await Estudiante.findByPk(estudiante_id, { transaction });
            if (!estudiante) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Estudiante no encontrado' });
            }
        }

        // Si se cambia asesoría, estudiante o fecha/hora, verificar que no exista un registro duplicado
        if ((asesoria_id && asesoria_id !== asistencia.asesoria_id) ||
            (estudiante_id && estudiante_id !== asistencia.estudiante_id) ||
            (fecha_hora && fecha_hora !== asistencia.fecha_hora)) {
            
            const existingAsistencia = await AsistenciaAsesoria.findOne({
                where: {
                    asesoria_id: asesoria_id || asistencia.asesoria_id,
                    estudiante_id: estudiante_id || asistencia.estudiante_id,
                    fecha_hora: fecha_hora || asistencia.fecha_hora
                },
                transaction
            });

            if (existingAsistencia && existingAsistencia.id !== parseInt(id)) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Ya existe un registro de asistencia para esta asesoría, estudiante y fecha/hora' });
            }
        }

        // Preparar objeto de actualización
        const updateData = {};

        if (asesoria_id) updateData.asesoria_id = asesoria_id;
        if (estudiante_id) updateData.estudiante_id = estudiante_id;
        if (fecha_hora) updateData.fecha_hora = fecha_hora;
        if (comentarios !== undefined) updateData.comentarios = comentarios;
        if (validado !== undefined) updateData.validado = validado;

        // Actualizar asistencia
        await asistencia.update(updateData, { transaction });

        await transaction.commit();

        // Obtener la asistencia actualizada con información relacionada
        const asistenciaActualizada = await AsistenciaAsesoria.findByPk(id, {
            include: [
                {
                    model: Asesoria,
                    as: 'asesoria'
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
        console.error('Error al actualizar asistencia a asesoría:', error);
        return res.status(500).json({ message: 'Error al actualizar asistencia a asesoría', error: error.message });
    }
};

// Validar asistencia a asesoría
export const validarAsistenciaAsesoria = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;

        // Verificar si la asistencia existe
        const asistencia = await AsistenciaAsesoria.findByPk(id, { transaction });
        if (!asistencia) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Asistencia no encontrada' });
        }

        // Actualizar el estado a validado
        await asistencia.update({ validado: true }, { transaction });

        await transaction.commit();

        return res.status(200).json({ 
            message: 'Asistencia validada correctamente',
            asistencia: await AsistenciaAsesoria.findByPk(id)
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Error al validar asistencia a asesoría:', error);
        return res.status(500).json({ message: 'Error al validar asistencia a asesoría', error: error.message });
    }
};

// Eliminar una asistencia a asesoría
export const deleteAsistenciaAsesoria = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;

        // Verificar si la asistencia existe
        const asistencia = await AsistenciaAsesoria.findByPk(id, { transaction });
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
        console.error('Error al eliminar asistencia a asesoría:', error);
        return res.status(500).json({ message: 'Error al eliminar asistencia a asesoría', error: error.message });
    }
};