var Clientes = require("mongoose").model("Clientes");
var Usuarios = require("mongoose").model("Usuarios");

var FamiliaInquilinos = require("mongoose").model("FamiliaInquilinos");
var requestIp = require("request-ip");
const md5 = require("md5");
const {
  _getDataModel,
  _printConsole,
  _insertDataModel,
  _sendEmail,
} = require("../utils/utils");

exports.list = function (req, res, next) {
  console.log("asas");
  res.json({ success: true, message: "prueba" });
  // Provincias.find({}, function(err, provincias) {
  //     if (err) {
  //         return next(err);
  //     }
  //     else {
  //         res.json({ success: true, message: provincias});
  //     
  // }).sort({orden:1 ,provincia :1} );
};

// exports.listDropDown = async function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );

//   let data = Object();
//   // _printConsole("AA")
//   // let nacionalidades= await _getDataModel(Nacionalidades,{isActive:true},"-__v -date_created -date_updated");
//   // let planes= await _getDataModel(Planes,{isActive:true,isVisible:true},"-__v -date_created -date_updated");

//   // let nacionalidades= await _getDataModel(Nacionalidades,{isActive:true});
//   // _printConsole("nacionalidades",nacionalidades);

//   data.tiposdocumentos = [
//     { id: "C", descripcion: "Cedula", mascara: "999-9999999-9" },
//     { id: "P", descripcion: "Pasaporte", mascara: "" },
//   ];

//   data.tipoInquilino = [
//     { id: "P", descripcion: "Propietario" },
//     { id: "A", descripcion: "Alquilado" },
//   ];




//   res.json({
//     success: true,
//     message: "Listas generada exitosamente.",
//     result: data,
//   });
// };

exports.createInquilinoFamiliar = async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  console.log(__filename + " >> .create: " + JSON.stringify(req.body));

  var entity = new FamiliaInquilinos(req.body);
  var userseccion = req.userseccion;
  console.log(req.params.idTitular)

  entity.cliente_id = userseccion.cliente._id;



    let crearInquilino = await _insertDataModel(entity);

    if (!crearInquilino.success) {
      res.json(crearCliente);
    }


    res.json(crearInquilino);
 // }
};

exports.listInquilinos = async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  var clienteId = req.userseccion.cliente._id;

  var cliente_id = clienteId; // userseccion.cliente

  //console.log(req.query)

  const limit = req.query.lenght || 10;
  const page = req.query.page || 1;
  const nombre = req.query.nombreInquilino || "";

  var filter = {
    cliente_id: cliente_id,
  };

  if (nombre != "") {
    filter.nombre = { $regex: new RegExp(nombre, "ig") };
  }

  var options = {
    lean: true,
    page: page,
    limit: limit,
    select: "-date_updated -__v",
    sort: { date_created: "asc" },
    populate: "usuario_id",
  };

  //console.log(filter);

  Inquilino.paginate(filter, options, function (err, result) {
    if (err)
      res.json({
        success: false,
        message: "Lista de Cliente creada exitosamente.",
        result: {},
      });

    //  delete(result.docs)

    res.json({
      success: true,
      message: "Lista de Cliente creada exitosamente.",
      result: result,
    });
  });

  // 	Inquilino
  // 			.find(filter)
  // 			.select("-date_updated -__v")
  // 			.populate("usuario_id")
  // 			.limit(pageOptions.limit)
  // 			.skip(pageOptions.skip)
  // 			.sort({
  // 				date_created: 'asc'
  // 			})
  // 			.exec(async (error,entityInquilino)=>{
  // 				if(error)return   res.json({success: false,
  // 					message: "Lista de Cliente creada exitosamente.",
  // 					 result: {}});

  //  let totali= await Inquilino.count(filter);

  // 				return  res.json({
  // 					success: true,
  // 					message: "Lista de Cliente creada exitosamente.",
  // 					result: entityInquilino,
  // 					totalitem: totali,
  // 					pages:parseInt(totali/pageOptions.limit)
  // 				})

  // 			})
};

async function getListClientes() {
  var promise = new Promise(function (resolve, reject) {
    Clientes.find({ isActive: true })
      .select("-__v")
      .exec(function (err, clientes) {
        if (err) {
          console.log(__filename + " >> .create: " + JSON.stringify(err));
          reject({
            success: false,
            message: "Error en la creación del Cliente.",
          });
        } else {
          resolve({
            success: true,
            message: "Lista de Cliente creada exitosamente.",
            result: clientes,
          });
        }
      });
  });
  return promise;
}
