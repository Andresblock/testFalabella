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
            // console.log('se eliminarons los datos de estancias de vehiculos oficiales.')
            nuevoMes()
        } else {
            res.json({ Status: err.code, Menssage: 'El modulo consultado no existe.' })
        }
    });

    // Funcion para el reinicio del acumulado de tiempo para vehiculos residentes:
    function nuevoMes(){

        let vehiResidente = `UPDATE fbl_estancias SET tiempo_acumulado = 0 WHERE id_estancia IN 
        (SELECT a.id_estancia FROM fbl_estancias a LEFT JOIN fbl_vehiculos b ON a.id_vehiculo = b.id_vehiculo 
        WHERE b.tipo_vehiculo = 'Residente' )`

        mysqlConn.query(vehiResidente, (err,rows, fields)=>{
            if(!err){
                res.json({Status: 200, Message: 'Nuevo mes iniciado con exito.'})
            }else{
                res.json({Status: err.code, Message: 'Se ha presentado un problema al inicar nuevo mes.'})
            }
        })
    }


})

module.exports = router