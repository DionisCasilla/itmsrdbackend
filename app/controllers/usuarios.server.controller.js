const md5 = require("md5");
const { _crearToken } = require("../utils/token.server.utils");
const { _getDataModel, _printConsole } = require("../utils/utils");

var TiposUsuarios = require("mongoose").model("TiposUsuarios");
var Usuarios = require("mongoose").model("Usuarios");

exports.list = function (req, res, next) {
  console.log("asas");
  res.json({ success: true, message: "prueba" });
  // Provincias.find({}, function(err, provincias) {
  //     if (err) {
  //         return next(err);
  //     }
  //     else {
  //         res.json({ success: true, message: provincias});
  //     }
  // }).sort({orden:1 ,provincia :1} );
};

exports.creartipousuarios = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  console.log(__filename + " >> .create: " + JSON.stringify(req.body));

  var entity = new TiposUsuarios(req.body);
  entity.save(function (err) {
    if (err) {
      console.log(__filename + " >> .create: " + JSON.stringify(err));
      res.json({
        success: false,
        message: "Error en la creación del Tipo Usuario.",
      });
    } else {
      res.json({
        success: true,
        message: "Tipo Usuario creada exitosamente.",
        result: entity,
      });
    }
  });
};

exports.listpoptipousuarios = async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  var tiposusuarios = await getListTipoUsuarios();

  res.json(tiposusuarios);

  //var entity = new TiposUsuarios(req.body);
  // TiposUsuarios
  // .find({isActive:true,isShow:true})
  // .select("-__v")
  // .exec(function(err,tiposusuarios) {
  //     if (err) {
  //         console.log(__filename + ' >> .create: ' + JSON.stringify(err));
  //         res.json({success: false, message: "Error en la creación del Tipo Usuario."});
  //     }
  //     else {
  //         res.json({success: true, message: "Lista de Tipo Usuario creada exitosamente.", result: tiposusuarios});
  //     }
  // });
};

exports.login =async function (req, res, next) {

// _printConsole("Login ",req.transaccionId)
 //res.transaccionId=req.transaccionId

  Usuarios
  .findOne({"documento_numero":req.body.documento_numero})
  .where("isActive").equals(true)
  .select("-__v -date_created -date_updated")
  .populate({
    path: 'cliente_id',
    match: { isActive: true },
    // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
    select: 'cliente plan_id _id'
  })
  .populate({
    path: 'tipo_usuario',
    match: {  isActive: true  },
    // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
    select: 'DescrpTipos isAdmin'
  })
  .exec(function (err, usuarioEntity) {
   // console.log(err)
    if (!usuarioEntity) {
      //  console.log('EEROR'+err)
        res.json({ success: false, message: "Usuarios no encontrado.",result:{} });
      } else {
       // console.log(usuarioEntity.password===md5(req.body.password))
        if(usuarioEntity.password!=md5(req.body.password)){
          res.json({ success: false, message: "Password Incorrecto!",result:{} });
        }else{
         // let recUsuario=usuarioEntity;
          
          // delete(usuarioEntity.password);
          // console.log(usuarioEntity);
          
          const dataToken={
            usuarios_id:usuarioEntity._id,
            documento_numero:usuarioEntity.documento_numero,
            cliente:usuarioEntity.cliente_id[0]
          }

 
          
          let _token= _crearToken(dataToken);
          if (!_token.success){
            res.json({success: false, message: "Error para genetar el token",result:{}});
          }

 // _printConsole("Entidad Usuario:",usuarioEntity);
          let infoUsuarios={
            "documento_tipo":usuarioEntity.documento_tipo,
            "documento_numero":usuarioEntity.documento_numero,
            "correo": usuarioEntity.correo,
            "cliente_id": usuarioEntity.cliente_id,
            "_id":usuarioEntity._id,
            "tipo_usuario":usuarioEntity.tipo_usuario,
            "usuario":usuarioEntity.usuario,
            "nombre":usuarioEntity.nombre,
            token:_token.token
          }


        //  _printConsole("Usuario",infoUsuarios)
          res.json({ success: true, message: "Usuarios encontrado.",result:infoUsuarios});
        }
        //    
      }
    });
};

async function getListTipoUsuarios() {
  var promise = new Promise(function (resolve, reject) {
    TiposUsuarios.find({ isActive: true, isShow: true })
      .select("-__v")
      .exec(function (err, tiposusuarios) {
        if (err) {
          console.log(__filename + " >> .create: " + JSON.stringify(err));
          reject({
            success: false,
            message: "Error en la creación del Tipo Usuario.",
          });
        } else {
          resolve({
            success: true,
            message: "Lista de Tipo Usuario creada exitosamente.",
            result: tiposusuarios,
          });
        }
      });
  });
  return promise;
}
