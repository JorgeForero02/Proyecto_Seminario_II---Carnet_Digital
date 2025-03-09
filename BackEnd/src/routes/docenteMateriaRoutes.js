import express from 'express';
import {
    getAllDocenteMaterias,
    getDocenteMateriaById,
    getAsignacionesByDocente,
    getDocentesByMateria,
    getAsignacionesByEstado,
    createDocenteMateria,
    updateDocenteMateria,
    updateDocenteMateriaEstado,
    deleteDocenteMateria
} from '../controllers/docenteMateriaController.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DocenteMateria:
 *       type: object
 *       required:
 *         - id
 *         - docente_id
 *         - materia_id
 *         - periodo_academico
 *         - estado
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado o personalizado de la asignación docente-materia
 *         docente_id:
 *           type: integer
 *           description: ID del docente asignado
 *         materia_id:
 *           type: integer
 *           description: ID de la materia asignada
 *         periodo_academico:
 *           type: string
 *           description: Periodo académico de la asignación
 *         estado:
 *           type: string
 *           description: Estado de la asignación (ACTIVO, INACTIVO, TERMINADO)
 *           enum: [ACTIVO, INACTIVO, TERMINADO]
 *           default: ACTIVO
 *       example:
 *         id: 1
 *         docente_id: 3003
 *         materia_id: 1
 *         periodo_academico: "2025-1"
 *         estado: "ACTIVO"
 *
 * tags:
 *   - name: DocenteMateria
 *     description: API para la gestión de asignaciones de docentes a materias
 */

/**
 * @swagger
 * /api/docente_materias:
 *   get:
 *     summary: Obtiene todas las asignaciones docente-materia, incluyendo datos completos del docente (con usuario) y de la materia.
 *     tags: [DocenteMateria]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones docente-materia.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DocenteMateria'
 */
router.get('/', verifyToken, getAllDocenteMaterias);

/**
 * @swagger
 * /api/docente_materias/{id}:
 *   get:
 *     summary: Obtiene una asignación docente-materia por ID.
 *     tags: [DocenteMateria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación docente-materia.
 *     responses:
 *       200:
 *         description: Información de la asignación docente-materia.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocenteMateria'
 *       404:
 *         description: Asignación docente-materia no encontrada.
 */
router.get('/:id', verifyToken, getDocenteMateriaById);

/**
 * @swagger
 * /api/docente_materias/docente/{docenteId}:
 *   get:
 *     summary: Obtiene todas las asignaciones para un docente específico.
 *     tags: [DocenteMateria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: docenteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del docente.
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [ACTIVO, INACTIVO, TERMINADO]
 *         description: Filtrar por estado (opcional).
 *     responses:
 *       200:
 *         description: Lista de asignaciones para el docente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DocenteMateria'
 */
router.get('/docente/:docenteId', verifyToken, getAsignacionesByDocente);

/**
 * @swagger
 * /api/docente_materias/materia/{materiaId}:
 *   get:
 *     summary: Obtiene las asignaciones (docentes) para una materia específica.
 *     tags: [DocenteMateria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: materiaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la materia.
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [ACTIVO, INACTIVO, TERMINADO]
 *         description: Filtrar por estado (opcional).
 *     responses:
 *       200:
 *         description: Lista de asignaciones para la materia.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DocenteMateria'
 */
router.get('/materia/:materiaId', verifyToken, getDocentesByMateria);

/**
 * @swagger
 * /api/docente_materias/estado/{estado}:
 *   get:
 *     summary: Obtiene todas las asignaciones por estado.
 *     tags: [DocenteMateria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ACTIVO, INACTIVO, TERMINADO]
 *         description: Estado de las asignaciones a buscar.
 *     responses:
 *       200:
 *         description: Lista de asignaciones con el estado especificado.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DocenteMateria'
 */
router.get('/estado/:estado', verifyToken, getAsignacionesByEstado);

/**
 * @swagger
 * /api/docente_materias:
 *   post:
 *     summary: Crea una nueva asignación docente-materia.
 *     tags: [DocenteMateria]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - docente_id
 *               - materia_id
 *               - periodo_academico
 *             properties:
 *               docente_id:
 *                 type: integer
 *               materia_id:
 *                 type: integer
 *               periodo_academico:
 *                 type: string
 *               estado:
 *                 type: string
 *                 enum: [ACTIVO, INACTIVO, TERMINADO]
 *                 default: ACTIVO
 *     responses:
 *       201:
 *         description: Asignación creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocenteMateria'
 *       400:
 *         description: Datos inválidos o asignación ya existe para ese periodo académico.
 *       500:
 *         description: Error del servidor.
 */
router.post('/', verifyToken, isAdmin, createDocenteMateria);

/**
 * @swagger
 * /api/docente_materias/{id}:
 *   put:
 *     summary: Actualiza una asignación docente-materia existente.
 *     tags: [DocenteMateria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               docente_id:
 *                 type: integer
 *               materia_id:
 *                 type: integer
 *               periodo_academico:
 *                 type: string
 *               estado:
 *                 type: string
 *                 enum: [ACTIVO, INACTIVO, TERMINADO]
 *     responses:
 *       200:
 *         description: Asignación actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocenteMateria'
 *       404:
 *         description: Asignación no encontrada.
 *       400:
 *         description: Datos inválidos o conflicto en la actualización.
 */
router.put('/:id', verifyToken, isAdmin, updateDocenteMateria);

/**
 * @swagger
 * /api/docente_materias/{id}/estado:
 *   patch:
 *     summary: Actualiza únicamente el estado de una asignación docente-materia.
 *     tags: [DocenteMateria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [ACTIVO, INACTIVO, TERMINADO]
 *     responses:
 *       200:
 *         description: Estado de la asignación actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocenteMateria'
 *       404:
 *         description: Asignación no encontrada.
 *       400:
 *         description: Estado inválido.
 */
router.patch('/:id/estado', verifyToken, isAdmin, updateDocenteMateriaEstado);

/**
 * @swagger
 * /api/docente_materias/{id}:
 *   delete:
 *     summary: Elimina una asignación docente-materia.
 *     tags: [DocenteMateria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación a eliminar.
 *     responses:
 *       200:
 *         description: Asignación eliminada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Asignación docente-materia eliminada correctamente"
 *       404:
 *         description: Asignación no encontrada.
 */
router.delete('/:id', verifyToken, isAdmin, deleteDocenteMateria);

export default router;