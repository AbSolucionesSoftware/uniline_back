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
    publicCourse,
    getCourseView,
    getCourses,
    aggregateCommentCourse,
    moreBuyCourse,
    searchCourse,
    getCourseDashUser,
    courseFreeInscription,
    getUsersCourse
 } = require('../controllers/Course.controllers');

router.route('/').post(auth,createCourse).get(getCourses);

router.route('/learnings/:idCourse').put(auth,editLerningsRequiredStudents);

router.route('/:idCourse').put(auth,editCourse).get(getCourse);

router.route('/view-course/:slugCourse').get(getCourseView);

router.route('/imagen/:idCourse').put(auth,uploadFile,uploadFileCourse);

router.route('/video/:idCourse').put(auth,uploadVideoCourse);

router.route('/teacher/:idTeacher').get(auth,getCourseTeacher);

router.route('/user/:idUser').get(auth,getCourseUser);

router.route('/public/:idCourse').put(auth,publicCourse);

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Filtros curso >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

router.route('/more/buy/').get(moreBuyCourse);

router.route('/search/:search').get(searchCourse);

router.route('/dashboard/teacher/:idCourse/users').get(auth,getUsersCourse);

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Routes Block >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

router.route('/data/:idCourse').get(auth,getBlockAndTopicCourse)

router.route('/block/:idCourse').post(auth,addBlockCourse);

router.route('/block/edit/:idBlock').put(auth,editBlockCourse);

router.route('/block/delete/:idBlock').delete(auth,deleteBlockCourse);

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Routes Temas >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

router.route('/topic/:idBlock').post(auth,createTopicBlock).put(auth,EditTopicBlock);

router.route('/topic/edit/:idTopic').put(auth,EditTopicBlock);

router.route('/topic/video/:idTopic').put(auth,VideoTopicBlock);

router.route('/topic/resource/:idTopic').post(auth,uploadFile2,uploadResourceTopic);

router.route('/topic/:idTopic/delete/resource/:idResourceTopic').delete(auth,deleteResoursceTopic);

router.route('/topic/delete/:idTopic').delete(auth,DeleteTopicBlock);

router.route('/content/order').put(auth,editOrderTopic);

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Routes Temas >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

router.route('/complete/topic/').post(registerTopicComplete);

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Promocion Curso >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

router.route('/price-promotion/:idCourse').put(auth,coursePrice);

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Cupones Curso >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

router.route('/coupon/:idCourse').post(auth,generateCoupon).get(auth,getCouponCourse);

router.route('/coupon/exchange/').put(auth,exchangeCouponCourse);

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Dashboard del usuario >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

//<<<<<<<<<<< Lista del curso >>>>>>>>>>//

router.route('/datalist/:idCourse/user/:idUser').get(getListCourse);

//<<<<<<<<<<< Informacion del curso >>>>>>>>>>//

router.route('/view/:slugCourse/user-progress/:idUser').get(auth,getCourseDashUser);


//<<<<<<<<<<<< Comentario y calificacion del Curso >>>>>>>>>>//

router.route('/comment/:idUser/course/:idCourse').post(auth,aggregateCommentCourse);

router.route('/:idCourse/inscription/course/free/user/:idUser').post(auth,courseFreeInscription);

module.exports = router;