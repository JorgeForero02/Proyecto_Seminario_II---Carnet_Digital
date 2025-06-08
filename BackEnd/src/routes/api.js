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

const router = express.Router();

// ============================================================================
// CONFIGURACIÓN GLOBAL
// ============================================================================

const publicGet = true; // Todos pueden ver cualquier recurso (GET públicos)

// ============================================================================
// DEFINICIÓN DE RECURSOS CRUD
// ============================================================================

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

router.get("/asesorias", async (req, res) => {
  const where = {};
  if (req.query.materia_id) where.materia_id = req.query.materia_id;

  const asesorias = await Models.Asesoria.findAll({
    where,
    include: [
      { model: Models.TipoAsesoria, attributes: ["nombre"] },
      { model: Models.PeriodoAcademico, attributes: ["nombre"] },
      {
        model: Models.Docente,
        include: [
          {
            model: Models.Usuario,
            attributes: { exclude: ["password"] },
          },
        ],
      },
    ],
  });

  res.json(asesorias);
});

// ============================================================================
// FUNCIONES AUXILIARES PARA CONSULTAS COMPLEJAS
// ============================================================================

// Funciones para Docentes
async function getDocenteMateriaIds(docenteId, materiaId = null) {
  const where = { docente_id: docenteId };
  if (materiaId) where.materia_id = materiaId;

  const dm = await Models.DocenteMateria.findAll({
    where,
    attributes: ["id"],
  });
  return dm.map((d) => d.id);
}

async function getHorarioClaseIds(docenteMateriaIds) {
  const hc = await Models.HorarioClase.findAll({
    where: { docente_materia_id: { [Op.in]: docenteMateriaIds } },
    attributes: ["id"],
  });
  return hc.map((h) => h.id);
}

async function getAsesoriaIds(docenteId, materiaId = null) {
  const where = { docente_id: docenteId };
  if (materiaId) where.materia_id = materiaId;

  const asesorias = await Models.Asesoria.findAll({
    where,
    attributes: ["id"],
  });
  return asesorias.map((a) => a.id);
}

async function getHorarioAsesoriaIds(asesoriaIds) {
  const horarios = await Models.HorarioAsesoria.findAll({
    where: { asesoria_id: { [Op.in]: asesoriaIds } },
    attributes: ["id"],
  });
  return horarios.map((h) => h.id);
}

// Funciones para Estudiantes
async function getEstudianteMaterias(estudianteId, materiaId = null) {
  const where = { estudiante_id: estudianteId };
  if (materiaId) where.materia_id = materiaId;

  return await Models.EstudianteMateria.findAll({ where });
}

async function getHorariosPorMateriasPeriodos(materiaIds, periodoIds) {
  return await Models.HorarioClase.findAll({
    include: [
      {
        model: Models.DocenteMateria,
        where: {
          materia_id: { [Op.in]: materiaIds },
          periodo_id: { [Op.in]: periodoIds },
        },
      },
    ],
  });
}

// Función para crear middlewares de autenticación
function createAuthMiddleware(cfg, operation) {
  const middlewares = [];

  if (!publicGet || operation !== "read") {
    middlewares.push(verifyToken);

    const allowedRoles = cfg.roles[operation] || cfg.roles.all;
    if (allowedRoles) {
      middlewares.push(roleMiddleware(allowedRoles));
    }
  }

  return middlewares;
}

// ============================================================================
// RUTAS DE AUTENTICACIÓN
// ============================================================================

router.post("/login", login);

// ============================================================================
// GENERACIÓN AUTOMÁTICA DE RUTAS CRUD
// ============================================================================

