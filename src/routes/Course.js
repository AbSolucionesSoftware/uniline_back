const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { createCourse,editCourse,editLerningsRequiredStudents,uploadFileCourse,uploadFile,uploadVideoCourse, getCourseTeacher,addBlockCourse,getCourse } = require('../controllers/Course.controllers');

router.route('/').post(createCourse);

router.route('/learnings/:idCourse').put(auth,editLerningsRequiredStudents);

router.route('/:idCourse').put(auth,editCourse).get(getCourse);

router.route('/imagen/:idCourse').put(auth,uploadFile,uploadFileCourse);

router.route('/video/:idCourse').put(auth,uploadVideoCourse);

router.route('/teacher/:idTeacher').get(auth,getCourseTeacher);

router.route('/block/:idCourse').post(addBlockCourse);

module.exports = router;