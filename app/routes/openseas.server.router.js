var shipping = require('../controllers/itmsshipping.server.controller.js');

module.exports = function(app) {
    app.route('/itmsshipping/apptoken/:interID').get(shipping.apptoken);
    app.route('/itmsshipping/userlist').get(shipping.getUserDelivery);
    app.route('/itmsshipping/userkeyvalidate/:userkey/:userId').get(shipping.getUserDeliverykey);
    app.route('/itmsshipping/config/:interID').get(shipping.getconfig);
    app.route('/itmsshipping/findForm/:formId/:type').get(shipping.findForm);
    app.route('/itmsshipping/findFormPending').get(shipping.findFormPendientes);
    app.route('/itmsshipping/saveForm').post(shipping.saveForm);
    app.route('/itmsshipping/saveNewForm').post(shipping.saveNewForm);
    app.route('/itmsshipping/createForm/:language').get(shipping.createForm);
};