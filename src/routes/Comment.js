const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { createCommentCourse } = require('../controllers/Comment.controllers'); 

router.route('/:idCourse/user/:idUser').post(auth,createCommentCourse);

module.exports = router;