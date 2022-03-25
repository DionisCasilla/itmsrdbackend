const axios = require("axios");
const {_printConsole,_validarEmpty} = require("../utils/utils.js")
const cnxConfig=require('../../config/sqlcnx.json')
const sql = require("mssql");
const { _crearToken, validatetoken } = require("../utils/token.server.utils");
const { max } = require("moment");

var configEmpresas=  {
  "OPENSEASSHIPPING":{
        "btnshippingform":false,
        "active":true
  }
}

  function getcnn(interID) {

    // _printConsole(cnxConfig[interID]);

    return  {
      user:cnxConfig[interID]["user"],
      password:cnxConfig[interID].password,
      database:cnxConfig[interID].database,
      server: cnxConfig[interID].server,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
      options: {
        encrypt: false, // for azure
        trustServerCertificate: false, // change to true for local dev / self-signed certs
      },}
    
  }


  exports.apptoken = async function (req, res, next) {
    const  interId=req.params.interID;

  
    try {

     let _config=  configEmpresas[interId];

      const dataToken={
        interId:interId
     
      }


      let _token= _crearToken(dataToken);

      let data={
        "config": _config,
        "token":_token.token
      }

   
        res.json({
          success: true,
          message: "token",
          result:data ,
        });
 
    } catch (err) {
      console.log(err);
      res.json({ success: false, message: err });
    }
  };
  

  exports.getUserDelivery = async function (req, res, next) {
    // const  interId=req.params.interID;

    // _printConsole("header",req.headers);
    let _tokenDecode= validatetoken(req.headers.authorization.replace("Bearer ", ""));
    const{ interId}=_tokenDecode.token;
    
    
    try {
      // make sure that any items are correctly URL encoded in the connection string
      let pool = await sql.connect(getcnn(interId));
      let result2 = await pool
        .request()
        .input("InterID", sql.VarChar(50), interId )
        .execute("spCouApp_Users");

   
      let result = result2.recordset;

     if (result.length>0) {
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
    let _tokenDecode= validatetoken(req.headers.authorization.replace("Bearer ", ""));
    const{ interId}=_tokenDecode.token;
    
    
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

     if (result.length>0) {
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
    let _tokenDecode= validatetoken(req.headers.authorization.replace("Bearer ", ""));
    const{ interId}=_tokenDecode.token;
    
    
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

     if (result.length>0) {
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
    let _tokenDecode= validatetoken(req.headers.authorization.replace("Bearer ", ""));
    const{ interId}=_tokenDecode.token;
    
    
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

     if (result.length>0) {
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
    let _tokenDecode= validatetoken(req.headers.authorization.replace("Bearer ", ""));
    const{ interId}=_tokenDecode.token;
    
    
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

     if (result.length>0) {
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
    const  interId=req.params.interID;

    try {
      _printConsole("a",interId)
 
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
  