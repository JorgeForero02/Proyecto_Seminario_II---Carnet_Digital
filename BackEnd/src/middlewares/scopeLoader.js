/// src/middlewares/scopeLoader.js
import * as Models from "../models/index.js";
import { Op } from "sequelize";

export async function loadUserScopes(req, res, next) {
  const { id, roles } = req.user;

  // 1) Si es estudiante, cargamos sus matrículas
  if (roles.includes("ESTUDIANTE")) {
    req.user.estudianteMaterias = await Models.EstudianteMateria.findAll({
      where: { estudiante_id: id },
    });
  }

  // 2) Si es docente, cargamos sus asignaciones y luego estudiantes matriculados
  if (roles.includes("DOCENTE")) {
    // 2.1) Asignaciones del docente
    req.user.docenteMaterias = await Models.DocenteMateria.findAll({
      where: { docente_id: id },
    });

    // 2.2) Matrículas de estudiantes en esas asignaciones
    const or = req.user.docenteMaterias.map((dm) => ({
      materia_id: dm.materia_id,
      periodo_id: dm.periodo_id,
    }));
    if (or.length) {
      req.user.docenteEstudianteMaterias = await Models.EstudianteMateria.findAll({
        where: { [Op.or]: or },
      });
    }
  }

  next();
}
