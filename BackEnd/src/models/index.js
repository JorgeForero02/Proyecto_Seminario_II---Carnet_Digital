// models/index.js
import Usuario from './usuario.js';
import Docente from './docente.js';
import Estudiante from './estudiante.js';
import Administrativo from './administrativo.js';
import Asesoria from './asesoria.js';
import AsistenciaAsesoria from './asistenciaAsesoria.js';
import AsistenciaAmigoAcademico from './asistenciaAmigoAcademico.js';
import AmigoAcademico from './amigoAcademico.js';
import Materia from './materia.js';
import AsistenciaClase from './asistenciaClase.js';
import DocenteMateria from './docenteMateria.js';
import EstudianteMateria from './estudianteMateria.js';

// Agregar todos los modelos al objeto models
const models = {
    Usuario,
    Docente,
    Estudiante,
    Administrativo,
    Asesoria,
    AsistenciaAsesoria,
    AsistenciaAmigoAcademico,
    AmigoAcademico,
    Materia,
    AsistenciaClase,
    DocenteMateria,
    EstudianteMateria
};

// Establecer asociaciones después de definir todos los modelos
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

export { 
    Usuario, 
    Docente, 
    Estudiante, 
    Administrativo,
    Asesoria,
    AsistenciaAsesoria,
    AsistenciaAmigoAcademico,
    AmigoAcademico,
    Materia,
    AsistenciaClase,
    DocenteMateria,
    EstudianteMateria
};