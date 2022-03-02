process.env.NODE_ENV = process.env.NODE_ENV || 'production';

var mongoose = require('./config/mongoose');

var db = mongoose();
var express = require('./config/express');
var job = require('./jobs/cronjobs');
var app         =   express();
var bodyParser  =   require("body-parser");
var morgan = require('morgan');

module.exports = app;
// job("TRS");
// job("ASMED");



var port = process.env.PORT || 8000
console.log(`Servidor ${port}`);
app.listen(port);