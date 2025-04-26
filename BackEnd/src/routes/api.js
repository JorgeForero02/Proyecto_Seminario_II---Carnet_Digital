// src/routes/index.js

import express from 'express';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import { verifyToken, roleMiddleware, canCreateAmigoAsistencia, canCreateAmigoHorario } from '../middlewares/auth.js';
import * as Models from '../models/index.js';
import { generateCrudControllers } from '../controllers/crudController.js';
import { validateFields } from '../validators/fieldValidator.js';
import { login } from '../controllers/authController.js';

const router = express.Router();

// Login
router.post('/login', login);

// Qué modelos son de vista pública para cualquier usuario autenticado
const publicViews = [
  'Facultad',
  'Departamento',
  'ProgramaAcademico',
  'HorarioAmigoAcademico',
  'HorarioAsesoria'
];

// Scopes restrictivos por modelo
const restrictedScopes = {
  // Sólo ADMIN ve todos; ESTUDIANTE y DOCENTE ven sólo su propio usuario
  Usuario: (req) => {
    if (req.user.roles.includes('ADMINISTRATIVO')) {
      return {};
    }
    return {
      where: { id: req.user.id }
    };
  },

  Materia: (req) => {
    if (req.user.roles.includes('ADMINISTRATIVO')) return {};
    const where = {};
    if (req.user.roles.includes('ESTUDIANTE')) {
      where.id = { [Op.in]: req.user.estudianteMaterias.map(em => em.materia_id) };
    }
    if (req.user.roles.includes('DOCENTE')) {
      where.id = { [Op.in]: req.user.docenteMaterias.map(dm => dm.materia_id) };
    }
    return { where };
  },

  HorarioClase: (req) => {
    if (req.user.roles.includes('ADMINISTRATIVO')) return {};
    const where = {};
    if (req.user.roles.includes('DOCENTE')) {
      where.docente_materia_id = { [Op.in]: req.user.docenteMaterias.map(dm => dm.id) };
    }
    if (req.user.roles.includes('ESTUDIANTE')) {
      where.id = { [Op.in]: req.user.horariosClases.map(hc => hc.id) };
    }
    return { where };
  },

  AsistenciaClase: (req) => {
    if (req.user.roles.includes('ADMINISTRATIVO')) return {};
    const where = {};
    if (req.user.roles.includes('ESTUDIANTE')) {
      where.estudiante_id = req.user.id;
    }
    if (req.user.roles.includes('DOCENTE')) {
      where.horario_clase_id = { [Op.in]: req.user.docenteHorarios.map(hc => hc.id) };
    }
    return { where };
  },

  AsistenciaAsesoria: (req) => {
    if (req.user.roles.includes('ADMINISTRATIVO')) return {};
    const where = {};
    if (req.user.roles.includes('ESTUDIANTE')) {
      where.estudiante_id = req.user.id;
    }
    if (req.user.roles.includes('DOCENTE')) {
      where.asesoria_id = { [Op.in]: req.user.asesorias.map(a => a.id) };
    }
    return { where };
  },

  AsistenciaAmigoAcademico: (req) => {
    if (req.user.roles.includes('ADMINISTRATIVO')) return {};
    const where = {};
    if (req.user.roles.includes('ESTUDIANTE')) {
      where.estudiante_id = req.user.id;
      where.horario_amigo_id = { [Op.in]: req.user.horariosAmigos.map(ha => ha.id) };
    }
    return { where };
  }
};

