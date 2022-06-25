// Definicion de parametros y rutas para vehiculos:

const express = require('express')
const router = express.Router()
const mysqlConn = require('../config/mysql')
const { json } = require('express')

// Consulta de vehiculos:

router.get('/estancia', (req, res) => {

    const consulta = 'SELECT * FROM fbl_estancias';

    mysqlConn.query(consulta, (err, rows, fields) => {
        if (!err) {
            res.json(
                {
                    Status: 200,
                    Data: rows
                }
            )
        } else {
            res.json({ Status: err.code, Menssage: 'El modulo consultado no existe.' })
        }
    });

})

// Registro de estancia (entrada):

router.post('/estancia/entrada', (req, res) => {

    // Definicion de campos a insertar:    
    const estancia = req.body;

    // Definicion de query:
    const query = 'INSERT INTO fbl_estancias SET ?';

    // Consultar la placa del vehiculo:
    let idVehiculo = '';
    const placa = `SELECT id_vehiculo from fbl_vehiculos where placa = "${estancia.id_vehiculo}"`;

    mysqlConn.query(placa, (err, rows, fields) => {
        if (!err) {
            let id_vehiculo = rows[0].id_vehiculo
            idVehiculo = id_vehiculo
            // Se recupera la llave del vehiculo a traves de la placa, se procede al registro de la entrada:
            registraVehiculo()
        } else {
            res.json({ Status: 'No se ha podido crear el registro' });
        }
    });

    // Funcion para el registro de la entrada de un vehiculo:
    function registraVehiculo() {
        
        // Definicion del objeto vehiculo para el registro de entrada:
        let vehiculo = { id_vehiculo: idVehiculo };

        mysqlConn.query(query, [vehiculo], (err, rows, fields) => {
            if (!err) {
                res.json({ Status: 200, Menssage: 'Registro creado.', Id: rows.insertId });
            } else {
                res.json({ Status: 'No se ha podido crear el registro' });
            }
        });
    }

})

// Registro de estancia (salida):

router.post('/estancia/salida', (req, res) => {

    // Definicion de campos a insertar:    
    const estancia = req.body;

    // Definicion de query:
    const query = 'INSERT INTO fbl_estancias SET ?;';

    // Proceso normal de creacion de registros:

    mysqlConn.query(query, [estancia], (err, rows, fields) => {
        if (!err) {
            res.json({ Status: 200, Menssage: 'Registro creado.', Id: rows.insertId });
        } else {
            res.json({ Status: 'No se ha podido crear el registro' });
            console.log('El insert es:', query);
            console.log('los parametros son:', parametros);
        }
    });
})

// Se exporta router como modulo generarl

module.exports = router;