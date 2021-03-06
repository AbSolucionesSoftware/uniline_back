const commentCtrl = {};
const modelComment = require('../models/Comment');  


commentCtrl.getCommentsCourse = async (req,res) => {
    try {
        const { idTopic = '' } = req.query;
        console.log(req.params.idCourse );
        var match = {  };
        if(idTopic){
            match = { idCourse: req.params.idCourse, idTopic: idTopic }
        }else{
            match = { idCourse: req.params.idCourse}
        }
        const comment = await modelComment.find(match).populate('idUser idCourse').populate({path: 'answers.idUser', model: 'user'}).sort({createdAt: 1});
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

commentCtrl.createCommentCourse = async (req,res) => {
    try {
        const newComment = new modelComment(req.body);
        console.log(req.body);
        newComment.idCourse = req.params.idCourse;
        newComment.idUser = req.params.idUser;
        newComment.likes = 0;
        newComment.dislikes = 0;
        await newComment.save();
        res.status(200).json({message: "Comentario agregado."});
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

commentCtrl.editCommentCourse = async (req,res) => {
    try {
        const { comment } = req.body;
        await modelComment.findByIdAndUpdate(req.params.idComment,{comment:comment})
        res.status(200).json({message: "Comentario editado"});
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

commentCtrl.deleteCommentCourse = async (req,res) => {
    try {
        const deleteComent = await modelComment.findById(req.params.idComment);
        if(deleteComent){
            await modelComment.findByIdAndDelete(req.params.idComment);
            res.status(200).json({message: "Comentario eliminado"});
        }else{
            res.status(200).json({message: "Este comentario no existe. "});
        }
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

commentCtrl.createAnswerCommentCourse = async (req,res) => {
    try {
        const { comment } = req.body;
        console.log(req.body);
        await modelComment.updateOne(
            {
                _id: req.params.idComment
            },
            {
                $addToSet: {
                    answers: [
                        {
                            comment: comment,
                            idUser: req.params.idUser,
                            createComment: new Date(),
                            editComment: new Date(),
                            likes: 0,
                            dislikes: 0
                        }
                    ]
                }
            },
			async (err, response) => {
				if (err) {
					res.status(500).json({ message: 'Ups, algo al agregar respuesta.', err });
				} else {
					if (!response) {
						res.status(404).json({ message: 'Error al guardar' });
					} else {
						res.status(200).json({ message: 'Comentario agregado.' });
					}
				}
			}
        )
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

commentCtrl.editAnswerCommentCourse = async (req,res) => {
    try {
        const commentBase = await modelComment.findById(req.params.idComment);
        const answer = commentBase.answers.filter((x) => x._id == req.params.idAnswer);
        answer.map(async (answer) => {
            const {comment} = req.body;
            await modelComment.updateOne(
                {
                    'answers._id': req.params.idAnswer
                },
                {
                    $set: { 'answers.$': {
                        comment: comment,
                        idUser: answer.idUser,
                        likes: answer.likes,
                        dislikes: answer.dislikes,
                        createComment: answer.createComment,
                        editComment: new Date()
                    } }
                },
				async (err, response) => {
					if (err) {
						res.status(500).json({ message: 'Ups algo paso al actualizar', err });
					} else {
						if (!response) {
							res.status(404).json({ message: 'Ups, algo paso al actualizar.' });
						} else {
							res.status(200).json({ message: 'Comentario actualizado.' });
						}
					}
				}
            );
        })
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

commentCtrl.deleteAnswerCommentCourse = async (req,res) => {
    try {
        await modelComment.updateOne(
            {
                _id: req.params.idComment
            },
            {

                $pull: {
                    answers: {
                        _id: req.params.idAnswer
                    }
                }
            },
            (err, response) => {
				if (err) {
					res.status(500).json({ message: 'Ups, algo paso en la base', err });
				} else {
					if (!response) {
						res.status(404).json({ message: 'Algo paso al eliminar' });
					} else {
						res.status(200).json({ message: 'Comentario eliminado.' });
					}
				}
			}
        )
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

commentCtrl.aggregateLikesComment = async (req,res) => {
    try {
        const commentBase = await modelComment.findById(req.params.idComment);
        var likesBase = parseInt(commentBase.likes);
        await modelComment.findByIdAndUpdate(req.params.idComment,{likes: likesBase + 1});
        res.status(200).json({message: "Like agregado."});
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

commentCtrl.aggregateDislikesComment = async (req,res) => {
    try {
        const commentBase = await modelComment.findById(req.params.idComment);
        var dislikesBase = parseInt(commentBase.dislikes);
        await modelComment.findByIdAndUpdate(req.params.idComment,{dislikes: dislikesBase + 1});
        res.status(200).json({message: "Dislike agregado."});
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

commentCtrl.aggregateLikesCommentAnswer = async (req,res) => {
    try {
        const commentBase = await modelComment.findById(req.params.idComment);
        const answer = commentBase.answers.filter((x) => x._id == req.params.idAnswer);
        answer.map(async (answer) => {
            var likeMore = parseInt(answer.likes) + 1;
            await modelComment.updateOne(
                {
                    'answers._id': req.params.idAnswer
                },
                {
                    $set: { 'answers.$': {
                        comment: answer.comment,
                        idUser: answer.idUser,
                        likes: likeMore,
                        dislikes: answer.dislikes,
                        createComment: answer.createComment,
                        editComment: new Date()
                    } }
                },
				async (err, response) => {
					if (err) {
						res.status(500).json({ message: 'Ups algo paso al actualizar', err });
					} else {
						if (!response) {
							res.status(404).json({ message: 'Ups, algo paso al actualizar.' });
						} else {
							res.status(200).json({ message: 'Comentario actualizado.' });
						}
					}
				}
            );
        })
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

commentCtrl.aggregateDislikesCommentAnswer = async (req,res) => {
    try {
        const commentBase = await modelComment.findById(req.params.idComment);
        const answer = commentBase.answers.filter((x) => x._id == req.params.idAnswer);
        answer.map(async (answer) => {
            var disLikeMore = parseInt(answer.dislikes) + 1;
            await modelComment.updateOne(
                {
                    'answers._id': req.params.idAnswer
                },
                {
                    $set: { 'answers.$': {
                        comment: answer.comment,
                        idUser: answer.idUser,
                        likes: answer.likes,
                        dislikes: disLikeMore,
                        createComment: answer.createComment,
                        editComment: new Date()
                    } }
                },
				async (err, response) => {
					if (err) {
						res.status(500).json({ message: 'Ups algo paso al actualizar', err });
					} else {
						if (!response) {
							res.status(404).json({ message: 'Ups, algo paso al actualizar.' });
						} else {
							res.status(200).json({ message: 'Comentario actualizado.' });
						}
					}
				}
            );
        })
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}


module.exports = commentCtrl;