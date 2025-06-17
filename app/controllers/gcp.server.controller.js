const path = require('path');
const XLSX = require('xlsx');
const {
  _getDataModel,
  _printConsole,
  _insertDataModel,
  _sendEmail,
  _validarEmpty,
  _isNumber,
} = require("../utils/utils");
const fs = require('fs');
const puppeteer = require('puppeteer');
var moment = require('moment');


const getIndex= (req, res) => {
  const url=path.join(__dirname, '../../public/gcp/gcpComprobantes.html');
  return res.sendFile(url);
}

const uploadandprocess=async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }
   try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet,{ header: 1,defval: ''});
    const headers = rows[0];

    const data = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((key, i) => {
        obj[key.toString().trim()] = row[i];
    });
    return obj;
    });
  const periodoPago=req.body.desde+ " - "+req.body.hasta;
  const datafilter = data.filter(x => x.CORREO && x.CORREO.trim() !== '');
        
  const url=path.join(__dirname, '../../public/gcp/gcpComprobantesbody.html');
  let htmlTemplate = fs.readFileSync(url, 'utf8');
  let ordenNomber = 1;
      for (const employer of datafilter) {
        const html = renderTemplate(htmlTemplate, employer,ordenNomber,periodoPago);
        ordenNomber++;
        const pdfBuffer = await generatePdfBuffer(html);
        await _sendEmail("ing.dionisc@gmail.com", "Comprobante", html, pdfBuffer, `Comprobante_${employer.CODIGO}.pdf`);
      }

    return res.status(200).json({ data });
  } catch (error) {
    console.error('Error al leer el Excel:', error);
    return res.status(500).json({ error: 'Error al procesar el archivo' });
  }

  return res.sendFile(url);
}

function renderTemplate(html, data,ordenNo,periodoPago ) {
  return html
    .replace(/{{codigo}}/g, data.CODIGO)
    .replace(/{{empleado}}/g, data.NOMBRE)
    .replace(/{{cedula}}/g, data.CEDULA)
    .replace(/{{fechageneracion}}/g, moment().format('DD/MM/YYYY'))
    .replace(/{{periodo}}/g, periodoPago)
    .replace(/{{noComprobante}}/g, ordenNo)
    .replace(/{{cuentaNo}}/g, data['CUENTA BANCARIA'])
    .replace(/{{fecheEmicion}}/g, moment().format('DD/MM/YYYY'))
    .replace(/{{cargo}}/g, data.CARGO)
    .replace(/{{salarioBase}}/g,parseFloat(data['$ SALARIO DIARIO']).toFixed(2))
    .replace(/{{correo}}/g, data.CORREO)
    .replace(/{{salarioHora}}/g, parseFloat(data['$ SALARIO HR']).toFixed(2))
    .replace(/{{quincena}}/g, data['SALARIO QUINCENAL'])
    .replace(/{{extra35}}/g, data['SALARIO QUINCENAL'])
    .replace(/{{extra100}}/g, data['SALARIO QUINCENAL'])
    .replace(/{{extra15}}/g, data['SALARIO QUINCENAL'])
    .replace(/{{incentivo}}/g, data['SALARIO QUINCENAL'])
    .replace(/{{otroIngresos}}/g, data['OTROS INGRESOS'])
    .replace(/{{totalQuincena}}/g, data['TOTAL.QUINC.'])
    .replace(/{{afpMonto}}/g, parseFloat(data['AFP NORMAL']).toFixed(2))
    .replace(/{{sfsMonto}}/g,parseFloat(data['SFS NORMAL']).toFixed(2))
    .replace(/{{isrMonto}}/g, parseFloat(data.ISR).toFixed(2))
    .replace(/{{afpMonto}}/g, data['SALARIO QUINCENAL'])
    .replace(/{{otrosDesMonto}}/g, data['SALARIO QUINCENAL'])
    .replace(/{{neto}}/g, data['NETO NOMINA QUINCENAL DIC.'])
    .replace(/{{noComprobante}}/g, data['SALARIO QUINCENAL']);
}

/**
 * Convierte HTML en un PDF buffer usando Puppeteer
 * @param {string} html HTML a renderizar
 * @returns {Buffer} PDF en memoria (Buffer)
 */
async function generatePdfBuffer(html) {
  const browser = await puppeteer.launch({
    headless: true,
     executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4', landscape: true, printBackground: true });

  await browser.close();
  return pdfBuffer;
}


module.exports = {
   getIndex,
    uploadandprocess
};