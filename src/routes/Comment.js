const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth");

const {
  createCommentCourse,
  getCommentsCourse,
  editCommentCourse,
  deleteCommentCourse,
  createAnswerCommentCourse,
  editAnswerCommentCourse,
  deleteAnswerCommentCourse,
  aggregateLikesComment,
  aggregateDislikesComment,
  aggregateLikesCommentAnswer,
  aggregateDislikesCommentAnswer,
} = require("../controllers/Comment.controllers");


router.route("/:idCourse/user/:idUser").post(auth, createCommentCourse);

router.route("/course/:idCourse").get(getCommentsCourse);

router.route("/:idComment").put(editCommentCourse).delete(deleteCommentCourse);

router.route('/:idComment/answer/:idUser').post(createAnswerCommentCourse);

router.route('/:idComment/user/answer/:idAnswer').put(editAnswerCommentCourse);

router.route('/:idComment/like');

router.route('/:idComment/dislike');

module.exports = router;
