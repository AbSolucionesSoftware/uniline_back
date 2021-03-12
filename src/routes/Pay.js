const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth");
const { createPay, confirmPay } = require("../controllers/Pay.controllers");

router.route("/generate/").post(auth,createPay);

router.route("/confirm/:idPay").put(auth,confirmPay);

router.route("/:idPay").get(auth,getPay);

module.exports = router;