import express from 'express';
import morgan from 'morgan';
import { PORT } from './config.js';
import sequelize from './database/connection.js';
import apiRoutes from './routes/api.js';
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

// ejemplo en Express + cors
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));
  

// Rutas
app.use('/api', apiRoutes);
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