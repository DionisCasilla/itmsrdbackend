const jwt = require("jsonwebtoken");
const { _printConsole, _insertDataModel } = require("./utils");
var Logger = require("mongoose").model("Logger");
var requestIp = require("request-ip");
const { json } = require("body-parser");

const KEY = {
  secretkey: "$3gur1d42321",
};

exports._crearToken = (datatoken) => {
  // var resp;
  try {
    let _token = jwt.sign(datatoken, KEY.secretkey, { expiresIn: "6h" });
    //   console.log(_token);

    return {
      success: true,
      token: _token,
      mensaje: "Token Generado Existosamente!",
    };
  } catch (error) {
    return { success: false, token: null, mensaje: error };
  }
};

const _valirdarToken = (token) => {
  jwt.verify(token, KEY.secretkey, function (err, decoded) {
    //console.log(decoded.foo) // bar
    if (err) return { success: false, token: null };

    return { success: true, token: decoded };
  });
  //	jwt.sign(data, KEY.secretkey , { expiresIn: '6h' }, function(err, token) {
};

exports.validaciondeAuthenticacion = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  var whiteListUrl = [
    "/usuarios/login",
    "/config/registroclientes",
    "/tsrapi/login",
    "/tsrapi/citas",
    "/tsrapi/listas",
    "/tsrapi/schedule",
    "/tsrapi/updatecitas",
    "/tsrapi/crearecitas",
    "/tsrapi/empresas",
    "/tsrapi/actualizarpin",
    "/procredito/loginapi",
    "/procredito/submitForm",
  ];
  // _printConsole(whiteListUrl.includes(req.originalUrl));

  var url2SegmentsSplit = req.originalUrl.split("/");
  var url2Segments =
    "/" +
    url2SegmentsSplit[1] +
    (typeof url2SegmentsSplit[2] !== "undefined"
      ? "/" + url2SegmentsSplit[2]
      : "");

  if (whiteListUrl.includes(url2Segments)) {
    return next();
  }

  if (!req.headers.authorization) {
    return res.status(403).json({
      success: false,
      message: "Tu petición no tiene cabecera de autorización",
    });
  }

  if (!req.headers.authorization.includes("Bearer ")) {
    return res.status(404).json({
      success: false,
      message: "Tipo de token invalido",
      result: {},
    });
  }

  let _token = req.headers.authorization.replace("Bearer ", "");
  var decoded;
  try {
    decoded = jwt.verify(_token, KEY.secretkey);
  } catch (err) {
    return res.status(407).json({
      success: false,
      message: err.message,
      result: {},
    });
  }

//  _printConsole("data",decoded);
  req.userseccion = decoded;

  next();
};

exports.loggerserver = async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  var whiteListUrl = [
    "/usuarios/login",
    "/config/registroclientes",
    "/tsrapi/login",
    "/tsrapi/citas",
    "/tsrapi/listas",
    "/tsrapi/schedule",
    "/tsrapi/updatecitas",
    "/tsrapi/crearecitas",
    "/tsrapi/empresas",
    "/tsrapi/actualizarpin",
  ];
  // _printConsole(whiteListUrl.includes(req.originalUrl));

  var url2SegmentsSplit = req.originalUrl.split("/");
  var url2Segments =
    "/" +
    url2SegmentsSplit[1] +
    (typeof url2SegmentsSplit[2] !== "undefined"
      ? "/" + url2SegmentsSplit[2]
      : "");

     // console.log(req.userseccion)

  var dataLog = {
    url: url2Segments,
    metodo: req.method,
    ip: requestIp.getClientIp(req),
    usuario:JSON.stringify(req.userseccion),
    request: JSON.stringify(req.body),
  };

  let _logger = new Logger(dataLog);
 
  await _insertDataModel(_logger);

  req.transaccionId = _logger._id;

  next();
};

exports.loggerResponseserver = async function (req, res, next) {
  var oldSend = res.json;

  res.json = async function (data) {
  //  console.log(req.transaccionId);
    // arguments[0] (or `data`) contains the response body
    // arguments[0] = "modified : " + arguments[0];




    let save= await _updatetLoggerModel(req.transaccionId,JSON.stringify(data));
  //  _printConsole(save)

    oldSend.apply(res, arguments);
    // console.log(data)
    // oldSend.apply(oldSend,data);
  };
   //console.log(res.json.data)
  next();
};

async function _updatetLoggerModel(_id,response){
 // console.log(response)
	const promise = new Promise(function (resolve, reject) {

		Logger.findOne({_id:_id})
		 // .select(selectCampos)
		  .exec(function (err, dbResult) {
			if (err) {
			  console.log(__filename + " >> .create: " + JSON.stringify(err));
			  reject({});
			} else {
				if(!dbResult){
					console.log(__filename + " >> .create: " + JSON.stringify(err));
					reject({});
				}else{

					dbResult.response = response;
					dbResult.date_updated= Date.now();

					dbResult.save(function (err){

						if (err) {
							console.log(__filename + ' >> .update: ' + JSON.stringify(err));
						
						resolve({});
							//	res.json({ success: false, message: `Error en la actualización de ${entityName}.`, result: {} });
						}
						else {
							resolve(dbResult);
							//res.json({ success: true, message: `${entityName} se actualizó exitosamente.`, result: entitydb });
						}
	
					})
	
				}
			}
		  });
	  });


  return promise;
}