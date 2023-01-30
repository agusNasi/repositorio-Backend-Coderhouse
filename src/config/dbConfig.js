const mongoose = require('mongoose');
const options = require('./options.js');

//conectamos a la base de datos
mongoose.set('strictQuery', false);
mongoose.connect(options.mongoDb.url,(err)=>{
    if(err) return console.log(`Hubo un error al conectarse a la base de datos ${err}`);
    console.log("conexion a la base de datos exitosa :)")
});