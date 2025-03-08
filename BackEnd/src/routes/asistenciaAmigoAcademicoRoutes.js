import express from 'express';
import {
  getAllAsistencias,
  getAsistenciaById,
  getAsistenciasByAmigoAcademico,
  getAsistenciasByEstudiante,
  createAsistencia,
  updateAsistencia,
  validarAsistencia,
  deleteAsistencia
} from '../controllers/asistenciaAmigoAcademicoController.js';
import { verifyToken, isDocente, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AsistenciaAmigoAcademico:
 *       type: object
 *       required:
 *         - id
 *         - amigo_academico_id
 *         - estudiante_id
 *         - fecha_hora
 *       properties:
 *         id:
 *           type: integer
 *           description: ID personalizado o autogenerado de la asistencia
 *         amigo_academico_id:
 *           type: integer
 *           description: ID del amigo académico
 *         estudiante_id:
 *           type: integer
 *           description: ID del estudiante
 *         fecha_hora:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la asistencia
 *         comentarios:
 *           type: string
 *           description: Comentarios adicionales
 *         validado:
 *           type: boolean
 *           description: Indica si la asistencia ha sido validada
 *       example:
 *         id: 5
 *         amigo_academico_id: 10
 *         estudiante_id: 2002
 *         fecha_hora: "2025-03-07T09:00:00.000Z"
 *         comentarios: "Asistencia registrada"
 *         validado: false
 *
 * tags:
 *   - name: Asistencias a Amigos Académicos
 *     description: API para gestionar registros de asistencia a amigos académicos
 */

/**
 * @swagger
 * /api/asistencias_amigos_academicos:
 *   get:
 *     summary: Retorna la lista de todas las asistencias registradas para amigos académicos.
 *     tags: [Asistencias a Amigos Académicos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asistencias a amigos académicos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AsistenciaAmigoAcademico'
 */
router.get('/', verifyToken, getAllAsistencias);

/**
 * @swagger
 * /api/asistencias_amigos_academicos/{id}:
 *   get:
 *     summary: Retorna el registro de asistencia identificado por su ID.
 *     tags: [Asistencias a Amigos Académicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia a amigos académicos
 *     responses:
 *       200:
 *         description: Información del registro de asistencia.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsistenciaAmigoAcademico'
 *       404:
 *         description: Registro de asistencia no encontrado.
 */
router.get('/:id', verifyToken, getAsistenciaById);

/**
 * @swagger
 * /api/asistencias_amigos_academicos/amigo-academico/{amigoAcademicoId}:
 *   get:
 *     summary: Retorna todas las asistencias asociadas a un amigo académico específico.
 *     tags: [Asistencias a Amigos Académicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: amigoAcademicoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del amigo académico
 *     responses:
 *       200:
 *         description: Lista de asistencias para el amigo académico.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AsistenciaAmigoAcademico'
 */
router.get('/amigo-academico/:amigoAcademicoId', verifyToken, getAsistenciasByAmigoAcademico);

/**
 * @swagger
 * /api/asistencias_amigos_academicos/estudiante/{estudianteId}:
 *   get:
 *     summary: Retorna todas las asistencias registradas para un estudiante específico.
 *     tags: [Asistencias a Amigos Académicos]
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
 *         description: Lista de asistencias para el estudiante.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AsistenciaAmigoAcademico'
 */
router.get('/estudiante/:estudianteId', verifyToken, getAsistenciasByEstudiante);

/**
 * @swagger
 * /api/asistencias_amigos_academicos:
 *   post:
 *     summary: Crea un nuevo registro de asistencia para un amigo académico.
 *     tags: [Asistencias a Amigos Académicos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amigo_academico_id
 *               - estudiante_id
 *               - fecha_hora
 *             properties:
 *               amigo_academico_id:
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
 *         description: Registro de asistencia creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsistenciaAmigoAcademico'
 *       400:
 *         description: Datos inválidos o registro duplicado.
 *       500:
 *         description: Error del servidor.
 */
router.post('/', verifyToken, createAsistencia);

/**
 * @swagger
 * /api/asistencias_amigos_academicos/{id}:
 *   put:
 *     summary: Actualiza un registro de asistencia para un amigo académico existente.
 *     tags: [Asistencias a Amigos Académicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia a actualizar.
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
 *         description: Registro de asistencia actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsistenciaAmigoAcademico'
 *       404:
 *         description: Registro de asistencia no encontrado.
 *       400:
 *         description: Datos inválidos o registro duplicado.
 */
router.put('/:id', verifyToken, updateAsistencia);

/**
 * @swagger
 * /api/asistencias_amigos_academicos/{id}/validar:
 *   patch:
 *     summary: Marca el registro de asistencia como validado.
 *     tags: [Asistencias a Amigos Académicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia a validar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               validado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Asistencia validada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Asistencia validada correctamente"
 *       404:
 *         description: Registro de asistencia no encontrado.
 */
router.patch('/:id/validar', verifyToken, isDocente, validarAsistencia);

/**
 * @swagger
 * /api/asistencias_amigos_academicos/{id}:
 *   delete:
 *     summary: Elimina definitivamente un registro de asistencia.
 *     tags: [Asistencias a Amigos Académicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia a eliminar.
 *     responses:
 *       200:
 *         description: Asistencia eliminada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Asistencia eliminada correctamente"
 *       404:
 *         description: Registro de asistencia no encontrado.
 */
router.delete('/:id', verifyToken, isAdmin, deleteAsistencia);

export default router;
