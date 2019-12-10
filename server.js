var express = require('express');
var mongodb = require('mongodb').MongoClient;
var uri = "mongodb://localhost:27017/mydb";
var app = express();
var bodyParser = require('body-parser');

app.use( bodyParser.json() );

mongodb.connect(uri, {useUnifiedTopology: true}, function(err, db){
    if (err) throw err;
    console.log("Database created");
    db.close();
})

app.post('/orgs/:org/comment', function(req, res){
    console.log("Printing request %s", req);
    console.log(req.body);
    console.log("The param is:- %s", req.params.org);
    res.send("Done");
})

app.get('/', function(req, res){
    res.send("Hllo world");

    console.log("Printing request %s", req);
    console.log("Printing response %s", res);
    console.log("Printing secret %s", process.env.testing);
})

var server = app.listen(8081, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("Hello world serving at http://%s:%d", host, port);
})