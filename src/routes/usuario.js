const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/create', userController.crearUsuario);
router.post('/login', userController.obtenerUsuario);

module.exports = router;