import express from 'express';
import {
  getAllAsistenciasClase,
  getAsistenciaClaseById,
  getAsistenciasByEstudiante,
  getAsistenciasByMateria,
  getAsistenciasByDocente,
  createAsistenciaClase,
  updateAsistenciaClase,
  deleteAsistenciaClase
} from '../controllers/asistenciaClaseController.js';
import { verifyToken, isDocente, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AsistenciaClase:
 *       type: object
 *       required:
 *         - id
 *         - estudiante_id
 *         - materia_id
 *         - docente_id
 *         - fecha
 *         - hora_inicio
 *         - hora_fin
 *         - estado
 *       properties:
 *         id:
 *           type: integer
 *           description: ID personalizado o autogenerado del registro de asistencia a clase
 *         estudiante_id:
 *           type: integer
 *           description: ID del estudiante
 *         materia_id:
 *           type: integer
 *           description: ID de la materia
 *         docente_id:
 *           type: integer
 *           description: ID del docente
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha de la clase
 *         hora_inicio:
 *           type: string
 *           description: Hora de inicio de la clase
 *         hora_fin:
 *           type: string
 *           description: Hora de finalización de la clase
 *         estado:
 *           type: string
 *           description: Estado de asistencia (por ejemplo, "Presente")
 *         observaciones:
 *           type: string
 *           description: Observaciones adicionales
 *       example:
 *         id: 30
 *         estudiante_id: 2002
 *         materia_id: 1
 *         docente_id: 3003
 *         fecha: "2025-03-07"
 *         hora_inicio: "08:00:00"
 *         hora_fin: "10:00:00"
 *         estado: "Presente"
 *         observaciones: "Llegó puntual"
 *
 * tags:
 *   - name: Asistencias a Clases
 *     description: API para gestionar registros de asistencia a clases
 */

/**
 * @swagger
 * /api/asistencias_clases:
 *   get:
 *     summary: Retorna la lista de todas las asistencias a clases, ordenadas por fecha y hora de inicio (descendente).
 *     tags: [Asistencias a Clases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de registros de asistencia a clases.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AsistenciaClase'
 */
router.get('/', verifyToken, getAllAsistenciasClase);

/**
 * @swagger
 * /api/asistencias_clases/{id}:
 *   get:
 *     summary: Retorna un registro de asistencia a clase específico, junto con la información del estudiante, materia y docente.
 *     tags: [Asistencias a Clases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia a clase.
 *     responses:
 *       200:
 *         description: Información del registro de asistencia a clase.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsistenciaClase'
 *       404:
 *         description: Registro de asistencia no encontrado.
 */
router.get('/:id', verifyToken, getAsistenciaClaseById);

/**
 * @swagger
 * /api/asistencias_clases/estudiante/{estudiante_id}:
 *   get:
 *     summary: Retorna todas las asistencias asociadas a un estudiante específico.
 *     tags: [Asistencias a Clases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: estudiante_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estudiante.
 *     responses:
 *       200:
 *         description: Lista de asistencias para el estudiante.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AsistenciaClase'
 */
router.get('/estudiante/:estudiante_id', verifyToken, getAsistenciasByEstudiante);

/**
 * @swagger
 * /api/asistencias_clases/materia/{materia_id}:
 *   get:
 *     summary: Retorna todas las asistencias registradas para una materia específica.
 *     tags: [Asistencias a Clases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: materia_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la materia.
 *     responses:
 *       200:
 *         description: Lista de asistencias para la materia.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AsistenciaClase'
 */
router.get('/materia/:materia_id', verifyToken, getAsistenciasByMateria);

/**
 * @swagger
 * /api/asistencias_clases/docente/{docente_id}:
 *   get:
 *     summary: Retorna todas las asistencias registradas para un docente específico.
 *     tags: [Asistencias a Clases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: docente_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del docente.
 *     responses:
 *       200:
 *         description: Lista de asistencias para el docente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AsistenciaClase'
 */
router.get('/docente/:docente_id', verifyToken, getAsistenciasByDocente);

/**
 * @swagger
 * /api/asistencias_clases:
 *   post:
 *     summary: Crea un nuevo registro de asistencia a clase.
 *     tags: [Asistencias a Clases]
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
 *               - docente_id
 *               - fecha
 *               - hora_inicio
 *               - hora_fin
 *               - estado
 *             properties:
 *               estudiante_id:
 *                 type: integer
 *               materia_id:
 *                 type: integer
 *               docente_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *               hora_inicio:
 *                 type: string
 *               hora_fin:
 *                 type: string
 *               estado:
 *                 type: string
 *               observaciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registro de asistencia creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsistenciaClase'
 *       400:
 *         description: Datos inválidos o registro duplicado.
 *       500:
 *         description: Error del servidor.
 */
router.post('/', verifyToken, isDocente, createAsistenciaClase);

/**
 * @swagger
 * /api/asistencias_clases/{id}:
 *   put:
 *     summary: Actualiza un registro de asistencia a clase existente.
 *     tags: [Asistencias a Clases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia a clase
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *               hora_inicio:
 *                 type: string
 *               hora_fin:
 *                 type: string
 *               estado:
 *                 type: string
 *               observaciones:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registro de asistencia actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsistenciaClase'
 *       404:
 *         description: Registro de asistencia no encontrado.
 *       400:
 *         description: Datos inválidos o registro duplicado.
 */
router.put('/:id', verifyToken, isDocente, updateAsistenciaClase);

/**
 * @swagger
 * /api/asistencias_clases/{id}:
 *   delete:
 *     summary: Elimina de forma definitiva un registro de asistencia a clase.
 *     tags: [Asistencias a Clases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia a clase
 *     responses:
 *       200:
 *         description: Registro de asistencia eliminado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registro de asistencia eliminado correctamente"
 *       404:
 *         description: Registro de asistencia no encontrado.
 */
router.delete('/:id', verifyToken, isAdmin, deleteAsistenciaClase);

export default router;
