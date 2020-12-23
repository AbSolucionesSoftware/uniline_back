const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { createCourse } = require('../controllers/User.controllers');

router.route('/').post(createCourse);

module.exports = router;