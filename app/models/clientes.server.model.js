var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ClientesSchema = new Schema({
    cliente             : String,
    contacto            : {type:String,require:true},
    documento_tipo      : String,
    documento_numero    : String,
    tipo                : {type:String, default:"60b590a05e58c45660827c20"},
    correo              : String,
    nacionalidad        : String,
    idioma              : String,
    ip                  : String,
    plan_id             : String,
    isActive            : { type: Boolean, default: true},
    date_created        : { type: Date, default: Date.now },
    date_updated        : { type: Date, default: Date.now }

});

mongoose.model('Clientes', ClientesSchema);