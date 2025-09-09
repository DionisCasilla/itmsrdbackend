'use strict';
const path = require('path');
const XLSX = require('xlsx');
const {  _sendEmail } = require("../utils/utils");
const fs = require('fs');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

var moment = require('moment');
let browserSingleton = null;

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

    return res.status(200).json({ datafilter });
  } catch (error) {
    console.error('Error al leer el Excel:', error);
    return res.status(500).json({ error: 'Error al procesar el archivo' });
  }

 
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
// async function generatePdfBuffer(html) {
//      let browser;
//      const outputPath = path.join(__dirname, `../../public/gcp/comprobante_${Date.now()}.pdf`);
//     try {
//         browser = await puppeteer.launch();
//         const page = await browser.newPage();

//         // Set the HTML content
//         await page.setContent(html, { waitUntil: 'networkidle0' });

//         // Emulate screen media type for CSS rendering
//         await page.emulateMediaType('screen');

//         // Generate the PDF
//         await page.pdf({
//                         format: 'A4',
//             printBackground: true,
//             // Add other options as needed, e.g., landscape: true, margin: { top: '1in' }
//         });

//         console.log(`PDF generated successfully at ${outputPath}`);
//     } catch (error) {
//         console.error('Error generating PDF:', error);
//     } finally {
//         if (browser) {
//             await browser.close();
//         }
//     }
// }

async function getBrowser() {
  if (browserSingleton && browserSingleton.isConnected()) return browserSingleton;

  if (isServerless()) {
    // Render / Lambda -> puppeteer-core + @sparticuz/chromium
    const puppeteer = require('puppeteer-core');
    const chromium = require('@sparticuz/chromium');

    browserSingleton = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 800, deviceScaleFactor: 1 },
      executablePath: process.env.CHROMIUM_PATH || await chromium.executablePath(),
      headless: chromium.headless
    });
  } else {
    // Local dev -> preferir puppeteer completo (descarga su Chromium)
    let puppeteer;
    try {
      puppeteer = require('puppeteer'); // devDependency
      browserSingleton = await puppeteer.launch({
        headless: 'new', // o true según tu versión
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    } catch {
      // Fallback: puppeteer-core + Chrome del sistema
      puppeteer = require('puppeteer-core');
      const chromePath = resolveLocalChrome();
      if (!chromePath) {
        throw new Error(
          'No se encontró Chrome local. Instala Google Chrome o define CHROME_PATH con la ruta al binario.'
        );
      }
      browserSingleton = await puppeteer.launch({
        executablePath: chromePath,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1280, height: 800, deviceScaleFactor: 1 }
      });
    }
  }

  return browserSingleton;
}

/**
 * Genera un PDF desde HTML y devuelve Buffer.
 * @param {string} html
 * @param {object} [opts]
 * @param {'A4'|'Letter'} [opts.format='A4']
 * @param {boolean} [opts.landscape=true]
 * @param {string} [opts.margin='10mm']
 * @param {number} [opts.timeoutMs=60000]
 */
async function generatePdfBuffer(html, {
  format = 'A4',
  landscape = true,
  margin = '10mm',
  timeoutMs = 60000
} = {}) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.emulateMediaType('print');
    await page.setCacheEnabled(false);
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: timeoutMs });

    const buffer = await page.pdf({
      format,
      landscape,
      printBackground: true,
      margin: { top: margin, right: margin, bottom: margin, left: margin }
    });
    return buffer;
  } finally {
    await page.close();
  }
}

/** Detecta si estamos en entorno serverless (Render/AWS) */
function isServerless() {
  return !!(
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.RENDER ||
    process.env.CHROMIUM_PATH // si lo defines explícitamente
  );
}

/** Intenta resolver la ruta local de Chrome/Chromium en macOS/Windows/Linux */
function resolveLocalChrome() {
  const platform = process.platform;
  const candidates = [];

  if (process.env.CHROME_PATH) {
    candidates.push(process.env.CHROME_PATH);
  }

  if (platform === 'darwin') {
    candidates.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium'
    );
  } else if (platform === 'win32') {
    candidates.push(
      path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Google/Chrome/Application/chrome.exe'),
      path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Google/Chrome/Application/chrome.exe')
    );
  } else {
    // Linux desktop
    candidates.push('/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser');
  }

  return candidates.find(p => p && fs.existsSync(p));
}


module.exports = {
   getIndex,
    uploadandprocess
};