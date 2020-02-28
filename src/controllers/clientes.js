const Cliente = require('../models/clientes');
const _ =require('underscore');
const bcryptjs = require('bcryptjs');
const { validationResult} =require('express-validator');
const jwt = require('jsonwebtoken');

class clientController {

  
    static async create(req, res){

         // revisar si hay errores
        const errores = validationResult(req);
        if( !errores.isEmpty() ) {
            return res.status(400).json({errores: errores.array() })
        }
        

        const{email,password} = req.body;

        try {
            // Revisar que el usuario registrado sea unico
            let cliente = await Cliente.findOne({ email });
    
            if(cliente) {
                return res.status(400).json({ msg: 'El cliente ya existe' });
            }
    
            // crea el nuevo usuario
            cliente = new Cliente(req.body);
    
            // Hashear el password
            const salt = await bcryptjs.genSalt(10);
            cliente.password = await bcryptjs.hash(password, salt );
    
            // guardar usuario
            await cliente.save();
    
            // Crear y firmar el JWT
            const payload = {
                cliente: {
                    id: cliente.id
                }
            };
    
            // firmar el JWT /*Revisar .env*/
            jwt.sign(payload, process.env.REACT_APP_PALABRA_SECRETA, {
                expiresIn: 3600 // 1 hora
            }, (error, token) => {
                if(error) throw error;
    
                // Mensaje de confirmación
                res.json({ token  });
            });
    
    
        } catch (error) {
            console.log(error);
            res.status(400).send('Hubo un error');
        }






        // let body = req.body;
        
        // let cliente = new Cliente({
        //     name: body.name,
        //     email: body.email,
        //     password: body.password,
        //     role: body.role,
        //     cliente: body.cliente
        // });

        // const {password} = req.body;
        // const salt = await bcryptjs.genSalt(10);
        // cliente.password = await bcryptjs.hash(password, salt);

        // try{
        //      // Revisar que el usuario registrado sea unico
        //     let cliente = await Cliente.findOne({ email });
    
        //     if(cliente) {
        //         return res.status(400).json({ msg: 'El usuario ya existe' });
        //     }

        // }catch{
        //     await cliente.save((err, clienteDB)=>{
        //         if (err) {
        //             return res.status(400).json({
        //                 ok: false,
        //                 err
        //             })
        //         } else {
        //             res.status(201).json({
        //                 ok: true,
        //                 cliente: cliente.id
        //             })

        //             //Crear el Token
        //             const payload = {
        //                 cliente:{
        //                     id:cliente.id
        //                 }
        //             }
        //             jwt.sign(payload, process.env.SECRETA,{
        //                 expiresIn:3600000
        //             }, (error, token)=>{
        //                 if (error ) throw error;
        //                 res.json({token})
        //             })
        //         }
        //     });
        // }

        

    };

    static async getAll(req, res) {

        await Cliente.find()
            .exec((err, clientes) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                Cliente.count((err, conteo) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        clientes,
                        cuantos: conteo
                    })
                })
            });
    };   

    static async getOne(req, res) {

        let id = req.params.id;

        Cliente.findById(id)
            .exec((err, clienteDB)=>{

                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                };
                if (!clienteDB){
                    return res.status(400).json({
                        ok:false,
                        err:{
                            message: 'El ID no es correcto'
                        }
                    });
                };
                res.json({
                    ok:true,
                    cliente:clienteDB
                })
        });
    };   

    static async updateCliente(req, res){
        let id = req.params.id;
        let body = _.pick(req.body,['name','email','role','turno']);

        await Cliente.findByIdAndUpdate(id,body,(err,clienteDB)=>{
            if (err){
                return res.status(400).json({
                   ok: false,
                   err
           })
            }else {
               res.status(200).json({
                   ok: true,
                   cliente:{
                        message: `El cliente ${clienteDB.name} fue actualizado`
                   } 
               })
           }
        }); 
    };

    static async deleted(req,res){
        const id = req.params.id;

        await Cliente.findByIdAndDelete(id,(err,clienteDB)=>{
            if (err){
                return res.status(500).json({
                   ok: false,
                   err
           })
            }else {
               res.status(200).json({
                   ok: true,
                   cliente:{
                        message: `El cliente ${clienteDB.name} fue eliminado`
                   } 
               })
           }
        })
    };

}

module.exports = clientController;