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
        
        if (name === 'Usuario') {
          const userData = entity.toJSON();
          delete userData.password;
          return res.status(201).json(userData);
        }
        
        res.status(201).json(entity);
      } catch (err) {
        console.error(err);
        next(err);
      }
    },

    findAll: async (req, res, next) => {
      try {
        const scopeOptions = options.scope ? options.scope(req) : {};
        const baseIncludes = options.include || [];
        const scopeIncludes = scopeOptions.include || [];
        const includes = [...baseIncludes, ...scopeIncludes];

        const attributes = name === 'Usuario'
          ? { exclude: ['password'] }
          : undefined;

        // Removemos include para no propagarlo dos veces
        const { include: _inc, ...scopeRest } = scopeOptions;

        const entities = await Model.findAll({
          include: includes,
          attributes,
          ...scopeRest
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
        const baseIncludes = options.include || [];
        const scopeIncludes = scopeOptions.include || [];
        const includes = [...baseIncludes, ...scopeIncludes];
        const attributes = name === 'Usuario'
          ? { exclude: ['password'] }
          : undefined;
    
        let entity;
        if (scopeOptions.where) {
          // Combina el id solicitado con el filtro de scope usando AND
          const where = {
            [Op.and]: [
              { id: Number(id) },
              scopeOptions.where
            ]
          };
          entity = await Model.findOne({ where, include: includes, attributes });
        } else {
          entity = await Model.findByPk(id, { include: includes, attributes });
        }
    
        if (!entity) {
          return res.status(404).json({ message: `${name} no encontrado` });
        }
        res.json(entity);
      } catch (err) {
        next(err);
      }
    },
    

    update: async (req, res, next) => {
      try {
        const { id } = req.params;
        if (name === 'Usuario' && req.body.password) {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const [updated] = await Model.update(req.body, { where: { id } });
        if (!updated) {
          return res.status(404).json({ message: `${name} no encontrado` });
        }

        const entity = name === 'Usuario'
          ? await Model.findByPk(id, { attributes: { exclude: ['password'] } })
          : await Model.findByPk(id);

        res.json(entity);
      } catch (err) {
        next(err);
      }
    },

    delete: async (req, res, next) => {
      try {
        const { id } = req.params;
        const deleted = await Model.destroy({ where: { id } });
        if (!deleted) {
          return res.status(404).json({ message: `${name} no encontrado` });
        }
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    }
  };
}
