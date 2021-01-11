const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { createCourse,
    editCourse,
    editLerningsRequiredStudents,
    uploadFileCourse,uploadFile,
    uploadVideoCourse, 
    getCourseTeacher,
    addBlockCourse,
    getCourse,
    editBlockCourse,
    deleteBlockCourse,
    createTopicBlock,
    VideoTopicBlock,
    EditTopicBlock,
    editOrderTopic
 } = require('../controllers/Course.controllers');

router.route('/').post(createCourse);

router.route('/learnings/:idCourse').put(auth,editLerningsRequiredStudents);

router.route('/:idCourse').put(auth,editCourse).get(getCourse);

router.route('/imagen/:idCourse').put(auth,uploadFile,uploadFileCourse);

router.route('/video/:idCourse').put(auth,uploadVideoCourse);

router.route('/teacher/:idTeacher').get(auth,getCourseTeacher);

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Routes Block >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

router.route('/block/:idCourse').post(addBlockCourse);

router.route('/block/edit/:idBlock').put(editBlockCourse);

router.route('/block/delete/:idBlock').delete(deleteBlockCourse);

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Routes Temas >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

router.route('/topic/:idBlock').post(createTopicBlock).put(EditTopicBlock);

router.route('/topic/video/:idTema').post(VideoTopicBlock);

router.route('/topic/order').put(editOrderTopic);

module.exports = router;