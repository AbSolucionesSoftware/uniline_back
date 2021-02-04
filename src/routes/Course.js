const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { 
    createCourse,
    editCourse,
    editLerningsRequiredStudents,
    uploadFileCourse,
    uploadFile,
    uploadVideoCourse, 
    getCourseTeacher,
    addBlockCourse,
    getCourse,
    editBlockCourse,
    deleteBlockCourse,
    createTopicBlock,
    VideoTopicBlock,
    EditTopicBlock,
    editOrderTopic,
    uploadResourceTopic,
    uploadFile2,
    deleteResoursceTopic,
    DeleteTopicBlock,
    getBlockAndTopicCourse,
    getListCourse,
    registerTopicComplete,
    coursePrice,
    getCourseUser,
    generateCoupon,
    getCouponCourse,
    exchangeCouponCourse,
    publicCourse
 } = require('../controllers/Course.controllers');

router.route('/').post(createCourse);

router.route('/learnings/:idCourse').put(auth,editLerningsRequiredStudents);

router.route('/:idCourse').put(auth,editCourse).get(getCourse);

router.route('/imagen/:idCourse').put(auth,uploadFile,uploadFileCourse);

router.route('/video/:idCourse').put(auth,uploadVideoCourse);

router.route('/teacher/:idTeacher').get(auth,getCourseTeacher);

router.route('/:idUser').get(getCourseUser);

router.route('/public/:idCourse').put(publicCourse);

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Routes Block >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

router.route('/data/:idCourse').get(getBlockAndTopicCourse)

router.route('/block/:idCourse').post(addBlockCourse);

router.route('/block/edit/:idBlock').put(editBlockCourse);

router.route('/block/delete/:idBlock').delete(deleteBlockCourse);

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Routes Temas >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

router.route('/topic/:idBlock').post(createTopicBlock).put(EditTopicBlock);

router.route('/topic/edit/:idTopic').put(EditTopicBlock);

router.route('/topic/video/:idTopic').put(VideoTopicBlock);

router.route('/topic/resource/:idTopic').post(uploadFile2,uploadResourceTopic);

router.route('/topic/:idTopic/delete/resource/:idResourceTopic').delete(deleteResoursceTopic);

router.route('/topic/delete/:idTopic').delete(DeleteTopicBlock);

router.route('/content/order').put(editOrderTopic);

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Routes Temas >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

router.route('/datalist/:idCourse/user/:idUser').get(getListCourse);

router.route('/complete/topic/').post(registerTopicComplete);

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Promocion Curso >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

router.route('/price-promotion/:idCourse').put(coursePrice);

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Cupones Curso >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

router.route('/coupon/:idCourse').post(generateCoupon).get(getCouponCourse);

router.route('/coupon/exchange/').put(exchangeCouponCourse);



module.exports = router;