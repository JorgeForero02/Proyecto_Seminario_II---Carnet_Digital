import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Usuario, Rol } from "../models/index.js";

dotenv.config();

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await Usuario.findOne({
      where: { email },
      include: [{ model: Rol, through: "UsuarioRol" }],
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Credenciales inválidas (correo)" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res
        .status(400)
        .json({ message: "Credenciales inválidas (contraseña)" });
    }

    const roles = user.Rols.map((r) => r.nombre);
    // El payload del JWT ya incluye el id y los roles
    const token = jwt.sign({ id: user.id, roles }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Además devolvemos el id en la respuesta
    res.json({ token, id: user.id });
  } catch (err) {
    next(err);
  }
};
