// var Clientes = require("mongoose").model("Clientes");
// var requestIp = require('request-ip');
const OneSignal = require("onesignal-node");
const sql = require("mssql");
const { json } = require("body-parser");
const { promises } = require("fs");
const nodemailer = require("nodemailer");
const {_mlCL} = require("../utils/trsapi.server.utils")

const sqlConfig = {
  user: "DB_A4454E_ITMSPLUS_admin",
  password: "sa@1234567890",
  database: "DB_A4454E_ITMSPLUS",
  server: "sql5053.site4now.net",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false, // change to true for local dev / self-signed certs
  },
};


exports.empresas = async function (req, res, next) {
  const { user, password, empresa } = req.body;
  try {
    // make sure that any items are correctly URL encoded in the connection string
    let pool = await sql.connect(sqlConfig);
    let result2 = await pool
      .request()
      .execute("jsonAppEmpresa");

    //console.dir(result2.recordset[0][""])
    let result = JSON.parse(result2.recordset[0]["result"]);
    console.log(result);
   // await sendMail();
    if (result[0]["EstatusID"] === "OK") {
      res.json({
        success: true,
        message: "Listado de Empresas",
        result: result,
      });
    } else {
      res.json({ success: false, message: "Empresa Invalido", result: null });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err });
  }
};

exports.login = async function (req, res, next) {
  const { user, password, empresa } = req.body;
  try {
    // make sure that any items are correctly URL encoded in the connection string
    let pool = await sql.connect(sqlConfig);
    let result2 = await pool
      .request()
      .input("InterID", sql.VarChar(50), "TRS")
      .input("UserID", sql.VarChar(50), user)
      .input("PwrdID", sql.VarChar(50), password)
      .execute("jsonAppLogin");

    //console.dir(result2.recordset[0][""])
    let result = JSON.parse(result2.recordset[0]["result"]);
    console.log(result);
   // await sendMail();
    if (result[0]["EstatusID"] === "OK") {
      res.json({
        success: true,
        message: "Usuario VALIDADO",
        result: result[0],
      });
    } else {
      res.json({ success: false, message: "Usuario Invalido", result: null });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err });
  }
};

exports.agenda = async function (req, res, next) {
  const { userId, rolId, interId } = req.body;

  try {
    // make sure that any items are correctly URL encoded in the connection string
    let pool = await sql.connect(sqlConfig);
    let result2 = await pool
      .request()
      .input("InterID", sql.VarChar(50), `${interId}`)
      .input("UserID", sql.VarChar(50), `${userId}`)
      .input("RolID", sql.VarChar(50), `${rolId}`)
      .execute("jsonAppAppointments");

    console.log(result2.recordset[0]);

    let result = JSON.parse(result2.recordset[0]["result"]);

    if (result[0]["EstatusID"] === "OK") {
      res.json({ success: true, message: "Consulta VALIDADO", result: result });
    } else {
      res.json({ success: false, message: "Consulta Invalido", result: null });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err, result: [] });
  }
};

