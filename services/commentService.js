const dateTime = require('node-datetime');
const datetime = dateTime.create();
const faker = require('faker');

Comments = {

    insertComment: async function(req, org_name, comment){
        var coll = req.app.locals.commentColl
        var formatted = datetime.format('d-m-y H:M:S')
        var doc = {"comment": comment, "org_name": org_name, "created": formatted}
        await coll.insertOne(doc, function(err, res) {
            if (err){
                console.log(err)
                throw err
            }
            console.log("1 document inserted")
        })
        await orgExists(req, org_name)
    },

    moveToTrash: async function(req, records){
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
    },

    findAllComments: async function(req, org_name){
        var coll = req.app.locals.commentColl
        items = await coll.find({"org_name": org_name}, { projection: { _id: 0 } }).toArray()
        return items
    },

    hardDelete: async function(req, org_name){
        var coll = req.app.locals.commentColl
        await coll.deleteMany({"org_name": org_name}, function(err, result){
            if (err) {
                console.log(err)
                throw err
            }
        })
    },

    orgExists: async function(req, org_name){
        var coll = req.app.locals.organisationsColl
        var upsertVal = await coll.updateOne({"org_name": org_name}, {$setOnInsert: {"org_name": org_name}}, {upsert: true})
        if (upsertVal.result.upserted){
            console.log("upserted")
            await populateOrgData(req, org_name)
        }
    },

    populateOrgData: async function(req, org_name){
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
}

module.exports = Comments;