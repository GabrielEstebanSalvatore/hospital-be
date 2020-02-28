const Cliente = require('../models/clientes');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarCliente = async (req, res) => {
    // revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array() })
    }

    // extraer el email y password
    const { email, password } = req.body;

    try {
        // Revisar que sea un usuario registrado
        let cliente = await Cliente.findOne({ email });
        if(!cliente) {
            return res.status(400).json({msg: 'El cliente no existe'});
        }

        // Revisar el password
        const passCorrecto = await bcryptjs.compare(password, cliente.password);
        if(!passCorrecto) {
            return res.status(400).json({msg: 'Password Incorrecto' })
        }

        // Si todo es correcto Crear y firmar el JWT
         const payload = {
            cliente: {
                id: cliente.id
            }
        };

        // firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if(error) throw error;

            // Mensaje de confirmación
            res.json({ token  });
        });

    } catch (error) {
        console.log(error);
    }
}


// Obtiene que cliente esta autenticado
exports.ClienteAutenticado = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.cliente.id).select('-password');
        res.json({cliente});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}