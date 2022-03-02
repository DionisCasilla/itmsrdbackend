var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const mongoosePaginate = require('mongoose-paginate-v2');

var InquilinosSchema = new Schema({
    nombre            : {type: String,   index: true},
    apodo             : {type: String,   default:""},
    documento_tipo    : {type: String,   default: "N",  index: true},
    documento_numero  : {type: String,   default: ""},
    fecha_nacimiento  : { type: Date, default: Date.now },
    sexo              : {type: String,   index: true},
    correo            : {type: String,   default:""},
    direccion         : {type: String,   default:""},
    no_casa           : {type: String,   default:""},
    telefono_movil    : {type: String,   default:""},
    telefono_casa     : {type: String,   default:""},
    isActive          : {type: Boolean,  default: true},
    tipo_inquilio     : {type: String,   default:"Propietario", index:true},
    usuario_id        : {type: Schema.Types.ObjectId, ref: 'Usuarios'},
    cliente_id        : {type: Schema.Types.ObjectId, ref: 'Clientes'},
    foto              : {type: String,   default:""},
    date_created      : { type: Date, default: Date.now },
    date_updated      : { type: Date, default: Date.now }
},{toJSON: {virtuals: true}, toObject: {virtuals: true}, autoIndex: false});

InquilinosSchema.virtual('_familiares_', {
    ref:'FamiliaInquilinos',             //Modelo Relacionado
    foreignField:'inquilino_id',  //ModeloRelacionado.campo
    localField:'_id',        //ModeloLocal.campo
    justOne: false
});

InquilinosSchema.virtual('_usuario_', {
    ref:'Usuarios',             //Modelo Relacionado
    foreignField:'_id',  //ModeloRelacionado.campo
    localField:'usuario_id',        //ModeloLocal.campo
    justOne: false
});


InquilinosSchema.plugin(mongoosePaginate);

mongoose.model('Inquilinos', InquilinosSchema);