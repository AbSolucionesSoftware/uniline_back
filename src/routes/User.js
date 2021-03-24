const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth");

const {
  createUser,
  createTeacher,
  getUser,
  signInUser,
  editUser,
  uploadFile,
  userFirebaseSign,
  resetPasswordUserSession,
  generateCodeResetPassword,
  verifyResetPassword,
  getTeachers,
  registerTeacherUser
} = require("../controllers/User.controllers");

router.route("/firebase").post(userFirebaseSign);

router.route("/").post(createUser);

router.route("/:idUser/teacher").put(createTeacher);

router.route("/:idUser").get(getUser).put(auth, uploadFile, editUser);

router.route("/signIn").post(signInUser);

router.route("/reset/password/:idUser").put(auth, resetPasswordUserSession);

router.route("/generate/reset/pass").post(generateCodeResetPassword);

router.route("/verify/:keyBlackList").put(verifyResetPassword);

router.route("/action/teacher/").get(auth,getTeachers).post(auth,registerTeacherUser);

module.exports = router;
