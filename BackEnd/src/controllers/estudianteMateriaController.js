import { EstudianteMateria, Estudiante, Materia, Usuario } from '../models/index.js';
import sequelize from '../database/connection.js';

// Obtener todas las relaciones estudiante-materia
export const getAllEstudianteMaterias = async (req, res) => {
    try {
        const estudianteMaterias = await EstudianteMateria.findAll({
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
                },
                {
                    model: Materia,
                    as: 'materia'
                }
            ]
        });

        return res.status(200).json(estudianteMaterias);
    } catch (error) {
        console.error('Error al obtener relaciones estudiante-materia:', error);
        return res.status(500).json({ message: 'Error al obtener relaciones estudiante-materia', error: error.message });
    }
};

// Obtener todas las materias de un estudiante
export const getMateriasByEstudiante = async (req, res) => {
    try {
        const { estudiante_id } = req.params;

        const estudianteMaterias = await EstudianteMateria.findAll({
            where: { estudiante_id },
            include: [
                {
                    model: Materia,
                    as: 'materia'
                }
            ]
        });

        return res.status(200).json(estudianteMaterias);
    } catch (error) {
        console.error('Error al obtener materias del estudiante:', error);
        return res.status(500).json({ message: 'Error al obtener materias del estudiante', error: error.message });
    }
};

// Obtener todos los estudiantes de una materia
export const getEstudiantesByMateria = async (req, res) => {
    try {
        const { materia_id } = req.params;

        const estudianteMaterias = await EstudianteMateria.findAll({
            where: { materia_id },
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

        return res.status(200).json(estudianteMaterias);
    } catch (error) {
        console.error('Error al obtener estudiantes de la materia:', error);
        return res.status(500).json({ message: 'Error al obtener estudiantes de la materia', error: error.message });
    }
};

// Obtener una relación estudiante-materia por ID
export const getEstudianteMateriaById = async (req, res) => {
    try {
        const { id } = req.params;

        const estudianteMateria = await EstudianteMateria.findByPk(id, {
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
                },
                {
                    model: Materia,
                    as: 'materia'
                }
            ]
        });

        if (!estudianteMateria) {
            return res.status(404).json({ message: 'Relación estudiante-materia no encontrada' });
        }

        return res.status(200).json(estudianteMateria);
    } catch (error) {
        console.error('Error al obtener relación estudiante-materia:', error);
        return res.status(500).json({ message: 'Error al obtener relación estudiante-materia', error: error.message });
    }
};

// Crear una nueva relación estudiante-materia
export const createEstudianteMateria = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            estudiante_id,
            materia_id,
            periodo_academico,
            estado
        } = req.body;

        // Verificar si el estudiante existe
        const estudiante = await Estudiante.findByPk(estudiante_id, { transaction });
        if (!estudiante) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        // Verificar si la materia existe
        const materia = await Materia.findByPk(materia_id, { transaction });
        if (!materia) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        // Verificar si la relación ya existe
        const relacionExistente = await EstudianteMateria.findOne({
            where: {
                estudiante_id,
                materia_id,
                periodo_academico
            },
            transaction
        });

        if (relacionExistente) {
            await transaction.rollback();
            return res.status(400).json({ message: 'El estudiante ya está inscrito en esta materia para este periodo académico' });
        }

        // Crear nueva relación estudiante-materia
        const nuevaRelacion = await EstudianteMateria.create({
            estudiante_id,
            materia_id,
            periodo_academico,
            estado: estado || 'ACTIVO'
        }, { transaction });

        await transaction.commit();

        // Obtener la relación creada con información completa
        const relacionCreada = await EstudianteMateria.findByPk(nuevaRelacion.id, {
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
                },
                {
                    model: Materia,
                    as: 'materia'
                }
            ]
        });

        return res.status(201).json(relacionCreada);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al crear relación estudiante-materia:', error);
        return res.status(500).json({ message: 'Error al crear relación estudiante-materia', error: error.message });
    }
};

