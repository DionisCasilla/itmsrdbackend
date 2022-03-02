var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FamiliaInquilinosSchema = new Schema({
    inquilino_id      : {type: String,   index: true},
    parentesco        : {type: String,   default:""},
    nombre            : {type: String,   default:""},
    fecha_nacimiento  : {type: Date,     default: Date.now },
    sexo              : {type: String,   index: true},
    correo            : {type: String,   default:""},
    telefono_movil    : {type: String,   default:""},
    telefono_casa     : {type: String,   default:""},
    foto              : {type: String,   default:""},
    isActive          : {type: Boolean,  default: true},
    date_created      : {type: Date, default: Date.now },
    date_updated      : {type: Date, default: Date.now }
})




mongoose.model('FamiliaInquilinos', FamiliaInquilinosSchema);

