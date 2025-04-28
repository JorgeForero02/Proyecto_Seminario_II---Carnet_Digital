import express from "express";
import { Op } from "sequelize";
import {
  verifyToken,
  roleMiddleware,
  canCreateAmigoAsistencia,
  canCreateAmigoHorario,
} from "../middlewares/auth.js";
import * as Models from "../models/index.js";
import { generateCrudControllers } from "../controllers/crudController.js";
import { validateFields } from "../validators/fieldValidator.js";
import { login } from "../controllers/authController.js";
import { loadUserScopes } from "../middlewares/scopeLoader.js";

const router = express.Router();

// Login
router.post("/login", login);

// Modelos de vista pública
const publicViews = [
  "Facultad",
  "Departamento",
  "ProgramaAcademico",
  "TipoAsesoria",
  "TipoContrato",
  "PeriodoAcademico",
  "Materia",
  "Rol",
  "UsuarioRol",
];

// Scopes restrictivos por modelo
const restrictedScopes = {
  Usuario: (req) => {
    // ADMINISTRATIVO puede ver todos los usuarios
    if (req.user.roles.includes("ADMINISTRATIVO")) return {};

    // DOCENTE puede ver los estudiantes matriculados en sus materias y su propio perfil
    if (
      req.user.roles.includes("DOCENTE") &&
      Array.isArray(req.user.docenteEstudianteMaterias) &&
      req.user.docenteEstudianteMaterias.length > 0
    ) {
      const studentIds = req.user.docenteEstudianteMaterias.map((em) => em.estudiante_id);
      const ids = [...studentIds, req.user.id];
      return { where: { id: { [Op.in]: ids } } };
    }

    // Por defecto, cada usuario solo puede verse a sí mismo
    return { where: { id: req.user.id } };
  },

  Estudiante: (req) => {
    if (req.user.roles.includes("ADMINISTRATIVO")) return {};
    if (req.user.roles.includes("ESTUDIANTE")) {
      return { where: { id: req.user.id } };
    }
    if (
      req.user.roles.includes("DOCENTE") &&
      Array.isArray(req.user.docenteEstudianteMaterias) &&
      req.user.docenteEstudianteMaterias.length > 0
    ) {
      const studentIds = req.user.docenteEstudianteMaterias.map((em) => em.estudiante_id);
      return { where: { id: { [Op.in]: studentIds } } };
    }
    return { where: { id: -1 } };
  },

  Docente: (req) => {
    if (req.user.roles.includes("ADMINISTRATIVO")) return {};
    if (req.user.roles.includes("DOCENTE")) {
      return { where: { id: req.user.id } };
    }
    return { where: { id: -1 } };
  },

  Administrativo: (req) => {
    if (req.user.roles.includes("ADMINISTRATIVO")) return {};
    return { where: { id: -1 } };
  },

  Materia: () => ({}),

  MateriaPrograma: (req) => {
    if (req.user.roles.includes("ADMINISTRATIVO")) return {};
    return { where: { id: { [Op.gt]: 0 } } }; // todos
  },

  PeriodoAcademico: (req) => {
    if (req.user.roles.includes("ADMINISTRATIVO")) return {};
    return { where: { id: { [Op.gt]: 0 } } }; // todos
  },

  DocenteMateria: (req) => {
    if (req.user.roles.includes("ADMINISTRATIVO")) return {};
    const or = [];
    if (req.user.roles.includes("DOCENTE")) {
      or.push({ docente_id: req.user.id });
    }
    if (req.user.roles.includes("ESTUDIANTE") && req.user.estudianteMaterias) {
      or.push({
        materia_id: {
          [Op.in]: req.user.estudianteMaterias.map((em) => em.materia_id),
        },
        periodo_id: {
          [Op.in]: req.user.estudianteMaterias.map((em) => em.periodo_id),
        },
      });
    }
    return or.length ? { where: { [Op.or]: or } } : { where: { id: -1 } };
  },

  EstudianteMateria: (req) => {
    if (req.user.roles.includes("ADMINISTRATIVO")) return {};
    if (req.user.roles.includes("ESTUDIANTE")) {
      return { where: { estudiante_id: req.user.id } };
    }
    if (req.user.roles.includes("DOCENTE") && req.user.docenteMaterias) {
      return {
        where: {
          materia_id: {
            [Op.in]: req.user.docenteMaterias.map((dm) => dm.materia_id),
          },
        },
      };
    }
    return { where: { id: -1 } };
  },

  HorarioClase: (req) => {
    if (req.user.roles.includes("ADMINISTRATIVO")) return {};
    if (req.user.roles.includes("DOCENTE") && req.user.docenteMaterias) {
      return {
        where: {
          docente_materia_id: {
            [Op.in]: req.user.docenteMaterias.map((dm) => dm.id),
          },
        },
      };
    }
    if (req.user.roles.includes("ESTUDIANTE") && req.user.estudianteMaterias) {
      const materiaIds = req.user.estudianteMaterias.map((em) => em.materia_id);
      const periodoIds = req.user.estudianteMaterias.map((em) => em.periodo_id);
      return {
        include: [
          {
            model: Models.DocenteMateria,
            required: true,
            attributes: [],
            where: {
              materia_id: { [Op.in]: materiaIds },
              periodo_id: { [Op.in]: periodoIds },
            },
          },
        ],
      };
    }
    return { where: { id: -1 } };
  },

  AsistenciaClase: (req) => {
    if (req.user.roles.includes("ADMINISTRATIVO")) return {};
    if (req.user.roles.includes("ESTUDIANTE")) {
      return { where: { estudiante_id: req.user.id } };
    }
    if (req.user.roles.includes("DOCENTE") && req.user.docenteHorarios) {
      return {
        where: {
          horario_clase_id: {
            [Op.in]: req.user.docenteHorarios.map((h) => h.id),
          },
        },
      };
    }
    return { where: { id: -1 } };
  },

  TipoAsesoria: () => ({}),

  Asesoria: (req) => {
    if (req.user.roles.includes("ADMINISTRATIVO")) return {};
    if (req.user.roles.includes("DOCENTE")) {
      return { where: { docente_id: req.user.id } };
    }
    if (req.user.roles.includes("ESTUDIANTE") && req.user.estudianteMaterias) {
      return {
        where: {
          materia_id: {
            [Op.in]: req.user.estudianteMaterias.map((em) => em.materia_id),
          },
          periodo_id: {
            [Op.in]: req.user.estudianteMaterias.map((em) => em.periodo_id),
          },
        },
      };
    }
    return { where: { id: -1 } };
  },

  HorarioAsesoria: (req) => {
    if (req.user.roles.includes("ADMINISTRATIVO")) return {};
    if (req.user.roles.includes("DOCENTE") && req.user.asesorias) {
      return {
        where: {
          asesoria_id: { [Op.in]: req.user.asesorias.map((a) => a.id) },
        },
      };
    }
    if (req.user.roles.includes("ESTUDIANTE") && req.user.estudianteMaterias) {
      return {
        include: [
          {
            model: Models.Asesoria,
            required: true,
            attributes: [],
            where: {
              materia_id: {
                [Op.in]: req.user.estudianteMaterias.map((em) => em.materia_id),
              },
              periodo_id: {
                [Op.in]: req.user.estudianteMaterias.map((em) => em.periodo_id),
              },
            },
          },
        ],
      };
    }
    return { where: { id: -1 } };
  },

  AsistenciaAsesoria: (req) => {
    if (req.user.roles.includes("ADMINISTRATIVO")) return {};
    if (req.user.roles.includes("ESTUDIANTE")) {
      return { where: { estudiante_id: req.user.id } };
    }
    if (req.user.roles.includes("DOCENTE") && req.user.asesorias) {
      return {
        include: [
          {
            model: Models.HorarioAsesoria,
            required: true,
            attributes: [],
            where: {
              asesoria_id: { [Op.in]: req.user.asesorias.map((a) => a.id) },
            },
          },
        ],
      };
    }
    return { where: { id: -1 } };
  },

  AmigoAcademico: (req) => {
    if (req.user.roles.includes("ADMINISTRATIVO")) return {};
    const or = [];
    if (req.user.roles.includes("ESTUDIANTE")) {
      or.push({ estudiante_monitor_id: req.user.id });
      if (req.user.estudianteMaterias) {
        or.push({
          materia_id: {
            [Op.in]: req.user.estudianteMaterias.map((em) => em.materia_id),
          },
          periodo_id: {
            [Op.in]: req.user.estudianteMaterias.map((em) => em.periodo_id),
          },
        });
      }
    }
    return or.length ? { where: { [Op.or]: or } } : { where: { id: -1 } };
  },

  HorarioAmigoAcademico: (req) => {
    if (req.user.roles.includes("ADMINISTRATIVO")) return {};
    if (req.user.roles.includes("ESTUDIANTE") && req.user.amigosAcademicos) {
      return {
        where: {
          amigo_academico_id: {
            [Op.in]: req.user.amigosAcademicos.map((aa) => aa.id),
          },
        },
      };
    }
    if (req.user.roles.includes("ESTUDIANTE") && req.user.estudianteMaterias) {
      return {
        include: [
          {
            model: Models.AmigoAcademico,
            required: true,
            attributes: [],
            where: {
              materia_id: {
                [Op.in]: req.user.estudianteMaterias.map((em) => em.materia_id),
              },
              periodo_id: {
                [Op.in]: req.user.estudianteMaterias.map((em) => em.periodo_id),
              },
            },
          },
        ],
      };
    }
    return { where: { id: -1 } };
  },

  AsistenciaAmigoAcademico: (req) => {
    if (req.user.roles.includes("ADMINISTRATIVO")) return {};
    const or = [];
    if (req.user.roles.includes("ESTUDIANTE")) {
      or.push({ estudiante_id: req.user.id });
      if (req.user.horariosAmigos) {
        or.push({
          horario_amigo_id: {
            [Op.in]: req.user.horariosAmigos.map((ha) => ha.id),
          },
        });
      }
    }
    return or.length ? { where: { [Op.or]: or } } : { where: { id: -1 } };
  },
};

