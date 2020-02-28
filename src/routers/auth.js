// Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Iniciar sesión
// http://localhost:4000/auth
router.post('/auth', 
    authController.autenticarCliente
);

// Obtiene el usuario autenticado
router.get('/auth',
    auth,
    authController.ClienteAutenticado
);
module.exports = router;