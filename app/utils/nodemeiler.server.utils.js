const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');


// Configura el transportador SMTP (puede ser Gmail, Outlook, SendGrid, etc.)
const transporter = nodemailer.createTransport({
  host: 'efacturacion.conditecrd.com',
  port: 465,
  secure: false,
  auth: {
    user: 'info@efacturacion.conditecrd.com',
    pass: 'LV{VcGoj]W1$'
  }
});

const sendHtmlEmail = async (to, subject, htmlPath) => {
  try {
    // Lee el archivo HTML
    const htmlContent = fs.readFileSync(path.resolve(htmlPath), 'utf8');

    // Envía el correo
    const info = await transporter.sendMail({
      from: '"Nombre del Remitente" <tu-correo@dominio.com>',
      to,
      subject,
      html: htmlContent
    });

    console.log('Correo enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return false;
  }
};

module.exports = sendHtmlEmail;