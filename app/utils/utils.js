
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
exports._sendEmail=  async(EmailTo, EmailSubject, EmailBody)=> {

	//try {
		// Generate test SMTP service account from ethereal.email
	 // Only needed if you don't have a real mail account for testing
	 // let testAccount = await nodemailer.createTestAccount();
   
	 // create reusable transporter object using the default SMTP transport
	 var transporter = nodemailer.createTransport({
	   host: "smtp-mail.outlook.com", // hostname
	   secureConnection: false, // TLS requires secureConnection to be false
	   port: 587, // port for secure SMTP
	   tls: {
		  ciphers:'SSLv3'
	   },
	   auth: {
		   user: 'ing.dionisc@hotmail.com',
		   pass: 'Casilla12345'
	   }
   });
   
   //console.log(EmailSubject)
	 // setup e-mail data, even with unicode symbols
   var mailOptions = {
	 from:'"Condominos RD" <ing.dionisc@hotmail.com>', // sender address (who sends)
	 to: /*EmailTo,*/'ing.dionisc@gmail.com', // list of receivers (who receives)
	 subject: EmailSubject,//'TRANSERSA APP ', // Subject line
	 // text: 'Hello world ', // plaintext body
	 html:EmailBody 
	 // `<div>
	 // <div><strong>Estimados,</strong></div>
	 // <br />
	 // <div>Solicito&nbsp;por&nbsp;esta&nbsp;v&iacute;a&nbsp;la&nbsp;planificaci&oacute;n&nbsp;de&nbsp;cirug&iacute;a</div>
	 // <div><strong>Fecha</strong>:&nbsp;dd-mm-aaaa</div>
	 // <div><strong>Hora</strong>:&nbsp;hh:mm</div>
	 // <div><strong>CM</strong>:&nbsp;centro&nbsp;medico&nbsp;(es&nbsp;opcional)</div>
	 // <div><strong>Paciente</strong>:&nbsp;paciente</div>
	 // <br />
	 // <div><strong>Motivos</strong>:&nbsp;motivo&nbsp;(es&nbsp;opcional)</div>
	 // <br /><br />
	 // <div>Cualquier&nbsp;duda&nbsp;quedamos&nbsp;a&nbsp;sus&nbsp;ordenes.</div>
	 // <br /><br /><br />
	 // <div>Saludos&nbsp;cordiales.</div>
	 // </div>`
   };
   
   
   // send mail with defined transport object
   transporter.sendMail(mailOptions, function(error, info){
	 if(error){
		 return console.log(error);
	 }
   
	 console.log('Message sent: ' + info.response);
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