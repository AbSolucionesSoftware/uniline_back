const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const {agregateCategorie,getCategories,editCategories,deleteCategories} = require('../controllers/Categories.controllers');

router.route('/').post(agregateCategorie).get(getCategories);

router.route('/:idCategorie').put(editCategories).delete(auth,deleteCategories);

module.exports = router;
