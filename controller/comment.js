var comment = require('../services/commentService')

var commentsController = {

    postComments: async function(req, res){
        await comment.insertComment(req, req.params.org, req.body.comment)
        msg = "The comment has been successfully posted"
        res.send({"success": true, "error": false, "message": msg})
    },
    deleteComment: async function(req, res){
        items = await comment.findAllComments(req, req.params.org)
        comment.moveToTrash(req, items)
        comment.hardDelete(req, req.params.org)
        msg = "The comments have been soft deleted"
        res.send({"success": true, "error": false, "message": msg})
    },
    getComments: async function(req, res){
        items = await comment.findAllComments(req, req.params.org)
        data = items
        msg = "The comments have been fetched."
        res.send({"success": true, "error": false, "message": msg, "data": data})
    }

}

module.exports = commentsController;