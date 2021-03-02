const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { createHomework, getHomeworks, qualificationHomeworkteacher } = require('../controllers/Homework.controllers'); 

router.route('/:idCourse/user/:idUser').post(auth,createHomework);

router.route('/:idCourse').get(auth,getHomeworks);

router.route('/qualification/:idHomework').put(auth,qualificationHomeworkteacher);

module.exports = router;