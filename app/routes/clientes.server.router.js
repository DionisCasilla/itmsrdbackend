var clientes = require('../controllers/clientes.server.controller.js');

module.exports = function(app) {
    app.route('/clientes').post(clientes.crearclientes);
   
};