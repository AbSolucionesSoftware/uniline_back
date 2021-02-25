const commentCtrl = {};
const { json } = require('express');
const modelComment = require('../models/Comment');  


commentCtrl.getCommentsCourse = async (req,res) => {
    try {
        const { idTopic = '' } = req.query;
        var match = {};
        if(idTopic){
            match = {
                idCourse: req.params.idCourse,
                idTopic: idTopic
            };
        }else{
            match = {
                idCourse: req.params.idCourse
            };
        }

        await modelComment.aggregate(
            [
                {
                    $match: match
                },
                { 
					$sort: { createdAt: 1 } 
				}
            ],
			async (err, postStored) => {
				if (err) {
					res.status(500).json({ message: 'Error en el servidor', err });
				} else {
					if (!postStored) {
						res.status(404).json({ message: 'Error al mostrar comentarios' });
					} else {
						res.status(200).json(postStored);
					}
				}
			}
        );

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

commentCtrl.createCommentCourse = async (req,res) => {
    try {
        /* const {comment, idTopic} = req.body; */
        const newComment = new modelComment(req.body);
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
        const {  } = req.body;
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

commentCtrl.editAnswerCommentCourse = async (req,res) => {
    try {
        
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