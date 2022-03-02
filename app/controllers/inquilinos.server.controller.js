var Clientes = require("mongoose").model("Clientes");
var Usuarios = require("mongoose").model("Usuarios");
var Inquilino = require("mongoose").model("Inquilinos");
var requestIp = require("request-ip");
const md5 = require("md5");
var entityName = "Inquilino";
const {
  _getDataModel,
  _printConsole,
  _insertDataModel,
  _sendEmail,
  _validarEmpty,
  _isNumber,
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
  //     }
  // }).sort({orden:1 ,provincia :1} );
};

exports.listDropDown = async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  let data = Object();
  // _printConsole("AA")
  // let nacionalidades= await _getDataModel(Nacionalidades,{isActive:true},"-__v -date_created -date_updated");
  // let planes= await _getDataModel(Planes,{isActive:true,isVisible:true},"-__v -date_created -date_updated");

  // let nacionalidades= await _getDataModel(Nacionalidades,{isActive:true});
  // _printConsole("nacionalidades",nacionalidades);

  data.tiposdocumentos = [
    { id: "C", descripcion: "Cedula", mascara: "999-9999999-9" },
    { id: "P", descripcion: "Pasaporte", mascara: "" },
  ];

  data.tipoInquilino = [
    { id: "P", descripcion: "Propietario" },
    { id: "A", descripcion: "Alquilado" },
  ];

  data.parentesco = [
    { id: "1", descripcion: "Espos@" },
    { id: "2", descripcion: "Hijo" },
    { id: "3", descripcion: "Otros" },
  ];

  res.json({
    success: true,
    message: "Listas generada exitosamente.",
    result: data,
  });
};

exports.createInquilino = async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  console.log(__filename + " >> .create: " + JSON.stringify(req.body));

  var entity = new Inquilino(req.body);
  var userseccion = req.userseccion;

  entity.cliente_id = userseccion.cliente[0]._id;

  let InquilinoExisteDoc = await _getDataModel(Inquilino, {
    documento_numero: entity.documento_numero,
    documento_tipo: entity.documento_tipo,
  });

  let InquilinoExisteEmail = await _getDataModel(Clientes, {
    correo: entity.correo,
  });

  if (InquilinoExisteDoc.length > 0) {
    res.json({
      success: false,
      message: `Ya existe un Inquilino registrado con ${
        entity.documento_tipo === "C" ? "Cedula" : "Pasaporte"
      } No. ${entity.documento_numero}`,
    });
  } else if (InquilinoExisteEmail.length > 0) {
    res.json({
      success: false,
      message: `Ya existe un cliente registrado con este correo  ${entity.correo}`,
    });
  } else {
    // _printConsole("Crear", entity);

    let crearInquilino = await _insertDataModel(entity);

    if (!crearInquilino.success) {
      res.json(crearCliente);
    }

      entityUsuario=  {
    	documento_tipo:crearCliente.result.documento_tipo,
    	documento_numero: crearCliente.result.documento_numero,
    	correo: crearCliente.result.correo,
    	cliente_id: [crearCliente.result._id],
    	tipo_usuario:'60b590a05e58c45660827c20',
    	usuario:crearCliente.result.documento_numero,
    	password:md5("123456"),//id administrador
    	nombre:crearCliente.result.contacto

      }

      var entityUsuarios = new Usuarios(entityUsuario);

    // entityUsuarios.cliente_id=[crearCliente.result._id]

    //   let crearUsario=await _insertDataModel(entityUsuarios);
    //   _printConsole('Crear Usuarios',crearUsario);

    //   if(!crearUsario.success){
    // 	res.json(crearUsario);
    //    }

    res.json(crearInquilino);
  }
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

exports.inquilinoPerfil = (req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");
  req.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  const inquilinoId = req.params.id;

  Inquilino.findById(inquilinoId)
    .populate("usuario_id")
    .populate("usuario_id")
    .exec(async (error, entityInquilino) => {
      if (error)
        res.json({
          success: false,
          message: "Inquilino no encontrado",
          result: {},
        });

      res.json({
        success: true,
        message: "Lista de Cliente creada exitosamente.",
        result: entityInquilino,
        permisos: {
          crear: true,
          editar: true,
          eliminar: true,
        },
      });
    });
};

