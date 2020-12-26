const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { createCourse,editCourse } = require('../controllers/Course.controllers');

router.route('/').post(createCourse);

module.exports = router;