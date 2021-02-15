const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const {agregateCategorie,getCategories,editCategories,deleteCategories} = require('../controllers/Categories.controllers');


router.route('/').post(auth,agregateCategorie).get(getCategories);

router.route('/:idCategorie').put(auth,editCategories).delete(auth,deleteCategories);


module.exports = router;