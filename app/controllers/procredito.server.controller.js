const axios = require("axios");

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

exports.submitForm = async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  let { emailDestino, infoCliente,tipoenvio } = req.body;
  let _tipoenvio=tipoenvio??0;
  let notification={};
  let _sharedLink={};
  
  
  if (_tipoenvio==1){//SMS
    _sharedLink.phone=infoCliente.celular;
  }else if(_tipoenvio==2){//email
    // _sharedLink.phone=infoCliente.celular;
    _sharedLink.email= emailDestino;
    _sharedLink.subject= "Procredito Dominicana: firma de contrato";
  }else if(_tipoenvio==0);{
    _sharedLink.phone=infoCliente.celular;
    _sharedLink.email= emailDestino;
    _sharedLink.subject= "Procredito Dominicana: firma de contrato";
  }

  notification.sharedLink=_sharedLink;

 

  let payload = {
    groupCode: "procredito_dominicana",
    externalCode: "",
    workflow: {
      type: "WEB",
    },

    document: {
      templateCode: "Contratosparaclientes",
      readRequired: false,
     watermarkText: "Borrador",
      formRequired: true,
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
        key: "direccion",
        value: infoCliente.direccion ?? "",
      },
      {
        key: "celular",
        value: infoCliente.celular ?? "",
      },
      {
        key: "ciudad",
        value: infoCliente.ciudad ?? "",
      },
      {
        key: "celular2",
        value: infoCliente.celular2 ?? "",
      },
      {
        key: "celular2",
        value: infoCliente.celular2 ?? "",
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
  };


  payload.notification=notification;//["sharedLink"]=_sharedLink;
  console.log(payload);
  let _resp = await axios.post("messages/dispatch", payload);
  const { scheme, link } = _resp.data.notification.sharedLink;

  res.json({ success: true, result: link, message: "." });
};
