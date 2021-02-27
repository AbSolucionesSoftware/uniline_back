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

router.route('/:idComment/answer/:idUser/new-answer/').post(createAnswerCommentCourse);

router.route('/:idComment/user/answer/:idAnswer/edit-answer/').put(editAnswerCommentCourse).delete(deleteAnswerCommentCourse);

router.route('/:idComment/like').put(aggregateLikesComment);

router.route('/:idComment/dislike').put(aggregateDislikesComment);

router.route('/:idComment/answer/:idAnswer/like').put(aggregateLikesCommentAnswer);

router.route('/:idComment/answer/:idAnswer/dislike').put(aggregateDislikesCommentAnswer);

module.exports = router;
