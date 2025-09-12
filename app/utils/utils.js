
const nodemailer = require("nodemailer");

exports._getDataModel =function(dbModel,filter={},selectCampos="",){
	const promise = new Promise(function (resolve, reject) {

		dbModel.find(filter)
		  .select(selectCampos)
		  .exec(function (err, dbResult) {
			if (err) {
			  console.log(__filename + " >> .create: " + JSON.stringify(err));
			  reject({});
			} else {
			  resolve(dbResult);
			}
		  });
	  });


  return promise;
}


exports._insertDataModel =function(dbModel){
	
	const promise = new Promise(function (resolve, reject) {

		// _printConsole('CREAR',dbModel)
		//console.log(dbModel)
		dbModel.save(function (err) {
			if (err) {
			  console.log(__filename + " >> .create: " + JSON.stringify(err));
			  resolve({
				success: false,
				data:null,
				message: "Error en la creación del Cliente.",
			  });
			} else {
				console.log(err)			  
				resolve({
				success: true,
				message: "Creado exitosamente.!",
				result: dbModel,
			  });
			}
		  });
	  });


  return promise;
}



exports._validarEmpty=(value)=>{
	//function isEmpty(value) {
		return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
	//  }
}


exports._isNumber=(value)=>{
	//function isEmpty(value) {
		return Number.isInteger(value); //typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
	//  }
}

exports._printConsole = (paramMsg, paramData)=> {
		let fecha=Date();

	console.log(`========${fecha}==========`)
	console.log('\r=========================================');
    console.log(__filename);
    console.log('-----------------------------------------');
    console.log(paramMsg);
    if (typeof paramData !== "undefined"){
        console.log('-----------------------------------------');
        console.log(paramData);
		console.log('-----------------------------------------');
    }
    console.log('=========================================\r\n'); 
}


// async..await is not allowed in global scope, must use a wrapper
exports._sendEmail=  async(EmailTo, EmailSubject, EmailBody,pdfBuffer, filename)=> {


	const transporter = nodemailer.createTransport({
	host: "smtp.titan.email", // Servidor SMTP de Titan
	port: 465,                // Usar 465 para SSL o 587 para TLS
	secure: true,             // true para 465, false para 587
	auth: {
		user: "auribe@grupocruzpuello.com", // Tu correo Titan
		pass: "gcp2010@AUJ"        // Tu contraseña o App Password
	},
	tls: {
		rejectUnauthorized: false // Asegura compatibilidad
	}
	});
	
   //console.log(EmailSubject)
   // setup e-mail data, even with unicode symbols
   var mailOptions = {
	 from:'"Grupo Cruz Puello" <auribe@grupocruzpuello.com', // sender address (who sends)
	 to: /*EmailTo,*/'ing.dionisc@gmail.com,auribe@grupocruzpuello.com', // list of receivers (who receives)
	 subject: EmailSubject,
	 html:EmailBody,
	 attachments: [
      {
        filename: filename,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
   };
   
   
   // send mail with defined transport object
   transporter.sendMail(mailOptions, function(error, info){
	 if(error){
		 return console.log(error);
	 }
   
	 console.log('Message sent: ' + info.response);
	 return info.response;
   });

	
}