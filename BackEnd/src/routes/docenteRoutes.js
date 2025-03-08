import express from 'express';
import {
  getAllDocentes,
  getDocenteById,
  createDocente,
  updateDocente,
  deleteDocente
} from '../controllers/docenteController.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Docente:
 *       type: object
 *       required:
 *         - id
 *         - nombres
 *         - apellidos
 *         - email
 *         - password
 *         - departamento
 *         - especialidad
 *         - tipo_contrato
 *       properties:
 *         id:
 *           type: integer
 *           description: ID personalizado del docente
 *         cedula:
 *           type: string
 *           description: Cédula del docente
 *         nombres:
 *           type: string
 *           description: Nombres del docente
 *         apellidos:
 *           type: string
 *           description: Apellidos del docente
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del docente (único)
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del docente (no se devuelve en las respuestas)
 *         telefono:
 *           type: string
 *         foto_perfil:
 *           type: string
 *         rol:
 *           type: string
 *           default: DOCENTE
 *         tipo_sangre:
 *           type: string
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *         departamento:
 *           type: string
 *         especialidad:
 *           type: string
 *         tipo_contrato:
 *           type: string
 *       example:
 *         id: 3003
 *         cedula: "444555666"
 *         nombres: "Ana"
 *         apellidos: "García"
 *         email: "ana.garcia@example.com"
 *         password: "contraseña123"
 *         telefono: "3109876543"
 *         foto_perfil: "https://miimagen.com/ana.jpg"
 *         departamento: "Física"
 *         especialidad: "Mecánica Cuántica"
 *         tipo_contrato: "Medio Tiempo"
 *
 * tags:
 *   - name: Docentes
 *     description: API para gestión de docentes
 */

/**
 * @swagger
 * /api/docentes:
 *   get:
 *     summary: Lista todos los docentes con la información del usuario asociado.
 *     tags: [Docentes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de docentes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Docente'
 */
router.get('/', verifyToken, getAllDocentes);

/**
 * @swagger
 * /api/docentes/{id}:
 *   get:
 *     summary: Obtiene un docente por ID.
 *     tags: [Docentes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del docente
 *     responses:
 *       200:
 *         description: Información del docente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Docente'
 *       404:
 *         description: Docente no encontrado
 */
router.get('/:id', verifyToken, getDocenteById);

/**
 * @swagger
 * /api/docentes:
 *   post:
 *     summary: Crea un nuevo docente (con ID explícito).
 *     tags: [Docentes]
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
 *               - departamento
 *               - especialidad
 *               - tipo_contrato
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
 *               departamento:
 *                 type: string
 *               especialidad:
 *                 type: string
 *               tipo_contrato:
 *                 type: string
 *     responses:
 *       201:
 *         description: Docente creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Docente'
 *       400:
 *         description: Datos inválidos o conflicto de registros.
 *       500:
 *         description: Error del servidor.
 */
router.post('/', verifyToken, isAdmin, createDocente);

/**
 * @swagger
 * /api/docentes/{id}:
 *   put:
 *     summary: Actualiza un docente existente.
 *     tags: [Docentes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del docente a actualizar
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
 *               departamento:
 *                 type: string
 *               tipo_contrato:
 *                 type: string
 *     responses:
 *       200:
 *         description: Docente actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Docente'
 *       404:
 *         description: Docente no encontrado.
 *       401:
 *         description: No autorizado.
 */
router.put('/:id', verifyToken, updateDocente);

/**
 * @swagger
 * /api/docentes/{id}:
 *   delete:
 *     summary: Desactiva un docente.
 *     tags: [Docentes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del docente a desactivar
 *     responses:
 *       200:
 *         description: Docente desactivado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Docente desactivado correctamente"
 *       404:
 *         description: Docente no encontrado.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: No tiene permisos de administrador.
 */
router.delete('/:id', verifyToken, isAdmin, deleteDocente);

export default router;
