// models/index.js
import sequelize from '../database/connection.js';
import Usuario from './Usuario.js';
import Rol from './Rol.js';
import UsuarioRol from './UsuarioRol.js';
import Facultad from './Facultad.js';
import Departamento from './Departamento.js';
import ProgramaAcademico from './ProgramaAcademico.js';
import Estudiante from './Estudiante.js';
import TipoContrato from './TipoContrato.js';
import Docente from './Docente.js';
import Administrativo from './Administrativo.js';
import Materia from './Materia.js';
import MateriaPrograma from './MateriaPrograma.js';
import PeriodoAcademico from './PeriodoAcademico.js';
import DocenteMateria from './DocenteMateria.js';
import HorarioClase from './HorarioClase.js';
import EstudianteMateria from './EstudianteMateria.js';
import AsistenciaClase from './AsistenciaClase.js';
import TipoAsesoria from './TipoAsesoria.js';
import Asesoria from './Asesoria.js';
import HorarioAsesoria from './HorarioAsesoria.js';
import AsistenciaAsesoria from './AsistenciaAsesoria.js';
import AmigoAcademico from './AmigoAcademico.js';
import HorarioAmigoAcademico from './HorarioAmigoAcademico.js';
import AsistenciaAmigoAcademico from './AsistenciaAmigoAcademico.js';

// Initialize models
// Note: The model files should use sequelize.define() or Model.init() internally

// Assuming all associations are defined in individual model files

// Export models and Sequelize instance
export {
  sequelize,
  Usuario,
  Rol,
  UsuarioRol,
  Facultad,
  Departamento,
  ProgramaAcademico,
  Estudiante,
  TipoContrato,
  Docente,
  Administrativo,
  Materia,
  MateriaPrograma,
  PeriodoAcademico,
  DocenteMateria,
  HorarioClase,
  EstudianteMateria,
  AsistenciaClase,
  TipoAsesoria,
  Asesoria,
  HorarioAsesoria,
  AsistenciaAsesoria,
  AmigoAcademico,
  HorarioAmigoAcademico,
  AsistenciaAmigoAcademico
};