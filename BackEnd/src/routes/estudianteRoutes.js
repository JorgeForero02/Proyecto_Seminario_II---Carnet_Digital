import express from 'express';
import {
  getAllEstudiantes,
  getEstudianteById,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante
} from '../controllers/estudianteController.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Estudiante:
 *       type: object
 *       required:
 *         - id
 *         - nombres
 *         - apellidos
 *         - email
 *         - password
 *         - programa_academico
 *         - facultad
 *         - modalidad
 *         - semestre
 *       properties:
 *         id:
 *           type: integer
 *           description: ID personalizado del estudiante
 *         cedula:
 *           type: string
 *           description: Cédula del estudiante
 *         nombres:
 *           type: string
 *           description: Nombres del estudiante
 *         apellidos:
 *           type: string
 *           description: Apellidos del estudiante
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del estudiante (único)
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del estudiante (no se devuelve en respuestas)
 *         telefono:
 *           type: string
 *         foto_perfil:
 *           type: string
 *         rol:
 *           type: string
 *           default: ESTUDIANTE
 *         tipo_sangre:
 *           type: string
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *         programa_academico:
 *           type: string
 *         facultad:
 *           type: string
 *         modalidad:
 *           type: string
 *         semestre:
 *           type: integer
 *       example:
 *         id: 2002
 *         cedula: "987654321"
 *         nombres: "Mariana"
 *         apellidos: "Gómez"
 *         email: "mariana.gomez@example.com"
 *         password: "otraContraseñaSegura"
 *         telefono: "3102223334"
 *         foto_perfil: "https://miimagen.com/mariana.jpg"
 *         programa_academico: "Ingeniería Industrial"
 *         facultad: "Ingeniería"
 *         modalidad: "Presencial"
 *         semestre: 5
 *
 * tags:
 *   - name: Estudiantes
 *     description: API para gestión de estudiantes
 */

/**
 * @swagger
 * /api/estudiantes:
 *   get:
 *     summary: Lista todos los estudiantes
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estudiantes con la información del usuario asociado (sin contraseña)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Estudiante'
 */
router.get('/', verifyToken, getAllEstudiantes);

/**
 * @swagger
 * /api/estudiantes/{id}:
 *   get:
 *     summary: Obtiene un estudiante por ID
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del estudiante
 *     responses:
 *       200:
 *         description: Información del estudiante, incluyendo los datos del usuario (sin contraseña)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *       404:
 *         description: Estudiante no encontrado
 */
router.get('/:id', verifyToken, getEstudianteById);

/**
 * @swagger
 * /api/estudiantes:
 *   post:
 *     summary: Crea un nuevo estudiante (con ID personalizado)
 *     tags: [Estudiantes]
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
 *               - nombres
 *               - apellidos
 *               - email
 *               - password
 *               - programa_academico
 *               - facultad
 *               - modalidad
 *               - semestre
 *             properties:
 *               id:
 *                 type: integer
 *               cedula:
 *                 type: string
 *               nombres:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               telefono:
 *                 type: string
 *               foto_perfil:
 *                 type: string
 *               tipo_sangre:
 *                 type: string
 *               programa_academico:
 *                 type: string
 *               facultad:
 *                 type: string
 *               modalidad:
 *                 type: string
 *               semestre:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Estudiante creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *       400:
 *         description: Datos inválidos o email/cedula ya registrado
 *       500:
 *         description: Error del servidor
 */
router.post('/', verifyToken, isAdmin, createEstudiante);

/**
 * @swagger
 * /api/estudiantes/{id}:
 *   put:
 *     summary: Actualiza un estudiante existente
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del estudiante a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefono:
 *                 type: string
 *               programa_academico:
 *                 type: string
 *               facultad:
 *                 type: string
 *               modalidad:
 *                 type: string
 *               semestre:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Estudiante actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *       404:
 *         description: Estudiante no encontrado
 */
router.put('/:id', verifyToken, updateEstudiante);

/**
 * @swagger
 * /api/estudiantes/{id}:
 *   delete:
 *     summary: Desactiva un estudiante
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del estudiante a desactivar
 *     responses:
 *       200:
 *         description: Estudiante desactivado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Estudiante desactivado correctamente"
 *       404:
 *         description: Estudiante no encontrado
 */
router.delete('/:id', verifyToken, isAdmin, deleteEstudiante);

export default router;
