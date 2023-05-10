const cnxConfig = require('../config/sqlcnx.json')
exports.getCnn=(interID)=> {

	
  
	return {
	  user: cnxConfig[interID]["user"],
	  password: cnxConfig[interID].password,
	  database: cnxConfig[interID].database,
	  server: cnxConfig[interID].server,
	  pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000,
	  },
	  options: {
		encrypt: false, // for azure
		trustServerCertificate: false, // change to true for local dev / self-signed certs
	  },
	}
  
  }
