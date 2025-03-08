import express from 'express';
import {
    getAllAmigosAcademicos,
    getActiveAmigosAcademicos,
    getAmigoAcademicoById,
    getAmigoAcademicoByEstudianteId,
    getAmigoAcademicoByMateriaId,
    createAmigoAcademico,
    updateAmigoAcademico,
    toggleActivoAmigoAcademico,
    deleteAmigoAcademico
} from '../controllers/amigoAcademicoController.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AmigoAcademico:
 *       type: object
 *       required:
 *         - id
 *         - estudiante_monitor_id
 *         - materia_id
 *         - horario
 *         - ubicacion
 *         - cupo_maximo
 *       properties:
 *         id:
 *           type: integer
 *           description: ID personalizado o autogenerado del registro de amigo académico
 *         estudiante_monitor_id:
 *           type: integer
 *           description: ID del estudiante que actúa como monitor
 *         materia_id:
 *           type: integer
 *           description: ID de la materia asociada
 *         horario:
 *           type: string
 *           description: Horario en el que se realiza la actividad (por ejemplo, "Miércoles 09:00-11:00")
 *         ubicacion:
 *           type: string
 *           description: Ubicación (por ejemplo, "Aula 3B")
 *         cupo_maximo:
 *           type: integer
 *           description: Número máximo de participantes
 *         activo:
 *           type: boolean
 *           description: "Estado del registro (true: activo, false: inactivo)"
 *       example:
 *         id: 10
 *         estudiante_monitor_id: 2002
 *         materia_id: 1
 *         horario: "Miércoles 09:00-11:00"
 *         ubicacion: "Aula 3B"
 *         cupo_maximo: 20
 *         activo: true
 *
 * tags:
 *   - name: Amigos Académicos
 *     description: API para gestión de amigos académicos y sus registros
 */

/**
 * @swagger
 * /api/amigos_academicos:
 *   get:
 *     summary: Retorna la lista de todos los amigos académicos, incluyendo datos del monitor y la materia asociada.
 *     tags: [Amigos Académicos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de amigos académicos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AmigoAcademico'
 */
router.get('/', verifyToken, getAllAmigosAcademicos);

/**
 * @swagger
 * /api/amigos_academicos/active:
 *   get:
 *     summary: Retorna únicamente los registros de amigos académicos activos.
 *     tags: [Amigos Académicos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de amigos académicos activos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AmigoAcademico'
 */
router.get('/active', verifyToken, getActiveAmigosAcademicos);

/**
 * @swagger
 * /api/amigos_academicos/{id}:
 *   get:
 *     summary: Retorna el registro de un amigo académico específico.
 *     tags: [Amigos Académicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del registro de amigo académico
 *     responses:
 *       200:
 *         description: Información del amigo académico, incluyendo datos del monitor, materia y asistencias.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AmigoAcademico'
 *       404:
 *         description: Amigo académico no encontrado
 */
router.get('/:id', verifyToken, getAmigoAcademicoById);

/**
 * @swagger
 * /api/amigos_academicos/estudiante/{estudianteId}:
 *   get:
 *     summary: Retorna todos los amigos académicos asociados a un estudiante monitor específico.
 *     tags: [Amigos Académicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: estudianteId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del estudiante monitor
 *     responses:
 *       200:
 *         description: Lista de amigos académicos asociados al estudiante monitor.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AmigoAcademico'
 */
router.get('/estudiante/:estudianteId', verifyToken, getAmigoAcademicoByEstudianteId);

/**
 * @swagger
 * /api/amigos_academicos/materia/{materiaId}:
 *   get:
 *     summary: Retorna todos los amigos académicos activos asociados a una materia específica, incluyendo los datos del monitor.
 *     tags: [Amigos Académicos]
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
 *         description: Lista de amigos académicos asociados a la materia.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AmigoAcademico'
 */
router.get('/materia/:materiaId', verifyToken, getAmigoAcademicoByMateriaId);

/**
 * @swagger
 * /api/amigos_academicos:
 *   post:
 *     summary: Crea un nuevo registro de amigo académico
 *     tags: [Amigos Académicos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estudiante_monitor_id
 *               - materia_id
 *               - horario
 *               - ubicacion
 *               - cupo_maximo
 *             properties:
 *               estudiante_monitor_id:
 *                 type: integer
 *               materia_id:
 *                 type: integer
 *               horario:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               cupo_maximo:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Amigo académico creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AmigoAcademico'
 *       400:
 *         description: Datos inválidos o conflicto de registros
 *       500:
 *         description: Error del servidor
 */
router.post('/', verifyToken, createAmigoAcademico);

/**
 * @swagger
 * /api/amigos_academicos/{id}:
 *   put:
 *     summary: Actualiza los datos de un amigo académico
 *     tags: [Amigos Académicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del registro de amigo académico a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               horario:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               cupo_maximo:
 *                 type: integer
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Amigo académico actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AmigoAcademico'
 *       404:
 *         description: Amigo académico no encontrado
 */
router.put('/:id', verifyToken, updateAmigoAcademico);

/**
 * @swagger
 * /api/amigos_academicos/{id}/toggle-activo:
 *   patch:
 *     summary: Cambia el estado de un amigo académico (activar o desactivar)
 *     tags: [Amigos Académicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del registro de amigo académico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estado del amigo académico actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Amigo académico desactivado correctamente"
 *       404:
 *         description: Registro no encontrado
 */
router.patch('/:id/toggle-activo', verifyToken, isAdmin, toggleActivoAmigoAcademico);

/**
 * @swagger
 * /api/amigos_academicos/{id}:
 *   delete:
 *     summary: Elimina o desactiva un amigo académico
 *     tags: [Amigos Académicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del registro de amigo académico a eliminar
 *     responses:
 *       200:
 *         description: Amigo académico eliminado o desactivado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Amigo académico eliminado correctamente"
 *       404:
 *         description: Registro no encontrado
 */
router.delete('/:id', verifyToken, isAdmin, deleteAmigoAcademico);

export default router;
