// Definicion de parametros y rutas para vehiculos:

const express = require('express')
const router = express.Router()
const mysqlConn = require('../config/mysql')

// Ruta para realizar el inicio de mes

router.get('/mes/nuevoMes', (req, res) => {
    
    /* Consulta de los datos segun el mes para:

            1. Eliminar los datos de las estancias de vehiculos Oficiales.
            2. Poner en 0 el tiempo estacionado de los vehiculos Residentes
    */
   
    // Consulta de los datos de vehiculos Oficiales para el mes anterior al que inicia:

    const estanciaOficial = `DELETE FROM fbl_estancias WHERE id_vehiculo IN (SELECT id_vehiculo FROM fbl_vehiculos WHERE tipo_vehiculo = 'Oficial')
    AND MONTH(fecha_ingreso) = MONTH(NOW())-1;`

    mysqlConn.query(estanciaOficial, (err, rows, fields) => {
        if (!err) {
            console.log('se eliminarons los datos de estancias de vehiculos oficiales.')
            res.json({Status: 200, Message: 'Nuevo mes iniciado con exito.'})
        } else {
            res.json({ Status: err.code, Menssage: 'El modulo consultado no existe.' })
        }
    });


})

module.exports = router