// controllers/docenteMateriaController.js
import { Docente, Materia, DocenteMateria, Usuario } from '../models/index.js';
import sequelize from '../database/connection.js';

// Obtener todas las asignaciones docente-materia
export const getAllDocenteMaterias = async (req, res) => {
    try {
        const docenteMaterias = await DocenteMateria.findAll({
            include: [
                {
                    model: Docente,
                    as: 'docente',
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

        return res.status(200).json(docenteMaterias);
    } catch (error) {
        console.error('Error al obtener asignaciones docente-materia:', error);
        return res.status(500).json({ message: 'Error al obtener asignaciones docente-materia', error: error.message });
    }
};

// Obtener una asignación docente-materia por ID
export const getDocenteMateriaById = async (req, res) => {
    try {
        const { id } = req.params;

        const docenteMateria = await DocenteMateria.findByPk(id, {
            include: [
                {
                    model: Docente,
                    as: 'docente',
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

        if (!docenteMateria) {
            return res.status(404).json({ message: 'Asignación docente-materia no encontrada' });
        }

        return res.status(200).json(docenteMateria);
    } catch (error) {
        console.error('Error al obtener asignación docente-materia:', error);
        return res.status(500).json({ message: 'Error al obtener asignación docente-materia', error: error.message });
    }
};

// Obtener asignaciones por docente
export const getAsignacionesByDocente = async (req, res) => {
    try {
        const { docenteId } = req.params;
        const { estado } = req.query; // Opcional para filtrar por estado

        // Verificar si el docente existe
        const docente = await Docente.findByPk(docenteId);
        if (!docente) {
            return res.status(404).json({ message: 'Docente no encontrado' });
        }

        // Preparar condiciones de búsqueda
        const whereCondition = { docente_id: docenteId };
        
        // Si se especifica un estado, añadirlo a las condiciones
        if (estado) {
            whereCondition.estado = estado;
        }

        const asignaciones = await DocenteMateria.findAll({
            where: whereCondition,
            include: [
                {
                    model: Materia,
                    as: 'materia'
                }
            ]
        });

        return res.status(200).json(asignaciones);
    } catch (error) {
        console.error('Error al obtener asignaciones del docente:', error);
        return res.status(500).json({ message: 'Error al obtener asignaciones del docente', error: error.message });
    }
};

// Obtener docentes por materia
export const getDocentesByMateria = async (req, res) => {
    try {
        const { materiaId } = req.params;
        const { estado } = req.query; // Opcional para filtrar por estado

        // Verificar si la materia existe
        const materia = await Materia.findByPk(materiaId);
        if (!materia) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        // Preparar condiciones de búsqueda
        const whereCondition = { materia_id: materiaId };
        
        // Si se especifica un estado, añadirlo a las condiciones
        if (estado) {
            whereCondition.estado = estado;
        }

        const asignaciones = await DocenteMateria.findAll({
            where: whereCondition,
            include: [
                {
                    model: Docente,
                    as: 'docente',
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

        return res.status(200).json(asignaciones);
    } catch (error) {
        console.error('Error al obtener docentes de la materia:', error);
        return res.status(500).json({ message: 'Error al obtener docentes de la materia', error: error.message });
    }
};

// Obtener asignaciones por estado
export const getAsignacionesByEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        
        // Validar que el estado sea válido
        const estadosValidos = ['ACTIVO', 'INACTIVO', 'TERMINADO'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ message: 'Estado no válido. Debe ser ACTIVO, INACTIVO o TERMINADO' });
        }

        const asignaciones = await DocenteMateria.findAll({
            where: { estado },
            include: [
                {
                    model: Docente,
                    as: 'docente',
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

        return res.status(200).json(asignaciones);
    } catch (error) {
        console.error('Error al obtener asignaciones por estado:', error);
        return res.status(500).json({ message: 'Error al obtener asignaciones por estado', error: error.message });
    }
};

// Crear una nueva asignación docente-materia
export const createDocenteMateria = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            docente_id,
            materia_id,
            periodo_academico,
            estado = 'ACTIVO' // Valor por defecto si no se proporciona
        } = req.body;

        // Verificar si el docente existe
        const docente = await Docente.findByPk(docente_id, { transaction });
        if (!docente) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Docente no encontrado' });
        }

        // Verificar si la materia existe
        const materia = await Materia.findByPk(materia_id, { transaction });
        if (!materia) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        // Validar el estado
        const estadosValidos = ['ACTIVO', 'INACTIVO', 'TERMINADO'];
        if (!estadosValidos.includes(estado)) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Estado no válido. Debe ser ACTIVO, INACTIVO o TERMINADO' });
        }

        // Verificar si la asignación ya existe para ese periodo
        const asignacionExistente = await DocenteMateria.findOne({
            where: {
                docente_id,
                materia_id,
                periodo_academico
            },
            transaction
        });

        if (asignacionExistente) {
            await transaction.rollback();
            return res.status(400).json({ message: 'La asignación docente-materia ya existe para este periodo académico' });
        }

        // Crear asignación
        const nuevaAsignacion = await DocenteMateria.create({
            docente_id,
            materia_id,
            periodo_academico,
            estado
        }, { transaction });

        await transaction.commit();

        // Obtener la asignación creada con información completa
        const asignacionCreada = await DocenteMateria.findByPk(nuevaAsignacion.id, {
            include: [
                {
                    model: Docente,
                    as: 'docente',
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

        return res.status(201).json(asignacionCreada);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al crear asignación docente-materia:', error);
        return res.status(500).json({ message: 'Error al crear asignación docente-materia', error: error.message });
    }
};

// Actualizar una asignación docente-materia existente
export const updateDocenteMateria = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;
        const {
            docente_id,
            materia_id,
            periodo_academico,
            estado
        } = req.body;

        // Verificar si la asignación existe
        const asignacion = await DocenteMateria.findByPk(id, { transaction });
        if (!asignacion) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Asignación docente-materia no encontrada' });
        }

        // Si se cambia el docente, verificar que exista
        if (docente_id && docente_id !== asignacion.docente_id) {
            const docente = await Docente.findByPk(docente_id, { transaction });
            if (!docente) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Docente no encontrado' });
            }
        }

        // Si se cambia la materia, verificar que exista
        if (materia_id && materia_id !== asignacion.materia_id) {
            const materia = await Materia.findByPk(materia_id, { transaction });
            if (!materia) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Materia no encontrada' });
            }
        }

        // Validar el estado si se proporciona
        if (estado) {
            const estadosValidos = ['ACTIVO', 'INACTIVO', 'TERMINADO'];
            if (!estadosValidos.includes(estado)) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Estado no válido. Debe ser ACTIVO, INACTIVO o TERMINADO' });
            }
        }

        // Verificar que no exista otra asignación con los mismos datos
        if ((docente_id || asignacion.docente_id) && 
            (materia_id || asignacion.materia_id) && 
            (periodo_academico || asignacion.periodo_academico)) {
            
            const asignacionExistente = await DocenteMateria.findOne({
                where: {
                    docente_id: docente_id || asignacion.docente_id,
                    materia_id: materia_id || asignacion.materia_id,
                    periodo_academico: periodo_academico || asignacion.periodo_academico,
                    id: { [sequelize.Op.ne]: id } // Excluir la asignación actual
                },
                transaction
            });

            if (asignacionExistente) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Ya existe una asignación con esos datos para este periodo académico' });
            }
        }

        // Preparar objeto de actualización
        const updateData = {};

        if (docente_id) updateData.docente_id = docente_id;
        if (materia_id) updateData.materia_id = materia_id;
        if (periodo_academico) updateData.periodo_academico = periodo_academico;
        if (estado) updateData.estado = estado;

        // Actualizar asignación
        await asignacion.update(updateData, { transaction });

        await transaction.commit();

        // Obtener la asignación actualizada
        const asignacionActualizada = await DocenteMateria.findByPk(id, {
            include: [
                {
                    model: Docente,
                    as: 'docente',
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

        return res.status(200).json(asignacionActualizada);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al actualizar asignación docente-materia:', error);
        return res.status(500).json({ message: 'Error al actualizar asignación docente-materia', error: error.message });
    }
};

// Actualizar solo el estado de una asignación docente-materia
export const updateDocenteMateriaEstado = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Verificar si la asignación existe
        const asignacion = await DocenteMateria.findByPk(id, { transaction });
        if (!asignacion) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Asignación docente-materia no encontrada' });
        }

        // Validar el estado
        const estadosValidos = ['ACTIVO', 'INACTIVO', 'TERMINADO'];
        if (!estadosValidos.includes(estado)) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Estado no válido. Debe ser ACTIVO, INACTIVO o TERMINADO' });
        }

        // Actualizar solo el estado
        await asignacion.update({ estado }, { transaction });

        await transaction.commit();

        // Obtener la asignación actualizada
        const asignacionActualizada = await DocenteMateria.findByPk(id, {
            include: [
                {
                    model: Docente,
                    as: 'docente',
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

        return res.status(200).json(asignacionActualizada);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al actualizar estado de asignación docente-materia:', error);
        return res.status(500).json({ message: 'Error al actualizar estado de asignación docente-materia', error: error.message });
    }
};

// Eliminar una asignación docente-materia
export const deleteDocenteMateria = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;

        // Verificar si la asignación existe
        const asignacion = await DocenteMateria.findByPk(id, { transaction });
        if (!asignacion) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Asignación docente-materia no encontrada' });
        }

        // Eliminar la asignación
        await asignacion.destroy({ transaction });

        await transaction.commit();

        return res.status(200).json({ message: 'Asignación docente-materia eliminada correctamente' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error al eliminar asignación docente-materia:', error);
        return res.status(500).json({ message: 'Error al eliminar asignación docente-materia', error: error.message });
    }
};