// Definición de recursos
const resources = {
  Usuario: {
    path: "usuarios",
    fields: ["cedula", "nombres", "apellidos", "email", "password"],
    roles: { all: ["ADMINISTRATIVO"] },
  },
  Rol: {
    path: "roles",
    fields: ["nombre"],
    roles: { all: ["ADMINISTRATIVO"] },
  },
  UsuarioRol: {
    path: "usuario-roles",
    fields: ["usuario_id", "rol_id"],
    roles: { all: ["ADMINISTRATIVO"] },
  },
  Facultad: {
    path: "facultades",
    fields: ["nombre", "codigo"],
    roles: { all: ["ADMINISTRATIVO"] },
  },
  Departamento: {
    path: "departamentos",
    fields: ["nombre", "facultad_id", "codigo"],
    roles: { all: ["ADMINISTRATIVO"] },
  },
  ProgramaAcademico: {
    path: "programas",
    fields: ["nombre", "codigo", "facultad_id", "modalidad"],
    roles: { all: ["ADMINISTRATIVO"] },
  },
  Estudiante: {
    path: "estudiantes",
    fields: ["programa_id", "semestre"],
    roles: { all: ["ADMINISTRATIVO"] },
  },
  TipoContrato: {
    path: "tipos-contrato",
    fields: ["nombre"],
    roles: { all: ["ADMINISTRATIVO"] },
  },
  Docente: {
    path: "docentes",
    fields: ["departamento_id", "especialidad", "tipo_contrato_id"],
    roles: { all: ["ADMINISTRATIVO"] },
  },
  Administrativo: {
    path: "administrativos",
    fields: ["departamento_id", "cargo"],
    roles: { all: ["ADMINISTRATIVO"] },
  },
  Materia: {
    path: "materias",
    fields: ["codigo", "nombre", "creditos", "departamento_id"],
    roles: { all: ["ADMINISTRATIVO", "DOCENTE", "ESTUDIANTE"] },
  },
  MateriaPrograma: {
    path: "materia-programas",
    fields: ["materia_id", "programa_id", "semestre"],
    roles: { all: ["ADMINISTRATIVO"] },
  },
  PeriodoAcademico: {
    path: "periodos",
    fields: ["codigo", "nombre", "fecha_inicio", "fecha_fin"],
    roles: { all: ["ADMINISTRATIVO"] },
  },
  DocenteMateria: {
    path: "docente-materias",
    fields: ["docente_id", "materia_id", "periodo_id", "estado"],
    roles: { all: ["ADMINISTRATIVO"] },
  },
  HorarioClase: {
    path: "horario-clases",
    fields: [
      "docente_materia_id",
      "dia_semana",
      "hora_inicio",
      "hora_fin",
      "ubicacion",
    ],
    roles: { all: ["ADMINISTRATIVO"] },
  },
  EstudianteMateria: {
    path: "estudiante-materias",
    fields: ["estudiante_id", "materia_id", "periodo_id", "estado"],
    roles: { all: ["ADMINISTRATIVO"] },
  },
  AsistenciaClase: {
    path: "asistencia-clases",
    fields: ["estudiante_id", "horario_clase_id", "fecha", "estado"],
    roles: { create: ["DOCENTE"], all: ["ADMINISTRATIVO"] },
  },
  TipoAsesoria: {
    path: "tipos-asesoria",
    fields: ["nombre"],
    roles: { all: ["ADMINISTRATIVO"] },
  },
  Asesoria: {
    path: "asesorias",
    fields: ["docente_id", "materia_id", "tipo_asesoria_id", "periodo_id"],
    roles: {
      create: ["DOCENTE"],
      update: ["DOCENTE"],
      all: ["ADMINISTRATIVO"],
    },
  },
  HorarioAsesoria: {
    path: "horario-asesorias",
    fields: [
      "asesoria_id",
      "dia_semana",
      "hora_inicio",
      "hora_fin",
      "ubicacion",
    ],
    roles: {
      create: ["DOCENTE"],
      update: ["DOCENTE"],
      all: ["ADMINISTRATIVO"],
    },
  },
  AsistenciaAsesoria: {
    path: "asistencia-asesorias",
    fields: ["horario_asesoria_id", "estudiante_id", "fecha_hora"],
    roles: { create: ["DOCENTE"], all: ["ADMINISTRATIVO"] },
  },
  AmigoAcademico: {
    path: "amigos",
    fields: [
      "estudiante_monitor_id",
      "materia_id",
      "periodo_id",
      "cupo_maximo",
    ],
    roles: { all: ["ADMINISTRATIVO"] },
  },
  HorarioAmigoAcademico: {
    path: "horario-amigos",
    fields: [
      "amigo_academico_id",
      "dia_semana",
      "hora_inicio",
      "hora_fin",
      "ubicacion",
    ],
    roles: {
      create: ["ESTUDIANTE"],
      update: ["ESTUDIANTE"],
      all: ["ADMINISTRATIVO"],
    },
    customCreate: canCreateAmigoHorario,
  },
  AsistenciaAmigoAcademico: {
    path: "asistencia-amigos",
    fields: ["horario_amigo_id", "estudiante_id", "fecha_hora"],
    roles: { create: ["ESTUDIANTE"], all: ["ADMINISTRATIVO"] },
    customCreate: canCreateAmigoAsistencia,
  },
};

