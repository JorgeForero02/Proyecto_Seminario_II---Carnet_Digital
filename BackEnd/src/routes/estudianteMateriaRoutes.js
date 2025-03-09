import express from 'express';
import {
    getAllEstudianteMaterias,
    getMateriasByEstudiante,
    getEstudiantesByMateria,
    getEstudianteMateriaById,
    createEstudianteMateria,
    updateEstudianteMateria,
    deleteEstudianteMateria,
    getEstudiantesByMateriaAndPeriodo
} from '../controllers/estudianteMateriaController.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     EstudianteMateria:
 *       type: object
 *       required:
 *         - id
 *         - estudiante_id
 *         - materia_id
 *         - periodo_academico
 *         - estado
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la relación estudiante-materia
 *         estudiante_id:
 *           type: integer
 *           description: ID del estudiante
 *         materia_id:
 *           type: integer
 *           description: ID de la materia
 *         periodo_academico:
 *           type: string
 *           description: Periodo académico (ej. '2025-1')
 *         estado:
 *           type: string
 *           description: Estado de la matricula (ACTIVO, RETIRADO)
 *       example:
 *         id: 1
 *         estudiante_id: 5
 *         materia_id: 3
 *         periodo_academico: "2025-1"
 *         estado: "ACTIVO"
 *
 * tags:
 *   - name: EstudianteMateria
 *     description: API para gestión de matrículas de estudiantes en materias
 */

/**
 * @swagger
 * /api/estudiante-materias:
 *   get:
 *     summary: Retorna la lista de todas las relaciones estudiante-materia
 *     tags: [EstudianteMateria]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de relaciones estudiante-materia
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EstudianteMateria'
 */
router.get('/', verifyToken, getAllEstudianteMaterias);

/**
 * @swagger
 * /api/estudiante-materias/{id}:
 *   get:
 *     summary: Retorna una relación estudiante-materia por su ID
 *     tags: [EstudianteMateria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la relación estudiante-materia
 *     responses:
 *       200:
 *         description: Información de la relación estudiante-materia
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstudianteMateria'
 *       404:
 *         description: Relación estudiante-materia no encontrada
 */
router.get('/:id', verifyToken, getEstudianteMateriaById);

/**
 * @swagger
 * /api/estudiante-materias/estudiante/{estudiante_id}:
 *   get:
 *     summary: Retorna todas las materias de un estudiante
 *     tags: [EstudianteMateria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: estudiante_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estudiante
 *     responses:
 *       200:
 *         description: Lista de materias del estudiante
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EstudianteMateria'
 */
router.get('/estudiante/:estudiante_id', verifyToken, getMateriasByEstudiante);

/**
 * @swagger
 * /api/estudiante-materias/materia/{materia_id}:
 *   get:
 *     summary: Retorna todos los estudiantes de una materia
 *     tags: [EstudianteMateria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: materia_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la materia
 *     responses:
 *       200:
 *         description: Lista de estudiantes de la materia
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EstudianteMateria'
 */
router.get('/materia/:materia_id', verifyToken, getEstudiantesByMateria);

/**
 * @swagger
 * /api/estudiante-materias/materia/{materia_id}/periodo/{periodo_academico}:
 *   get:
 *     summary: Retorna todos los estudiantes de una materia por periodo académico
 *     tags: [EstudianteMateria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: materia_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la materia
 *       - in: path
 *         name: periodo_academico
 *         required: true
 *         schema:
 *           type: string
 *         description: Periodo académico (ej. '2025-1')
 *     responses:
 *       200:
 *         description: Lista de estudiantes de la materia por periodo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EstudianteMateria'
 */
router.get('/materia/:materia_id/periodo/:periodo_academico', verifyToken, getEstudiantesByMateriaAndPeriodo);

/**
 * @swagger
 * /api/estudiante-materias:
 *   post:
 *     summary: Crea una nueva relación estudiante-materia
 *     tags: [EstudianteMateria]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estudiante_id
 *               - materia_id
 *               - periodo_academico
 *             properties:
 *               estudiante_id:
 *                 type: integer
 *               materia_id:
 *                 type: integer
 *               periodo_academico:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       201:
 *         description: Relación estudiante-materia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstudianteMateria'
 *       400:
 *         description: Datos inválidos o relación ya existente
 *       404:
 *         description: Estudiante o materia no encontrados
 *       500:
 *         description: Error del servidor
 */
router.post('/', verifyToken, createEstudianteMateria);

/**
 * @swagger
 * /api/estudiante-materias/{id}:
 *   put:
 *     summary: Actualiza una relación estudiante-materia existente
 *     tags: [EstudianteMateria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la relación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estudiante_id:
 *                 type: integer
 *               materia_id:
 *                 type: integer
 *               periodo_academico:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Relación estudiante-materia actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstudianteMateria'
 *       404:
 *         description: Relación, estudiante o materia no encontrada
 */
router.put('/:id', verifyToken, updateEstudianteMateria);

/**
 * @swagger
 * /api/estudiante-materias/{id}:
 *   delete:
 *     summary: Cambia el estado de una relación estudiante-materia a 'RETIRADO'
 *     tags: [EstudianteMateria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la relación a retirar
 *     responses:
 *       200:
 *         description: Estado de matrícula actualizado a RETIRADO correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Estado de matrícula actualizado a RETIRADO correctamente"
 *       404:
 *         description: Relación estudiante-materia no encontrada
 */
router.delete('/:id', verifyToken, deleteEstudianteMateria);

export default router;