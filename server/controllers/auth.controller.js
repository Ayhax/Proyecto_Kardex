const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '8h';

// POST /api/auth/login
async function login(req, res) {
  const { codigo_usuario, clave } = req.body;

  if (!codigo_usuario || !clave) {
    return res.status(400).json({ message: 'Usuario y contraseña son obligatorios.' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT id_usuario, codigo_usuario, nombre_usuario, clave, estado,
              es_admin_sistema, debe_cambiar_pass
       FROM usuarios WHERE codigo_usuario = ?`,
      [codigo_usuario]
    );

    // Mensaje genérico siempre, para no filtrar si el usuario existe o no
    const credencialesInvalidas = () =>
      res.status(401).json({ message: 'Usuario o contraseña incorrectos' });

    if (rows.length === 0) return credencialesInvalidas();

    const usuario = rows[0];

    if (usuario.estado !== 'A') {
      return res.status(403).json({ message: 'Usuario inactivo. Contacta al administrador.' });
    }

    const claveValida = await bcrypt.compare(clave, usuario.clave);
    if (!claveValida) return credencialesInvalidas();

    // Perfil real desde el SP — nunca se arma el JWT a mano sin pasar por la BD
    const [perfilRows] = await pool.query('CALL SP_Cargar_Perfil_Usuario(?)', [
      usuario.id_usuario,
    ]);
    const perfil = perfilRows[0]; // mysql2 devuelve [resultSet, metadata] para CALL

    const payload = {
      id_usuario: usuario.id_usuario,
      codigo_usuario: usuario.codigo_usuario,
      es_admin_sistema: !!usuario.es_admin_sistema,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    await pool.query('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id_usuario = ?', [
      usuario.id_usuario,
    ]);

    return res.json({
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        codigo_usuario: usuario.codigo_usuario,
        nombre_usuario: usuario.nombre_usuario,
        es_admin_sistema: !!usuario.es_admin_sistema,
        debe_cambiar_pass: !!usuario.debe_cambiar_pass,
      },
      perfil,
    });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

// POST /api/auth/cambiar-password  (requiere estar autenticado)
async function cambiarPassword(req, res) {
  const { clave_actual, nueva_clave, confirmacion } = req.body;
  const id_usuario = req.usuario.id_usuario; // inyectado por el middleware auth

  if (!clave_actual || !nueva_clave || !confirmacion) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }
  if (nueva_clave !== confirmacion) {
    return res.status(400).json({ message: 'La nueva contraseña y su confirmación no coinciden.' });
  }
  if (nueva_clave.length < 8) {
    return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 8 caracteres.' });
  }

  try {
    const [rows] = await pool.query('SELECT clave FROM usuarios WHERE id_usuario = ?', [
      id_usuario,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const claveValida = await bcrypt.compare(clave_actual, rows[0].clave);
    if (!claveValida) {
      return res.status(401).json({ message: 'La contraseña actual es incorrecta.' });
    }

    const nuevoHash = await bcrypt.hash(nueva_clave, 12);

    await pool.query(
      'UPDATE usuarios SET clave = ?, debe_cambiar_pass = 0 WHERE id_usuario = ?',
      [nuevoHash, id_usuario]
    );

    return res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (err) {
    console.error('Error en cambiarPassword:', err);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

module.exports = { login, cambiarPassword };