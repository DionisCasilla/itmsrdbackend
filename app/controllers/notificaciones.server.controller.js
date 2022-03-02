// var Clientes = require("mongoose").model("Clientes");
// var requestIp = require('request-ip');
const OneSignal = require("onesignal-node");
const sql = require('mssql');
const { json } = require("body-parser");
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






exports.list = async function (req, res, next) {
console.log()
 const {user,password,}=req.body;
  try {
    // make sure that any items are correctly URL encoded in the connection string
    let pool= await sql.connect(sqlConfig)
    let result2 = await pool.request()
            .input('InterID', sql.VarChar(50),'TRS')
            .input('UserID', sql.VarChar(50), user)
            .input('PwrdID', sql.VarChar(50), password)

            .execute('jsonAppLogin')
     console.dir(result2.recordset[0][""])
     let result=JSON.parse( result2.recordset[0][""]);
     console.log(result);

    res.json({ success: true, message: result });
   } catch (err) {
     console.log(err)
    res.json({ success: false, message: err });
   }

  
};



exports.crearNotificaciones =async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  console.log(__filename + " >> .create: " + JSON.stringify(req.body));
  let respuesta= await sentNotification(req.body)
  res.json(respuesta)

  // var entity = new Clientes(req.body);

  // entity.save(function (err) {
  //   if (err) {
  //     console.log(__filename + " >> .create: " + JSON.stringify(err));
  //     res.json({
  //       success: false,
  //       message: "Error en la creación del Cliente.",
  //     });
  //   } else {
  //     res.json({
  //       success: true,
  //       message: "Cliente creado exitosamente.!",
  //       result: entity,
  //     });
  //   }
  // });
};

function runStoredProcedure() {
  return pool2Connect.then((pool) => {
      pool.request() // or: new sql.Request(pool2)
      .input('input_parameter', sql.Int, 10)
      .input('input_parameter', sql.Int, 10)
      .output('output_parameter', sql.VarChar(50))
      .execute('procedure_name', (err, result) => {
          // ... error checks
          console.dir(result)
      })
  }).catch(err => {
      // ... error handler
  })
}


 const sentNotification=async (params)=> {
   console.log(params)
  const { appId, apiKey,data } = params;

  // With custom API endpoint
  const client = new OneSignal.Client(appId, apiKey);

  // See all fields: https://documentation.onesignal.com/reference/create-notification
  const notification =data

   let result;

   console.log(notification)

  try {
    const response = await client.createNotification(notification);
    const { body } = response;
  result={
      success: true,
      message: "Notificacion enviada exitosamente.!",
      result: body,
    };
  } catch (e) {
    if (e instanceof OneSignal.HTTPError) {
      // When status code of HTTP response is not 2xx, HTTPError is thrown.
      result={
        success: false,
        message: e,
        result: null,
      };
    }
  }
  return result;
}


exports.sentNotification=sentNotification;
