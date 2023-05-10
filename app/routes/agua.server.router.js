const { listaSucursales, getSucursalById, updateLocationSucursal } = require("../controllers/agua.server.controller");

module.exports = function(app) {
    app.route('/agua/sucursales').get(listaSucursales);
    app.route('/agua/sucursales/:id').get(getSucursalById);
    app.route('/agua/sucursales/:id').put(updateLocationSucursal);

};