var CronJob = require("cron").CronJob;
const sql = require("mssql");
const {
  sentNotification,
} = require("../app/controllers/notificaciones.server.controller.js");
const sqlConfig = {
  user: "DB_A4454E_ITMSPLUS_admin",
  password: "sa@1234567890",
  database: "DB_A4454E_ITMSPLUS",
  server: "sql5053.site4now.net",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false, // change to true for local dev / self-signed certs
  },
};

module.exports = function (interID) {
  console.log(interID);

  var job = new CronJob("0 */59 * * * *", async function () {
    //console.log(sqlConfig);

    let pool = await sql.connect(sqlConfig);

    let result2 = await pool
      .request()
      .input("InterID", sql.VarChar(50), `${interID}`)
      .execute("jsonAppPushNotifications");

    // jsonAppRequest 'trs','p.aybar','T','TRS-0095','20-06-2021','17:00','JUAN PEREZ','',''

   // console.log(result2.recordset[0]["result"]);

    let result = JSON.parse(result2.recordset[0]["result"]);

    if (result.length > 0) {
     // result.forEach((alerta) => {

  for (const alerta of result) {
    
 let infoNoticacion=[];
 alerta.UserAlerts.forEach(infoAlerta => {
   
  infoNoticacion.push(infoAlerta["AlertText"])
 });
      //  console.log(alerta);
        var n = {
          appId: "443c8a63-b4c2-4634-922c-73b930e50d0e",
          apiKey: "N2QxNWFmYWItOWJiZi00OTZjLWE4NTktZjAzYjU3NDEwOTIx",
          data: {
          
            headings: { en: "Confirmacion Citas" },
            contents: {
              en:infoNoticacion.join("\n") //alerta.UserAlerts[0]["AlertText"]
              // `Mensajes de ${new Date().toLocaleString("es-do", {
              //   timeZone: "America/Santo_Domingo",
              // })}`,
            },
           // included_segments: ["Subscribed Users"],
            filters: [
              {"field": "tag", "key": "UserId", "relation": "=", "value": `${alerta.UserID}`}],//
            
          },
        };
    let confi=  await sentNotification(n);
        console.log(confi);
      };
    }
   
    //console.log(`You will see this message every second ${new Date().toISOString()}`);
    // }, null, true, 'America/Santo_Domingo');

    // if (result[0]["EstatusID"] === "OK") {
    //   console.log(result[0])
    //   //res.json({ success: true, message:  result[0]["Message"], result: result });
    // } else {
    //  // res.json({ success: false, message: result[0]["Message"], result: null });
    // }
  });

  job.start();
};
