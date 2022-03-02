var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UsuariosSchema = new Schema({
    nombre :  {type:String,  index: true},
    documento_tipo: {type:String, default: "N",  index: true},
    documento_numero:{type:String, default: ""},
    sexo: {type:String, index: true},
    correo: {type:String,default:""},
    tipo_usuario: { type: Schema.Types.ObjectId, ref: 'TiposUsuarios' },
    usuario:{type:String,require:true},
    password:{type:String,require:true},
    isActive: {type: Boolean, default: true},
    cliente_id:[{ type: Schema.Types.ObjectId, ref: 'Clientes'}],
    date_created : { type: Date, default: Date.now },
    date_updated : { type: Date, default: Date.now }
});

mongoose.model('Usuarios', UsuariosSchema);