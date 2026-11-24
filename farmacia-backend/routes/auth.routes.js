const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username y password son requeridos',
      });
    }

    const result = await db.execute(
      `SELECT u.id_usuario, u.username, u.password_hash, u.email, u.estado,
              r.nombre AS rol, e.nombre, e.apellido, e.id_sucursal
       FROM usuarios u
       JOIN roles r ON u.id_rol = r.id_rol
       LEFT JOIN empleados e ON u.id_empleado = e.id_empleado
       WHERE u.username = :username`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    const user = result.rows[0];

    if (user.ESTADO === 'I') {
      return res.status(401).json({
        success: false,
        message: 'Usuario desactivado',
      });
    }

    const validPassword = await bcrypt.compare(password, user.PASSWORD_HASH);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    // Actualizar último acceso
    await db.execute(
      'UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id_usuario = :id',
      [user.ID_USUARIO]
    );

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.ID_USUARIO,
        username: user.USERNAME,
        email: user.EMAIL,
        rol: user.ROL,
        nombre: user.NOMBRE,
        apellido: user.APELLIDO,
        id_sucursal: user.ID_SUCURSAL,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        token,
        user: {
          id: user.ID_USUARIO,
          username: user.USERNAME,
          email: user.EMAIL,
          rol: user.ROL,
          nombre: user.NOMBRE,
          apellido: user.APELLIDO,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/register
router.post('/register', authMiddleware, async (req, res, next) => {
  try {
    const { username, password, email, id_empleado, id_rol } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.execute(
      `INSERT INTO usuarios (username, password_hash, email, id_empleado, id_rol)
       VALUES (:username, :password_hash, :email, :id_empleado, :id_rol)
       RETURNING id_usuario INTO :id`,
      {
        username,
        password_hash: hashedPassword,
        email,
        id_empleado: id_empleado || null,
        id_rol,
        id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER },
      }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: { id_usuario: result.outBinds.id[0] },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/profile
router.get('/profile', authMiddleware, async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

module.exports = router;
