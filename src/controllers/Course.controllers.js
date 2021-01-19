const courseCtrl = {};
const modelCourse = require("../models/Course");
const modelBlock = require("../models/Block");
const modelTopic = require("../models/Topic");
const uploadFileAws = require("../middleware/awsFile");
const modelTopicComplete = require("../models/topicsCompleted");

courseCtrl.uploadFile = async (req, res, next) => {
  try {
    await uploadFileAws.upload(req, res, function (err) {
      if (err) {
        res.status(500).json({ message: err });
      }
      return next();
    });
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};

courseCtrl.uploadFile2 = async (req, res, next) => {
  try {
    await uploadFileAws.uploadFile(req, res, function (err) {
      if (err) {
        res.status(500).json({ message: err });
      }
      return next();
    });
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};

courseCtrl.getCourses = async (req, res) => {
  try {
    const courses = await modelCourse.find({});
    res.status(200).json(courses);
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.getCourse = async (req, res) => {
  try {
    const course = await modelCourse.findById(req.params.idCourse);
    console.log(course);
    res.status(200).json(course);
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.getCourseTeacher = async (req,res) => {
  try {
    const course = await modelCourse.find({idProfessor: req.params.idTeacher});
    console.log(course);
    res.status(200).json(course);
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.editLerningsRequiredStudents = async (req, res) => {
  try {
    console.log(req.body);
    await modelCourse.findByIdAndUpdate(req.params.idCourse,req.body);
    res.status(200).json({message: "Curso actualizado"});

  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.createCourse = async (req, res) => {
  try {
    const newCourse = new modelCourse(req.body);
    newCourse.publication = false;
    newCourse.save((err, userStored) => {
      if (err) {
        res
          .status(500)
          .json({ message: "Ups, algo paso al crear el curso.", err });
      } else {
        if (!userStored) {
          res.status(404).json({ message: "Error al crear el curso." });
        } else {
          res.status(200).json({ message: "Curso creado", userStored });
        }
      }
    });
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.editCourse = async (req, res) => {
  try {
    console.log(req.body);
    const courseBase = await modelCourse.findById(req.params.idCourse); 
    if(courseBase){
      const editCourse = req.body;
      await modelCourse.findByIdAndUpdate(req.params.idCourse,editCourse);
      res.status(200).json({message: "Curso editado"});
    }else{
      res.status(504).json({ message: "Este curso no existe", error });
    }

  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.uploadFileCourse = async (req,res) => {
  try {
    const courseBase = await modelCourse.findById(req.params.idCourse);
    const editImagen = {};
    if(courseBase){
      if(req.file){
        console.log(req.file);
        if(courseBase.keyPromotionalImage){
          uploadFileAws.eliminarImagen(courseBase.keyPromotionalImage);
        }
        editImagen.keyPromotionalImage = req.file.key;
        editImagen.urlPromotionalImage = req.file.location;
        await modelCourse.findByIdAndUpdate(req.params.idCourse, editImagen);
        res.status(200).json({message: "Imagen agregada."});
      }else{
        res.status(404).json({ message: "Es necesario una imagen."});
      }
    }else{
      res.status(404).json({ message: "El curso no existe."});
    }
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.uploadVideoCourse = async (req,res) => {
  try {
      console.log(req.body);
      const video = req.body;
      await modelCourse.findByIdAndUpdate(req.params.idCourse,video);
      res.status(200).json({message: "Video subido correctamente"});
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.getListCourse = async (req,res) => {
  try {
    const idUser  = req.params.idUser;
    await modelBlock.find({idCourse: req.params.idCourse} , async function (err, GroupBlocks){
      const listCourseAdmin = [];
      //console.log(idUser);
      //console.log(typeof  idUser);
      /* console.log(GroupBlocks) */
      for(i = 0; i < GroupBlocks.length; i++){
        console.log(GroupBlocks[i]._id );
        const topics =  await modelTopic.aggregate(
            [
              {
                $sort : { preference: 1 }
              },
              {
                $match: {
                  idBlock: GroupBlocks[i]._id 
                }
              },
              {
                $lookup: {
                  from: 'topicscompleteds',
                  let: { "id": "$_id" , "user": `${idUser}`},
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$idTopic", {$toObjectId: "$$id"}]},
                            { $eq: ["$idUser", {$toObjectId: "$$user"}] }
                          ] 
                        }
                      }
                    }
                  ],
                  as: 'topicCompleted'
                }
              }
              /* {
                $lookup: {
                  from: 'topicscompleteds',
                  localField: '_id',
                  foreignField: 'idTopic',
                  as: 'topicCompleted'
                }
              } */
            ],
            async function(err, topicsBase) {
              if(err){
                console.log(err);
              }else{
                console.log(topicsBase);
                return topicsBase;
                
              }
            }
          );
        listCourseAdmin.push({
          block: GroupBlocks[i],
          topics: topics
        });
      }  
      res.status(200).json(listCourseAdmin);
    })
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Routes Block >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

courseCtrl.getBlockAndTopicCourse = async (req,res) => {
  try {
    await modelBlock.find({idCourse: req.params.idCourse} , async function (err, GroupBlocks){
      const listCourseAdmin = [];
      for(i = 0; i < GroupBlocks.length; i++){
        const topics =  await modelTopic.aggregate(
            [
              {
                $sort : { preference: 1 }
              },
              {
                $match: {
                  $or: [ { idBlock: GroupBlocks[i]._id } ]
                }
              }
            ],
            async function(err, subCategoriasBase) {
              return subCategoriasBase;
            }
          );
        listCourseAdmin.push({
          block: GroupBlocks[i],
          topics: topics
        });
      }  
      res.status(200).json(listCourseAdmin);
    })
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.addBlockCourse = async (req,res) => {
  try {
    const {blockTitle,preference} = req.body;
    const newBlock = await new modelBlock({
      blockTitle,
      preference,
      idCourse: req.params.idCourse
    });
    await newBlock.save();
    res.status(200).json({message: "Bloque agregado."});

  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.editBlockCourse = async (req,res) => {
  try {
    await modelBlock.findByIdAndUpdate(req.params.idBlock,req.body);
    res.status(200).json({message: "Block editado."});
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.deleteBlockCourse = async (req,res) => {
  try {
    
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Routes Topic >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

courseCtrl.createTopicBlock = async (req,res) => {
  try {
    const {topicTitle,preference} = req.body;
    const newTopic = new modelTopic({
      topicTitle,
      idBlock: req.params.idBlock,
      preference
    })
    await newTopic.save();
    res.status(200).json({message: "Tema agregado."});
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.VideoTopicBlock = async (req,res) => {
  try {
    console.log(req.body);
    const newUploadVideo = req.body;
    await modelTopic.findByIdAndUpdate(req.params.idTopic,newUploadVideo);
    res.status(200).json({message: "Video agregado"})
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.uploadResourceTopic = async (req,res) => {
  try {
    const { title , urlExtern } = req.body;
    const model = {
      title
    }

    if(req.file){
      model.keyDownloadResource = req.file.key;
      model.urlDownloadResource = req.file.location;
    }

    if(urlExtern){
      model.urlExtern = urlExtern;
    }

    await modelTopic.updateOne(
      { _id: req.params.idTopic },
      {
        $addToSet: {
          resources: [model]
        }
      },
      async (err, response) => {
				if (err) {
					res.status(500).json({ message: 'Ups, algo al el recurso', err });
				} else {
					if (!response) {
						res.status(404).json({ message: 'Error al guardar' });
					} else {
						res.status(200).json({ message: 'Recurso agregado' });
					}
				}
			}
    )
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.deleteResoursceTopic = async (req,res) => {
  try {
    const topicBase = await modelTopic.findById(req.params.idTopic);
    if(topicBase.resources.length){
      for(i = 0; i < topicBase.resources.length; i++){
        if(topicBase.resources[i]._id == req.params.idResourceTopic){
          console.log(req.params.idResourceTopic);
          if(topicBase.resources[i].keyDownloadResource){
            uploadFileAws.eliminarImagen(topicBase.resources[i].keyDownloadResource);
          }
          await modelTopic.updateOne(
            {
              _id: req.params.idTopic
            },
            {
              $pull: {
                resources: {
                  _id: req.params.idResourceTopic
                }
              }
            },
            (err, response) => {
              if (err) {
                res.status(500).json({ message: 'Ups, also paso en la base', err });
              } else {
                if (!response) {
                  res.status(404).json({ message: 'Recurso no existente.' });
                } else {
                  res.status(200).json({ message: 'Recurso eliminado' });
                }
              }
            }
          );
        }
      }
    }
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.EditTopicBlock = async (req,res) => {
  try {
    await modelTopic.findByIdAndUpdate(req.params.idTopic,req.body)
    res.status(200).json({message: "Tema editado."});
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.DeleteTopicBlock = async (req,res) => {
  try {
    const topic = await modelTopic.findById(req.params.idTopic);
    if(topic){
      res.status(404).json({ message: "Error del servidor" });
    }else{
      modelTopic.findByIdAndDelete(req.params.idTopic);
      res.status(200).json({message: "Tema eliminado"})
    }
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.editOrderTopic = async (req,res) => {
  try {
    
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.registerTopicComplete = async (req,res) => {
  try {
    const newTopicComplete = new modelTopicComplete(req.body);
    await newTopicComplete.save();
    res.status(200).json({message: "Tema completado"})
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}



module.exports = courseCtrl;
