const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { createCommentCourse, getCommentsCourse, editCommentCourse } = require('../controllers/Comment.controllers'); 
const { route } = require('./User');

router.route('/:idCourse/user/:idUser').post(auth,createCommentCourse);

router.route('/course/:idCourse').get(getCommentsCourse);

router.route('/:idComment').put(editCommentCourse);

/* router.route(); */

module.exports = router;