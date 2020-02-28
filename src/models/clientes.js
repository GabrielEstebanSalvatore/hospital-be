const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
//const bcrypt = require('bcryptjs');

let rolesValidos ={
    values:['ADMIN_ROLE', 'USER_ROLE'],
    message:'{VALUE} no es un rol válido'
}

let clienteSchema = new Schema({
name:{
    type: String,
    required: true
},
email: {
    type: String,
    unique:true,
    required: true
},
password: {
    type: String,
    required: true
},
role: {
    type: String,
    default: 'USER_ROLE',
    enum:rolesValidos
}
});

/*ELIMINA LA CONTRASEÑA*/
clienteSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}
clienteSchema.plugin(uniqueValidator, {message:'{PATH} debe ser único'})

module.exports = mongoose.model('Cliente', clienteSchema);