const mongodb = require('mongodb').MongoClient
const uri = process.env.mongoUri
app = require('../index')


mongodb.connect(uri, {useUnifiedTopology: true}, function(err, client){
    if (err){ 
        console.log(err)
        throw err
    }
    var db = client.db(process.env.dbName)
    var commentColl = db.collection(process.env.commentColl)
    var memberColl = db.collection(process.env.memberColl)
    var trashCommentColl = db.collection(process.env.trashCommentColl)
    var organisationsColl = db.collection(process.env.organisationsColl)
    console.log("Database created")
    app.locals.commentColl = commentColl
    app.locals.memberColl = memberColl
    app.locals.trashCommentColl = trashCommentColl
    app.locals.organisationsColl = organisationsColl
})

module.exports = mongodb;