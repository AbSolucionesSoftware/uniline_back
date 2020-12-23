const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const {createUser,createTeacher,getUser,signInUser,editUser,uploadFile,userFirebaseSign} = require('../controllers/User.controllers');

router.route('/firebase').post(userFirebaseSign);

router.route('/').post(createUser);

router.route('/:idUser/teacher').put(auth,createTeacher);

router.route('/:idUser').get(getUser).put(auth,uploadFile,editUser)

router.route('/signIn').post(signInUser);

module.exports = router;



