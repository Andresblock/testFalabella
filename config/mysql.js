// Definicion de la conexion a MySQL:
const mysql = require('mysql');

/* Definicion de parametros requeridos:
    Al igual que el puerto en el app.js, es una buena practica tomarlos por las variables de entorno,
    como se especifico en el punto anterior, esto se recomienda realizarlo en ambientes productivos
*/

const host= 'mysql-acdesacomp.alwaysdata.net';
const user= '229164_agomez';
const password= 'ab3244262';
const database= 'acdesacomp_db';
    
// Definicion del metodo de conexion hacia la base de datos:

const mysqlConn = mysql.createConnection({

    host: host,
    user: user,
    password: password,
    database: database
});

mysqlConn.connect(function (err){
    if (err){
        console.log(err);
        return;
    }else{
        console.log('Conexion exitosa a la base de datos');
    }
});

module.exports = mysqlConn;