const axios = require("axios");
const { _printConsole, _validarEmpty } = require("../utils/utils.js")
const cnxConfig = require('../../config/sqlcnx.json')
const createformData = require('../../public/formDataCreate.json')
const sql = require("mssql");
const { _crearToken, validatetoken } = require("../utils/token.server.utils");
const { max } = require("moment");

var configEmpresas = {
  "OPENSEASSHIPPING": {
    "btnshippingform": false,
    "active": true
  }
}




function getcnn(interID) {

  // _printConsole(cnxConfig[interID]);

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


  try {
    // // make sure that any items are correctly URL encoded in the connection string
    // let pool = await sql.connect(getcnn(interId));
    // let result2 = await pool
    //   .request()
    //   .input("InterID", sql.VarChar(50), interId)
    //   execute("spCouApp_Secuence");


    // let result = result2.recordset;



    // if (result.length>0) {
    res.json({
      success: true,
      message: "Create Formulario",
      result: createformData[interId],
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


    let result = result2.recordset;

    if (result.length > 0) {
      res.json({
        success: true,
        message: result[0].Result,
        result: {},
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


  try {
    // make sure that any items are correctly URL encoded in the connection string
    let pool = await sql.connect(getcnn(interId));
    let result2 = await pool
      .request()
      .input("InterID", sql.VarChar(50), interId)   /*						varchar(50)		-- */
      .input("PaqueteID", sql.VarChar(50), interId) /*						varchar(50)		--*/
      .input("PaqueteNumero", sql.VarChar(50), interId) /*					varchar(50)		--*/
      .input("RowUsr", sql.VarChar(50), interId) /*						varchar(50)		--*/

   /* --SenderInfo*/
      .input("PaqueteSenderID", sql.VarChar(50), interId) /*				varchar(50)		-- shippingform-01-01*/
      .input("PaqueteSenderNombre", sql.VarChar(50), interId) /*			varchar(100)	-- shippingform-01-02*/
      .input("PaqueteSenderDireccion", sql.VarChar(50), interId) /*		varchar(4000)	-- shippingform-01-03*/
      .input("PaqueteSenderTel1", sql.VarChar(50), interId) /*				varchar(50)		-- shippingform-01-04*/
      .input("PaqueteSenderIdetificacionID", sql.VarChar(50), interId) /*	varchar(50)		-- shippingform-01-06*/
      .input("PaqueteSenderIdetificacionVence", sql.VarChar(50), interId) /*varchar(20)		-- shippingform-01-07*/

  /*  --RecieverInfo*/
      .input("PaqueteRecieverID", sql.VarChar(50), interId) /*				varchar(50)		-- shippingform-02-01*/
      .input("PaqueteRecieverNombre", sql.VarChar(50), interId) /*			varchar(100)	-- shippingform-02-02*/
      .input("PaqueteRecieverDireccion", sql.VarChar(50), interId) /*	varchar(4000)	-- shippingform-02-03*/
      .input("PaqueteRecieverTel1", sql.VarChar(50), interId) /*			varchar(50)		-- shippingform-02-04*/

   /* --Destination*/
      .input("PaqueteCiudadID", sql.VarChar(50), interId) /*				varchar(50)		-- shippingform-02-05*/
      .input("PaqueteCiudadTexto", sql.VarChar(50), interId) /*		varchar(50)		-- shippingform-02-06*/

   /* --PackageDescription*/
      .input("PaqueteContenido", sql.VarChar(50), interId) /*			varchar(max)	-- shippingform-03-01 + shippingform-03-02*/
      .input("PaqueteContenidoBalance", sql.VarChar(50), interId) /*		decimal(18,2)	-- shippingform-04-03*/

  /*  --ShippingOptions*/
      .input("PaqueteContenidoTipoCantidad", sql.VarChar(50), interId) /*	decimal(18,2)	-- shippingform-04-01*/
      .input("PaqueteContenidoTipo", sql.VarChar(50), interId) /*			varchar(100)	-- shippingform-04-02*/
      .input("PaqueteContenidoL", sql.VarChar(50), interId) /*				decimal(18,2)	-- shippingform-04-03*/
      .input("PaqueteContenidoW", sql.VarChar(50), interId) /*				decimal(18,2)	-- shippingform-04-04*/
      .input("PaqueteContenidoH", sql.VarChar(50), interId) /*				decimal(18,2)	-- shippingform-04-05*/

      .input("PaqueteContenidoTipoValor", sql.Decimal(18,2), paqueteContenidoTipoValor) /*		decimal(18,2)	-- shippingform-04-06*/
      .input("PaqueteContenidoManejo", sql.VarChar(100), paqueteContenidoManejo) /*		varchar(100)	-- sshippingform-04-07*/
      .input("PaqueteAsegurado", sql.Int, paqueteAsegurado)  /*				int				-- shippingform-04-08*/
      .execute("spCouApp_SignForm");


    let result = result2.recordset;

    if (result.length > 0) {
      res.json({
        success: true,
        message: result[0].Result,
        result: {},
      });
    } else {
      res.json({ success: false, message: "Not User", result: [] });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err });
  }
};

exports.getconfig = async function (req, res, next) {
  const interId = req.params.interID;

  try {
    _printConsole("a", interId)

    res.json({
      success: true,
      message: "Config",
      result: configEmpresas[interId],
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }

};
