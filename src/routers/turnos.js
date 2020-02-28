const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const TurnoController = require('../controllers/turnos');

router.post('/turnos',
    auth ,
    [
        check('name', 'El nombre del cliente es obligatorio').not().isEmpty()
    ]
    ,
    async (req, res)=>{
    await TurnoController.create(req,res);
    //console.log(req.body);    
});

router.get('/turnos',
    auth, 
    async (req, res )=>{
    await TurnoController.ObtenerTurnos(req, res);
});

router.put('/turnos/:id', 
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatoio').not().isEmpty()
    ],
    async (req, res)=>{
    await TurnoController.updateTurno(req,res);
});

router.delete('/turnos/:id',
    auth,
    async (req,res)=>{
    await TurnoController.eliminarTurno(req,res);
});
module.exports = router;