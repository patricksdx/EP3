const jwt = require('jsonwebtoken')

const User = require('../models/User')
const config = require('../config/global')

exports.crearUsuario = async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body); 

        const { nombres, apellidos, correo, password } = req.body;

        if (!nombres || !apellidos || !correo || !password) {
            return res.status(400).send('Todos los campos son requeridos');
        }

        const user = new User({
            nombres,
            apellidos,
            correo,
            password
        });

        user.password = await user.encryptPassword(user.password);
        
        await user.save();

        const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 60 * 60 * 24
        });

        res.json({ auth: true, token });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.obtenerUsuario = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).send('Correo o contraseña no proporcionados');
        }

        const user = await User.findOne({ correo: correo });

        if (!user) return res.status(404).send('El usuario no existe');

        const validPassword = await user.validatePassword(password);

        if (!validPassword) return res.status(401).json({ auth: false, token: null });

        const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 60 * 60 * 24,
        });

        res.json({ auth: true, token, user: { nombres: user.nombres, apellidos: user.apellidos } });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};
