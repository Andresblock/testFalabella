// Definicion de parametros y rutas para vehiculos:

const express = require('express')
const router = express.Router()
const mysqlConn = require('../config/mysql')
const { json } = require('express')

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

// Registro de vehiculos:

router.post('/vehiculos',(req,res) =>{
    
    // Definicion de campos a insertar:    
    const vehiculo = req.body;
    
    // Definicion de query:
    const query = 'INSERT INTO fbl_vehiculos SET ?;';    

    // Proceso normal de creacion de registros:
    
    mysqlConn.query(query,[vehiculo],(err,rows,fields)=>{
        if( !err ){
            res.json({Status: 200, Menssage: 'Registro creado.' , Id: rows.insertId});
        }else{
            res.json({Status: 'No se ha podido crear el registro'});
            console.log('El insert es:',query);
            console.log('los parametros son:',parametros);
        }
    });
})

// Se exporta router como modulo generarl

module.exports = router;