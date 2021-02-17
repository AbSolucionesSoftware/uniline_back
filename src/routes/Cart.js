const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { aggregateCourse,getCartCourse,deleteCourse } = require('../controllers/Cart.controllers');

router.route('/:idUser').post(auth,aggregateCourse).get(getCartCourse);

module.exports = router;