Object.entries(resources).forEach(([modelName, cfg]) => {
  const Model = Models[modelName];
  const ctrl = generateCrudControllers(Model, modelName, {});
  const basePath = `/${cfg.path}`;

  // GET routes - Públicos o protegidos según configuración
  if (publicGet) {
    router.get(basePath, ctrl.findAll);
    router.get(`${basePath}/:id`, ctrl.findOne);
  } else {
    const authMiddleware = createAuthMiddleware(cfg, "read");
    router.get(basePath, ...authMiddleware, ctrl.findAll);
    router.get(`${basePath}/:id`, ...authMiddleware, ctrl.findOne);
  }

  // CREATE route - Siempre protegido
  if (cfg.roles.create || cfg.roles.all) {
    const middlewares = createAuthMiddleware(cfg, "create");

    if (cfg.customCreate) {
      middlewares.push(cfg.customCreate);
    }

    middlewares.push(validateFields(cfg.fields), ctrl.create);
    router.post(basePath, ...middlewares);
  }

  // UPDATE route - Siempre protegido
  if (cfg.roles.update || cfg.roles.all) {
    const middlewares = createAuthMiddleware(cfg, "update");
    middlewares.push(validateFields(cfg.fields), ctrl.update);
    router.put(`${basePath}/:id`, ...middlewares);
  }

  // DELETE route - Siempre protegido
  if (cfg.roles.all) {
    const middlewares = createAuthMiddleware(cfg, "delete");
    middlewares.push(ctrl.delete);
    router.delete(`${basePath}/:id`, ...middlewares);
  }
});

// ============================================================================
// ENDPOINTS ESPECÍFICOS PARA DOCENTES
// ============================================================================

