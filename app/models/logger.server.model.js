var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LoggerSchema = new Schema({
    url                 : String,
    metodo              : {type:String},
    ip                  : String,
    usuario             : String,
    request             : String,
    response            : String,
    ip                  : String,
    date_created        : { type: Date, default: Date.now },
    date_updated        : { type: Date, default: Date.now }

});

mongoose.model('Logger', LoggerSchema);