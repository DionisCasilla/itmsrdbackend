var config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser');
const fs = require('fs');
var cors = require('cors')

const { validaciondeAuthenticacion,loggerserver, loggerResponseserver } = require('../app/utils/token.server.utils');
const { setupAxios } = require('../app/utils/axios.config');
const { default: axios } = require('axios');


    


module.exports = function() {
    var app = express();
    app.use(express.static('public'));
    app.use(cors())
    
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });

    setupAxios();
    app.use(bodyParser.json());
    app.use(validaciondeAuthenticacion);
    // app.use(loggerserver);
    // app.use(loggerResponseserver);

    // console.log(axios)
  
    // require('../app/routes/utilities.server.router.js')(app);
    // require('../app/routes/config.server.router.js')(app);
    // require('../app/routes/usuarios.server.router.js')(app);
    // require('../app/routes/clientes.server.router.js')(app);
    // require('../app/routes/notification.server.router.js')(app);
    // require('../app/routes/trsapi.server.router.js')(app);

    var routePath = "app/routes/"; //add one folder then put your route files there my router folder name is routers
    fs.readdirSync(routePath).forEach(function(file) {
        var route = '../' + routePath + file;
        //console.log("route:", route);
        require(route)(app);
    });

    console.log("\n======= Rutas Cargadas =======\n");
    return app;
};