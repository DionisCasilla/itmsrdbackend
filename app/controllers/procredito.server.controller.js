const axios = require("axios");
const sql = require("mssql");
const {
  _getDataModel,
  _printConsole,
  _insertDataModel,
  _sendEmail,
  _validarEmpty,
  _isNumber,
} = require("../utils/utils");
const sqlConfig = {
  user: "DB_A3F291_PCDClientes_admin",
  password: "Pr0Credit0@dmin",
  database: "DB_A3F291_PCDClientes",
  server: "sql5008.site4now.net",
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

/*
@"Data Source=sql5008.site4now.net;Initial Catalog=DB_A3F291_PCDClientes;User Id=DB_A3F291_PCDClientes_admin;Password=Pr0Credit0@dmin;"
*/

exports.loginApi = async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  var username = "procredito_dominicana";
  var password = "MD43SA";
  var auth =
    "Basic " + Buffer.from(username + ":" + password).toString("base64");

  res.json({ success: true, result: auth, message: "." });
};


exports.bCedula = async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  let { cedula } = req.params;


  let pool = await sql.connect(sqlConfig);
  let _sqlquery = `select	CEDULA		= ClienteID,
                NOMBRE		= UPPER(ClienteNombre),
                TELEFONO	= ClienteTel2,
                DIRECCION	= ClienteDireccion,
                FECHA		= GETDATE(),
                DD			= DAY(GETDATE()),
                MM			= MONTH(GETDATE()),
                YY			= YEAR(GETDATE())
                from	clientes 
                where	clienteid = '${cedula}'`;







    let data={};
  let result2 = await pool.query(_sqlquery);



  console.log(result2.recordset[0]);
  data.cliente= result2.recordset[0];


  


  res.json({ success: !isEmptyObject(data.cliente), result: data, message: !isEmptyObject(data.cliente)?"Consulta Exitosa!":"Cliente no encontrado!" });
};


exports.loaddata = async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  let { cedula } = req.params;


  let pool = await sql.connect(sqlConfig);


  let _sqlSectores = `select	*  from	Sectores`;
  let _sqlCiudades = `select	*  from	Ciudades`;





    let data={};
  // let result2 = await pool.query(_sqlquery);
  let sectores = await pool.query(_sqlSectores);
  let ciudades = await pool.query(_sqlCiudades);


  // console.log(result2.recordset[0]);
  // data.cliente= result2.recordset[0];
  data.sectores= sectores.recordset;
  data.ciudades= ciudades.recordset;


  res.json({ success: true, result: data, message: "." });
};

exports.submitForm = async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

try {
  let { emailDestino, infoCliente, tipoenvio } = req.body;
  let _tipoenvio = tipoenvio ?? 0;
  let notification = {};
  let _sharedLink = {};


  if (_tipoenvio == 1) {//SMS
    _sharedLink.phone = infoCliente.celular;
  } else if (_tipoenvio == 2) {//email
    // _sharedLink.phone=infoCliente.celular;
    _sharedLink.email = emailDestino;
    _sharedLink.subject = "Procredito Dominicana: firma de contrato";
  } else if (_tipoenvio == 0); {
    _sharedLink.phone = infoCliente.celular;
    _sharedLink.email = emailDestino;
    _sharedLink.subject = "Procredito Dominicana: firma de contrato";
  }

  notification.sharedLink = _sharedLink;



  let payload = {
    groupCode: "procredito_dominicana",
    externalCode: "",
    workflow: {
      type: "WEB",
    },

    document: {
      templateCode: "CONTRATODIGITAL",//
      readRequired: false,
      formRequired: false,
      formDisabled: true,
    },
    metadataList: [
      {
        key: "nombre",
        value: infoCliente.nombre ?? "",
      },
      {
        key: "cedula",
        value: infoCliente.cedula ?? "",
      },
      {
        key: "celular",
        value: infoCliente.celular ?? "",
      },
       {
        key: "dia",
        value: infoCliente.dia ?? "",
      },
      {
        key: "mes",
        value: infoCliente.mes ?? "",
      },
      {
        key: "a",
        value: infoCliente.ano ?? "",
      },
    ],
    // metadataList: [
    //   {
    //     key: "nombre",
    //     value: infoCliente.nombre ?? "",
    //   },
    //   {
    //     key: "cedula",
    //     value: infoCliente.cedula ?? "",
    //   },
    //   {
    //     key: "direccion",
    //     value: infoCliente.direccion ?? "",
    //   },
    //   {
    //     key: "celular",
    //     value: infoCliente.celular ?? "",
    //   },
    //   {
    //     key: "ciudad",
    //     value: infoCliente.ciudad ?? "",
    //   },
    //   {
    //     key: "celular2",
    //     value: infoCliente.celular2 ?? "",
    //   },
    
    //   {
    //     key: "dia",
    //     value: infoCliente.dia ?? "",
    //   },
    //   {
    //     key: "mes",
    //     value: infoCliente.mes ?? "",
    //   },
    //   {
    //     key: "a",
    //     value: infoCliente.ano ?? "",
    //   },
    // ],
  };


  payload.notification = notification;//["sharedLink"]=_sharedLink;


  _printConsole("payload",payload);
  //  console.log(payload);
  let _resp = await axios.post("messages/dispatch", payload);
  const { scheme, link } = _resp.data.notification.sharedLink;

  return res.json({ success: true, result: link, message: "." ,moredata:_resp.data});
} catch (error) {
  console.log(error)
  return res.json({ success: false, result: "", message: error ,moredata:""});
}

 
};


exports.submitFormV2 = async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

try {
  let { emailDestino, infoCliente, tipoenvio } = req.body;
  
  let payload = {
     groupCode: "procredito_dominicana",
      recipients: [
    {
      key  : "signer01_key",
      name : infoCliente.nombre,
      mail : emailDestino,
      phone: infoCliente.celular,
      notificationType : "SMS",
      order: "1"
    }
  ], 
     messages : [{
            document : {
                templateCode : "CONTRATODIGITAL",
                readRequired : false,
                formRequired : true,
               
            }
        }],
        metadataList : [ 
          {
            key      : "signer01_key.mail",
            value    : emailDestino,
            internal : false
        },
        {
            key      : "signer01_key.phone",
            value    : infoCliente.celular,
            internal : false
        },
          
          {
          key : "nombre",
          value : infoCliente.nombre,
          internal : false
        }, {
          key : "cedula",
          value : infoCliente.cedula,
          internal : false
        }, {
          key : "celular",
          value : infoCliente.celular,
          internal : false
        }, {
          key : "dia",
          value : infoCliente.dia,
          internal : false
        }, {
          key : "mes",
          value : infoCliente.mes,
          internal : false
        }, {
          key : "a",
          value : infoCliente.ano,
          internal : false
        }]
    };

  
  let _resp = await axios.post("api/v3/set", payload);

  return res.json({ success: true, result: _resp.data, message: "." ,moredata:""});
} catch (error) {
 console.log(error)
  return res.json({ success: false, result: "", message: error ,moredata:""});
}

 
};

function isEmptyObject(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false;
  }

  return true;
}