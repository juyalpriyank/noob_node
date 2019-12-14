Members = {

    membersOfOrg: async function(req, orgName){
        try{
        var memberColl = req.app.locals.memberColl
        var orgColl = req.app.locals.organisationsColl
        var orgExists = await orgColl.findOne({"org_name": orgName})
        if(orgExists){
            var members = await memberColl.find({"org_name": orgName}, { projection: { _id: 0 } }).sort({followers: -1}).toArray()
            return members
        }
        return
    }
    catch(err){
        console.log("Printing error from membrsOfOrg", err)
    }
    }
}

module.exports = Members;