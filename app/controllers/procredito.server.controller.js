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

	res.json({success: true, result:auth ,message: "."});


};



exports.submitForm =async function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  let  {emailDestino,infoCliente}=req.body;

let payload={
  "groupCode" : "procredito_dominicana",
  "externalCode" : "",
  "workflow" : {
    "type" : "WEB"
  },
  "notification" : {
    // "text": "Nuevo contrato pendiente de firma.",
    // "detail": "Núm. Contrato AA9988",
    "sharedLink": {
     // "appCode": "com.viafirma.documents",
      "email": emailDestino,
      "subject": "Procredito Dominicana: firma de contrato"
    },
  },
  "document" : {
    "templateCode" : "Contratosparaclientes",
    "readRequired" : false,
    // "watermarkText" : "Borrador",
    "formRequired" : true,
    "formDisabled" : true
  },
  "metadataList" : [{
    "key" : "nombre",
    "value" : infoCliente.nombre??""
  },{
    "key" : "cedula",
    "value" : infoCliente.cedula??""
  },{
    "key" : "direccion",
    "value" : infoCliente.direccion??""
  },{
    "key" : "celular",
    "value" :infoCliente.celular??""
  },
  {
    "key" : "ciudad",
    "value" :infoCliente.ciudad??""
  }
  ,{
    "key" : "celular2",
    "value" : infoCliente.celular2??""
  } ,{
    "key" : "celular2",
    "value" : infoCliente.celular2??""
  } ,{
    "key" : "dia",
    "value" : infoCliente.dia??""
  } ,{
    "key" : "mes",
    "value" :infoCliente.mes??""
  }
  ,{
    "key" : "a",
    "value" : infoCliente.ano??""
  }

]
}

let _resp=await axios.post("messages/dispatch",payload)
const {scheme,link} = _resp.data.notification.sharedLink;


 
	res.json({success: true, result:link ,message: "."});

 
} 
