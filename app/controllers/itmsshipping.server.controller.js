const axios = require("axios");
const { _printConsole, _validarEmpty } = require("../utils/utils.js")
const cnxConfig = require('../../config/sqlcnx.json')
const createformData = require('../../public/formDataCreate.json')
const sql = require("mssql");
const { _crearToken, validatetoken } = require("../utils/token.server.utils");
const { max, now } = require("moment");

var configEmpresas = {
  "OPENSEASSHIPPING": {
    "btnshippingform": false,
    "active": true,
    "appversion":10,
    "urldonwload":"http://plus.itmsrd.com/apk/ItmsShippingApp-120422.apk"
  }
}




function getcnn(interID) {

  // _printConsole(cnxConfig[interID]);
 // let newInterId="OPENSEASSHIPPINGDev";

  return {
    user: cnxConfig[interID]["user"],
    password: cnxConfig[interID].password,
    database: cnxConfig[interID].database,
    server: cnxConfig[interID].server,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: false, // for azure
      trustServerCertificate: false, // change to true for local dev / self-signed certs
    },
  }

}


exports.apptoken = async function (req, res, next) {
  const interId = req.params.interID;

  // console.log(interId);

  try {

    let _config = configEmpresas[interId];

    const dataToken = {
      interId: interId

    }


    let _token = _crearToken(dataToken);

    let data = {
      "config": _config,
      "token": _token.token
    }


    res.json({
      success: true,
      message: "token",
      result: data,
    });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err });
  }
};


exports.getUserDelivery = async function (req, res, next) {
  // const  interId=req.params.interID;

  // _printConsole("header",req.headers);
  let _tokenDecode = validatetoken(req.headers.authorization.replace("Bearer ", ""));
  const { interId } = _tokenDecode.token;


  try {
    // make sure that any items are correctly URL encoded in the connection string
    let pool = await sql.connect(getcnn(interId));
    let result2 = await pool
      .request()
      .input("InterID", sql.VarChar(50), interId)
      .execute("spCouApp_Users");


    let result = result2.recordset;

    if (result.length > 0) {

      // result.push({
      //   "InterID": "OPENSEASSHIPPING",
      //   "UserID": "1000",
      //   "UserName": "Dev",
      //   "UserRole": "ITMS",
      //   "KeyRequered": "true",
      //   "UserLangID": "ES"
      // });
// console.log(result);
      res.json({
        success: true,
        message: "User List",
        result: result,
      });
    } else {
      res.json({ success: false, message: "Not User", result: [] });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err });
  }
};


exports.getUserDeliverykey = async function (req, res, next) {
  // const  interId=req.params.interID;

  // _printConsole("header",req.headers);
  let _tokenDecode = validatetoken(req.headers.authorization.replace("Bearer ", ""));
  const { interId, } = _tokenDecode.token;


  try {
    // make sure that any items are correctly URL encoded in the connection string
    let pool = await sql.connect(getcnn(interId));
    let result2 = await pool
      .request()
      .input("InterID", sql.VarChar(50), interId)
      .input("Tipo", sql.Int, 1)
      .input("UserID", sql.VarChar(50), req.params.userId)
      .input("KeyValue", sql.VarChar(50), req.params.userkey)
      .execute("spCouApp_Users");


    let result = result2.recordset;

    if (result.length > 0) {

      // result.push({
      //   "InterID": "OPENSEASSHIPPING",
      //   "UserID": "1000",
      //   "UserName": "Dev",
      //   "UserRole": "ITMS`",
      //   "KeyRequered": "true"
      // });
      
      res.json({
        success: true,
        message: "Key is valid!",
        result:{},
      });
    } else {
      res.json({ success: false, message: "Not User", result: [] });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err });
  }
};



