// controllers/asistenciaClaseController.js
import { AsistenciaClase, Estudiante, Materia, Docente, Usuario } from '../models/index.js';
import sequelize from '../database/connection.js';
import { Op } from 'sequelize';

// Obtener todas las asistencias a clases
export const getAllAsistenciasClase = async (req, res) => {
    try {
        const asistencias = await AsistenciaClase.findAll({
            include: [
                {
                    model: Estudiante,
                    as: 'estudiante',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['id', 'nombres', 'apellidos', 'email']
                        }
                    ]
                },
                {
                    model: Materia,
                    as: 'materia'
                },
                {
                    model: Docente,
                    as: 'docente',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['id', 'nombres', 'apellidos', 'email']
                        }
                    ]
                }
            ],
            order: [['fecha', 'DESC'], ['hora_inicio', 'DESC']]
        });

        return res.status(200).json(asistencias);
    } catch (error) {
        console.error('Error al obtener asistencias a clase:', error);
        return res.status(500).json({ message: 'Error al obtener asistencias a clase', error: error.message });
    }
};

// Obtener una asistencia por ID
export const getAsistenciaClaseById = async (req, res) => {
    try {
        const { id } = req.params;

        const asistencia = await AsistenciaClase.findByPk(id, {
            include: [
                {
                    model: Estudiante,
                    as: 'estudiante',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['id', 'nombres', 'apellidos', 'email']
                        }
                    ]
                },
                {
                    model: Materia,
                    as: 'materia'
                },
                {
                    model: Docente,
                    as: 'docente',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['id', 'nombres', 'apellidos', 'email']
                        }
                    ]
                }
            ]
        });

        if (!asistencia) {
            return res.status(404).json({ message: 'Registro de asistencia no encontrado' });
        }

        return res.status(200).json(asistencia);
    } catch (error) {
        console.error('Error al obtener asistencia:', error);
        return res.status(500).json({ message: 'Error al obtener asistencia', error: error.message });
    }
};

// Obtener asistencias por estudiante
export const getAsistenciasByEstudiante = async (req, res) => {
    try {
        const { estudiante_id } = req.params;

        const asistencias = await AsistenciaClase.findAll({
            where: { estudiante_id },
            include: [
                {
                    model: Materia,
                    as: 'materia'
                },
                {
                    model: Docente,
                    as: 'docente',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['id', 'nombres', 'apellidos']
                        }
                    ]
                }
            ],
            order: [['fecha', 'DESC'], ['hora_inicio', 'DESC']]
        });

        return res.status(200).json(asistencias);
    } catch (error) {
        console.error('Error al obtener asistencias del estudiante:', error);
        return res.status(500).json({ message: 'Error al obtener asistencias del estudiante', error: error.message });
    }
};

// Obtener asistencias por materia
export const getAsistenciasByMateria = async (req, res) => {
    try {
        const { materia_id } = req.params;

        const asistencias = await AsistenciaClase.findAll({
            where: { materia_id },
            include: [
                {
                    model: Estudiante,
                    as: 'estudiante',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['id', 'nombres', 'apellidos']
                        }
                    ]
                },
                {
                    model: Docente,
                    as: 'docente',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['id', 'nombres', 'apellidos']
                        }
                    ]
                }
            ],
            order: [['fecha', 'DESC'], ['hora_inicio', 'DESC']]
        });

        return res.status(200).json(asistencias);
    } catch (error) {
        console.error('Error al obtener asistencias de la materia:', error);
        return res.status(500).json({ message: 'Error al obtener asistencias de la materia', error: error.message });
    }
};

// Obtener asistencias por docente
export const getAsistenciasByDocente = async (req, res) => {
    try {
        const { docente_id } = req.params;

        const asistencias = await AsistenciaClase.findAll({
            where: { docente_id },
            include: [
                {
                    model: Estudiante,
                    as: 'estudiante',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['id', 'nombres', 'apellidos']
                        }
                    ]
                },
                {
                    model: Materia,
                    as: 'materia'
                }
            ],
            order: [['fecha', 'DESC'], ['hora_inicio', 'DESC']]
        });

        return res.status(200).json(asistencias);
    } catch (error) {
        console.error('Error al obtener asistencias del docente:', error);
        return res.status(500).json({ message: 'Error al obtener asistencias del docente', error: error.message });
    }
};

