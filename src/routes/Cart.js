const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { aggregateCourse,getCartCourse,deleteCourse } = require('../controllers/Cart.controllers');

router.route('/:idUser').get(getCartCourse);

router.route('/aggregate/:idUser').post(auth,aggregateCourse)

module.exports = router;