exports.findForm = async function (req, res, next) {
  // const  interId=req.params.interID;

  // _printConsole("header",req.headers);
  let _tokenDecode = validatetoken(req.headers.authorization.replace("Bearer ", ""));
  const { interId } = _tokenDecode.token;


  try {
    // make sure that any items are correctly URL encoded in the connection string
    let pool = await sql.connect(getcnn(interId));
    let result2 = await pool
      .request()
      .input("InterID", sql.VarChar(50), interId)
      .input("FormID", sql.VarChar(50), req.params.formId)
      .input("ModeID", sql.VarChar(50), req.params.type)
      .execute("spCouApp_GetForm");


    let result = result2.recordset;
    

    if (result.length > 0) {
    

      res.json({
        success: true,
        message: "User List",
        result: result,
      });
    } else {
      res.json({ success: false, message: "Not User", result: [] });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err });
  }
};

exports.createForm = async function (req, res, next) {
  // const  interId=req.params.interID;

  // _printConsole("header",req.headers);
  let _tokenDecode = validatetoken(req.headers.authorization.replace("Bearer ", ""));
  const { interId } = _tokenDecode.token;
  const { language }=req.params;


let newForm=createformData[interId][language];

//LISTADO DE Ciudades
let indexFormP =newForm.findIndex(form=>form.id==="shippingform-02");
let newCityes= newForm[indexFormP].information.findIndex(info=>info.id==='shippingform-02-05');
newForm[indexFormP].information[newCityes].information=await getCiudades(interId);

//formas de pago   
let indexPForma =newForm.findIndex(form=>form.id==="shippingform-04");
let fpa= newForm[indexPForma].information.findIndex(info=>info.id==='shippingform-04-11');
newForm[indexPForma].information[fpa].information=await getformasPago();

//Lista Items
let indexItems =newForm.findIndex(form=>form.id==="shippingform-03");
let itemsindex= newForm[indexItems].information.findIndex(info=>info.id==='shippingform-03-01');
newForm[indexItems].information[itemsindex].values=await getListadoItems(interId);


  try {

    res.json({
      success: true,
      message: "Create Formulario",
      result: newForm,
    });
    // } else {
    //   res.json({ success: false, message: "Not User", result: [] });
    // }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};


exports.findForm = async function (req, res, next) {
  // const  interId=req.params.interID;

  // _printConsole("header",req.headers);
  let _tokenDecode = validatetoken(req.headers.authorization.replace("Bearer ", ""));
  const { interId } = _tokenDecode.token;


  try {
    // make sure that any items are correctly URL encoded in the connection string
    let pool = await sql.connect(getcnn(interId));
    let result2 = await pool
      .request()
      .input("InterID", sql.VarChar(50), interId)
      .input("FormID", sql.VarChar(50), req.params.formId)
      .input("ModeID", sql.VarChar(50), req.params.type)
      .execute("spCouApp_GetForm");



    let result = result2.recordset;

 //  if(result==0) return  res.json({ success: false, message: "Not User", result: [] });
    if (result.length > 0) {
  
      res.json({
        success: true,
        message: "User List",
        result: result,
      });
    } else {
      res.json({ success: false, message: "Record not found", result: [] });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err });
  }
};

exports.findFormPendientes = async function (req, res, next) {
  // const  interId=req.params.interID;

  // _printConsole("header",req.headers);
  let _tokenDecode = validatetoken(req.headers.authorization.replace("Bearer ", ""));
  const { interId } = _tokenDecode.token;


  try {
    // make sure that any items are correctly URL encoded in the connection string
    let pool = await sql.connect(getcnn(interId));
    let result2 = await pool
      .request()
      .input("InterID", sql.VarChar(50), interId)
      .input("FormID", sql.VarChar(50),'')
      .input("ModeID", sql.VarChar(50), 2)
      .execute("spCouApp_GetForm");



    let result = result2.recordset;

 //  if(result==0) return  res.json({ success: false, message: "Not User", result: [] });
    if (result.length > 0) {
  
      res.json({
        success: true,
        message: "Form Pending Signature",
        result: result,
      });
    } else {
      res.json({ success: false, message: "Records not found", result: [] });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err });
  }
};

