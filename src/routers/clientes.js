const express = require('express');
const router = express.Router();
const { check } =require('express-validator')


const clienteController = require('../controllers/clientes');


router.post('/clientes', 
    [
        check('name', 'El nombre es olbligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe ser mínimo de 6 caracteres').isLength({min:6})
    ],
    async (req, res)=>{await clienteController.create(req,res);},
);

router.get('/clientes', async (req, res )=>{
    await clienteController.getAll(req, res);
});

router.get('/clientes/:id', async (req, res )=>{
    await clienteController.getOne(req, res);
});
router.put('/clientes/:id', async (req, res)=>{
    await clienteController.updateCliente(req,res);
});

router.delete('/clientes/:id', async (req,res)=>{
    await clienteController.deleted(req,res);
});


module.exports = router;