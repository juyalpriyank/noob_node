var express = require('express')
var mongodb = require('mongodb').MongoClient
var uri = "mongodb://localhost:27017/"
var app = express()
var dateTime = require('node-datetime')
var datetime = dateTime.create()
var bodyParser = require('body-parser')
var faker = require('faker');


app.use(bodyParser.json())

mongodb.connect(uri, {useUnifiedTopology: true}, function(err, client){
    if (err) throw err
    var db = client.db('node_db')
    var commentColl = db.collection('comments')
    var memberColl = db.collection('members')
    var trashCommentColl = db.collection('trash_comments')
    var organisationsColl = db.collection('organisations')
    console.log("Database created")
    app.locals.commentColl = commentColl
    app.locals.memberColl = memberColl
    app.locals.trashCommentColl = trashCommentColl
    app.locals.organisationsColl = organisationsColl
})


// TODO: Call control c function to close db conn

async function populateOrgData(req, org_name){
    var coll = req.app.locals.memberColl
    numOfRecords = Math.floor(Math.random() * Math.floor(5)) + 1
    console.log("Printing numofrecords", numOfRecords)
    console.log("Printing org_name", org_name)
    for(var i = 0; i<=numOfRecords; i++){
        myObj = {"name": faker.name.findName(),
                 "org_name": org_name,
                 "followers": faker.random.number(),
                 "following": faker.random.number(),
                 "email": faker.internet.email(),
                 "avatar": faker.internet.avatar()
                }
        await coll.insertOne(myObj, function(err, res) {
            if (err){
                console.log("Error from populateOrgData", err)
                throw err
            }
          })
    }
}

async function membersOfOrg(req, orgName){
    var memberColl = req.app.locals.memberColl
    var orgColl = req.app.locals.organisationsColl
    var orgExists = await orgColl.findOne({"org_name": orgName})
    if(orgExists){
        var members = await memberColl.find({"org_name": orgName}, { projection: { _id: 0 } }).sort({followers: -1}).toArray()
        return members
    }
    return
}

async function orgExists(req, org_name){
    var coll = req.app.locals.organisationsColl
    var upsertVal = await coll.updateOne({"org_name": org_name}, {$setOnInsert: {"org_name": org_name}}, {upsert: true})
    if (upsertVal.result.upserted){
        console.log("upserted")
        await populateOrgData(req, org_name)
    }
}

async function insert_comment(req, org_name, comment){
    var coll = req.app.locals.commentColl
    var formatted = datetime.format('d-m-y H:M:S')
    var doc = {"comment": comment, "org_name": org_name, "created": formatted}
    await coll.insertOne(doc, function(err, res) {
        if (err) throw err
        console.log("1 document inserted")
      })
    await orgExists(req, org_name)
}

async function move_to_trash(req, records){
    var coll = req.app.locals.trashCommentColl
    var formatted = datetime.format('d-m-y H:M:S')
    records.forEach(function(key){
        console.log("Printing each record", key)
        key.deleted = formatted
        coll.insertOne(key, function(err, res){
            if(err) {
                console.log("Error from move_to_trash insert", err)
                throw err
            }
            })
    })
    console.log('All records moved to trash')
}

async function find_all_comments(req, org_name){
    var coll = req.app.locals.commentColl
    items = await coll.find({"org_name": org_name}, { projection: { _id: 0 } }).toArray()
    return items
}

async function hard_delete(req, org_name){
    var coll = req.app.locals.commentColl
    await coll.deleteMany({"org_name": org_name}, function(err, result){
        if (err) {
            console.log(err)
            throw err
        }
    })
}
// TODO: Add try catch exceptions

app.all('/orgs/:org/comment', async function(req, res){
    var data = []
    if(req.method=='POST'){
        await insert_comment(req, req.params.org, req.body.comment)
        msg = "The comment has been successfully posted"
    }
    if(req.method=='DELETE'){
        items = await find_all_comments(req, req.params.org)
        move_to_trash(req, items)
        hard_delete(req, req.params.org)
        msg = "The comments have been soft deleted"
    }
    if(req.method=='GET'){
        items = await find_all_comments(req, req.params.org)
        data = items
        msg = "The comments have been fetched."
    }
    res.send({"success": true, "error": false, "message": msg, "data": data})
})

app.get('/orgs/:org/members', async function(req, res){
    data = await membersOfOrg(req, req.params.org)
    res.send({"success": true, "error": false, "message": "Members have been successfully fetched.", "data": data})
})


// Only for testing
app.get('/', function(req, res){
    res.send("Hello world")
    var formatted = datetime.format('d-m-y H:M:S')
    console.log(formatted)
    console.log("Printing request %s", req)
    console.log("Printing response %s", res)
    console.log("Printing secret %s", process.env.testing)
})

var server = app.listen(8081, function(){
    var host = server.address().address
    var port = server.address().port

    console.log("API serving at http://%s:%d", host, port)
})