exports.saveForm = async function (req, res, next) {
  // const  interId=req.params.interID;

  // _printConsole("header",req.headers);
  let _tokenDecode = validatetoken(req.headers.authorization.replace("Bearer ", ""));
  const { interId } = _tokenDecode.token;


  try {
    // make sure that any items are correctly URL encoded in the connection string
    let pool = await sql.connect(getcnn(interId));
    let result2 = await pool
      .request()
      .input("InterID", sql.VarChar(50), interId)
      .input("FormID", sql.VarChar(50), req.body.FormID)
      .input("UserID", sql.VarChar(50), req.body.UserID)
      .input("SignName", sql.VarChar(300), req.body.SignName)
      .input("SignUrl", sql.VarChar(2000), req.body.SignUrl)
      .execute("spCouApp_SignForm");


    let result = result2.recordsets;
    if (result.length>0) {

    // console.log(result[1][0]);
      result[2][0].InterEmail="Email: info@openseasvi.com";
      result[2][0].InterDireccion="Mapony Building, Bldg 1, Unit 2 Duff Bottom, Tortola British Virgin Islands";
      result[2][0].InterTelefono="Tel.:BVI: 284-441-3019 Rep. Dom.: 1-829-704-1067";
      result[2][0].EmpresaName="Open Seas Shipping";
      let respuesta={
        empresa:result[2][0],
        ordenInfo:result[1][0]
      }
          res.json({
            success: true,
            message:result[0][0].Result,
            result: respuesta
          });
        } else {
          res.json({ success: false, message: "Not User", result: [] });
        }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err });
  }
};

