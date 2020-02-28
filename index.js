const express = require('express');
var cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
//const methodOverride = require('method-override')

//Initializations
const app= express();
require('./src/config/passport');
require('dotenv').config({ path: 'variables.env' });

//Middleware
//para no recibir las imagenes (extended:true)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
//app.use(methodOverride('_method'));
app.use(session({
    secret:'mysecretapp',
    resave:true,
    saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());

//Setting
app.set('port', process.env.PORT || 4000);
app.use(cors());

//Routes
app.use(require('./src/routers/doctores'));
app.use(require('./src/routers/turnos'));
app.use(require('./src/routers/clientes'));
app.use(require('./src/routers/auth'));

//Static Files 
app.use(express.static(path.join(__dirname, 'public')));


//base de datos 
mongoose.connect('mongodb://localhost:27017/hospital',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.error(err)); 

//Server is listenning
app.listen(app.get('port'), ()=>{console.log('Server on port', app.get('port') );
})