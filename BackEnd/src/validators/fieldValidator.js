import { body, validationResult } from 'express-validator';

export const validateFields = fields => [
  ...fields.map(field => body(field).exists().withMessage(`${field} es requerido`)),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];