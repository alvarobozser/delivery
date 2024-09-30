const express = require ('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors= require('cors');
const { error } = require('console');
const passport = require('passport');
const multer = require('multer');
const io= require('socket.io')(server);



/**
 * Sockets
 * 
 */
const ordersSockets=require('./sockets/ordersSocket');


/**
 * RUTAS
 * 
 */

const usersRoutes = require('./routes/userRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const productRoutes  = require('./routes/productRoutes');
const addressRoutes = require('./routes/addressRoutes');
const ordersRoutes = require('./routes/orderRoutes');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port',port);

/**Llamada a sockets */
ordersSockets(io);


const upload = multer({
    storage:multer.memoryStorage()
});

/** LLAMADO RUTAS*/

usersRoutes(app,upload);
categoriesRoutes(app);
addressRoutes(app);
productRoutes(app,upload);
ordersRoutes(app);

/*Produccion*/
server.listen(3000, '0.0.0.0', function() {
    console.log('App NodeJS ' + process.pid + ' Iniciada...');
});

/*Local
server.listen(3000, '192.168.1.129', function() {
    console.log('App NodeJS ' + process.pid + ' Iniciada...');
});*/


app.get('/',(req,res)=>{
    res.send('Ruta Raiz del backend');
});

app.get('/test',(req,res)=>{
    res.send('Ruta Test del backend');
});

//ERROR Handlers
app.use((error,req,res,next)=>{
    console.log(error);
    res.status(error.status||500).send(error.stack);
});

//200 Ok
//404 Not Found
//500 Internal Server Error