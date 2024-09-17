const mysql = require('mysql');

const db = mysql.createConnection({
    host:'databases.c76su0oueias.eu-north-1.rds.amazonaws.com',
    user:'admin',
    password:'zJ7FWze2M.BiKww',
    database:'delivery'
});

db.connect(function(error){
    if(error)throw error;
    console.log('Conectado a la Base de Datos con éxito');
});

module.exports = db;