// Crear un nuevo registro de asistencia
export const createAsistenciaClase = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            estudiante_id,
            materia_id,
            docente_id,
            fecha,
            hora_inicio,
            hora_fin,
            estado,
            observaciones
        } = req.body;

        // Verificar que el estudiante existe
        const estudiante = await Estudiante.findByPk(estudiante_id, { transaction });
        if (!estudiante) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        // Verificar que la materia existe
        const materia = await Materia.findByPk(materia_id, { transaction });
        if (!materia) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        // Verificar que el docente existe
        const docente = await Docente.findByPk(docente_id, { transaction });
        if (!docente) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Docente no encontrado' });
        }

        // Verificar si ya existe una asistencia para el mismo estudiante, materia, fecha y horario
        const asistenciaExistente = await AsistenciaClase.findOne({
            where: {
                estudiante_id,
                materia_id,
                fecha,
                hora_inicio
            },
            transaction
        });

        if (asistenciaExistente) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Ya existe un registro de asistencia para este estudiante en esta clase' });
        }

        // Crear registro de asistencia
        const nuevaAsistencia = await AsistenciaClase.create({
            estudiante_id,
            materia_id,
            docente_id,
            fecha,
            hora_inicio,
            hora_fin,
            estado,
            observaciones
        }, { transaction });

        await transaction.commit();

        // Obtener la asistencia creada con información relacionada
        const asistenciaCreada = await AsistenciaClase.findByPk(nuevaAsistencia.id, {
            include: [
                {
                    model: Estudiante,
                    as: 'estudiante',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['id', 'nombres', 'apellidos']
                        }
                    ]
                },
                {
                    model: Materia,
                    as: 'materia'
                },
                {
                    model: Docente,
                    as: 'docente',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['id', 'nombres', 'apellidos']
                        }
                    ]
                }
            ]
        });

        return res.status(201).json(asistenciaCreada);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al crear registro de asistencia:', error);
        return res.status(500).json({ message: 'Error al crear registro de asistencia', error: error.message });
    }
};

// Actualizar un registro de asistencia
export const updateAsistenciaClase = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;
        const {
            estudiante_id,
            materia_id,
            docente_id,
            fecha,
            hora_inicio,
            hora_fin,
            estado,
            observaciones,
            validado
        } = req.body;

        // Verificar si la asistencia existe
        const asistencia = await AsistenciaClase.findByPk(id, { transaction });
        if (!asistencia) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Registro de asistencia no encontrado' });
        }

        // Si se cambian detalles importantes, verificar entidades relacionadas
        if (estudiante_id) {
            const estudiante = await Estudiante.findByPk(estudiante_id, { transaction });
            if (!estudiante) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Estudiante no encontrado' });
            }
        }

        if (materia_id) {
            const materia = await Materia.findByPk(materia_id, { transaction });
            if (!materia) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Materia no encontrada' });
            }
        }

        if (docente_id) {
            const docente = await Docente.findByPk(docente_id, { transaction });
            if (!docente) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Docente no encontrado' });
            }
        }

        // Verificar duplicados si se cambian datos claves
        if (estudiante_id || materia_id || fecha || hora_inicio) {
            const whereClause = {
                id: { [Op.ne]: id } // Excluir el registro actual
            };

            if (estudiante_id) whereClause.estudiante_id = estudiante_id;
            else whereClause.estudiante_id = asistencia.estudiante_id;

            if (materia_id) whereClause.materia_id = materia_id;
            else whereClause.materia_id = asistencia.materia_id;

            if (fecha) whereClause.fecha = fecha;
            else whereClause.fecha = asistencia.fecha;

            if (hora_inicio) whereClause.hora_inicio = hora_inicio;
            else whereClause.hora_inicio = asistencia.hora_inicio;

            const asistenciaExistente = await AsistenciaClase.findOne({
                where: whereClause,
                transaction
            });

            if (asistenciaExistente) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Ya existe un registro de asistencia para este estudiante en esta clase' });
            }
        }

        // Preparar objeto de actualización
        const updateData = {};

        if (estudiante_id) updateData.estudiante_id = estudiante_id;
        if (materia_id) updateData.materia_id = materia_id;
        if (docente_id) updateData.docente_id = docente_id;
        if (fecha) updateData.fecha = fecha;
        if (hora_inicio) updateData.hora_inicio = hora_inicio;
        if (hora_fin) updateData.hora_fin = hora_fin;
        if (estado) updateData.estado = estado;
        if (observaciones !== undefined) updateData.observaciones = observaciones;
        if (validado !== undefined) updateData.validado = validado;

        // Actualizar asistencia
        await asistencia.update(updateData, { transaction });

        await transaction.commit();

        // Obtener asistencia actualizada con información relacionada
        const asistenciaActualizada = await AsistenciaClase.findByPk(id, {
            include: [
                {
                    model: Estudiante,
                    as: 'estudiante',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['id', 'nombres', 'apellidos']
                        }
                    ]
                },
                {
                    model: Materia,
                    as: 'materia'
                },
                {
                    model: Docente,
                    as: 'docente',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['id', 'nombres', 'apellidos']
                        }
                    ]
                }
            ]
        });

        return res.status(200).json(asistenciaActualizada);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al actualizar registro de asistencia:', error);
        return res.status(500).json({ message: 'Error al actualizar registro de asistencia', error: error.message });
    }
};

// Eliminar un registro de asistencia
export const deleteAsistenciaClase = async (req, res) => {
    try {
        const { id } = req.params;

        const asistencia = await AsistenciaClase.findByPk(id);
        if (!asistencia) {
            return res.status(404).json({ message: 'Registro de asistencia no encontrado' });
        }

        await asistencia.destroy();

        return res.status(200).json({ message: 'Registro de asistencia eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar registro de asistencia:', error);
        return res.status(500).json({ message: 'Error al eliminar registro de asistencia', error: error.message });
    }
};