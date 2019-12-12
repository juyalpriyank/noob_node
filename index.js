const express = require('express');
const bodyParser = require('body-parser');
var app = module.exports = express();
const routes = require('./routes/routes');
const db = require('./db/db');

app.use(bodyParser.json());

app.use('/', routes);


var server = app.listen(8081, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("API serving at http://%s:%d", host, port);
})
