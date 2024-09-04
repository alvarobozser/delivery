const mysql = require('mysql');

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'zJ7FWze2M.BiKww',
    database:'delivery'
});

db.connect(function(error){
    if(error)throw error;
    console.log('Conectado a la Base de Datos con éxito');
});

module.exports = db;