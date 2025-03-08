import express from 'express';
import {
  getAllAdministrativos,
  getAdministrativoById,
  createAdministrativo,
  updateAdministrativo,
  deleteAdministrativo
} from '../controllers/administrativoController.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Administrativo:
 *       type: object
 *       required:
 *         - id
 *         - nombres
 *         - apellidos
 *         - email
 *         - password
 *         - departamento
 *         - cargo
 *       properties:
 *         id:
 *           type: integer
 *           description: ID personalizado del administrativo
 *         cedula:
 *           type: string
 *           description: Cédula del administrativo
 *         nombres:
 *           type: string
 *           description: Nombres del administrativo
 *         apellidos:
 *           type: string
 *           description: Apellidos del administrativo
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del administrativo (único)
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del administrativo (no se devuelve en las respuestas)
 *         telefono:
 *           type: string
 *         foto_perfil:
 *           type: string
 *         rol:
 *           type: string
 *           default: ADMINISTRATIVO
 *         tipo_sangre:
 *           type: string
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *         departamento:
 *           type: string
 *         cargo:
 *           type: string
 *       example:
 *         id: 4004
 *         cedula: "123456789"
 *         nombres: "Laura"
 *         apellidos: "Martínez"
 *         email: "laura.martinez@example.com"
 *         telefono: "3001234567"
 *         foto_perfil: "https://miimagen.com/laura.jpg"
 *         rol: "ADMINISTRATIVO"
 *         tipo_sangre: "AB+"
 *         fecha_registro: "2025-03-07T12:00:00.000Z"
 *         departamento: "Recursos Humanos"
 *         cargo: "Gerente"
 *
 * tags:
 *   - name: Administrativos
 *     description: API para gestión de administrativos
 */

/**
 * @swagger
 * /api/administrativos:
 *   get:
 *     summary: Retorna la lista de administrativos junto con la información del usuario asociado.
 *     tags: [Administrativos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de administrativos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Administrativo'
 */
router.get('/', verifyToken, getAllAdministrativos);

/**
 * @swagger
 * /api/administrativos/{id}:
 *   get:
 *     summary: Retorna un administrativo por ID
 *     tags: [Administrativos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del administrativo
 *     responses:
 *       200:
 *         description: Información del administrativo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Administrativo'
 *       404:
 *         description: Administrativo no encontrado
 */
router.get('/:id', verifyToken, getAdministrativoById);

/**
 * @swagger
 * /api/administrativos:
 *   post:
 *     summary: Crea un nuevo administrativo (con ID explícito)
 *     tags: [Administrativos]
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
 *               - cargo
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
 *               cargo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Administrativo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Administrativo'
 *       400:
 *         description: Datos inválidos o conflicto de registros
 *       500:
 *         description: Error del servidor
 */
router.post('/', verifyToken, isAdmin, createAdministrativo);

/**
 * @swagger
 * /api/administrativos/{id}:
 *   put:
 *     summary: Actualiza un administrativo existente
 *     tags: [Administrativos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del administrativo a actualizar
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
 *               cargo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Administrativo actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Administrativo'
 *       404:
 *         description: Administrativo no encontrado
 */
router.put('/:id', verifyToken, updateAdministrativo);

/**
 * @swagger
 * /api/administrativos/{id}:
 *   delete:
 *     summary: Desactiva un administrativo
 *     tags: [Administrativos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del administrativo a desactivar
 *     responses:
 *       200:
 *         description: Administrativo desactivado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Administrativo desactivado correctamente"
 *       404:
 *         description: Administrativo no encontrado
 */
router.delete('/:id', verifyToken, isAdmin, deleteAdministrativo);

export default router;
