import express from 'express';
import {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    loginUsuario
} from '../controllers/usuarioController.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - id
 *         - nombres
 *         - apellidos
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: ID personalizado del usuario
 *         cedula:
 *           type: string
 *           description: Cédula del usuario
 *         nombres:
 *           type: string
 *           description: Nombres del usuario
 *         apellidos:
 *           type: string
 *           description: Apellidos del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario (único)
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario (no se devuelve en las respuestas)
 *         telefono:
 *           type: string
 *         foto_perfil:
 *           type: string
 *         rol:
 *           type: string
 *           enum: [admin, usuario]
 *           description: Rol del usuario en el sistema
 *         tipo_sangre:
 *           type: string
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1001
 *         cedula: "123456789"
 *         nombres: "Carlos"
 *         apellidos: "López"
 *         email: "carlos.lopez@example.com"
 *         telefono: "3001112223"
 *         foto_perfil: "https://miimagen.com/carlos.jpg"
 *         rol: "ADMIN"
 *         tipo_sangre: "A+"
 *         fecha_registro: "2025-03-07T10:00:00.000Z"
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         token:
 *           type: string
 *           description: JWT para autenticación
 *         usuario:
 *           $ref: '#/components/schemas/Usuario'
 *
 * tags:
 *   - name: Usuarios
 *     description: API para gestión de usuarios y autenticación
 */

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Inicia sesión en el sistema
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error del servidor
 */
router.post('/login', loginUsuario);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crea un nuevo usuario (registro)
 *     tags: [Usuarios]
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
 *               rol:
 *                 type: string
 *                 enum: [admin, usuario]
 *                 default: usuario
 *               tipo_sangre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Datos inválidos o email/cedula ya registrado
 *       500:
 *         description: Error del servidor
 */
router.post('/', createUsuario);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios (sin contraseñas)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado, token inválido
 *       403:
 *         description: No tiene permisos de administrador
 *       500:
 *         description: Error del servidor
 */
router.get('/', verifyToken, isAdmin, getAllUsuarios);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Información del usuario (sin contraseña)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/:id', verifyToken, getUsuarioById);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *               nombres:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 */
router.put('/:id', verifyToken, updateUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Desactiva un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a desactivar
 *     responses:
 *       200:
 *         description: Usuario desactivado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario desactivado correctamente"
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 */
router.delete('/:id', verifyToken, isAdmin, deleteUsuario);

export default router;
