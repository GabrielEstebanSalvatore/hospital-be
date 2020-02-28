const Doctor = require('../models/doctores');
const _ =require('underscore');

class DocController {

    static async create(req , res){
    let body = req.body;
    let doctor = new Doctor({
        name: body.name,
        email: body.email,
        img: body.img,
        profession: body.profession

     });
     
        await doctor.save((err, doctorDB)=>{
    
         if (err){
             return res.status(400).json({
                ok: false,
                err
        })
         }else {
            res.status(201).json({
                ok: true,
                doctor: doctorDB
            })
        }
     });
    };

    static async getAll(req, res) {

        await Doctor.find()
            .exec((err, doctorDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                Doctor.count((err, conteo) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        doctorDB,
                        cuantos: conteo
                    })
                })
            });
    };

    static async updateDoctor(req, res){
        const id = req.params.id;
        let body = _.pick(req.body, ['name','img','email','profession', 'estado'])
        
        await Doctor.findByIdAndUpdate(id,body,(err,doctorDB)=>{
            if (err){
                return res.status(400).json({
                   ok: false,
                   err
           })
            }else {
               res.status(200).json({
                   ok: true,
                   doctor:{
                        message: `El doctor ${doctorDB.name} fue actualizado`
                   } 
               })
           }
        })    
    };
        
    static async deleted(req,res){
        const id = req.params.id;

        await Doctor.findByIdAndDelete(id,(err,doctorDB)=>{
            if (err){
                return res.status(500).json({
                   ok: false,
                   err
           })
            }else {
               res.status(200).json({
                   ok: true,
                   doctor:{
                        message: `El doctor ${doctorDB} fue eliminado`
                   } 
               })
           }
        })
    };
}

module.exports= DocController;