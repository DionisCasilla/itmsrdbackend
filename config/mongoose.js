var config = require('./config'),
mongoose = require('mongoose');
const fs = require('fs');
const { _printConsole } = require('../app/utils/utils');

module.exports = function() {

    const modelPath = 'app/models/';
    
  
    var db = mongoose.connect(config.db);
    
  //  var modelPath = "app/models/";
    fs.readdirSync(modelPath).forEach(function(file) {
        var model = '../' + modelPath + file;
        console.log("model:", model);
        require(model);
    });

   //  console.log("\n======= Modelos Cargados =======\n");

   return db;




   
};