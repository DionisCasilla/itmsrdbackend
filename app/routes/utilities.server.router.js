var localidades = require('../controllers/localidades.server.controller.js');

module.exports = function(app) {
    app.route('/utilities/lprovincias').get(localidades.list);

};