// Definicion de la aplicacion:

const exprees = require('express')
const cors = require('cors')

const app = exprees()

// Definicion de middleware

app.use(cors())

// Especificacion de puerto:

const port = 3000; // El puerto puede especificarse por variable de entorno, esta practica se recomienda en ambientes productivos.

// Verificacion de inicio de la aplicacion:
app.listen(port, ()=>{
    console.log(`Aplicacion en el puerto ${port}`)
})
