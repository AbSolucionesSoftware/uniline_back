const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { createCourse,editCourse,editLerningsRequiredStudents } = require('../controllers/Course.controllers');

router.route('/').post(createCourse);

router.route('/learnings/:idCourse').put(editLerningsRequiredStudents);

router.route('/:idCourse').put(editCourse);

module.exports = router;