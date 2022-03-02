var tsr = require('../controllers/trsapi.server.controller.js');

module.exports = function(app) {
    app.route('/tsrapi/login').post(tsr.login);
    app.route('/tsrapi/citas').post(tsr.agenda);
    app.route('/tsrapi/citas/:id').post(tsr.agendadetalle);
    app.route('/tsrapi/listas').post(tsr.cargarList);
    app.route('/tsrapi/schedule').post(tsr.getSchedule);
    app.route('/tsrapi/updatecitas').post(tsr.actualizarEstatus);
    app.route('/tsrapi/crearecitas').post(tsr.crearcitas);
    app.route('/tsrapi/empresas').get(tsr.empresas);
    app.route('/tsrapi/actualizarpin').post(tsr.cambiarpin);

};