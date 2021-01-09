const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { createCourse,editCourse,editLerningsRequiredStudents,uploadFileCourse,uploadFile,uploadVideoCourse, getCourseTeacher } = require('../controllers/Course.controllers');

router.route('/').post(createCourse);

router.route('/learnings/:idCourse').put(editLerningsRequiredStudents);

router.route('/:idCourse').put(auth,editCourse);

router.route('/imagen/:idCourse').put(auth,uploadFile,uploadFileCourse);

router.route('/video/:idCourse').put(uploadVideoCourse);

router.route('/teacher/:idTeacher').get(getCourseTeacher);

module.exports = router;