const {Router} = require('express');
const router = Router();

const {createUser} = require('../controllers/User.controllers');



router.route('/').post(createUser)


module.exports = router;
