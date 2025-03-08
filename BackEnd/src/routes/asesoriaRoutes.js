import express from 'express';
import {
  getAllAsesorias,
  getAsesoriaById,
  createAsesoria,
  updateAsesoria,
  deleteAsesoria,
  getAsesoriasByDocente,
  getAsesoriasByMateria
} from '../controllers/asesoriaController.js';
import { verifyToken, isDocente } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Asesoria:
 *       type: object
 *       required:
 *         - id
 *         - docente_id
 *         - materia_id
 *         - horario
 *         - ubicacion
 *         - tipo_asesoria
 *       properties:
 *         id:
 *           type: integer
 *           description: ID personalizado o autogenerado de la asesoría
 *         docente_id:
 *           type: integer
 *           description: ID del docente encargado
 *         materia_id:
 *           type: integer
 *           description: ID de la materia asociada
 *         horario:
 *           type: string
 *           description: Horario de la asesoría
 *         ubicacion:
 *           type: string
 *           description: Ubicación física o virtual de la asesoría
 *         tipo_asesoria:
 *           type: string
 *           description: Tipo de asesoría (por ejemplo, "Grupal" o "Individual")
 *         activo:
 *           type: boolean
 *           description: Indica si la asesoría está activa
 *       example:
 *         id: 20
 *         docente_id: 3003
 *         materia_id: 1
 *         horario: "Lunes 10:00-12:00"
 *         ubicacion: "Sala 101"
 *         tipo_asesoria: "Grupal"
 *         activo: true
 *
 * tags:
 *   - name: Asesorías
 *     description: API para gestión de asesorías
 */

/**
 * @swagger
 * /api/asesorias:
 *   get:
 *     summary: Retorna todas las asesorías activas, incluyendo datos del docente (con información del usuario asociado) y de la materia.
 *     tags: [Asesorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asesorías activas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asesoria'
 */
router.get('/', verifyToken, getAllAsesorias);

/**
 * @swagger
 * /api/asesorias/{id}:
 *   get:
 *     summary: Retorna la asesoría especificada por su ID, incluyendo datos del docente, materia y asistencias registradas.
 *     tags: [Asesorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la asesoría
 *     responses:
 *       200:
 *         description: Información de la asesoría
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asesoria'
 *       404:
 *         description: Asesoría no encontrada
 */
router.get('/:id', verifyToken, getAsesoriaById);

/**
 * @swagger
 * /api/asesorias:
 *   post:
 *     summary: Crea una nueva asesoría
 *     tags: [Asesorías]
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
 *               - horario
 *               - ubicacion
 *               - tipo_asesoria
 *             properties:
 *               docente_id:
 *                 type: integer
 *               materia_id:
 *                 type: integer
 *               horario:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               tipo_asesoria:
 *                 type: string
 *               activo:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Asesoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asesoria'
 *       400:
 *         description: Datos inválidos o conflicto de registros
 *       500:
 *         description: Error del servidor
 */
router.post('/', verifyToken, isDocente, createAsesoria);

/**
 * @swagger
 * /api/asesorias/{id}:
 *   put:
 *     summary: Actualiza una asesoría existente
 *     tags: [Asesorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la asesoría a actualizar
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
 *               horario:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               tipo_asesoria:
 *                 type: string
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Asesoría actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asesoria'
 *       404:
 *         description: Asesoría no encontrada
 */
router.put('/:id', verifyToken, isDocente, updateAsesoria);

/**
 * @swagger
 * /api/asesorias/{id}:
 *   delete:
 *     summary: Desactiva una asesoría (eliminación lógica)
 *     tags: [Asesorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la asesoría a desactivar
 *     responses:
 *       200:
 *         description: Asesoría desactivada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Asesoría desactivada correctamente"
 *       404:
 *         description: Asesoría no encontrada
 */
router.delete('/:id', verifyToken, isDocente, deleteAsesoria);

/**
 * @swagger
 * /api/asesorias/docente/{docenteId}:
 *   get:
 *     summary: Retorna todas las asesorías activas asociadas a un docente específico.
 *     tags: [Asesorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: docenteId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del docente
 *     responses:
 *       200:
 *         description: Lista de asesorías del docente
 */
router.get('/docente/:docenteId', verifyToken, getAsesoriasByDocente);

/**
 * @swagger
 * /api/asesorias/materia/{materiaId}:
 *   get:
 *     summary: Retorna todas las asesorías activas asociadas a una materia específica.
 *     tags: [Asesorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: materiaId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la materia
 *     responses:
 *       200:
 *         description: Lista de asesorías de la materia
 */
router.get('/materia/:materiaId', verifyToken, getAsesoriasByMateria);

export default router;
