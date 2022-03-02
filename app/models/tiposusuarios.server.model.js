var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TiposUsuariosSchema = new Schema({
    DescrpTipos         : String,
    isActive            : {type: Boolean, default: true},
    isShow              : {type: Boolean, default: true},
    isAdmin             : {type: Boolean, default: false},
    date_created        : {type: Date, default: Date.now },
    date_updated        : Date 
});

mongoose.model('TiposUsuarios', TiposUsuariosSchema);