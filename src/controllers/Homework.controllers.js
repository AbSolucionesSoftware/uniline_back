const homeworkCtrl = {};
const modelHomework = require('../models/HomeWork');
const uploadFileAws = require('../middleware/awsFile');

homeworkCtrl.uploadFile = async (req,res,next) => {
    try {
        await uploadFileAws.uploadFile(req, res, function (err) {
            if (err) {
              res.status(500).json({ message: err });
            }
            return next();
          });
    } catch (error) {
        res.status(505).json({ message: "Error del servidor", error });
        console.log(error);
    }
}

homeworkCtrl.createHomework = async (req,res) => {
    try {
        /* const { qualificationHomework } = req.body; */
        /* const { qualificationHomework } = req.body;  */
        const createHomework = new modelHomework();
        if(req.file){
            createHomework.homeworkFileKey = req.file.key;
            createHomework.homeworkFileUrl = req.file.location;
            createHomework.idUser = req.params.idUser;
            createHomework.idCourse = req.params.idCourse;
            await createHomework.save(async function(err, HomeWork){
                if(err){
                    res.status(404).json({message: "Error de registro.",err})
                }else{
                    if(!HomeWork){
                        res.status(404).json({message: "La tarea no fue encontrada."})
                    }else{
                        res.status(200).json({message: "Tarea subida correctamente.", HomeWork})
                    }
                }
            });
           
        }else{
            res.status(404).json({message: "La tarea no fue encontrada."})
        }
    } catch (error) {
        res.status(505).json({ message: "Error del servidor", error });
        console.log(error);
    }
}

homeworkCtrl.qualificationHomeworkteacher = async (req,res) => {
    try {
        const {qualificationHomework} = req.body;
        await modelHomework.findByIdAndUpdate(req.params.idHomework,{qualificationHomework});
        req.status(200).json({message: "Tarea calificada."})
    } catch (error) {
        res.status(505).json({ message: "Error del servidor", error });
        console.log(error);
    }
}

homeworkCtrl.getHomeworks = async (req,res) => {
    try {
        const homeworks = await modelHomework.find({idCourse: req.params.idCourse});
        res.status(200).json(homeworks);
    } catch (error) {
        res.status(505).json({ message: "Error del servidor", error });
        console.log(error);
    }
}

module.exports = homeworkCtrl;