// Montaje automático de rutas
Object.entries(resources).forEach(([modelName, cfg]) => {
  const Model = Models[modelName];
  const options = {
    include: cfg.include || [],
    scope: restrictedScopes[modelName],
  };
  const ctrl = generateCrudControllers(Model, modelName, options);
  const base = `/${cfg.path}`;

  // Cadena común para GETs
  const getChain = [verifyToken, loadUserScopes];

  // GET ALL & GET ONE
  if (publicViews.includes(modelName)) {
    router.get(base, ...getChain, ctrl.findAll);
    router.get(`${base}/:id`, ...getChain, ctrl.findOne);
  } else if (restrictedScopes[modelName]) {
    router.get(
      base,
      ...getChain,
      roleMiddleware(["DOCENTE", "ESTUDIANTE", "ADMINISTRATIVO"]),
      ctrl.findAll
    );
    router.get(
      `${base}/:id`,
      ...getChain,
      roleMiddleware(["DOCENTE", "ESTUDIANTE", "ADMINISTRATIVO"]),
      ctrl.findOne
    );
  } else {
    router.get(base, ...getChain, roleMiddleware(cfg.roles.all), ctrl.findAll);
    router.get(
      `${base}/:id`,
      ...getChain,
      roleMiddleware(cfg.roles.all),
      ctrl.findOne
    );
  }

  // CREATE
  if (cfg.roles.create || cfg.roles.all) {
    const allowed = cfg.roles.create || cfg.roles.all;
    const chain = [verifyToken, roleMiddleware(allowed)];
    if (cfg.customCreate) chain.push(cfg.customCreate);
    chain.push(validateFields(cfg.fields), ctrl.create);
    router.post(base, ...chain);
  }

  // UPDATE
  if (cfg.roles.update || cfg.roles.all) {
    const allowed = cfg.roles.update || cfg.roles.all;
    router.put(
      `${base}/:id`,
      verifyToken,
      roleMiddleware(allowed),
      validateFields(cfg.fields),
      ctrl.update
    );
  }

  // DELETE
  if (cfg.roles.all) {
    router.delete(
      `${base}/:id`,
      verifyToken,
      roleMiddleware(cfg.roles.all),
      ctrl.delete
    );
  }
});

export default router;
