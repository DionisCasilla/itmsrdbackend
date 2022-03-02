var procredito = require('../controllers/procredito.server.controller.js');

module.exports = function(app) {
    app.route('/procredito/loginapi').get(procredito.loginApi);
    app.route('/procredito/submitForm').post(procredito.submitForm);


};