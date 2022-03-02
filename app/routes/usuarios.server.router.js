// var tipousuarios = require('../controllers/usuarios.server.controller.js');
var usuarios = require('../controllers/usuarios.server.controller.js');

module.exports = function(app) {
    app.route('/usuarios/tipousuarios').post(usuarios.creartipousuarios);
    app.route('/usuarios/tipousuarios').get(usuarios.listpoptipousuarios);
    app.route('/usuarios/login').post(usuarios.login);
   


};