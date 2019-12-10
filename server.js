var express = require('express')
var mongodb = require('mongodb').MongoClient
var uri = "mongodb://localhost:27017/"
var app = express()
var dateTime = require('node-datetime')
var datetime = dateTime.create()
var bodyParser = require('body-parser')

app.use( bodyParser.json() )

mongodb.connect(uri, {useUnifiedTopology: true}, function(err, client){
    if (err) throw err
    var db = client.db('node_db')
    var commentColl = db.collection('comments')
    var memberColl = db.collection('members')
    var trashCommentColl = db.collection('trash_comments')
    console.log("Database created")
    app.locals.commentColl = commentColl
    app.locals.memberColl = memberColl
    app.locals.trashCommentColl = trashCommentColl
})

function insert_comment(req, org_name, comment){
    var coll = req.app.locals.commentColl
    var formatted = datetime.format('d-m-y H:M:S')
    var doc = {"comment": comment, "org_name": org_name, "created": formatted}
    coll.insertOne(doc, function(err, res) {
        if (err) throw err
        console.log("1 document inserted")
      })
}

function move_to_trash(req, records){
    var coll = req.app.locals.trashCommentColl
    var formatted = datetime.format('d-m-y H:M:S')
    for (each_record in records){
        each_record.deleted = formatted
        coll.insertOne(each_record)
    }
    console.log('All records moved to trash')
}

function find_all_comments(req, org_name){
    var coll = req.app.locals.commentColl
    var _list = coll.find({"org_name": org_name}, { projection: { _id: 0 } }).toArray(function(err, result){
        if (err) throw err
        // console.log(result)
        // return result
    })
    return _list
}

function hard_delete(req, org_name){
    var coll = req.app.locals.commentColl
    coll.deleteMany({"org_name": org_name}, function(err, result){
        if (err) {
            console.log(err)
            throw err
        }
    })
}

app.all('/orgs/:org/comment', function(req, res){
    console.log("Logging param org:-", req.params.org)
    if(req.method=='POST'){
        insert_comment(req, req.params.org, req.body.comment)
        msg = "The comment has been successfully posted"
    }
    if(req.method=='DELETE'){
        var records = find_all_comments(req, req.params.org)
        console.log("Logging records:-", records)
        move_to_trash(req, records)
        // hard_delete(req, req.params.org)
        msg = "The comments have been soft deleted"
    }
    res.send({"success": true, "error": false, "message": msg})
})

app.get('/', function(req, res){
    res.send("Hllo world")
    var formatted = datetime.format('d-m-y H:M:S')
    console.log(formatted)
    console.log("Printing request %s", req)
    console.log("Printing response %s", res)
    console.log("Printing secret %s", process.env.testing)
})

var server = app.listen(8081, function(){
    var host = server.address().address
    var port = server.address().port

    console.log("Hello world serving at http://%s:%d", host, port)
})