exports.agendadetalle = async function (req, res, next) {
  const { userId, rolId, interId } = req.body;
  const { id } = req.params;

  _mlCL("Detalle",req.body)

  try {
    // make sure that any items are correctly URL encoded in the connection string
    let pool = await sql.connect(sqlConfig);
    let result2 = await pool
      .request()
      .input("InterID", sql.VarChar(50), `${interId}`)
      .input("DetalleId", sql.VarChar(50), `${id}`)
      .input("RolID", sql.VarChar(50), `${rolId}`)
      .execute("jsonAppAppointment");
    
    let result = JSON.parse(result2.recordset[0]["result"]);
// console.log(result)
    if (result[0]["EstatusID"] === "OK") {
     
      let dataParse = parseDetalleCitas(result[0]);
      // console.log(dataParse);
      res.json({
        success: true,
        message: "Detalle Citas Generado exitozamente!",
        result: dataParse,
      });
    } else {
      res.json({ success: false, message: "Usuario Invalido", result: null });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error inesperado",result:null });
  }
};

exports.getSchedule = async function (req, res, next) {
  const { userId, rolId, interId } = req.body;
  console.log(req.body);
  try {
    // make sure that any items are correctly URL encoded in the connection string
    let pool = await sql.connect(sqlConfig);
    let result2 = await pool
      .request()
      .input("InterID", sql.VarChar(50),`${interId}` )
      .input("UserID", sql.VarChar(50), `${userId}`)
      .input("RolID", sql.VarChar(50), `${rolId}`)
      .execute("jsonAppEvents");

    let result = JSON.parse(result2.recordset[0]["result"]);

    //if (result[0]["EstatusID"] === "OK") {
    console.log(result);
    //  let dataParse = parseDetalleCitas(result[0]);

    res.json({
      success: true,
      message: "Schedule generado Exitosamente!",
      result: result,
    });
    // } else {
    //   res.json({ success: false, message: "Schedule Invalido", result: null });
    // }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err });
  }
};

exports.cargarList = async function (req, res, next) {
  const { detalleId, rolId, empresa } = req.body;
  var ddlist = {};
  var list = ["Medicos", "Tecnicos", "CentrosMedicos", "Ars", "Motivos"]; //"Ars",
  try {
    for await (const tipo of list) {
      // make sure that any items are correctly URL encoded in the connection string

      let resp = await consultarTipos(tipo);

      ddlist[tipo] = resp;
    }

    res.json({
      success: true,
      message: "Listado para dropdown",
      result: ddlist,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error inesperado",result:null });
  }
};

exports.actualizarEstatus = async function (req, res, next) {


  try {
    
    _mlCL("Parametros Actualizar",req.body);
   
    const { userId, rolId, interID,citaID,estatusID,dateID,hourID,reasonID,notes } = req.body;
    
    
    let inter_ID=  interID==""?"TRS":interID;
    // console.log(inter_ID)
    let pool = await sql.connect(sqlConfig);
    let result2 = await pool
      .request()
      .input("InterID",     sql.VarChar(50), `${inter_ID}`)
      .input("UserID",      sql.VarChar(50), `${userId}`)
      .input("RolID",       sql.VarChar(50), `${rolId}`)
      .input("CitaID",      sql.VarChar(50), `${citaID}`)
      .input("EstatusID",   sql.VarChar(50), `${estatusID}`)
      .input("DateID",      sql.VarChar(50), `${dateID}`)
      .input("HourID",      sql.VarChar(50), `${hourID}`)
      .input("ReasonID",    sql.VarChar(50), `${reasonID}`)
      .input("Notes",       sql.VarChar(50), `${notes}`)
      .execute("jsonAppChangeStatus");

  

    let result = JSON.parse(result2.recordset[0]["result"]);


    console.log(result);
    if (result[0]["EstatusID"] === "OK") {
      res.json({ success: true, message: result.Message, result: result });
    } else {
      res.json({ success: false, message: "Consulta Invalido", result: null });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err, result: [] });
  }
};


exports.crearcitas=async function (req,res,next) {
 
  const { userId, rolId, interID,autID,arsID,dateID,hourID,patientID,centerID } = req.body;

  _mlCL("Body Crear Citas",req.body)
 
  //--SOLICITAR CITA 
  try {
    // make sure that any items are correctly URL encoded in the connection string
    let pool = await sql.connect(sqlConfig);
    let result2 = await pool
      .request()
      .input("InterID",   sql.VarChar(50), `${interID}`)
      .input("UserID",    sql.VarChar(50), `${userId}`)
      .input("RolID",     sql.VarChar(50), `${rolId}`)
      .input("CenterID",  sql.VarChar(50), `${centerID}`)
      .input("DateID",    sql.VarChar(50), `${dateID}`)
      .input("HourID",    sql.VarChar(50), `${hourID}`)
      .input("PatientID", sql.VarChar(50), `${patientID}`)
      .input("ArsID",     sql.VarChar(50), `${arsID}`)
      .input("AutID",     sql.VarChar(50), `${autID}`)
      .execute("jsonAppRequest");


      // jsonAppRequest 'trs','p.aybar','T','TRS-0095','20-06-2021','17:00','JUAN PEREZ','',''
  
  console.log(result2.recordset[0]["result"]);
 
 
  let result = JSON.parse(result2.recordset[0]["result"]);

   // _mlCL("Crear Cita",JSON.parse(result[0]))

    if (result[0].EstatusID === "OK") {
      sendMail(result[0]);
      res.json({ success: true, message:result[0]["Message"], result: result });
    } else {
      res.json({ success: false, message: "Cita Invalido", result: null });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err, result: [] });
  }


}


exports.cambiarpin=async function (req,res,next) {

  const {interID,userId,pwrdID1,pwrdID2,pwrdID3}=req.body

  //--SOLICITAR CITA 
  try {
    // make sure that any items are correctly URL encoded in the connection string
    let pool = await sql.connect(sqlConfig);
    let result2 = await pool
      .request()
      .input("InterID",     sql.VarChar(50),   `${interID}`)
      .input("UserID",      sql.VarChar(50),   `${userId}`)
      .input("PwrdID1",     sql.VarChar(50),   `${pwrdID1}`)
      .input("PwrdID2",     sql.VarChar(50),   `${pwrdID2}`)
      .input("PwrdID3",     sql.VarChar(50),   `${pwrdID3}`)

      .execute("jsonAppChangePassword");


      // jsonAppRequest 'trs','p.aybar','T','TRS-0095','20-06-2021','17:00','JUAN PEREZ','',''
  
    console.log(result2.recordset[0]);

    let result = JSON.parse(result2.recordset[0]["result"]);

    if (result[0]["EstatusID"] === "OK") {
      res.json({ success: true, message:  result[0]["Message"], result: result });
    } else {
      res.json({ success: false, message: result[0]["Message"], result: null });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err, result: [] });
  }


}


