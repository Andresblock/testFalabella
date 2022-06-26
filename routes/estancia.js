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

    // Definicion de query, para generar una salida, se debe identificar la entrada registrada segun la placa

    const vehiculo = `SELECT id_vehiculo, tipo_vehiculo FROM fbl_vehiculos WHERE placa = "${estancia.placa}"`;

    // Consulta datos del vehiculo:

    let datVehiculo = ''

    mysqlConn.query(vehiculo, (err, rows, fields) => {
        if (!err) {
            datVehiculo = JSON.stringify(rows[0])
            validaIngreso()
        }
    });

    // Definicion de funcion para tratar los datos del vehiculo para su salida:

    function validaIngreso() {
        let datSalida = JSON.parse(datVehiculo)

        // A partir de la informacion del vehiculo se consulta el ingreso:

        const ingreso = `SELECT id_estancia, id_vehiculo FROM fbl_estancias WHERE id_vehiculo = ${datSalida.id_vehiculo}
        AND IFNULL(fecha_salida, '0') = 0;`

        let datIngreso = ''

        mysqlConn.query(ingreso, (err, rows, fields) => {
            if (!err) {

                if (rows.length > 0) {
                    datIngreso = JSON.stringify(rows[0])
                    salida(datIngreso, datSalida)
                } else {
                    res.json({ Status: 201, Message: 'Este vehiculo no tiene un registro de ingreso.' })
                }

            }
        });

    }

    // Funcion de registro de la salida

    function salida(datIngreso, datSalida) {

        let infIngreso = JSON.parse(datIngreso)
        
        // Ejecucion de query para procesar la salida:

        let regSalida = '';

        switch (datSalida.tipo_vehiculo) {
            case 'Oficial':

                regSalida = `UPDATE fbl_estancias SET fecha_salida = NOW()
                WHERE id_vehiculo = ${infIngreso.id_vehiculo} AND IFNULL(fecha_salida, '0') = 0;`

                mysqlConn.query(regSalida, (err, rows, fields) => {
                    if (!err) {
                        res.json({ Status: 200, Message: 'Salida registrada con exito' })
                    } else {
                        res.json(err)
                    }
                });

                break;

            case 'No residente':

                regSalida = `UPDATE fbl_estancias SET fecha_salida = NOW(), tiempo_estancia = TIMESTAMPDIFF(MINUTE,fecha_ingreso,NOW()) 
                WHERE id_vehiculo = ${infIngreso.id_vehiculo} AND IFNULL(fecha_salida, '0') = 0;`

                mysqlConn.query(regSalida, (err, rows, fields) => {
                    if (!err) {
                        importe(infIngreso)
                    } else {
                        res.json(err)
                    }
                });

                function importe(infIngreso) {
                    let importe = ` SELECT tiempo_estancia tiempo, 0.2 valor, tiempo_estancia * 0.2 pago FROM fbl_estancias 
                    WHERE id_estancia = ${infIngreso.id_estancia};`

                    mysqlConn.query(importe, (err, rows, fields) => {
                        if (!err) {
                            let valImporte = rows[0].pago
                            res.json({ Status: 200, Message: 'Vehiculo No residente en salida', Importe: valImporte})

                        } else {
                            res.json(err)
                        }
                    });
                }


                break;

            default:
                break;
        }

    }

})

// Se exporta router como modulo generarl

module.exports = router;