const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const {uploadFile, createHomework, getHomeworks, qualificationHomeworkteacher, deleteHomeworks, getHomeworkUser } = require('../controllers/Homework.controllers'); 

router.route('/:idCourse/user/:idUser').post(auth,uploadFile,createHomework);

router.route('/:idCourse').get(auth,getHomeworks);

router.route('/get/:idHomework').get(auth,getHomeworkUser)

router.route('/qualification/:idHomework').put(auth,qualificationHomeworkteacher);

router.route('/delete/:idHomework').delete(auth,deleteHomeworks);

module.exports = router;