// Definición de recursos, rutas y permisos
const resources = {
  Usuario:                   { path: 'usuarios',           fields: ['cedula','nombres','apellidos','email','password'],                       roles: { all: ['ADMINISTRATIVO'] } },
  Rol:                       { path: 'roles',              fields: ['nombre'],                                                           roles: { all: ['ADMINISTRATIVO'] } },
  UsuarioRol:                { path: 'usuario-roles',      fields: ['usuario_id','rol_id'],                                               roles: { all: ['ADMINISTRATIVO'] } },
  Facultad:                  { path: 'facultades',         fields: ['nombre','codigo'],                                                   roles: { all: ['ADMINISTRATIVO'] } },
  Departamento:              { path: 'departamentos',      fields: ['nombre','facultad_id','codigo'],                                     roles: { all: ['ADMINISTRATIVO'] } },
  ProgramaAcademico:         { path: 'programas',          fields: ['nombre','codigo','facultad_id','modalidad'],                        roles: { all: ['ADMINISTRATIVO'] } },
  Estudiante:                { path: 'estudiantes',        fields: ['id','programa_id','semestre'],                                       roles: { all: ['ADMINISTRATIVO'] } },
  TipoContrato:              { path: 'tipos-contrato',     fields: ['nombre'],                                                           roles: { all: ['ADMINISTRATIVO'] } },
  Docente:                   { path: 'docentes',           fields: ['id','departamento_id','especialidad','tipo_contrato_id'],            roles: { all: ['ADMINISTRATIVO'] } },
  Administrativo:            { path: 'administrativos',    fields: ['id','departamento_id','cargo'],                                       roles: { all: ['ADMINISTRATIVO'] } },
  Materia:                   { path: 'materias',           fields: ['codigo','nombre','creditos','departamento_id'],                       roles: { all: ['ADMINISTRATIVO'] } },
  MateriaPrograma:           { path: 'materia-programas',  fields: ['materia_id','programa_id','semestre'],                               roles: { all: ['ADMINISTRATIVO'] } },
  PeriodoAcademico:          { path: 'periodos',           fields: ['codigo','nombre','fecha_inicio','fecha_fin'],                        roles: { all: ['ADMINISTRATIVO'] } },
  DocenteMateria:            { path: 'docente-materias',   fields: ['docente_id','materia_id','periodo_id','estado'],                     roles: { all: ['ADMINISTRATIVO'] } },
  HorarioClase:              { path: 'horario-clases',     fields: ['docente_materia_id','dia_semana','hora_inicio','hora_fin','ubicacion'], roles: { all: ['ADMINISTRATIVO'] } },
  EstudianteMateria:         { path: 'estudiante-materias',fields: ['estudiante_id','materia_id','periodo_id','estado'],                  roles: { all: ['ADMINISTRATIVO'] } },
  AsistenciaClase:           { path: 'asistencia-clases',  fields: ['estudiante_id','horario_clase_id','fecha','estado'],                 roles: { create: ['DOCENTE'], all: ['ADMINISTRATIVO'] } },
  TipoAsesoria:              { path: 'tipos-asesoria',     fields: ['nombre'],                                                           roles: { all: ['ADMINISTRATIVO'] } },
  Asesoria:                  { path: 'asesorias',          fields: ['docente_id','materia_id','tipo_asesoria_id','periodo_id'],           roles: { create: ['DOCENTE'], all: ['ADMINISTRATIVO'] } },
  HorarioAsesoria:           { path: 'horario-asesorias',  fields: ['asesoria_id','dia_semana','hora_inicio','hora_fin','ubicacion'],    roles: { create: ['DOCENTE'], all: ['ADMINISTRATIVO'] } },
  AsistenciaAsesoria:        { path: 'asistencia-asesorias',fields: ['horario_asesoria_id','estudiante_id','fecha_hora'],              roles: { create: ['DOCENTE'], all: ['ADMINISTRATIVO'] } },
  AmigoAcademico:            { path: 'amigos',             fields: ['estudiante_monitor_id','materia_id','periodo_id','cupo_maximo'],     roles: { all: ['ADMINISTRATIVO'] } },
  HorarioAmigoAcademico:     { path: 'horario-amigos',     fields: ['amigo_academico_id','dia_semana','hora_inicio','hora_fin','ubicacion'], roles: { create: ['ESTUDIANTE'], all: ['ADMINISTRATIVO'] }, customCreate: canCreateAmigoHorario },
  AsistenciaAmigoAcademico:  { path: 'asistencia-amigos',  fields: ['horario_amigo_id','estudiante_id','fecha_hora'],                   roles: { create: ['ESTUDIANTE'], all: ['ADMINISTRATIVO'] }, customCreate: canCreateAmigoAsistencia }
};

// Montaje automático de controladores y rutas
Object.entries(resources).forEach(([modelName, cfg]) => {
  const Model = Models[modelName];
  const options = {
    include: cfg.include || [],
    scope: restrictedScopes[modelName]
  };
  const ctrl  = generateCrudControllers(Model, modelName, options);
  const base  = `/${cfg.path}`;

  // GET ALL & GET ONE
  if (publicViews.includes(modelName)) {
    router.get(base, verifyToken, ctrl.findAll);
    router.get(`${base}/:id`, verifyToken, ctrl.findOne);
  } else if (restrictedScopes[modelName]) {
    router.get(base, verifyToken, roleMiddleware(['DOCENTE','ESTUDIANTE','ADMINISTRATIVO']), ctrl.findAll);
    router.get(`${base}/:id`, verifyToken, roleMiddleware(['DOCENTE','ESTUDIANTE','ADMINISTRATIVO']), ctrl.findOne);
  } else {
    router.get(base, verifyToken, roleMiddleware(cfg.roles.all), ctrl.findAll);
    router.get(`${base}/:id`, verifyToken, roleMiddleware(cfg.roles.all), ctrl.findOne);
  }

  // CREATE
  if (cfg.roles.create || cfg.roles.all) {
    const allowed = cfg.roles.create || cfg.roles.all;
    const chain = [verifyToken, roleMiddleware(allowed)];
    if (cfg.customCreate) chain.push(cfg.customCreate);
    chain.push(validateFields(cfg.fields), ctrl.create);
    router.post(base, ...chain);
  }

  // UPDATE & DELETE (sólo ADMINISTRATIVO)
  if (cfg.roles.all) {
    router.put(
      `${base}/:id`,
      verifyToken,
      roleMiddleware(cfg.roles.all),
      validateFields(cfg.fields),
      ctrl.update
    );
    router.delete(
      `${base}/:id`,
      verifyToken,
      roleMiddleware(cfg.roles.all),
      ctrl.delete
    );
  }
});

export default router;
