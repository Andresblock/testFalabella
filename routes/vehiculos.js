// Definicion de parametros y rutas para vehiculos:

const express = require('express')
const router = express.Router()
const mysqlConn = require('../config/mysql')

// Consulta de vehiculos:

router.get('/vehiculos',(req,res)=>{
    
    const consulta= 'SELECT * FROM fbl_vehiculos';

    mysqlConn.query(consulta, (err, rows, fields)=>{
        if (!err){            
            res.json(
                {
                    Status: 200,
                    Data: rows
                }
            )
        }else{
            res.json({Status: err.code, Menssage: 'El modulo consultado no existe.'})
        }
    });
    
})

// Registro de vehiculos ( el front envia el estado):

router.post('/vehiculos/v1',(req,res) =>{
    
    // Definicion de campos a insertar:    
    const vehiculo = req.body;
    
    // Definicion de query:
    const query = 'INSERT INTO fbl_vehiculos SET ?';    

    // Proceso normal de creacion de registros:
    
    mysqlConn.query(query,[vehiculo],(err,rows,fields)=>{
        if( !err ){
            res.json({Status: 200, Menssage: 'Registro creado.' , Id: rows.insertId});
        }else{
            res.json({Status: 'No se ha podido crear el registro'});
        }
    });

})

// Registro de vehiculos (identificacion del tipo):

router.post('/vehiculos/v2/:tipo',(req,res) =>{
    
    // Definicion de campos a insertar:    
    const vehiculo = req.body

    /* Definicion del tipo de vehiculo: 

            1- vehiculo Oficial
            2- vehiculo Residente
            3- vehiculo No residente
    */
    const codtipo = req.params.tipo
    let tipo = ''
    
    switch (codtipo) {
        case "1":
            // Definicion del tipo Oficial:
            tipo = 'Oficial'
            break;
        case "2":
            // Definicion del tipo Residente:
            tipo = 'Residente'
            break;
        case "3":
            // Definicion del tipo No residente:
            tipo = 'No residente'
            break;
        default:
            tipo = ''
            break;
    }

    // Con base al tipo de vehiculo ya definido, se define el objeto vehiculo a registrar:
    const regVehiculo = { placa: vehiculo.placa , tipo_vehiculo: tipo }

    // Definicion de query:
    const query = 'INSERT INTO fbl_vehiculos SET ?';    

    // Proceso normal de creacion de registros:
    
    mysqlConn.query(query,[regVehiculo],(err,rows,fields)=>{
        if( !err ){
            res.json({Status: 200, Menssage: 'Registro creado.' , Id: rows.insertId});
        }else{
            res.json({Status: 'No se ha podido crear el registro'});
        }
    });
    
})

// Se exporta router como modulo generarl

module.exports = router;