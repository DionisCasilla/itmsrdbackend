const axios = require('axios');

exports.setupAxios=()=>{

    axios.defaults.baseURL= "https://documents.viafirma.com/documents/";
    axios.defaults.headers.Authorization ="Basic cHJvY3JlZGl0b19kb21pbmljYW5hOk1ENDNTQQ=="
       

    
}