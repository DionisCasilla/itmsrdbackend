var shipping = require('../controllers/itmsshipping.server.controller');

module.exports = function(app) {
    app.route('/itmsshipping/apptoken/:interID').get(shipping.apptoken);
    app.route('/itmsshipping/userlist').get(shipping.getUserDelivery);
    app.route('/itmsshipping/config/:interID').get(shipping.getconfig);
    app.route('/itmsshipping/findForm/:formId/:type').get(shipping.findForm);
    app.route('/itmsshipping/saveForm').post(shipping.saveForm);


};