// Actualizar una relación estudiante-materia existente
export const updateEstudianteMateria = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;
        const {
            estudiante_id,
            materia_id,
            periodo_academico,
            estado
        } = req.body;

        // Verificar si la relación existe
        const estudianteMateria = await EstudianteMateria.findByPk(id, { transaction });
        if (!estudianteMateria) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Relación estudiante-materia no encontrada' });
        }

        // Si se va a cambiar estudiante_id, verificar que exista
        if (estudiante_id && estudiante_id !== estudianteMateria.estudiante_id) {
            const estudiante = await Estudiante.findByPk(estudiante_id, { transaction });
            if (!estudiante) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Estudiante no encontrado' });
            }
        }

        // Si se va a cambiar materia_id, verificar que exista
        if (materia_id && materia_id !== estudianteMateria.materia_id) {
            const materia = await Materia.findByPk(materia_id, { transaction });
            if (!materia) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Materia no encontrada' });
            }
        }

        // Si cambian los campos que forman la clave única, verificar que no exista duplicado
        if ((estudiante_id && estudiante_id !== estudianteMateria.estudiante_id) ||
            (materia_id && materia_id !== estudianteMateria.materia_id) ||
            (periodo_academico && periodo_academico !== estudianteMateria.periodo_academico)) {

            const relacionExistente = await EstudianteMateria.findOne({
                where: {
                    estudiante_id: estudiante_id || estudianteMateria.estudiante_id,
                    materia_id: materia_id || estudianteMateria.materia_id,
                    periodo_academico: periodo_academico || estudianteMateria.periodo_academico
                },
                transaction
            });

            if (relacionExistente && relacionExistente.id !== parseInt(id)) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Ya existe esta relación estudiante-materia para este periodo académico' });
            }
        }

        // Preparar objeto de actualización
        const updateData = {};

        if (estudiante_id) updateData.estudiante_id = estudiante_id;
        if (materia_id) updateData.materia_id = materia_id;
        if (periodo_academico) updateData.periodo_academico = periodo_academico;
        if (estado) updateData.estado = estado;

        // Actualizar relación
        await estudianteMateria.update(updateData, { transaction });

        await transaction.commit();

        // Obtener la relación actualizada con información completa
        const relacionActualizada = await EstudianteMateria.findByPk(id, {
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
                },
                {
                    model: Materia,
                    as: 'materia'
                }
            ]
        });

        return res.status(200).json(relacionActualizada);
    } catch (error) {
        await transaction.rollback();
        console.error('Error al actualizar relación estudiante-materia:', error);
        return res.status(500).json({ message: 'Error al actualizar relación estudiante-materia', error: error.message });
    }
};

// Eliminar una relación estudiante-materia
export const deleteEstudianteMateria = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;

        // Verificar si la relación existe
        const estudianteMateria = await EstudianteMateria.findByPk(id, { transaction });
        if (!estudianteMateria) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Relación estudiante-materia no encontrada' });
        }

        // Opción 1: Actualizar estado a 'RETIRADO'
        await estudianteMateria.update({ estado: 'RETIRADO' }, { transaction });

        // Opción 2 (alternativa): Eliminar físicamente el registro
        // await estudianteMateria.destroy({ transaction });

        await transaction.commit();

        return res.status(200).json({ message: 'Estado de matrícula actualizado a RETIRADO correctamente' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error al actualizar estado de matrícula:', error);
        return res.status(500).json({ message: 'Error al actualizar estado de matrícula', error: error.message });
    }
};

// Obtener estudiantes por materia y periodo académico
export const getEstudiantesByMateriaAndPeriodo = async (req, res) => {
    try {
        const { materia_id, periodo_academico } = req.params;

        const estudianteMaterias = await EstudianteMateria.findAll({
            where: {
                materia_id,
                periodo_academico
            },
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

        return res.status(200).json(estudianteMaterias);
    } catch (error) {
        console.error('Error al obtener estudiantes de la materia por periodo:', error);
        return res.status(500).json({ message: 'Error al obtener estudiantes de la materia por periodo', error: error.message });
    }
};