exports.crearNotificaciones = async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  console.log(__filename + " >> .create: " + JSON.stringify(req.body));
  let respuesta = await sentNotification(req.body);
  res.json(respuesta);
};



const sentNotification = async (params) => {
  console.log(params);
  const { appId, apiKey, data } = params;

  // With custom API endpoint
  const client = new OneSignal.Client(appId, apiKey);

  // See all fields: https://documentation.onesignal.com/reference/create-notification
  const notification = data;

  let result;

  try {
    const response = await client.createNotification(notification);
    const { body } = response;
    result = {
      success: true,
      message: "Notificacion enviada exitosamente.!",
      result: body,
    };
  } catch (e) {
    if (e instanceof OneSignal.HTTPError) {
      // When status code of HTTP response is not 2xx, HTTPError is thrown.
      result = {
        success: false,
        message: e,
        result: null,
      };
    }
  }
  return result;
};

const parseDetalleCitas = (parseData) => {
  var data = {
    Id: parseData.Id,
    EstatusID: parseData.EstatusID,
    CitaID: parseData.CitaID, // '46F19041-52E2-4020-AD9C-EC04B579BF3A',
    CitaFecha: parseData.CitaFecha, // '01-06-2021',
    CitaHora: parseData.CitaHora, // '10:parseData.//00',
    CitaMedico: parseData.CitaMedico, // 'AMBAR PEREZ',
    CitaMedicoTel: parseData.CitaMedicoTel, // '809-000-0000',
    CitaCentroMedico: parseData.CitaCentroMedico, // 'HOSPITAL JUAN PABLO PINA',
    CitaCentroMedicoUrl1: parseData.CitaCentroMedicoUrl1, // 'https:parseData.////goo.gl/maps/5i5bSDhLMQZiLRVd8',
    CitaCentroMedicoUrl2: parseData.CitaCentroMedicoUrl2, // '18.418810372048693, -70.11470563208941',
    CitaMateriales: parseData.CitaMateriales, // [ [Object], [Object], [Object], [Object], [Object] ],
    CitaComentarios: parseData.CitaComentarios, // [ [Object] ],
    btnCtrl: [
      {
        label: "Cirugia Realizada",
        visible: parseData.CtrlRealizar,
        color: parseData.ColorRealizar,
        id: 3,
      },

      {
        label: "Suspender Cirugia",
        visible: parseData.CtrlSuspender,
        color: parseData.ColorSuspender,
        id: 5,
      },
      {
        label: "Cancelar Cirugia",
        visible: parseData.CtrlAnular,
        color: parseData.ColorAnular,
        id: 5,
      },
      {
        label: "Re-Programar Cirugia",
        visible: parseData.CtrlReProgramar,
        color: parseData.ColorReProgramar,
        id: 4,
      },
      {
        label: "Repetir Terapi",
        visible:  parseData.CtrlRepetir,
        color: parseData.ColorRepetir,
        id: 99,
      },
    ],
    CtrlFechaHora: parseData.CtrlFechaHora,
    CtrlMotivo: parseData.CtrlMotivo,
    CtrlNotas: parseData.CtrlNotas,
    EstadoColor: parseData.EstadoColor,
    CitaARS: parseData.CitaARS,
    Message: parseData.Message,
  };

  return data;
};

