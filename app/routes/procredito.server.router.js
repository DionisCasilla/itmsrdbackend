var procredito = require('../controllers/procredito.server.controller.js');

module.exports = function(app) {
    app.route('/procredito/loginapi').get(procredito.loginApi);
    app.route('/procredito/submitForm').post(procredito.submitForm);
    app.route('/procredito/bCedula/:cedula').get(procredito.bCedula);
    app.route('/procredito/loaddata').get(procredito.loaddata);


};