var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlanesSchema = new Schema({
    plan                : String,
    descripcion         : String,
    precio              : Number,
    isVisible           : {type: Boolean, default: true},
    isActive            : {type: Boolean, default: true},
    date_created        : { type: Date, default: Date.now },
    date_updated        : { type: Date, default: Date.now }

},
{toJSON: {virtuals: true}, toObject: {virtuals: true}, autoIndex: false});

PlanesSchema.virtual('_configuracion_', {
    ref:'PlanesSetting',             //Modelo Relacionado
    foreignField:'plan_id',  //ModeloRelacionado.campo
    localField:'_id',        //ModeloLocal.campo
    justOne: false
});
mongoose.model('Planes', PlanesSchema);