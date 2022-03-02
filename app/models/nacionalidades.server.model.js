var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NacionalidadesSchema = new Schema({
    ID_NAC              : Number,
    PAIS_NAC            : String,
    GENTILICIO_NAC      : String,
    ALFA3_NAC           : String,
    ALFA2_NAC           : String,
    BANDERA_NAC         : String,
    isActive            : {type: Boolean, default: true},
    date_created        : { type: Date, default: Date.now },
    date_updated        : { type: Date, default: Date.now }

});

mongoose.model('Nacionalidades', NacionalidadesSchema);