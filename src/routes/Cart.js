const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { aggregateCourse,getCartCourse,deleteCourse, deleteCart } = require('../controllers/Cart.controllers');

router.route('/:idUser').post(auth,aggregateCourse).get(getCartCourse).delete(deleteCart);

router.route('/:idUser/delete/:idCurse').delete(deleteCourse);

module.exports = router;