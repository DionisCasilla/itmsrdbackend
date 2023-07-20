const { getCnn } = require("../../config/sqlcnx");

const sql = require("mssql");

exports.listaSucursales = async (req, res, next) => {

  try {
    let search=req.query["search"]??"";
    
    let pool = await sql.connect(getCnn("AGUA"));
   let result2=await pool.request()
  .input("InterID","OBED") 
	.input("ModoID",search!=""?2:1) 
	.input("ClienteID",search) 
	// .input("@Direccion",)
	// .input("@Ciudad",)
	// .input("@MapUrl",) 
	// .input("@MapPin",)
.execute("spAqua_IntegracionMaps")
                                

    let result = result2.recordset;


    return res.json({
      success: true,
      message: "Sucursales List",
      result: result,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error,
      result: {},
    });
  }
};

exports.getSucursalSearch = async (req, res, next) => {
  const { id } = req.query;

  try {
    let pool = await sql.connect(getCnn("AGUA"));
    let result2 = await pool.request().input("InterID","OBED") 
    .input("ModoID",2) 
    .input("ClienteID",) 
    // .input("@Direccion",)
    // .input("@Ciudad",)
    // .input("@MapUrl",) 
    // .input("@MapPin",)
  .execute("spAqua_IntegracionMaps")

    let result = result2.recordset[0];
    console.log(result);

    return res.json({
      success: true,
      message: "User List",
      result: result,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error,
      result: {},
    });
  }
};

exports.updateLocationSucursal = async (req, res, next) => {

  const  coordenadas  = req.body;
  try {
    let pool = await sql.connect(getCnn("AGUA"));
    let result2=await pool.request()
    .input("InterID","OBED") 
    .input("ModoID",3) 
    .input("ClienteID",coordenadas["CLIENTE_ID"]) 
    .input("Direccion",coordenadas["DIRECCION"])
    .input("Ciudad",coordenadas["CIUDAD"])
    .input("MapUrl",coordenadas[""]) 
    .input("MapPin",coordenadas["MAP_PIN"])
  .execute("spAqua_IntegracionMaps")

    let result = result2;

    return res.json({
      success: true,
      message: "Coordenadas registra exitosamente.",
      result: result,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error,
      result: {},
    });
  }
};
