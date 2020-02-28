const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const Cliente = require('../models/clientes'); 

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  // Match Email's Client
  const cliente = await Cliente.findOne({email: email});
  if (!cliente) {
    return done(null, false, { message: 'Cliente no encontrado.' });
  } else {
    // Match Password's User
    const match = await cliente.matchPassword(password);
    if(match) {
      return done(null, cliente);
    } else {
      return done(null, false, { message: 'Password incorrecto.' });
    }
  }

}));

passport.serializeUser((cliente, done)=>{
    done(null, cliente.id)
})

passport.deserializeUser((id, done)=>{
    Cliente.findById(id,(err,cliente)=>{
        done(err, cliente)
    })
})