// Definicion de la aplicacion:

const express = require('express')
const cors = require('cors')

const app = express()

// Definicion de middleware

app.use(cors())
app.use(express.json());

// Se hace referencia a las rutas generadas
app.use(require('./routes/vehiculos'));
app.use(require('./routes/estancia'));
app.use(require('./routes/mes'));
app.use(require('./routes/reporte'));

// Especificacion de puerto:

const port = 3000; // El puerto puede especificarse por variable de entorno, esta practica se recomienda en ambientes productivos.

// Verificacion de inicio de la aplicacion:
app.listen(port, ()=>{
    console.log(`Aplicacion en el puerto ${port}`)
})

