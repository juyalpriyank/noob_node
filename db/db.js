const mongodb = require('mongodb').MongoClient
const uri = "mongodb://localhost:27017/"
app = require('../index')


mongodb.connect(uri, {useUnifiedTopology: true}, function(err, client){
    if (err){ 
        console.log(err)
        throw err
    }
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

module.exports = mongodb;