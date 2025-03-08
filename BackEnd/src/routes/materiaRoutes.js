import express from 'express';
import {
  getAllMaterias,
  getMateriaById,
  createMateria,
  updateMateria,
  deleteMateria
} from '../controllers/materiaController.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Materia:
 *       type: object
 *       required:
 *         - id
 *         - codigo
 *         - nombre
 *         - creditos
 *         - semestre
 *       properties:
 *         id:
 *           type: integer
 *           description: ID personalizado o autogenerado de la materia
 *         codigo:
 *           type: string
 *           description: Código único de la materia
 *         nombre:
 *           type: string
 *           description: Nombre de la materia
 *         creditos:
 *           type: integer
 *           description: Cantidad de créditos de la materia
 *         semestre:
 *           type: integer
 *           description: Semestre en el que se imparte la materia
 *         activo:
 *           type: boolean
 *           description: "Estado de la materia (true: activa, false: desactivada)"
 *       example:
 *         id: 1
 *         codigo: "MAT101"
 *         nombre: "Matemáticas Básicas"
 *         creditos: 3
 *         semestre: 1
 *         activo: true
 *
 * tags:
 *   - name: Materias
 *     description: API para gestión de materias
 */

/**
 * @swagger
 * /api/materias:
 *   get:
 *     summary: Retorna la lista de todas las materias registradas en el sistema.
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de materias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Materia'
 */
router.get('/', verifyToken, getAllMaterias);

/**
 * @swagger
 * /api/materias/{id}:
 *   get:
 *     summary: Retorna la materia especificada por su ID, incluyendo asesorías activas y amigos académicos.
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la materia
 *     responses:
 *       200:
 *         description: Información de la materia
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Materia'
 *       404:
 *         description: Materia no encontrada
 */
router.get('/:id', verifyToken, getMateriaById);

/**
 * @swagger
 * /api/materias:
 *   post:
 *     summary: Crea una nueva materia
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - codigo
 *               - nombre
 *               - creditos
 *               - semestre
 *             properties:
 *               id:
 *                 type: integer
 *               codigo:
 *                 type: string
 *               nombre:
 *                 type: string
 *               creditos:
 *                 type: integer
 *               semestre:
 *                 type: integer
 *               activo:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Materia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Materia'
 *       400:
 *         description: Datos inválidos o código ya registrado
 *       500:
 *         description: Error del servidor
 */
router.post('/', verifyToken, isAdmin, createMateria);

/**
 * @swagger
 * /api/materias/{id}:
 *   put:
 *     summary: Actualiza una materia existente
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la materia a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               nombre:
 *                 type: string
 *               creditos:
 *                 type: integer
 *               semestre:
 *                 type: integer
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Materia actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Materia'
 *       404:
 *         description: Materia no encontrada
 */
router.put('/:id', verifyToken, isAdmin, updateMateria);

/**
 * @swagger
 * /api/materias/{id}:
 *   delete:
 *     summary: Desactiva una materia (eliminación lógica)
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la materia a desactivar
 *     responses:
 *       200:
 *         description: Materia desactivada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Materia desactivada correctamente"
 *       404:
 *         description: Materia no encontrada
 */
router.delete('/:id', verifyToken, isAdmin, deleteMateria);

export default router;
