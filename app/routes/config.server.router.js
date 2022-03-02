var config = require('../controllers/config.server.controller.js');

module.exports = function(app) {
    app.route('/config/planes').post(config.createplanes);
    app.route('/config/planessetup').post(config.createplanesSetting);
    app.route('/config/parameters').post(config.createConfigparameter);
    app.route('/config/listpopplanes').get(config.listpopPlanes);
    app.route('/config/nacionalidad').post(config.createNacionalidades);
    app.route('/config/listpopnacionalidad').get(config.listpopNacionalidades);
    app.route('/config/registroclientes').get(config.listdropdown);


};