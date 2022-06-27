// Definicion de parametros y rutas para vehiculos:

const express = require('express')
const router = express.Router()
const mysqlConn = require('../config/mysql')
const fs = require('fs')
const path = require('path')

// Ruta para realizar el inicio de mes

router.post('/reporte/pagoResidente', (req, res) => {

    let archivo = req.body.archivo
    
    /* Consulta de los datos segun el mes para:

            1. Eliminar los datos de las estancias de vehiculos Oficiales.
            2. Poner en 0 el tiempo estacionado de los vehiculos Residentes
    */
   
    // Consulta de los datos de vehiculos Oficiales para el mes anterior al que inicia:

    const reporte = `SELECT * FROM reporte_mes;`

    mysqlConn.query(reporte, (err, rows, fields) => {
        if (!err) {
            geReporte(JSON.stringify(rows))
        } else {
            res.json({ Status: err.code, Menssage: 'Se ha presentado un error en la consulta del reporte.' })
        }
    });

    // Funcion para generar el archivo del reporte:
    
    function geReporte(info){
        
        // Definicion de parametros para generar el archivo:
        let repo = JSON.parse(info)

        // Esta variable contiene las llaves del reporte, estos seran los titulos:
        let titulos = Object.keys(repo[0])

        // Esta variable, contiene los valores segun las llaves o lo que seran los datos:
        let datos = Object.values(repo)

        let reporte = '';

        titulos.forEach(t =>{
            reporte += t+'\t' 
        })

        // Adicion de un salto de linea a los titulos:
        reporte += '\n'

        // Construccion del texto para los datos:
        datos.forEach( d =>{
            let rep = Object.values(d)
            rep.forEach(d =>{
                reporte +=d+'\t\t\t'
            })
            reporte += '\n'
        })

        // Generacion del archivo:

        let ruta = path.join(__dirname,'../repositorio/')

        fs.appendFile(`${ruta}/${archivo}.txt`,reporte,'utf-8',(err)=>{
            if(err){
                // res.json({Status: 500, Message: 'Se ha presentado un error al momento de generar el reporte.'})
                console.log(err)
            }
            res.json({Status: 200, Message: 'Se ha generado el reporte.'})
        })

    }

})

module.exports = router