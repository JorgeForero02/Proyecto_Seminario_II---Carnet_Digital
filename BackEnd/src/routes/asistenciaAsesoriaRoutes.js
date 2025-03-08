import express from 'express';
import {
  getAllAsistenciasAsesorias,
  getAsistenciaAsesoriaById,
  getAsistenciasByAsesoriaId,
  getAsistenciasByEstudianteId,
  createAsistenciaAsesoria,
  updateAsistenciaAsesoria,
  validarAsistenciaAsesoria,
  deleteAsistenciaAsesoria
} from '../controllers/asistenciaAsesoriaController.js';
import { verifyToken, isDocente, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AsistenciaAsesoria:
 *       type: object
 *       required:
 *         - id
 *         - asesoria_id
 *         - estudiante_id
 *         - fecha_hora
 *       properties:
 *         id:
 *           type: integer
 *           description: ID personalizado o autogenerado del registro de asistencia a asesoría
 *         asesoria_id:
 *           type: integer
 *           description: ID de la asesoría
 *         estudiante_id:
 *           type: integer
 *           description: ID del estudiante
 *         fecha_hora:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del registro de asistencia
 *         comentarios:
 *           type: string
 *           description: Comentarios adicionales
 *         validado:
 *           type: boolean
 *           description: Indica si la asistencia ha sido validada
 *       example:
 *         id: 15
 *         asesoria_id: 20
 *         estudiante_id: 2002
 *         fecha_hora: "2025-03-07T09:00:00.000Z"
 *         comentarios: "Presente"
 *         validado: false
 *
 * tags:
 *   - name: Asistencias a Asesorías
 *     description: API para gestionar registros de asistencia a asesorías
 */

/**
 * @swagger
 * /api/asistencias_asesorias:
 *   get:
 *     summary: Retorna la lista de todas las asistencias a asesorías, incluyendo la información de la asesoría y del estudiante.
 *     tags: [Asistencias a Asesorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asistencias a asesorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AsistenciaAsesoria'
 */
router.get('/', verifyToken, getAllAsistenciasAsesorias);

/**
 * @swagger
 * /api/asistencias_asesorias/{id}:
 *   get:
 *     summary: Retorna un registro de asistencia a asesoría específico, con la información de la asesoría y del estudiante.
 *     tags: [Asistencias a Asesorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia a asesoría
 *     responses:
 *       200:
 *         description: Información del registro de asistencia a asesoría
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsistenciaAsesoria'
 *       404:
 *         description: Registro de asistencia no encontrado
 */
router.get('/:id', verifyToken, getAsistenciaAsesoriaById);

/**
 * @swagger
 * /api/asistencias_asesorias/asesoria/{asesoriaId}:
 *   get:
 *     summary: Retorna todas las asistencias asociadas a una asesoría específica.
 *     tags: [Asistencias a Asesorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: asesoriaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asesoría
 *     responses:
 *       200:
 *         description: Lista de asistencias para la asesoría
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AsistenciaAsesoria'
 */
router.get('/asesoria/:asesoriaId', verifyToken, getAsistenciasByAsesoriaId);

/**
 * @swagger
 * /api/asistencias_asesorias/estudiante/{estudianteId}:
 *   get:
 *     summary: Retorna todas las asistencias registradas por un estudiante específico, incluyendo la asesoría asociada.
 *     tags: [Asistencias a Asesorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: estudianteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estudiante
 *     responses:
 *       200:
 *         description: Lista de asistencias para el estudiante
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AsistenciaAsesoria'
 */
router.get('/estudiante/:estudianteId', verifyToken, getAsistenciasByEstudianteId);

/**
 * @swagger
 * /api/asistencias_asesorias:
 *   post:
 *     summary: Crea un nuevo registro de asistencia a asesoría.
 *     tags: [Asistencias a Asesorías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - asesoria_id
 *               - estudiante_id
 *               - fecha_hora
 *             properties:
 *               asesoria_id:
 *                 type: integer
 *               estudiante_id:
 *                 type: integer
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *               comentarios:
 *                 type: string
 *               validado:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Registro de asistencia a asesoría creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsistenciaAsesoria'
 *       400:
 *         description: Datos inválidos o registro duplicado
 *       500:
 *         description: Error del servidor
 */
router.post('/', verifyToken, createAsistenciaAsesoria);

/**
 * @swagger
 * /api/asistencias_asesorias/{id}:
 *   put:
 *     summary: Actualiza un registro de asistencia a asesoría existente.
 *     tags: [Asistencias a Asesorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia a asesoría a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *               comentarios:
 *                 type: string
 *               validado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Registro de asistencia a asesoría actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsistenciaAsesoria'
 *       404:
 *         description: Registro de asistencia no encontrado
 */
router.put('/:id', verifyToken, updateAsistenciaAsesoria);

/**
 * @swagger
 * /api/asistencias_asesorias/{id}/validar:
 *   put:
 *     summary: Marca el registro de asistencia a asesoría como validado.
 *     tags: [Asistencias a Asesorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia a asesoría a validar
 *     responses:
 *       200:
 *         description: Asistencia validada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Asistencia validada correctamente"
 *       404:
 *         description: Registro de asistencia no encontrado
 */
router.put('/:id/validar', verifyToken, isDocente, validarAsistenciaAsesoria);

/**
 * @swagger
 * /api/asistencias_asesorias/{id}:
 *   delete:
 *     summary: Elimina definitivamente un registro de asistencia a asesoría.
 *     tags: [Asistencias a Asesorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia a asesoría a eliminar
 *     responses:
 *       200:
 *         description: Asistencia eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Asistencia eliminada correctamente"
 *       404:
 *         description: Registro de asistencia no encontrado
 */
router.delete('/:id', verifyToken, isDocente, deleteAsistenciaAsesoria);

export default router;
