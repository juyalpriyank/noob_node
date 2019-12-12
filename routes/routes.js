const express = require('express')
const router = express.Router()

var comments = require('../controller/comment')
var members = require('../controller/member')

router.route('/orgs/:org/comment', comments.postComments).post()

router.get('/orgs/:org/comment', comments.getComments)

router.delete('/orgs/:org/comment', comments.deleteComment)

router.get('/orgs/:org/members', members.getMembers)


module.exports = router