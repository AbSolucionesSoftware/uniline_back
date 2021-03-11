const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth");
const { createPay, confirmPay } = require("../controllers/Pay.controllers");

router.route("/generate/").post(createPay);

router.route("/confirm/:idPay").put(confirmPay);

module.exports = router;