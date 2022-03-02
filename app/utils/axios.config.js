const axios = require('axios');

exports.setupAxios=()=>{

    axios.defaults.baseURL= "https://services.viafirma.com/documents/api/v3/";
    axios.defaults.headers.Authorization ="Basic cHJvY3JlZGl0b19kb21pbmljYW5hOk1ENDNTQQ=="
       

    
}