// Docente ve sus estudiantes de todos sus cursos - PÚBLICO
router.get("/docentes/:id/estudiantes", async (req, res) => {
  try {
    const docenteId = req.params.id;
    const dm = await Models.DocenteMateria.findAll({
      where: { docente_id: docenteId },
    });

    const pairs = dm.map((d) => ({
      materia_id: d.materia_id,
      periodo_id: d.periodo_id,
    }));

    const em = await Models.EstudianteMateria.findAll({
      where: { [Op.or]: pairs },
    });

    const studentIds = [...new Set(em.map((e) => e.estudiante_id))];
    const estudiantes = await Models.Estudiante.findAll({
      where: { id: { [Op.in]: studentIds } },
      include: [
        {
          model: Models.Usuario,
          attributes: { exclude: ["password"] },
        },
      ],
    });

    res.json(estudiantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/docentes/:id/materias", async (req, res) => {
  try {
    const docenteId = req.params.id;

    // Obtener todas las relaciones docente-materia
    const dm = await Models.DocenteMateria.findAll({
      where: { docente_id: docenteId },
    });

    if (dm.length === 0) {
      return res.json([]);
    }

    const materiaIds = [...new Set(dm.map((d) => d.materia_id))];
    const periodoIds = [...new Set(dm.map((d) => d.periodo_id))];

    // Obtener información de materias y períodos
    const materias = await Models.Materia.findAll({
      where: { id: { [Op.in]: materiaIds } },
    });

    const periodos = await Models.PeriodoAcademico.findAll({
      where: { id: { [Op.in]: periodoIds } },
    });

    // Construir respuesta con la información completa
    const resultado = dm.map((d) => ({
      id: d.id,
      estado: d.estado,
      materia: materias.find((m) => m.id === d.materia_id),
      periodo: periodos.find((p) => p.id === d.periodo_id),
      docente_materia_id: d.id, // útil para otras consultas
    }));

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Docente ve su horario (clases) - PÚBLICO
router.get("/docentes/:id/horario", async (req, res) => {
  try {
    const docenteId = req.params.id;
    const docenteMateriaIds = await getDocenteMateriaIds(docenteId);

    const hc = await Models.HorarioClase.findAll({
      where: { docente_materia_id: { [Op.in]: docenteMateriaIds } },
    });

    res.json(hc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregar estos endpoints en la sección "ENDPOINTS ESPECÍFICOS PARA DOCENTES"

// Docente ve su horario por materia específica - PÚBLICO
router.get(
  "/docentes/:docenteId/materias/:materiaId/horario",
  async (req, res) => {
    try {
      const { docenteId, materiaId } = req.params;
      const docenteMateriaIds = await getDocenteMateriaIds(
        docenteId,
        materiaId
      );
      if (docenteMateriaIds.length === 0) {
        return res
          .status(404)
          .json({ error: "El docente no imparte esa materia." });
      }

      // Sólo filtro, sin include
      const horarios = await Models.HorarioClase.findAll({
        where: { docente_materia_id: { [Op.in]: docenteMateriaIds } },
        order: [
          ["dia_semana", "ASC"],
          ["hora_inicio", "ASC"],
        ],
      });

      res.json(horarios);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

// Docente ve los estudiantes de una materia específica - PÚBLICO
router.get(
  "/docentes/:docenteId/materias/:materiaId/estudiantes",
  async (req, res) => {
    try {
      const { docenteId, materiaId } = req.params;

      // Verificar que el docente imparte esa materia
      const dm = await Models.DocenteMateria.findAll({
        where: {
          docente_id: docenteId,
          materia_id: materiaId,
        },
      });

      if (dm.length === 0) {
        return res.status(404).json({
          error: "El docente no imparte esa materia.",
        });
      }

      // Obtener períodos en los que el docente imparte la materia
      const periodoIds = dm.map((d) => d.periodo_id);

      // Obtener estudiantes matriculados en esa materia y períodos
      const em = await Models.EstudianteMateria.findAll({
        where: {
          materia_id: materiaId,
          periodo_id: { [Op.in]: periodoIds },
        },
      });

      const studentIds = [...new Set(em.map((e) => e.estudiante_id))];

      // Obtener información completa de los estudiantes
      const estudiantes = await Models.Estudiante.findAll({
        where: { id: { [Op.in]: studentIds } },
        include: [
          {
            model: Models.Usuario,
            attributes: { exclude: ["password"] },
          },
          {
            model: Models.ProgramaAcademico,
            attributes: ["id", "nombre", "codigo"],
          },
        ],
      });

      // Combinar información de matrícula con datos del estudiante
      const estudiantesConEstado = estudiantes.map((estudiante) => {
        const matriculas = em.filter((e) => e.estudiante_id === estudiante.id);
        return {
          ...estudiante.toJSON(),
          matriculas: matriculas.map((m) => ({
            estado: m.estado,
            periodo_id: m.periodo_id,
            periodo: dm.find((d) => d.periodo_id === m.periodo_id),
          })),
        };
      });

      res.json({
        materiaId,
        docenteId,
        totalEstudiantes: estudiantes.length,
        estudiantes: estudiantesConEstado,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Docente ve las asistencias de estudiantes por materia - PÚBLICO
router.get(
  "/docentes/:docenteId/materias/:materiaId/asistencias-estudiantes",
  async (req, res) => {
    try {
      const { docenteId, materiaId } = req.params;

      const docenteMateriaIds = await getDocenteMateriaIds(
        docenteId,
        materiaId
      );
      if (docenteMateriaIds.length === 0) {
        return res.status(404).json({
          error: "El docente no imparte esa materia.",
        });
      }

      const horarioIds = await getHorarioClaseIds(docenteMateriaIds);

      // Obtener todas las asistencias de los estudiantes para esta materia
      const asistencias = await Models.AsistenciaClase.findAll({
        where: { horario_clase_id: { [Op.in]: horarioIds } },
        include: [
          {
            model: Models.Estudiante,
            include: [
              {
                model: Models.Usuario,
                attributes: { exclude: ["password"] },
              },
              {
                model: Models.ProgramaAcademico,
                attributes: ["id", "nombre", "codigo"],
              },
            ],
          },
          {
            model: Models.HorarioClase,
            attributes: ["dia_semana", "hora_inicio", "hora_fin", "ubicacion"],
            include: [
              {
                model: Models.DocenteMateria,
                include: [
                  {
                    model: Models.Materia,
                    attributes: ["id", "codigo", "nombre"],
                  },
                  {
                    model: Models.PeriodoAcademico,
                    attributes: ["id", "codigo", "nombre"],
                  },
                ],
              },
            ],
          },
        ],
        order: [
          ["fecha", "DESC"],
          ["Estudiante", "Usuario", "apellidos", "ASC"],
        ],
      });

      res.json({
        materiaId,
        docenteId,
        totalAsistencias: asistencias.length,
        asistencias,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Docente ve las asistencias de sus estudiantes - PROTEGIDO
router.get(
  "/docentes/:id/asistencias",
  verifyToken,
  roleMiddleware(["DOCENTE"]),
  async (req, res) => {
    try {
      const docenteId = req.params.id;
      const docenteMateriaIds = await getDocenteMateriaIds(docenteId);
      const horarioIds = await getHorarioClaseIds(docenteMateriaIds);

      const asistencias = await Models.AsistenciaClase.findAll({
        where: { horario_clase_id: { [Op.in]: horarioIds } },
        include: [
          {
            model: Models.Estudiante,
            include: [
              {
                model: Models.Usuario,
                attributes: { exclude: ["password"] },
              },
            ],
          },
          {
            model: Models.HorarioClase,
            attributes: ["dia_semana", "hora_inicio", "hora_fin", "ubicacion"],
          },
        ],
        order: [["fecha", "DESC"]],
      });

      res.json(asistencias);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Docente ve las asistencias por materia - PROTEGIDO
router.get(
  "/docentes/:docenteId/materias/:materiaId/asistencias",
  verifyToken,
  roleMiddleware(["DOCENTE"]),
  async (req, res) => {
    try {
      const { docenteId, materiaId } = req.params;

      const docenteMateriaIds = await getDocenteMateriaIds(
        docenteId,
        materiaId
      );
      if (docenteMateriaIds.length === 0) {
        return res.status(404).json({
          error: "El docente no imparte esa materia.",
        });
      }

      const horarioIds = await getHorarioClaseIds(docenteMateriaIds);
      const asistencias = await Models.AsistenciaClase.findAll({
        where: { horario_clase_id: { [Op.in]: horarioIds } },
        include: [
          {
            model: Models.Estudiante,
            include: [
              {
                model: Models.Usuario,
                attributes: { exclude: ["password"] },
              },
            ],
          },
          {
            model: Models.HorarioClase,
            attributes: ["dia_semana", "hora_inicio", "hora_fin", "ubicacion"],
          },
        ],
        order: [["fecha", "DESC"]],
      });

      res.json({
        materiaId,
        totalAsistencias: asistencias.length,
        asistencias,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Docente ve las asistencias de sus asesorías - PROTEGIDO
router.get(
  "/docentes/:id/asistencias-asesorias",
  verifyToken,
  roleMiddleware(["DOCENTE"]),
  async (req, res) => {
    try {
      const docenteId = req.params.id;
      // Reuso funciones auxiliares para ids…
      const asesoriaIds = await getAsesoriaIds(docenteId);
      const horarioIds = await getHorarioAsesoriaIds(asesoriaIds);

      const asistencias = await Models.AsistenciaAsesoria.findAll({
        where: { horario_asesoria_id: { [Op.in]: horarioIds } },
        include: [
          {
            model: Models.Estudiante,
            include: [
              {
                model: Models.Usuario,
                attributes: { exclude: ["password"] },
              },
            ],
          },
          {
            model: Models.HorarioAsesoria,
            attributes: ["dia_semana", "hora_inicio", "hora_fin", "ubicacion"],
          },
        ],
        order: [["fecha_hora", "DESC"]],
      });

      // **Normalizamos** la salida para que siempre sea { asistencias: [...] }
      res.json({ asistencias });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Docente ve todas sus asesorías - PROTEGIDO
router.get(
  "/docentes/:id/asesorias",
  verifyToken,
  roleMiddleware(["DOCENTE"]),
  async (req, res) => {
    try {
      const docenteId = req.params.id;

      // Obtener todas las asesorías del docente, con sus detalles y horarios
      const asesorias = await Models.Asesoria.findAll({
        where: { docente_id: docenteId },
        include: [
          {
            model: Models.Materia,
            attributes: ["id", "codigo", "nombre"],
          },
          {
            model: Models.TipoAsesoria,
            attributes: ["id", "nombre"],
          },
          {
            model: Models.PeriodoAcademico,
            attributes: ["id", "codigo", "nombre", "fecha_inicio", "fecha_fin"],
          },
          {
            model: Models.HorarioAsesoria,
            attributes: ["id", "dia_semana", "hora_inicio", "hora_fin", "ubicacion"],
            order: [
              ["dia_semana", "ASC"],
              ["hora_inicio", "ASC"],
            ],
          },
        ],
      });

      res.json({
        docenteId,
        totalAsesorias: asesorias.length,
        asesorias,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);


// Docente ve las asistencias de asesorías por materia - PROTEGIDO
router.get(
  "/docentes/:docenteId/materias/:materiaId/asistencias-asesorias",
  verifyToken,
  roleMiddleware(["DOCENTE"]),
  async (req, res) => {
    try {
      const { docenteId, materiaId } = req.params;

      const asesoriaIds = await getAsesoriaIds(docenteId, materiaId);
      if (asesoriaIds.length === 0) {
        return res.status(404).json({
          error: "El docente no da asesorías en esa materia.",
        });
      }

      const horarioIds = await getHorarioAsesoriaIds(asesoriaIds);
      const asistencias = await Models.AsistenciaAsesoria.findAll({
        where: { horario_asesoria_id: { [Op.in]: horarioIds } },
        include: [
          {
            model: Models.Estudiante,
            include: [
              {
                model: Models.Usuario,
                attributes: { exclude: ["password"] },
              },
            ],
          },
          {
            model: Models.HorarioAsesoria,
            attributes: ["dia_semana", "hora_inicio", "hora_fin", "ubicacion"],
          },
        ],
        order: [["fecha_hora", "DESC"]],
      });

      res.json({
        materiaId,
        totalAsistencias: asistencias.length,
        asistencias,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ============================================================================
// ENDPOINTS ESPECÍFICOS PARA ESTUDIANTES
// ============================================================================

// Estudiante ve todas sus materias y periodos - PÚBLICO
router.get("/estudiantes/:id/materias", async (req, res) => {
  try {
    const estudianteId = req.params.id;
    const em = await getEstudianteMaterias(estudianteId);

    const materiaIds = [...new Set(em.map((e) => e.materia_id))];
    const periodoIds = [...new Set(em.map((e) => e.periodo_id))];

    const materias = await Models.Materia.findAll({
      where: { id: { [Op.in]: materiaIds } },
    });
    const periodos = await Models.PeriodoAcademico.findAll({
      where: { id: { [Op.in]: periodoIds } },
    });

    const resultado = em.map((e) => ({
      estado: e.estado,
      materia: materias.find((m) => m.id === e.materia_id),
      periodo: periodos.find((p) => p.id === e.periodo_id),
    }));

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Estudiante ve su horario (clases) - PÚBLICO
router.get("/estudiantes/:id/horario", async (req, res) => {
  try {
    const estudianteId = req.params.id;
    const em = await getEstudianteMaterias(estudianteId);

    const materiaIds = em.map((e) => e.materia_id);
    const periodoIds = em.map((e) => e.periodo_id);

    const hc = await getHorariosPorMateriasPeriodos(materiaIds, periodoIds);
    res.json(hc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Estudiante ve sus asistencias de clases por materia - PÚBLICO
router.get(
  "/estudiantes/:estudianteId/materias/:materiaId/asistencias-clases",
  async (req, res) => {
    try {
      const { estudianteId, materiaId } = req.params;

      const em = await getEstudianteMaterias(estudianteId, materiaId);
      if (em.length === 0) {
        return res.status(404).json({
          error: "No estás matriculado en esa materia.",
        });
      }

      const periodos = em.map((x) => x.periodo_id);
      const hc = await Models.HorarioClase.findAll({
        include: [
          {
            model: Models.DocenteMateria,
            where: {
              materia_id: materiaId,
              periodo_id: { [Op.in]: periodos },
            },
            attributes: [],
          },
        ],
        attributes: [
          "id",
          "dia_semana",
          "hora_inicio",
          "hora_fin",
          "ubicacion",
        ],
      });

      const horarioIds = hc.map((h) => h.id);
      const asistencias = await Models.AsistenciaClase.findAll({
        where: {
          estudiante_id: estudianteId,
          horario_clase_id: { [Op.in]: horarioIds },
        },
        include: [
          {
            model: Models.HorarioClase,
            attributes: ["dia_semana", "hora_inicio", "hora_fin", "ubicacion"],
          },
        ],
        order: [["fecha", "DESC"]],
      });

      res.json({
        materiaId,
        total: asistencias.length,
        asistencias,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Estudiante ve todas sus asistencias de asesorías - PROTEGIDO
router.get(
  "/estudiantes/:id/asistencias-asesorias",
  verifyToken,
  roleMiddleware(["ESTUDIANTE"]),
  async (req, res) => {
    try {
      const estudianteId = req.params.id;
      const asistencias = await Models.AsistenciaAsesoria.findAll({
        where: { estudiante_id: estudianteId },
        include: [
          {
            model: Models.HorarioAsesoria,
            include: [
              { model: Models.Asesoria, attributes: ["materia_id"] },
              {
                model: Models.Docente,
                include: [
                  {
                    model: Models.Usuario,
                    attributes: { exclude: ["password"] },
                  },
                ],
              },
            ],
            attributes: ["dia_semana", "hora_inicio", "hora_fin", "ubicacion"],
          },
        ],
        order: [["fecha_hora", "DESC"]],
      });
      res.json(asistencias);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Estudiante ve asistencias de asesorías por materia - PROTEGIDO
router.get(
  "/estudiantes/:id/materias/:materiaId/asistencias-asesorias",
  verifyToken,
  roleMiddleware(["ESTUDIANTE"]),
  async (req, res) => {
    try {
      const { id: estudianteId, materiaId } = req.params;
      const asistencias = await Models.AsistenciaAsesoria.findAll({
        where: { estudiante_id: estudianteId },
        include: [
          {
            model: Models.HorarioAsesoria,
            include: [
              {
                model: Models.Asesoria,
                where: { materia_id: materiaId },
                attributes: [],
              },
            ],
            attributes: ["dia_semana", "hora_inicio", "hora_fin", "ubicacion"],
          },
        ],
        order: [["fecha_hora", "DESC"]],
      });

      res.json({
        materiaId,
        totalAsistencias: asistencias.length,
        asistencias,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Estudiante ve los horarios de asesorías por materia - PÚBLICO
router.get(
  "/estudiantes/:id/materias/:materiaId/horarios-asesorias",
  async (req, res) => {
    try {
      const { id: estudianteId, materiaId } = req.params;

      // Verificar matrícula…
      const em = await Models.EstudianteMateria.findAll({ where: { estudiante_id: estudianteId, materia_id: materiaId } });
      if (em.length === 0) {
        return res
          .status(404)
          .json({ error: "No estás matriculado en esa materia." });
      }

      // Obtener IDs de asesoría
      const periodos = em.map((e) => e.periodo_id);
      const asesorias = await Models.Asesoria.findAll({
        where: { materia_id: materiaId, periodo_id: { [Op.in]: periodos } },
        attributes: ["id"],
      });
      const asesoriaIds = asesorias.map((a) => a.id);
      if (asesoriaIds.length === 0) {
        return res.json({ materiaId, total: 0, horarios: [] });
      }

      // **Incluir explícitamente** Docente → Usuario
      const horarios = await Models.HorarioAsesoria.findAll({
      where: { asesoria_id: { [Op.in]: asesoriaIds } },
      include: [
        {
          model: Models.Asesoria,
          include: [
            {
              model: Models.Docente,
              include: [
                {
                  model: Models.Usuario,
                  attributes: { exclude: ["password"] },
                },
              ],
            },
          ],
            attributes: [], // opcional para no duplicar datos
          },
        ],
        order: [
          ["dia_semana", "ASC"],
          ["hora_inicio", "ASC"],
        ],
      });

      res.json({
        materiaId,
        total: horarios.length,
        horarios,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);


// Estudiante ve todas sus asistencias de Amigo Académico - PROTEGIDO
router.get(
  "/estudiantes/:id/asistencias-amigos",
  verifyToken,
  roleMiddleware(["ESTUDIANTE"]),
  async (req, res) => {
    try {
      const estudianteId = req.params.id;
      const asistencias = await Models.AsistenciaAmigoAcademico.findAll({
        where: { estudiante_id: estudianteId },
        include: [
          {
            model: Models.HorarioAmigoAcademico,
            include: [
              { model: Models.AmigoAcademico, attributes: ["materia_id"] },
            ],
            attributes: ["dia_semana", "hora_inicio", "hora_fin", "ubicacion"],
          },
        ],
        order: [["fecha_hora", "DESC"]],
      });
      res.json(asistencias);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Estudiante ve asistencias de Amigo Académico por materia - PROTEGIDO
router.get(
  "/estudiantes/:id/materias/:materiaId/asistencias-amigos",
  verifyToken,
  roleMiddleware(["ESTUDIANTE"]),
  async (req, res) => {
    try {
      const { id: estudianteId, materiaId } = req.params;
      const asistencias = await Models.AsistenciaAmigoAcademico.findAll({
        where: { estudiante_id: estudianteId },
        include: [
          {
            model: Models.HorarioAmigoAcademico,
            include: [
              {
                model: Models.AmigoAcademico,
                where: { materia_id: materiaId },
                attributes: [],
              },
            ],
            attributes: ["dia_semana", "hora_inicio", "hora_fin", "ubicacion"],
          },
        ],
        order: [["fecha_hora", "DESC"]],
      });

      res.json({
        materiaId,
        totalAsistencias: asistencias.length,
        asistencias,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
