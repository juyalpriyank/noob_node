var member = require('../services/memberService')

var membersController = {
    getMembers: async function(req, res){
        data = await member.membersOfOrg(req, req.params.org)
        res.send({"success": true, "error": false, "message": "Members have been successfully fetched.", "data": data})
    }
}

module.exports = membersController;