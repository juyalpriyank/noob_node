const express = require('express');
var app = module.exports = express();
const db = require('./db/db');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

app.use(bodyParser.json());

app.use('/', routes);


var server = app.listen(8081, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("API serving at http://%s:%d", host, port);
})