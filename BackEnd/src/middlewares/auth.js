import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }
    
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        console.log(req.user);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

export const isDocente = (req, res, next) => {
    if (req.user && req.user.role === 'DOCENTE') {
        
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de docente.' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMINISTRATIVO') {
        
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
};