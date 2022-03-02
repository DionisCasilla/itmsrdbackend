var Clientes = require("mongoose").model("Clientes");
var Usuarios = require("mongoose").model("Usuarios");
var requestIp = require("request-ip");
const md5 = require('md5');
const { _getDataModel, _printConsole,_insertDataModel, _sendEmail } = require("../utils/utils");

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

exports.crearclientes = async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  console.log(__filename + " >> .create: " + JSON.stringify(req.body));

  req.body["ip"] = requestIp.getClientIp(req);

  var entity = new Clientes(req.body);



  let clienteExisteDoc = await _getDataModel(Clientes, {
    documento_numero: entity.documento_numero,
    documento_tipo: entity.documento_tipo,
  });


  let clienteExisteEmail = await _getDataModel(Clientes, {
    correo: entity.correo,
  });


  if (clienteExisteDoc.length > 0) {
    res.json({
      success: false,
      message: `Ya existe un cliente registrado con ${entity.documento_tipo==='C'?'Cedula':'Pasaporte'} No. ${entity.documento_numero}`,
    });
  } else if (clienteExisteEmail.length > 0) {
    res.json({
      success: false,
      message: `Ya existe un cliente registrado con este correo  ${entity.correo}`,
    });
  } else {

   //   _printConsole("Crear", mg.Usuarios);

    let crearCliente=await _insertDataModel(entity);


     //   _printConsole("Crear Cliente", crearCliente.result);

     if(!crearCliente.success){
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

    let crearUsario=await _insertDataModel(entityUsuarios);
    //_printConsole('Crear Usuarios',crearUsario);
  
    
    if(!crearUsario.success){
      res.json(crearUsario);
     }

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

     
     let sendEmail=await _sendEmail(crearUsario.result.correo,'Creacion de Cuenta Condominios RD',bodyEmail)

     console.log(sendEmail)
     res.json(crearCliente);
  
  


  }
};

exports.listpopclientes = async function (req, res, next) {
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
  //         res.json({success: false, message: "Error en la creación del Cliente."});
  //     }
  //     else {
  //         res.json({success: true, message: "Lista de Cliente creada exitosamente.", result: tiposusuarios});
  //     }
  // });
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
