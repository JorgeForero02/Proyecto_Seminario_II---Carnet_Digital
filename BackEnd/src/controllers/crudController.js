import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

export function generateCrudControllers(Model, name, options = {}) {
  return {
    create: async (req, res, next) => {
      try {
        if (name === 'Usuario' && req.body.password) {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        const entity = await Model.create(req.body);
        res.status(201).json(entity);
      } catch (err) {
        next(err);
      }
    },

    findAll: async (req, res, next) => {
      try {
        // Apply custom scope if provided
        const scopeOptions = options.scope ? options.scope(req) : {};
        const entities = await Model.findAll({
          include: options.include || [],
          ...scopeOptions
        });
        res.json(entities);
      } catch (err) {
        next(err);
      }
    },

    findOne: async (req, res, next) => {
      try {
        const { id } = req.params;
        const scopeOptions = options.scope ? options.scope(req) : {};
        let entity;
        if (scopeOptions.where) {
          // If scope includes a where, use findOne
          entity = await Model.findOne({
            where: { id, ...scopeOptions.where },
            include: options.include || []
          });
        } else {
          entity = await Model.findByPk(id, { include: options.include || [] });
        }
        if (!entity) return res.status(404).json({ message: `${name} no encontrado` });
        res.json(entity);
      } catch (err) {
        next(err);
      }
    },

    update: async (req, res, next) => {
      try {
        const { id } = req.params;
        const [updated] = await Model.update(req.body, { where: { id } });
        if (!updated) return res.status(404).json({ message: `${name} no encontrado` });
        const entity = await Model.findByPk(id);
        res.json(entity);
      } catch (err) {
        next(err);
      }
    },

    delete: async (req, res, next) => {
      try {
        const { id } = req.params;
        const deleted = await Model.destroy({ where: { id } });
        if (!deleted) return res.status(404).json({ message: `${name} no encontrado` });
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    }
  };
}