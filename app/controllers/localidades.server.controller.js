// var Provincias = require('mongoose').model('Provincia');
// var Municipios = require('mongoose').model('Municipio');
// var Sectores = require('mongoose').model('Sectores');

exports.list = function(req, res, next) {
    console.log("asas");
    res.json({ success: true, message: "prueba"});
    // Provincias.find({}, function(err, provincias) {
    //     if (err) {
    //         return next(err);
    //     }
    //     else {
    //         res.json({ success: true, message: provincias});
    //     }
    // }).sort({orden:1 ,provincia :1} );
};

