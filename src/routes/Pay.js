const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth");
const { createPay } = require("../controllers/Pay.controllers");

router.route("/generate/").post(createPay);

module.exports = router;