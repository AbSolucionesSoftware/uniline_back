const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const {createUser,createTeacher,getUser,signInUser,editUser,uploadFile,userFirebaseSign,resetPasswordUserSession} = require('../controllers/User.controllers');

router.route('/firebase').post(userFirebaseSign);

router.route('/').post(createUser);

router.route('/:idUser/teacher').put(auth,createTeacher);

router.route('/:idUser').get(getUser).put(auth,uploadFile,editUser)

router.route('/signIn').post(signInUser);

router.route('/reset/password/:idUser').put(resetPasswordUserSession)

module.exports = router;



