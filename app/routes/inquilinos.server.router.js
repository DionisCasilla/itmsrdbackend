var inquilinos = require('../controllers/inquilinos.server.controller.js');
var inquilinosfamiliares = require('../controllers/inquilinosfamiliares.server.controller.js');

module.exports = function(app) {

    app.route('/inquilinos/listpop').get(inquilinos.listInquilinos);
    app.route('/inquilinos/dropdonw').get(inquilinos.listDropDown);
    app.route('/inquilinos').post(inquilinos.createInquilino);
    app.route('/inquilinos/update/:id').post(inquilinos.inquilinoPerfilUpdate);
    app.route('/inquilinos/:id').get(inquilinos.inquilinoPerfil);
    app.route('/inquilinos/familiares/:idTitular').post(inquilinosfamiliares.createInquilinoFamiliar);


};