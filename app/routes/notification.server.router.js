var notificaciones = require('../controllers/notificaciones.server.controller.js');

module.exports = function(app) {
    app.route('/notificacion').post(notificaciones.crearNotificaciones);
    app.route('/notificacion').get(notificaciones.list);
};