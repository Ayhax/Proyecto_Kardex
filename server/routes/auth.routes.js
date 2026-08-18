const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verificarToken } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/cambiar-password', verificarToken, authController.cambiarPassword);

module.exports = router;