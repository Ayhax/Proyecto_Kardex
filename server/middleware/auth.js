const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No se proporcionó token de acceso.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id_usuario, codigo_usuario, es_admin_sistema }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}

module.exports = { verificarToken };