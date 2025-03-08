// swaggerConfig.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Académica',
            version: '1.0.0',
            description: 'API para gestión de estudiantes, docentes, asistencias y más',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: [
        path.join(__dirname, './routes/*.js'),
        path.join(__dirname, './models/*.js'), // Para incluir esquemas de modelos
        path.join(__dirname, './swagger-docs/*.js') // Carpeta opcional para documentación adicional
    ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app) => {
    // Ruta para la documentación
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }' // Opcional: personalizar la UI
    }));

    // Endpoint para obtener el archivo swagger.json
    app.get('/swagger.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    console.log('Documentación Swagger disponible en /api-docs');
};