async function consultarTipos(tipo) {
  // let promise = new Promise((resolve, reject) => {
  let pool = await sql.connect(sqlConfig);
  let result2 = await pool
    .request()
    .input("InterID", sql.VarChar(50), "TRS")
    .input("ListID", sql.VarChar(50), tipo)
    // .input("DetalleId", sql.VarChar(50), `46F19041-52E2-4020-AD9C-EC04B579BF3A`)
    // .input("RolID", sql.VarChar(50), `t`)
    .execute("jsonAppLists");

  let result = JSON.parse(result2.recordset[0]["result"]);
  //console.log(result);

  return result;
  //     resolve()

  // });

  // return promise;
}

async function actualizarmateriales(objecto) {
  // let promise = new Promise((resolve, reject) => {
  let pool = await sql.connect(sqlConfig);
  let result2 = await pool
    .request()
    .input("InterID", sql.VarChar(50), "TRS")
    .input("UserID", sql.VarChar(50), tipo)
    .input("RolID ", sql.VarChar(50), tipo)
    .input("MatID ", sql.VarChar(50), tipo)
    .input("Qty ", sql.VarChar(50), tipo)
 

    .execute("jsonAppChangeMaterials");

  let result = JSON.parse(result2.recordset[0]["result"]);
  //console.log(result);

  return result;
  //     resolve()

  // });

  // return promise;
}

exports.sentNotification = sentNotification;


// function printConsole(titulo,data) {
//    console.log("====================") 
//    console.log(`     ${titulo}      `) 
//    console.log("====================") 
//    console.log("") 
//    console.log(data) 
//    console.log("") 
//    console.log("====================") 


// }

// async..await is not allowed in global scope, must use a wrapper
async function sendMail({EmailTo, EmailSubject, EmailBody}) {

 //try {
     // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: true, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: 'trs.itmsrd@outlook.com',
        pass: 'ItmsApp$TRS'
    }
});


  // setup e-mail data, even with unicode symbols
var mailOptions = {
  from: `Booking APP <trs.itmsrd@outlook.com>`, // sender address (who sends)
  to: EmailTo,//'ing.dionisc@gmail.com', // list of receivers (who receives)
  subject: EmailSubject,//'TRANSERSA APP ', // Subject line
  // text: 'Hello world ', // plaintext body
  html:EmailBody 
  // `<div>
  // <div><strong>Estimados,</strong></div>
  // <br />
  // <div>Solicito&nbsp;por&nbsp;esta&nbsp;v&iacute;a&nbsp;la&nbsp;planificaci&oacute;n&nbsp;de&nbsp;cirug&iacute;a</div>
  // <div><strong>Fecha</strong>:&nbsp;dd-mm-aaaa</div>
  // <div><strong>Hora</strong>:&nbsp;hh:mm</div>
  // <div><strong>CM</strong>:&nbsp;centro&nbsp;medico&nbsp;(es&nbsp;opcional)</div>
  // <div><strong>Paciente</strong>:&nbsp;paciente</div>
  // <br />
  // <div><strong>Motivos</strong>:&nbsp;motivo&nbsp;(es&nbsp;opcional)</div>
  // <br /><br />
  // <div>Cualquier&nbsp;duda&nbsp;quedamos&nbsp;a&nbsp;sus&nbsp;ordenes.</div>
  // <br /><br /><br />
  // <div>Saludos&nbsp;cordiales.</div>
  // </div>`
};


// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
  if(error){
      return console.log(error);
  }

  console.log('Message sent: ' + info.response);
});
  // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: 'TRANSERSA APP', // sender address
//     to: "ing.dionisc@gmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: `Estimados,

//     Solicito por esta vía la planificación de cirugía
//     Fecha: dd-mm-aaaa
//     Hora: hh:mm
//     CM: centro medico (es opcional)
//     Paciente: paciente
    
//     Motivos: motivo (es opcional)
    
    
//     Cualquier duda quedamos a sus ordenes.
    
    
    
//     Saludos cordiales. `, // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//   } catch (error) {
//     console.log(error)
//   }
 
 }

// main().catch(console.error);

/*
Port: 587
Server: smtp.live.com
User: trs.itmsrd@outlook.com
Password: ItmsApp$TRS
--------------------------
From: TRANSERSA APP
To: son varios destinatarios, vienen ahi jsonAppLists 'TRS','Correos'
Body:
Estimados,

Solicito por esta vía la planificación de cirugía
Fecha: dd-mm-aaaa
Hora: hh:mm
CM: centro medico (es opcional)
Paciente: paciente

Motivos: motivo (es opcional)


Cualquier duda quedamos a sus ordenes.



Saludos cordiales.

*/