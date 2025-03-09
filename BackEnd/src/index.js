import express from 'express';
import morgan from 'morgan';
import { PORT } from './config.js';
import sequelize from './database/connection.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import docenteRoutes from './routes/docenteRoutes.js';
import estudianteRoutes from './routes/estudianteRoutes.js';
import administrativoRoutes from './routes/administrativoRoutes.js';
import asistenciaClaseRoutes from './routes/asistenciaClaseRoutes.js';
import MateriaRoutes from './routes/materiaRoutes.js';
import AsistenciaAsesoriaRoutes from './routes/asistenciaAsesoriaRoutes.js';
import AsesoriaRoutes from './routes/asesoriaRoutes.js';
import AmigoAcademicoRoutes from './routes/amigoAcademicoRoutes.js';
import AsistenciaAmigoAcademico from './routes/asistenciaAmigoAcademicoRoutes.js';
import DocenteMateriaRoutes from './routes/docenteMateriaRoutes.js';
import EstudianteMateriaRoutes from './routes/estudianteMateriaRoutes.js';
import { setupSwagger } from './swaggerConfig.js';
import cors from 'cors';

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Configurar Swagger
setupSwagger(app);

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/docentes', docenteRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/administrativos', administrativoRoutes);
app.use('/api/asistencias_clases', asistenciaClaseRoutes);
app.use('/api/materias', MateriaRoutes);
app.use('/api/asistencias_asesorias', AsistenciaAsesoriaRoutes);
app.use('/api/asesorias', AsesoriaRoutes);
app.use('/api/amigos_academicos', AmigoAcademicoRoutes);
app.use('/api/asistencias_amigos_academicos', AsistenciaAmigoAcademico);
app.use('/api/docentes_materias', DocenteMateriaRoutes);
app.use('/api/estudiantes_materias', EstudianteMateriaRoutes);

// Inicializar el servidor y la conexión a la base de datos
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // Sincronizar modelos con la base de datos (no forzar)
        // Nota: usar { force: true } solo en entorno de desarrollo para recrear tablas
        await sequelize.sync({ force: false });

        app.listen(PORT, () => {
            console.log(`Servidor funcionando en el puerto ${PORT}`);
            console.log(`Documentación API disponible en http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

startServer();