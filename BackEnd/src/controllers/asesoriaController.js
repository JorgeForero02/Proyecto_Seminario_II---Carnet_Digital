// controllers/asesoriaController.js
import { Asesoria, Docente, Materia, AsistenciaAsesoria } from '../models/index.js';
import sequelize from '../database/connection.js';

// Obtener todas las asesorías
export const getAllAsesorias = async (req, res) => {
    try {
        const asesorias = await Asesoria.findAll({
            include: [
                {
                    model: Docente,
                    as: 'docente',
                    attributes: ['id', 'departamento', 'especialidad'],
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['nombres', 'apellidos', 'email', 'foto_perfil']
                        }
                    ]
                },
                {
                    model: Materia,
                    as: 'materia',
                    attributes: ['id', 'codigo', 'nombre', 'creditos', 'semestre']
                }
            ],
            where: { activo: true }
        });

        return res.status(200).json(asesorias);
    } catch (error) {
        console.error('Error al obtener asesorías:', error);
        return res.status(500).json({ message: 'Error al obtener asesorías', error: error.message });
    }
};

// Obtener una asesoría por ID
export const getAsesoriaById = async (req, res) => {
    try {
        const { id } = req.params;

        const asesoria = await Asesoria.findByPk(id, {
            include: [
                {
                    model: Docente,
                    as: 'docente',
                    attributes: ['id', 'departamento', 'especialidad'],
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['nombres', 'apellidos', 'email', 'foto_perfil']
                        }
                    ]
                },
                {
                    model: Materia,
                    as: 'materia',
                    attributes: ['id', 'codigo', 'nombre', 'creditos', 'semestre']
                },
                {
                    model: AsistenciaAsesoria,
                    as: 'asistencias',
                    include: [
                        {
                            model: Estudiante,
                            as: 'estudiante',
                            include: [
                                {
                                    model: Usuario,
                                    as: 'usuario',
                                    attributes: ['nombres', 'apellidos', 'email']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!asesoria) {
            return res.status(404).json({ message: 'Asesoría no encontrada' });
        }

        return res.status(200).json(asesoria);
    } catch (error) {
        console.error('Error al obtener asesoría:', error);
        return res.status(500).json({ message: 'Error al obtener asesoría', error: error.message });
    }
};

// Crear una nueva asesoría
export const createAsesoria = async (req, res) => {
    try {
        const {
            docente_id,
            materia_id,
            horario,
            ubicacion,
            tipo_asesoria,
            activo
        } = req.body;

        // Verificar si el docente existe
        const docente = await Docente.findByPk(docente_id);
        if (!docente) {
            return res.status(404).json({ message: 'Docente no encontrado' });
        }

        // Verificar si la materia existe
        const materia = await Materia.findByPk(materia_id);
        if (!materia) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        // Crear asesoría
        const nuevaAsesoria = await Asesoria.create({
            docente_id,
            materia_id,
            horario,
            ubicacion,
            tipo_asesoria,
            activo: activo !== undefined ? activo : true
        });

        // Obtener la asesoría creada con relaciones
        const asesoriaCreada = await Asesoria.findByPk(nuevaAsesoria.id, {
            include: [
                {
                    model: Docente,
                    as: 'docente',
                    attributes: ['id', 'departamento', 'especialidad'],
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['nombres', 'apellidos', 'email']
                        }
                    ]
                },
                {
                    model: Materia,
                    as: 'materia',
                    attributes: ['id', 'codigo', 'nombre']
                }
            ]
        });

        return res.status(201).json(asesoriaCreada);
    } catch (error) {
        console.error('Error al crear asesoría:', error);
        return res.status(500).json({ message: 'Error al crear asesoría', error: error.message });
    }
};

// Actualizar una asesoría existente
export const updateAsesoria = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            docente_id,
            materia_id,
            horario,
            ubicacion,
            tipo_asesoria,
            activo
        } = req.body;

        // Verificar si la asesoría existe
        const asesoria = await Asesoria.findByPk(id);
        if (!asesoria) {
            return res.status(404).json({ message: 'Asesoría no encontrada' });
        }

        // Si se están actualizando las relaciones, verificar que existan
        if (docente_id) {
            const docente = await Docente.findByPk(docente_id);
            if (!docente) {
                return res.status(404).json({ message: 'Docente no encontrado' });
            }
        }

        if (materia_id) {
            const materia = await Materia.findByPk(materia_id);
            if (!materia) {
                return res.status(404).json({ message: 'Materia no encontrada' });
            }
        }

        // Preparar objeto de actualización
        const updateData = {};

        if (docente_id) updateData.docente_id = docente_id;
        if (materia_id) updateData.materia_id = materia_id;
        if (horario) updateData.horario = horario;
        if (ubicacion) updateData.ubicacion = ubicacion;
        if (tipo_asesoria) updateData.tipo_asesoria = tipo_asesoria;
        if (activo !== undefined) updateData.activo = activo;

        // Actualizar asesoría
        await asesoria.update(updateData);

        // Obtener asesoría actualizada
        const asesoriaActualizada = await Asesoria.findByPk(id, {
            include: [
                {
                    model: Docente,
                    as: 'docente',
                    attributes: ['id', 'departamento', 'especialidad'],
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['nombres', 'apellidos', 'email']
                        }
                    ]
                },
                {
                    model: Materia,
                    as: 'materia',
                    attributes: ['id', 'codigo', 'nombre']
                }
            ]
        });

        return res.status(200).json(asesoriaActualizada);
    } catch (error) {
        console.error('Error al actualizar asesoría:', error);
        return res.status(500).json({ message: 'Error al actualizar asesoría', error: error.message });
    }
};

