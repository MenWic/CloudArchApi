const express = require('express');//iniciar express
const mongoose = require('mongoose');//iniciar mongoose
const usuarioRoutes = require('./routes/Usuario.routes');
const archivoRoutes = require('./routes/Archivo.routes');
const carpetaRoutes = require('./routes/Carpeta.routes');
const papeleraRoutes = require('./routes/Papelera.routes');
const compartidosRoutes = require('./routes/Compartidos.routes');

const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
//igualar una constante a expresss
const app = express();
const corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
//lectura de json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//cors
app.use(cors(corsOptions));
//achivos estaticos 
app.use(express.static(path.join(__dirname, './upload')));
async function start() {
    try {
        const db = await mongoose.connect('mongodb://localhost:27017/cloudarch', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4
        });//establecer una conexion con la base de datos en mongodb

        console.log("Nos conectamos", db.connection.name);//mensaje de confirmacion
    } catch (error) {
        console.log("Nos nos conectamos");//mensaje de error
    }
}
start();//llamamos la funcion
app.use('/usuarios', usuarioRoutes);//las rutas para los usuarios seran leidas desde localost/usuario/
app.use('/archivos', archivoRoutes);
app.use('/carpetas', carpetaRoutes);
app.use('/papelera', papeleraRoutes);
app.use('/compartidos', compartidosRoutes);
app.listen(3000);//exuchando por el pueto 3000