exports.inquilinoPerfilUpdate = (req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");
  req.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  try {
    const inquilinoId = req.params.id;
 
    _printConsole("Actualizar Perfil 2", _validarEmpty(req.body));
    _printConsole("Actualizar Perfil", req.body);
  
    var userseccion = req.userseccion;
  
    Inquilino.findById(inquilinoId)
    .exec(async (error, entityInquilino) => {
      if (error) {
        res.json({
          success: false,
          message: "Inquilino no encontrado",
          result: {},
        });
      } else {





        if (!_validarEmpty(req.body.nombre)) {
          entityInquilino.nombre = req.body.nombre;
        }
        if (!_validarEmpty(req.body.apodo)) {
          entityInquilino.apodo = req.body.apodo;
        }
        if (!_validarEmpty(req.body.documento_tipo)) {
          entityInquilino.documento_tipo = req.body.documento_tipo;
        }
        if (!_validarEmpty(req.body.documento_numero)) {
          entityInquilino.documento_numero = req.body.documento_numero;
        }
        if (!_validarEmpty(req.body.fecha_nacimiento)) {
          entityInquilino.fecha_nacimiento = req.body.fecha_nacimiento;
        }
        if (!_validarEmpty(req.body.sexo)) {
          entityInquilino.sexo = req.body.sexo;
        }
        if (!_validarEmpty(req.body.correo)) {
          entityInquilino.correo = req.body.correo;
        }
        if (!_validarEmpty(req.body.direccion)) {
          entityInquilino.direccion = req.body.direccion;
        }
        if (!_isNumber(req.body.no_casa)) {
          entityInquilino.no_casa = req.body.no_casa;
        }
        if (!_validarEmpty(req.body.telefono_movil)) {
          entityInquilino.telefono_movil = req.body.telefono_movil;
        }
        if (!_validarEmpty(req.body.telefono_casa)) {
          entityInquilino.telefono_casa = req.body.telefono_casa;
        }
        if (!_validarEmpty(req.body.isActive)) {
          entityInquilino.isActive = req.body.isActive;
        }
        if (!_validarEmpty(req.body.tipo_inquilio)) {
          entityInquilino.tipo_inquilio = req.body.tipo_inquilio;
        }
        if (!_validarEmpty(req.body.usuario_id)) {
          entityInquilino.usuario_id = req.body.usuario_id;
        }
        if (!_validarEmpty(req.body.foto)) {
          entityInquilino.foto = req.body.foto;
        }
  
        entityInquilino.date_updated = new Date();




        if(req.body.crearusuario){
          var  entityUsuario=  {
              documento_tipo:entityInquilino.documento_tipo,
              documento_numero: entityInquilino.documento_numero,
              correo: entityInquilino.correo,
              cliente_id: [entityInquilino.cliente_id],
              tipo_usuario:'60b590b65e58c45660827c23',
              usuario:entityInquilino.documento_numero,
              password:md5("123456"),//id administrador
              nombre:entityInquilino.nombre
        
              }
        
              var entityUsuarios = new Usuarios(entityUsuario);

             let resp=    await _insertDataModel(entityUsuarios)
             console.log(resp.result._id)
             entityInquilino.usuario_id=resp.result._id;


             let bodyEmail= 
             `<div>
             <div><strong>Estimados,</strong></div>
             <br />
             <div>Solicito&nbsp;por&nbsp;esta&nbsp;v&iacute;a&nbsp;la&nbsp;planificaci&oacute;n&nbsp;de&nbsp;cirug&iacute;a</div>
             <div><strong>Fecha</strong>:&nbsp;dd-mm-aaaa</div>
             <div><strong>Hora</strong>:&nbsp;hh:mm</div>
             <div><strong>CM</strong>:&nbsp;centro&nbsp;medico&nbsp;(es&nbsp;opcional)</div>
             <div><strong>Paciente</strong>:&nbsp;paciente</div>
             <br />
             <div><strong>Motivos</strong>:&nbsp;motivo&nbsp;(es&nbsp;opcional)</div>
             <br /><br />
             <div>Cualquier&nbsp;duda&nbsp;quedamos&nbsp;a&nbsp;sus&nbsp;ordenes.</div>
             <br /><br /><br />
             <div>Saludos&nbsp;cordiales.</div>
             </div>`;
        
             
             let sendEmail= _sendEmail(entityInquilino.correo,'Creacion de Cuenta Condominios RD',bodyEmail)
          }
  
        entityInquilino.save( function (err) {
          if (err) {
            console.log(__filename + " >> .update: " + JSON.stringify(err));
            res.json({
              success: false,
              message: `Error en la actualización de ${entityName}.`,
              result: {},
            });
          } else {
        
        
        
        
            res.json({
              success: true,
              message: `${entityName} se actualizó exitosamente. ${req.body.crearusuario==true?" Se estara enviando un correo al inquilino con la informacion para iniciar sesion":""}:`,
              result: entityInquilino,
            });
          }
        });
      }
    });
  } catch (error) {
    res.json({
      success: false,
      message: `Ocurrio un error inesperado: ${error.message}.`,
      result: {},
    });
  }
 
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
