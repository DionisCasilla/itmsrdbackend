
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

	//try {
		// Generate test SMTP service account from ethereal.email
	 // Only needed if you don't have a real mail account for testing
	 // let testAccount = await nodemailer.createTestAccount();
   
	 // create reusable transporter object using the default SMTP transport
// 	 var transporter = nodemailer.createTransport({
// 	   host: 'efacturacion.conditecrd.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: 'info@efacturacion.conditecrd.com',
//     pass: 'LV{VcGoj]W1$'
//   }
//    });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ing.dionisc@gmail.com',
    pass: 'slcm rpdb qfhs bfci' // No es tu contraseña de Gmail
  }
});
   
   //console.log(EmailSubject)
	 // setup e-mail data, even with unicode symbols
   var mailOptions = {
	 from:'"Condominos RD" <ing.dionisc@hotmail.com>', // sender address (who sends)
	 to: /*EmailTo,*/'ing.dionisc@gmail.com,auribe@grupocruzpuello.com', // list of receivers (who receives)
	 subject: EmailSubject,//'TRANSERSA APP ', // Subject line
	 // text: 'Hello world ', // plaintext body
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