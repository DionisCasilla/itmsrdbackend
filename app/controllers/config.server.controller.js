const { _getDataModel,_printConsole } = require('../utils/utils');

 var Planes = require('mongoose').model('Planes');
 var PlanesSetting = require('mongoose').model('PlanesSetting');
 var ConfigPlanes = require('mongoose').model('ConfigPlanes');
 var Nacionalidades = require('mongoose').model('Nacionalidades');


exports.list = function(req, res, next) {
   
    res.json({ success: true, message: "prueba"});
    // Provincias.find({}, function(err, provincias) {
    //     if (err) {
    //         return next(err);
    //     }
    //     else {
    //         res.json({ success: true, message: provincias});
    //     }
    // }).sort({orden:1 ,provincia :1} );
};


exports.createplanes = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    console.log(__filename + ' >> .create: ' + JSON.stringify(req.body));

    var entity = new Planes(req.body);
    entity.save(function(err) {
        if (err) {
            console.log(__filename + ' >> .create: ' + JSON.stringify(err));
            res.json({success: false, message: "Error en la creación del Planes."});
        }
        else {
            res.json({success: true, message: "Planes creada exitosamente.", result: entity});
        }
    });
};


exports.createplanesSetting = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    console.log(__filename + ' >> .create: ' + JSON.stringify(req.body));

    var entity = new PlanesSetting(req.body);
    entity.save(function(err) {
        if (err) {
            console.log(__filename + ' >> .create: ' + JSON.stringify(err));
            res.json({success: false, message: "Error en la creación del Planes."});
        }
        else {
            res.json({success: true, message: "Planes creada exitosamente.", result: entity});
        }
    });
};

exports.createConfigparameter = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    console.log(__filename + ' >> .create: ' + JSON.stringify(req.body));

    var entity = new ConfigPlanes(req.body);
    entity.save(function(err) {
        if (err) {
            console.log(__filename + ' >> .create: ' + JSON.stringify(err));
            res.json({success: false, message: "Error en la creación del Planes."});
        }
        else {
            res.json({success: true, message: "Planes creada exitosamente.", result: entity});
        }
    });
};


exports.createNacionalidades = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    console.log(__filename + ' >> .create: ' + JSON.stringify(req.body.nacionalidad.length));


    if(req.body.nacionalidad.length==0){
        var entity = new Nacionalidades(req.body);
        entity.save(function(err) {
            if (err) {
                console.log(__filename + ' >> .create: ' + JSON.stringify(err));
                res.json({success: false, message: "Error en la creación de la Nacionalidad."});
            }
            else {
                res.json({success: true, message: "Nacionalidad creada exitosamente.", result: entity});
            }
        });
    }else{
        // console.log(__filename + ' >> .create: ' + JSON.(req.body));

        Nacionalidades.insertMany(req.body.nacionalidad).then(result=> {
            console.log(`Successfully inserted ${result} items!`);
            return   res.json({success: true, message: "Nacionalidad creada exitosamente.", result: `Successfully inserted ${result.insertedIds} items!`});
        }).catch(err=>{
            console.log(__filename + ' >> .create: ' + JSON.stringify(err));
            res.json({success: false, message: `Error en la creación de la Nacionalidad. ${err}`});
        })
    }

  
};


exports.listpopPlanes = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    Planes
        .find({})
        .populate([
            {
                path: "_configuracion_",
                model: PlanesSetting,
                select: "config_id parametro",
                populate: [
                    {
                        path: "_parametros_",
                        model: ConfigPlanes,
                        select: "configuracion -_id"
                    }]
            },
        ])
        .exec(function(err, data) {
            if (err) {
                console.log(__filename + ' >> .list: ' + JSON.stringify(err));
                res.json({success: false, message: "Error en la lista de planes."});
            }
            else {
                delete (data.id);
                res.json({success: true, message: "Lista de planes generada exitosamente.", result: data}); 
            }
        });
};


exports.listpopNacionalidades = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    Nacionalidades
        .find({isActive:true})
        .exec(function(err, data) {
            if (err) {
                console.log(__filename + ' >> .list: ' + JSON.stringify(err));
                res.json({success: false, message: "Error en la lista de Nacionalidades."});
            }
            else {
                delete (data.id);
                res.json({success: true, message: "Lista de Nacionalidades generada exitosamente.", result: data}); 
            }
        });
};



exports.listdropdown =async function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let data = Object();
   // _printConsole("AA")
    let nacionalidades= await _getDataModel(Nacionalidades,{isActive:true},"-__v -date_created -date_updated");
    let planes= await _getDataModel(Planes,{isActive:true,isVisible:true},"-__v -date_created -date_updated");

  
  
    // let nacionalidades= await _getDataModel(Nacionalidades,{isActive:true});
    // _printConsole("nacionalidades",nacionalidades);
    

    data.nacionalidades=nacionalidades;
    data.planes=planes;
    data.idiomas=[{"id":"001",idioma:"Español"}]
    data.tiposdocumentos=[
        {"id":"C",descripcion:"Cedula",mascara:"999-9999999-9"},
        {"id":"P",descripcion:"Pasaporte",mascara:""},
    ]
  
    res.json({success: true, message: "Listas generada exitosamente.", result: data}); 
     
};

