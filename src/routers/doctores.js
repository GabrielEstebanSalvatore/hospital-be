const express = require('express');
const router = express.Router();

const docContrller = require('../controllers/doctores');

router.post('/doctores', async (req, res)=>{
    await docContrller.create(req,res);
    
});

router.get('/doctores', async (req, res )=>{
    await docContrller.getAll(req, res);
});

router.put('/doctores/:id', async (req, res)=>{
    await docContrller.updateDoctor(req,res);
});

router.delete('/doctores/:id', async (req,res)=>{
    await docContrller.deleted(req,res);
});




module.exports = router;






