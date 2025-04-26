import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { HorarioAmigoAcademico, AmigoAcademico } from '../models/index.js';

dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido o expirado.' });
    
  }
};

export const roleMiddleware = allowedRoles => (req, res, next) => {
  const userRoles = req.user.roles || [];
  if (userRoles.includes('ADMINISTRATIVO') || userRoles.some(r => allowedRoles.includes(r))) {
    return next();
  }
  res.status(403).json({ message: 'Permisos insuficientes.' });
};

export const canCreateAmigoAsistencia = async (req, res, next) => {
  if (req.user.roles.includes('ADMINISTRATIVO')) return next();
  const { horario_amigo_id } = req.body;
  try {
    const horario = await HorarioAmigoAcademico.findByPk(horario_amigo_id, { include: [{ model: AmigoAcademico }] });
    if (!horario || horario.AmigoAcademico.estudiante_monitor_id !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para crear asistencia de amigo académico.' });
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const canCreateAmigoHorario = async (req, res, next) => {
  if (req.user.roles.includes('ADMINISTRATIVO')) return next();
  const { amigo_academico_id } = req.body;
  try {
    const amigo = await AmigoAcademico.findByPk(amigo_academico_id);
    if (!amigo || amigo.estudiante_monitor_id !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para crear horario de amigo académico.' });
    }
    next();
  } catch (err) {
    next(err);
  }
};