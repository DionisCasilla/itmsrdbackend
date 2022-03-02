var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlanesSettingSchema = new Schema({
    plan_id             : String,
    config_id           : String,
    parametro           : Number,
    isShow              : {type: Boolean, default: true},
    isActive            : {type: Boolean, default: true},
    date_created        : { type: Date, default: Date.now },
    date_updated        : { type: Date, default: Date.now }

},
{toJSON: {virtuals: true}, toObject: {virtuals: true}, autoIndex: false});


PlanesSettingSchema.virtual('_parametros_', {
    ref:'ConfigPlanes',             //Modelo Relacionado
    foreignField:'_id',             //ModeloRelacionado.campo
    localField:'config_id',        //ModeloLocal.campo
    justOne: true
});

mongoose.model('PlanesSetting', PlanesSettingSchema);