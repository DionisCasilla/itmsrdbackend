var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConfigPlanesSchema = new Schema({
    configuracion       : String,
    isActive            : {type: Boolean, default: true},
    isShow              : {type: Boolean, default: true},
    date_created        : { type: Date, default: Date.now },
    date_updated        : { type: Date, default: Date.now }

});

mongoose.model('ConfigPlanes', ConfigPlanesSchema);