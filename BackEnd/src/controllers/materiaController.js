// controllers/materiaController.js
import { Materia, Asesoria, AmigoAcademico } from '../models/index.js';

// Obtener todas las materias
export const getAllMaterias = async (req, res) => {
    try {
        const materias = await Materia.findAll();
        return res.status(200).json(materias);
    } catch (error) {
        console.error('Error al obtener materias:', error);
        return res.status(500).json({ message: 'Error al obtener materias', error: error.message });
    }
};

// Obtener una materia por ID
export const getMateriaById = async (req, res) => {
    try {
        const { id } = req.params;

        const materia = await Materia.findByPk(id, {
            include: [
                {
                    model: Asesoria,
                    as: 'asesorias',
                    where: { activo: true },
                    required: false
                },
                {
                    model: AmigoAcademico,
                    as: 'amigosAcademicos',
                    required: false
                }
            ]
        });

        if (!materia) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        return res.status(200).json(materia);
    } catch (error) {
        console.error('Error al obtener materia:', error);
        return res.status(500).json({ message: 'Error al obtener materia', error: error.message });
    }
};

// Crear una nueva materia
export const createMateria = async (req, res) => {
    try {
        const {
            codigo,
            nombre,
            creditos,
            semestre,
            activo
        } = req.body;

        // Verificar si el código ya existe
        const codigoExists = await Materia.findOne({ where: { codigo } });
        if (codigoExists) {
            return res.status(400).json({ message: 'El código de materia ya está registrado' });
        }

        // Crear materia
        const nuevaMateria = await Materia.create({
            codigo,
            nombre,
            creditos,
            semestre,
            activo: activo !== undefined ? activo : true
        });

        return res.status(201).json(nuevaMateria);
    } catch (error) {
        console.error('Error al crear materia:', error);
        return res.status(500).json({ message: 'Error al crear materia', error: error.message });
    }
};

// Actualizar una materia existente
export const updateMateria = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            codigo,
            nombre,
            creditos,
            semestre,
            activo
        } = req.body;

        // Verificar si la materia existe
        const materia = await Materia.findByPk(id);
        if (!materia) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        // Si se está actualizando el código, verificar que no exista ya
        if (codigo && codigo !== materia.codigo) {
            const codigoExists = await Materia.findOne({ where: { codigo } });
            if (codigoExists) {
                return res.status(400).json({ message: 'El código de materia ya está registrado' });
            }
        }

        // Preparar objeto de actualización
        const updateData = {};

        if (codigo) updateData.codigo = codigo;
        if (nombre) updateData.nombre = nombre;
        if (creditos !== undefined) updateData.creditos = creditos;
        if (semestre) updateData.semestre = semestre;
        if (activo !== undefined) updateData.activo = activo;

        // Actualizar materia
        await materia.update(updateData);

        // Obtener materia actualizada
        const materiaActualizada = await Materia.findByPk(id);

        return res.status(200).json(materiaActualizada);
    } catch (error) {
        console.error('Error al actualizar materia:', error);
        return res.status(500).json({ message: 'Error al actualizar materia', error: error.message });
    }
};

// Eliminar una materia (desactivación lógica)
export const deleteMateria = async (req, res) => {
    try {
        const { id } = req.params;

        const materia = await Materia.findByPk(id);
        if (!materia) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        // Desactivar la materia en lugar de eliminarla físicamente
        await materia.update({ activo: false });

        return res.status(200).json({ message: 'Materia desactivada correctamente' });
    } catch (error) {
        console.error('Error al desactivar materia:', error);
        return res.status(500).json({ message: 'Error al desactivar materia', error: error.message });
    }
};