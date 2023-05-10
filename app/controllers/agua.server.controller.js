const { getCnn } = require('../../config/sqlcnx');

const sql = require("mssql");



exports.listaSucursales=async(req, res, next)=>{

	try {
		let pool = await sql.connect(getCnn("AGUA"));
		let result2 = await pool.request().query(`SELECT ContactoID,
		ContactoTexto,
		ContactoDireccion,
		ContactoLocation,-->Map Url
		ContactoLocation2-->Geolocalización
FROM	coreclientes
WHERE	InterID = 'OBED'
		AND ContactoGrupoID LIKE '%PLANTA%'
		AND ClienteAqua = 1`)

	
		let result = result2.recordset;
		console.log(result)

	return	res.json({
			success: true,
			message: "User List",
			result: result,
		  });
	} catch (error) {
		console.error(error)
	return	res.json({
			success: false,
			message: error,
			result: {},
		  });
	}
}

exports.getSucursalById=async(req, res, next)=>{

	const {id} = req.params;

	try {
		let pool = await sql.connect(getCnn("AGUA"));
		let result2 = await pool.request().query(`SELECT ContactoID,
		ContactoTexto,
		ContactoDireccion,
		ContactoLocation,-->Map Url
		ContactoLocation2-->Geolocalización
FROM	coreclientes
WHERE	InterID = 'OBED'
		AND ContactoGrupoID LIKE '%PLANTA%'
		AND ClienteAqua = 1
		AND ContactoID='${id}'
		`)

	
		let result = result2.recordset[0];
		console.log(result)

	return	res.json({
			success: true,
			message: "User List",
			result: result,
		  });
	} catch (error) {
		console.error(error)
	return	res.json({
			success: false,
			message: error,
			result: {},
		  });
	}
}

exports.updateLocationSucursal=async(req, res, next)=>{

	const {id} = req.params;
	const {coordenadas} = req.body;

	

	try {
		let pool = await sql.connect(getCnn("AGUA"));
		let result2 = await pool.request().query(`UPDATE coreclientes 
		SET ContactoLocation2='${coordenadas}'
        WHERE	InterID = 'OBED'
		AND ContactoGrupoID LIKE '%PLANTA%'
		AND ClienteAqua = 1
		AND ContactoID='${id}'
		`)

	
		let result = result2;
		console.log(result)

	return	res.json({
			success: true,
			message: "Coordenadas registra exitosamente.",
			result: result,
		  });
	} catch (error) {
		console.error(error)
	return	res.json({
			success: false,
			message: error,
			result: {},
		  });
	}
}