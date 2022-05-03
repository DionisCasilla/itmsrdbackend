// exports.sendContactMail = function (nombre, apellido, telefono, email, mensaje) {
//     const sgMail = require('@sendgrid/mail');
//     sgMail.setApiKey("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");
//     const msg = {
//         to: 'yamil.alburquerque@gmail.com',
//         from: 'solicitudcontacto@cps-dom.com',
//         subject: 'Sending with Twilio SendGrid is Fun',
//         text: 'and easy to do anywhere, even with Node.js',
//         html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//     };
//     sgMail.send(msg);
// }

// exports.sendPostCheckInMail = function (trackingNumber, cpsNo, packageNumber, usdValue, emailAddressPost, uploadInvoice) {
    
//     sendPostCheckInMailGeneric(
//         'webcps@cps-dom.com', 
//         emailAddressPost, 
//         'Post Check-In CPS', 
//         'Gracias por realizar su post check-in. Hemos recibido satisfactoriamente su factura. Para más información puede comunicarse con el departamento de operaciones. Correo: amazon.ses@cps-dom.com. Teléfono: (809)563-2000 Ext. 7509 / 7477 / 7474', 
//         uploadInvoice);

//     sendPostCheckInMailGeneric(
//         'webcps@cps-dom.com', 
//         'cps.postchecking@gmail.com',
//         'Post Check-In CPS: ' + cpsNo, 
//         'CPS: ' + cpsNo + '. Tracking No.: ' + trackingNumber + '. No. Paquete: ' + packageNumber + '. Valor: ' + usdValue + '. Factura Imágen: ', 
//         uploadInvoice);

// }

// function sendPostCheckInMailGeneric(paramFromEmail, paramToMail, paramSubject, paramMessage, paramUploadInvoice) {
//     var helper = require('sendgrid').mail;
//     var fs = require('fs');

//     var fromEmail = new helper.Email(paramFromEmail);
//     var toEmail = new helper.Email(paramToMail);
//     var subject = paramSubject;
//     var content = new helper.Content('text/html', paramMessage);
//     var mail = new helper.Mail(fromEmail, subject, toEmail, content);
    
//     var attachment = new helper.Attachment();
//     var file = fs.readFileSync(paramUploadInvoice.path);
//     var base64File = new Buffer(file).toString('base64');
//     attachment.setContent(base64File);
//     attachment.setType(paramUploadInvoice.type);
//     attachment.setFilename(paramUploadInvoice.name);
//     attachment.setDisposition('attachment');

//     mail.addAttachment(attachment);

//     var sg = require('sendgrid')('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');
//     var request = sg.emptyRequest({
//         method: 'POST',
//         path: '/v3/mail/send',
//         body: mail.toJSON()
//     });

//     sg.API(request, function(error, response) {
//         if (error) {
//             console.log('Error response received');
//         }
//         console.log(response.statusCode);
//         console.log(response.body);
//         console.log(response.headers);
//     });
// }


// function sendOperaciones(trackingNumber, cpsNo, packageNumber, usdValue, emailAddressPost) {
    
// }

// // exports.sendBulletinSubscription = function(fullName, claim, nationalID, email, phone) {
// // exports.sendPostCheckIn = function(fullName, claim, nationalID, email, phone) {
// //     var helper = require('sendgrid').mail;
// //     var fromEmail = new helper.Email('reclamaciones@hyundaion.com');
// //     var toEmail = new helper.Email("atencionmagnacrm@magna.com.do");
// //     var subject = 'HYUNDAI ON: RECLAMACIONES';
// //     var content = new helper.Content('text/html', ' ');
// //     var mail = new helper.Mail(fromEmail, subject, toEmail, content);
// //     mail.personalizations[0].addSubstitution(new helper.Substitution('%body%', '.'));
// //     mail.personalizations[0].addSubstitution(new helper.Substitution('%fullName%', fullName));
// //     mail.personalizations[0].addSubstitution(new helper.Substitution('%claim%', claim));
// //     mail.personalizations[0].addSubstitution(new helper.Substitution('%cedula%', nationalID));
// //     mail.personalizations[0].addSubstitution(new helper.Substitution('%email%', email));
// //     mail.personalizations[0].addSubstitution(new helper.Substitution('%phone%', phone));
// //     mail.setTemplateId('d1da97db-7295-4327-9f81-e6c5cec1440e');

// //     var sg = require('sendgrid')('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');
// //     var request = sg.emptyRequest({
// //         method: 'POST',
// //         path: '/v3/mail/send',
// //         body: mail.toJSON()
// //     });

// //     sg.API(request, function(error, response) {
// //         if (error) {
// //             console.log('Error response received');
// //         }
// //         console.log(response.statusCode);
// //         console.log(response.body);
// //         console.log(response.headers);
// //     });
// // }