// Eliminar una asesoría (desactivación lógica)
export const deleteAsesoria = async (req, res) => {
    try {
        const { id } = req.params;

        const asesoria = await Asesoria.findByPk(id);
        if (!asesoria) {
            return res.status(404).json({ message: 'Asesoría no encontrada' });
        }

        // Desactivar la asesoría en lugar de eliminarla físicamente
        await asesoria.update({ activo: false });

        return res.status(200).json({ message: 'Asesoría desactivada correctamente' });
    } catch (error) {
        console.error('Error al desactivar asesoría:', error);
        return res.status(500).json({ message: 'Error al desactivar asesoría', error: error.message });
    }
};

// Obtener asesorías por docente
export const getAsesoriasByDocente = async (req, res) => {
    try {
        const { docenteId } = req.params;

        // Verificar si el docente existe
        const docente = await Docente.findByPk(docenteId);
        if (!docente) {
            return res.status(404).json({ message: 'Docente no encontrado' });
        }

        const asesorias = await Asesoria.findAll({
            where: {
                docente_id: docenteId,
                activo: true
            },
            include: [
                {
                    model: Materia,
                    as: 'materia',
                    attributes: ['id', 'codigo', 'nombre', 'creditos', 'semestre']
                }
            ]
        });

        return res.status(200).json(asesorias);
    } catch (error) {
        console.error('Error al obtener asesorías del docente:', error);
        return res.status(500).json({ message: 'Error al obtener asesorías del docente', error: error.message });
    }
};

// Obtener asesorías por materia
export const getAsesoriasByMateria = async (req, res) => {
    try {
        const { materiaId } = req.params;

        // Verificar si la materia existe
        const materia = await Materia.findByPk(materiaId);
        if (!materia) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        const asesorias = await Asesoria.findAll({
            where: {
                materia_id: materiaId,
                activo: true
            },
            include: [
                {
                    model: Docente,
                    as: 'docente',
                    attributes: ['id', 'departamento', 'especialidad'],
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['nombres', 'apellidos', 'email', 'foto_perfil']
                        }
                    ]
                }
            ]
        });

        return res.status(200).json(asesorias);
    } catch (error) {
        console.error('Error al obtener asesorías de la materia:', error);
        return res.status(500).json({ message: 'Error al obtener asesorías de la materia', error: error.message });
    }
};
