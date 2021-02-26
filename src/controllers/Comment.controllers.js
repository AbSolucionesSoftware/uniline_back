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
        console.log(match);

        const comment = await modelComment.find(match);
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

commentCtrl.createCommentCourse = async (req,res) => {
    try {
        /* const {comment, idTopic} = req.body; */
        const newComment = new modelComment(req.body);
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
        const { comment,idUser } = req.body;
        await modelComment(
            {
                _id: req.params.idComment
            },
            {
                $addToSet: {
                    answers: [
                        {
                            comment: comment,
                            idUser: idUser,
                            createComment: new Date(),
                            editComment: new Date()
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
        
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

commentCtrl.aggregateLikesComment = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

commentCtrl.aggregateDislikesComment = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

commentCtrl.aggregateLikesCommentAnswer = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

commentCtrl.aggregateDislikesCommentAnswer = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}


module.exports = commentCtrl;