exports.saveNewForm = async function (req, res, next) {
  // const  interId=req.params.interID;

  // _printConsole("header",req.headers);
  let _tokenDecode = validatetoken(req.headers.authorization.replace("Bearer ", ""));
  const { interId } = _tokenDecode.token;

  _printConsole("SaveForm",req.body)

  try {
    // make sure that any items are correctly URL encoded in the connection string

    const {RowUsr,formbody }=req.body;

    if(formbody["shippingform-04-11"]!="0" &&formbody["shippingform-04-10"]===""){
    return  res.json({ success: false, message: "Amount Paid is requered", result: [] });
    }
    


    let pool2 = await sql.connect(getcnn(interId));
    let result2sq = await pool2
      .request()
      .input("InterID", sql.VarChar(50), interId)
      .execute("spCouApp_Secuence");
    const{ PackNumber,PackID}= result2sq.recordset[0];

    let pool = await sql.connect(getcnn(interId));
    let _PaqueteContenido=  `${formbody['shippingform-03-01']}`
    // console.log(_PaqueteContenido);


    let result2 = await pool
      .request()
      .input("InterID", sql.VarChar(50), interId)   /*						varchar(50)		-- */
      .input("PaqueteID", sql.VarChar(50), PackNumber) /*						varchar(50)		--*/
      .input("PaqueteNumero", sql.VarChar(50), PackID) /*					varchar(50)		--*/
      .input("RowUsr", sql.VarChar(50), RowUsr) /*						varchar(50)		--*/

   /* --SenderInfo*/
      .input("PaqueteSenderID", sql.VarChar(50), "001") /*				varchar(50)		-- shippingform-01-01*/
      .input("PaqueteSenderNombre", sql.VarChar(100), formbody["shippingform-01-02"]) /*			varchar(100)	-- shippingform-01-02*/
      .input("PaqueteSenderDireccion", sql.VarChar(4000), formbody["shippingform-01-03"]) /*		varchar(4000)	-- shippingform-01-03*/
      .input("PaqueteSenderTel1", sql.VarChar(50), formbody["shippingform-01-04"]) /*				varchar(50)		-- shippingform-01-04*/
      .input("PaqueteSenderIdetificacionID", sql.VarChar(50), formbody["shippingform-01-06"]) /*	varchar(50)		-- shippingform-01-06*/
      .input("PaqueteSenderIdetificacionVence", sql.VarChar(50), formbody["shippingform-01-07"]) /*varchar(20)		-- shippingform-01-07*/

  /*  --RecieverInfo*/
      .input("PaqueteRecieverID", sql.VarChar(50), "001") /*				varchar(50)		-- shippingform-02-01*/
      .input("PaqueteRecieverNombre", sql.VarChar(100), formbody["shippingform-02-02"]) /*			varchar(100)	-- shippingform-02-02*/
      .input("PaqueteRecieverDireccion", sql.VarChar(4000), formbody["shippingform-02-03"]) /*	varchar(4000)	-- shippingform-02-03*/
      .input("PaqueteRecieverTel1", sql.VarChar(50), formbody["shippingform-02-04"]) /*			varchar(50)		-- shippingform-02-04*/

   /* --Destination*/
      .input("PaqueteCiudadID", sql.VarChar(50), formbody["shippingform-02-05"]) /*				varchar(50)		-- shippingform-02-05*/
      .input("PaqueteCiudadTexto", sql.VarChar(50), /*formbody["shippingform-02-06"]*/"") /*		varchar(50)		-- shippingform-02-06*/

   /* --PackageDescription*/

      .input("PaqueteContenido", sql.VarChar(sql.MAX),_PaqueteContenido.toString()) /*			varchar(max)	-- shippingform-03-01 + shippingform-03-02*/
      .input("PaqueteContenidoBalance", sql.Decimal(18,2), parseFloat(formbody["shippingform-03-03"])) /*		decimal(18,2)	-- shippingform-04-03*/

  /*  --ShippingOptions*/
      .input("PaqueteContenidoTipoCantidad", sql.Decimal(18,2), parseFloat(formbody["shippingform-04-01"])) /*	decimal(18,2)	-- shippingform-04-01*/
      .input("PaqueteContenidoTipo", sql.VarChar(100), formbody["shippingform-04-02"]) /*			varchar(100)	-- shippingform-04-02*/
      .input("PaqueteContenidoL", sql.Decimal(18,2), /*parseFloat(formbody["shippingform-04-03"])->EL cliente pidio quitar estos campos*/parseFloat( 0.0)) /*				decimal(18,2)	-- shippingform-04-03*/
      .input("PaqueteContenidoW", sql.Decimal(18,2),  /*parseFloat(formbody["shippingform-04-04"])->EL cliente pidio quitar estos campos */parseFloat(0.0)) /*				decimal(18,2)	-- shippingform-04-04*/
      .input("PaqueteContenidoH", sql.Decimal(18,2), /*parseFloat(formbody["shippingform-04-05"])->EL cliente pidio quitar estos campos*/parseFloat(0.0)) /*				decimal(18,2)	-- shippingform-04-05*/

      .input("PaqueteContenidoTipoValor", sql.Decimal(18,2), parseFloat(formbody["shippingform-04-06"])) /*		decimal(18,2)	-- shippingform-04-06*/
      .input("PaqueteContenidoManejo", sql.VarChar(100),formbody["shippingform-04-07"]) /*		varchar(100)	-- sshippingform-04-07*/
      .input("PaqueteAsegurado", sql.Int, parseInt(formbody["shippingform-04-08"]==='YES'?1:0))  /*				int				-- shippingform-04-08*/
      .input("PaquetePagado",sql.Decimal(18,2), parseFloat(formbody["shippingform-04-10"]===""?0:formbody["shippingform-04-10"]))  /*				int				-- shippingform-04-08*/
      .input("PaquetePagadoTipo", sql.Int, parseInt(formbody["shippingform-04-11"]))  /*				int				-- shippingform-04-08*/
      .input("PaqueteFirmado", sql.NVarChar(sql.MAX), formbody["shippingform-04-09"]) 
      .input("PaqueteIdTemporal", sql.VarChar(50), formbody["guid"]??"") /*	 /*				int				-- shippingform-04-08*/
      //.input("PaqueteContenidoPaquetes", sql.NVarChar(sql.MAX), "")  /*				int				-- shippingform-04-08*/
      .execute("spCouPaquetes");

   // _printConsole("Data",pool.query)
      // _printConsole("asas",result2);

    let result = result2.recordset;

    // _printConsole("asas",result[0]);

    if (result.length > 0) {
      let _empresa={};
     _empresa.InterEmail="Email: info@openseasvi.com";
     _empresa.InterDireccion="Mapony Building, Bldg 1, Unit 2 Duff Bottom, Tortola British Virgin Islands";
     _empresa.InterTelefono="Tel.:BVI: 284-441-3019 Rep. Dom.: 1-829-704-1067";
     _empresa.EmpresaName="Open Seas Shipping";

    
      let respuesta={
        empresa:_empresa,
        ordenInfo:result[0]
      }

    // let respuesta={
    //   empresa: {
    //     InterEmail: 'Email: info@openseasvi.com',
    //     InterDireccion: 'Mapony Building, Bldg 1, Unit 2 Duff Bottom, Tortola British Virgin Islands',
    //     InterTelefono: 'Tel.:BVI: 284-441-3019 Rep. Dom.: 1-829-704-1067',
    //     EmpresaName: 'Open Seas Shipping'
    //   },
    //   ordenInfo: {
    //     InterID: 'OPENSEASSHIPPING',
    //     PaqueteID: 'OSS-0000046',
    //     PaqueteNumero: 'AEEDAA7F-3876-41DB-865D-FDDAA41F1ABF',
    //     PaqueteEnvioTipoID: 1,
    //     PaqueteClienteID: '001',
    //     PaqueteEstatusID: 'PEN',
    //     PaqueteTracking: 'OSS-0000046',
    //     PaqueteRetenido: 0,
    //     PaqueteFechaEntrega: '2022-07-11T22:25:22.517Z',
    //     PaqueteDestinoID: 'BVI',
    //     PaqueteProveedor: 'OPENSEASSHIPPING',
    //     PaqueteContenido: 'ITEMS: NEW CLOTHES-ROPA NUEVA',
    //     PaqueteContenidoPaquetes: '5686868.00',
    //     PaqueteContenidoFecha1: '11-07-2022',
    //     PaqueteContenidoFecha2: '11-07-2022',
    //     PaqueteContenidoTipoID: 'CON',
    //     PaqueteContenidoTipo: 'DJDJX JF',
    //     PaqueteContenidoL: 0,
    //     PaqueteContenidoW: 0,
    //     PaqueteContenidoH: 0,
    //     PaqueteContenidoTipoCantidad: 5686868,
    //     PaqueteContenidoTipoValor: 5888,
    //     PaqueteContenidoTipoTotal: 5888,
    //     PaqueteContenidoManejo: 'RXKZKX',
    //     PaqueteContenidoPeso: 0,
    //     PaqueteContenidoVolumen: 0,
    //     PaqueteContenidoBalance: 5686868,
    //     PaqueteFacturaTotal: 5888,
    //     PaqueteAsegurado: 1,
    //     PaqueteFacturaID: 'AEEDAA7F-3876-41DB-865D-FDDAA41F1ABF',
    //     PaqueteSenderID: '001',
    //     PaqueteSenderNombre: 'CJXNXNNX',
    //     PaqueteSenderDireccion: 'CNXNCNMXNC',
    //     PaqueteSenderTel1: '(889) 88-',
    //     PaqueteSenderIdetificacionTipo: 2,
    //     PaqueteSenderIdetificacionID: 'XJSCNDNXNZLS',
    //     PaqueteRecieverID: '001',
    //     PaqueteRecieverNombre: 'FJXJXNXNXB',
    //     PaqueteRecieverDireccion: 'XNZNXNMXNX',
    //     PaqueteRecieverTel1: '(889) 88-',
    //     PaquetePrioridadID: 2,
    //     RowAct: 1,
    //     RowUsr: '0004',
    //     RowCdt: '2022-07-11T22:25:22.517Z',
    //     RowMdt: '2022-07-11T22:25:22.517Z',
    //     RowIdx: 94,
    //     PaqueteTrackingEstatusID: 0,
    //     PaqueteCiudadID: 'BVI0001',
    //     PaqueteCiudadTexto: 'BVI',
    //     PaqueteSenderIdetificacionVence: '12/07/2022',
    //     PaqueteEntregado: 0,
    //     PaqueteEntregadoFecha: '',
    //     PaqueteEntregadoNombre: '',
    //     PaqueteEntregadoUsuarioID: '',
    //     PaqueteEntregadoUsuarioNombre: '',
    //     PaqueteEntregadoFirma: '',
    //     PaqueteFirmado: 'https://res.cloudinary.com/dfbwtygxk/image/upload/v1657603521/itms/shipping/firmas/4eb13dbb-aac9-4b11-9641-99074cb6a68a.png',
    //     PaquetePagado: 800,
    //     PaquetePagadoTipo: 2,
    //     PaqueteIdTemporal: ""
    //   }}
    


      console.log(respuesta);
      res.json({
        success: true,
        message: "Order Complete.",
        result: respuesta,
      });

    } else {
      res.json({ success: false, message: "Not User", result: {} });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Please Try again.", result: {} });
  }
};

exports.getconfig = async function (req, res, next) {
  const interId = req.params.interID;

  try {
   // _printConsole("a", interId)

    res.json({
      success: true,
      message: "Config",
      result: configEmpresas[interId],
    });
  } catch (error) {
  //  console.log(error);
    res.json({ success: false, message: error });
  }

};

getCiudades=async (interId) =>{
  let pool = await sql.connect(getcnn(interId));

  let result2 = await pool
    .request()
    .input("InterID", sql.VarChar(50), interId)
    .execute("spCouApp_Cities");




    
  let result = result2.recordset;

  let infoCiudades=[];
   result.forEach(element => {
    infoCiudades.push(
      {
        "description":element.CityText,
        "enabled": true,
        "requered": true,
        "order": 0,
        "values": element.CityText,
        "type": "String",
        "id": element.CityID,
        "createdDate": "2022-13-00T00:00:00.0000000-00:00"
      },
    )
   }); 

   return infoCiudades;
}

getListadoItems=async (interId) =>{
  let pool = await sql.connect(getcnn(interId));

  let result2 = await pool
    .request()
    .input("InterID", sql.VarChar(50), interId)
    .execute("spCouApp_Items");
    
  let result = result2.recordset;

  let infoItems="";
   result.forEach(element => {
   infoItems+=`${element.ItemText}|`
   }); 
 
 //  _printConsole("Items",infoItems)
   return infoItems.slice(0,-1);
}


getformasPago=async () =>{
  let _formasPago=[];
  formasPago.forEach(fp => {
    _formasPago.push(
        {
          "description":fp.descripcion,
          "enabled": true,
          "requered": true,
          "order":  fp.id,
          "values": fp.descripcion,
          "type": "String",
          "id": fp.id,
          "createdDate":now()
        },
      )
     }); 

   return _formasPago;
}

let formasPago = [
  { id: 0, descripcion: "NONE" },
  { id: 1, descripcion: "CASH" },
  { id: 2, descripcion: "CREDIT CARD" },
  { id: 3, descripcion: "CHECK" },
  { id: 4, descripcion: "CASHAPP" },
  { id: 5, descripcion: "BANK TRANSFFER" },
];