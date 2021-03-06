const courseCtrl = {};
const modelCourse = require("../models/Course");
const modelBlock = require("../models/Block");
const modelTopic = require("../models/Topic");
const uploadFileAws = require("../middleware/awsFile");
const modelTopicComplete = require("../models/topicsCompleted");
const reuserFunction = require("../middleware/reuser");
const modelCoupon = require("../models/Coupon");
const modelInscription = require("../models/Inscription");
const modelCommentCourse = require('../models/CommentCourse');
const modelComentDashCourse = require('../models/Comment');

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
    const courses = await modelCourse.find({publication: true}).populate('idProfessor');
    res.status(200).json(courses);
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.getCourseView = async (req, res) => {
  try {
      const course = await modelCourse.findOne({slug: req.params.slugCourse}).populate('idProfessor');
      await modelBlock.find({idCourse: course._id}, async function(err, blocks){
        let countCursos = 0;
        const newArray = {
          course,
          totalTopics: "",
          totalInscription: "",
          commentCourse: [],
        };
        for(i = 0; i < blocks.length; i++){
          const topics = await modelTopic.countDocuments({idBlock: blocks[i]._id});
          countCursos+= topics;
        }
        newArray.totalTopics = countCursos;

        const inscriptions = await modelInscription.countDocuments({idCourse: course._id});
        newArray.totalInscription = inscriptions - 1;

        const commentCourse = await modelCommentCourse.find({idCourse: course._id}).populate('idUser');
        newArray.commentCourse = commentCourse;

        await modelBlock.find(
          { idCourse: course._id },
          async function (err, GroupBlocks) {
            const listCourseAdmin = [];
            for (i = 0; i < GroupBlocks.length; i++) {
              const topics = await modelTopic.aggregate(
                [
                  {
                    $sort: { preference: 1 },
                  },
                  {
                    $match: {
                      idBlock: GroupBlocks[i]._id,
                    },
                  },
                ],
                async function (err, topicsBase) {
                  if (err) {
                    console.log(err);
                  } else {
                    return topicsBase;
                  }
                }
              );
              listCourseAdmin.push({
                block: GroupBlocks[i],
                topics: topics,
              });
            }
            newArray.contentCourse = listCourseAdmin
            //res.status(200).json(listCourseAdmin);
            res.status(200).json(newArray);
          }
        ).sort({ preference: 1 });
    });

  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.getCourseDashUser = async (req, res) => {
  try {
    const course = await modelCourse.findOne({slug: req.params.slugCourse}).populate('idProfessor');
    await modelBlock.find({idCourse: course._id}, async function(err, blocks){
      let countCursos = 0;
      const newArray = {
        course,
        totalTopics: "",
        totalInscription: "",
        commentCourse: [],
        inscriptionStudent: {},
        endTopicView: "",
        commentStudentQualification: "",
      };
      for(i = 0; i < blocks.length; i++){
        const topics = await modelTopic.countDocuments({idBlock: blocks[i]._id});
        countCursos+= topics;
      }
      newArray.totalTopics = countCursos;

      const inscriptions = await modelInscription.countDocuments({idCourse: course._id});
      newArray.totalInscription = inscriptions;

      const inscriptionUser = await modelInscription.findOne({idCourse: course._id, idUser: req.params.idUser});
      newArray.inscriptionStudent = inscriptionUser;

      const commentCourse = await modelComentDashCourse.find({idCourse: course._id}).populate('idUser');
      newArray.commentCourse = commentCourse;

      const endTopic = await modelTopicComplete.find({idCourse: course._id, idUser: req.params.idUser}).sort({createdAt: -1});
      if(endTopic.length > 0){
        newArray.endTopicView = endTopic[0].idTopic;
      }else{
        const blocks = await modelBlock.find({ idCourse: course._id }).sort({preference: 1});
        if(blocks.length > 0){
          const topicsCourse = await modelTopic.find({idBlock: blocks[0]._id}).sort({preference: 1});
          if(topicsCourse.length > 0){
            newArray.endTopicView = topicsCourse[0]._id;
          }else{
            newArray.endTopicView = null;
          }
        }else{
          newArray.endTopicView = null;
        }
      }
      const commentCalification = await modelCommentCourse.findOne({idUser: req.params.idUser, idCourse: course._id});
      newArray.commentStudentQualification = commentCalification;
      res.status(200).json(newArray);
  });

} catch (error) {
  res.status(505).json({ message: "Error del servidor", error });
  console.log(error);
}
}

courseCtrl.getCourse = async (req, res) => {
  try {
    const course = await modelCourse.findById(req.params.idCourse).populate('idProfessor');
/*     await modelBlock.find({idCourse: req.params.idCourse}, async function(err, blocks){
      let countCursos = 0;
      const newArray = {
        course,
        totalTopics: "",
        totalInscription: ""
      };
        for(i = 0; i < blocks.length; i++){
          const topics = await modelTopic.find({idBlock: blocks[i]._id}).count();
          countCursos+= topics;
        }
        console.log(countCursos);
        newArray.totalTopics = countCursos;
        res.status(200).json(newArray);
    }); */
    res.status(200).json(course);
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.getCourseTeacher = async (req, res) => {
  try {
    const course = await modelCourse.find({
      idProfessor: req.params.idTeacher,
    }, async ( err,courses ) => {
      let coursesFinal = [];
      for( i=0; i< courses.length; i++){
        let courseActual = {
          course: courses[i],
          numInscription: "",
          sales: "",
          numCalification: "",
          blockCourse: true
        };
        const numScription = await modelInscription.countDocuments({idCourse: courses[i]._id});
        courseActual.numInscription = numScription - 1;
        const Suminscription = await modelInscription.find({idCourse: courses[i]._id});
        let sumTotal = 0;
        for(y=0; y < Suminscription.length; y++){
          if(Suminscription[y].code !== true){
            if(Suminscription[y].promotionCourse > 0){
              sumTotal+= Suminscription[y].promotionCourse;
            }else{
              sumTotal+= Suminscription[y].priceCourse;
            }
          }
        }
        courseActual.sales = sumTotal;
        const numCalificationCourse = await modelCommentCourse.countDocuments({idCourse: courses[i]._id});
        courseActual.numCalification = numCalificationCourse;
        const blockCourseBase = await modelBlock.find({idCourse: courses[i]._id});
        if(blockCourseBase.length > 0){
          courseActual.blockCourse = true;
        }else{
          courseActual.blockCourse = false;
        } 
        coursesFinal.push(courseActual);
      }
      res.status(200).json(coursesFinal);

    });
    //console.log(course);
    
    
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.editLerningsRequiredStudents = async (req, res) => {
  try {
    await modelCourse.findByIdAndUpdate(req.params.idCourse, req.body);
    res.status(200).json({ message: "Curso actualizado" });
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.createCourse = async (req, res) => {
  try {
    const newCourse = new modelCourse(req.body);
    newCourse.publication = false;
    newCourse.qualification = 5;
    await newCourse.save( async(err, userStored) => {
      if (err) {
        res
          .status(500)
          .json({ message: "Ups, algo paso al crear el curso.", err });
      } else {
        if (!userStored) {
          res.status(404).json({ message: "Error al crear el curso." });
        } else {
          const newInscription = new modelInscription({
            idCourse: userStored._id,
            idUser: userStored.idProfessor,
            codeKey: "",
            code: false,
            priceCourse: 0,
            freeCourse: false,
            promotionCourse: 0,
            persentagePromotionCourse: 0,
            studentAdvance: "0",
            ending: false,
            numCertificate: reuserFunction.generateNumCertifictate(10)
          });
          await newInscription.save();
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
    const courseBase = await modelCourse.findById(req.params.idCourse);
    if (courseBase) {
      const editCourse = req.body;
      await modelCourse.findByIdAndUpdate(req.params.idCourse, editCourse);
      res.status(200).json({ message: "Curso editado" });
    } else {
      res.status(504).json({ message: "Este curso no existe", error });
    }
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.deleteCourse = async (req, res) => {
  try {
      const blockCursos = await modelBlock.find({idCourse: req.params.idCourse});
      if(blockCursos.length > 0){
        res.status(504).json({ message: "Este curso no se puede eliminar, aun tiene bloques.", error });
      }else{
        const incription = await modelInscription.find({idCourse: req.params.idCourse});
        if(incription.length > 1){
            res.status(500).json({ message: "Curso ya tiene estudiantes inscritos." });
        }else{
          await modelCourse.findByIdAndDelete(req.params.idCourse);
          for(let i = 0; i < incription.length; i++){
            await modelInscription.findByIdAndDelete(incription[i]._id);
            res.status(200).json({ message: "Curso eliminado" });
          }
        }
      }
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.uploadFileCourse = async (req, res) => {
  try {
    const courseBase = await modelCourse.findById(req.params.idCourse);
    const editImagen = {};
    if (courseBase) {
      if (req.file) {
        if (courseBase.keyPromotionalImage) {
          uploadFileAws.eliminarImagen(courseBase.keyPromotionalImage);
        }
        editImagen.keyPromotionalImage = req.file.key;
        editImagen.urlPromotionalImage = req.file.location;
        await modelCourse.findByIdAndUpdate(req.params.idCourse, editImagen);
        res.status(200).json({ message: "Imagen agregada." });
      } else {
        res.status(404).json({ message: "Es necesario una imagen." });
      }
    } else {
      res.status(404).json({ message: "El curso no existe." });
    }
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.uploadVideoCourse = async (req, res) => {
  try {
    const video = req.body;
    await modelCourse.findByIdAndUpdate(req.params.idCourse, video);
    res.status(200).json({ message: "Video subido correctamente" });
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.getListCourse = async (req, res) => {
  try {
    const idUser = req.params.idUser;
    
    await modelBlock.find(
      { idCourse: req.params.idCourse },
      async function (err, GroupBlocks) {
        const listCourseAdmin = [];
        for(i = 0; i < GroupBlocks.length; i++){
          const topics = await modelTopic.aggregate(
            [
              {
                $sort: { preference: 1 },
              },
              {
                $match: {
                  idBlock: GroupBlocks[i]._id,
                },
              },
              {
                $lookup: {
                  from: "topicscompleteds",
                  let: { id: "$_id", user: `${idUser}` },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$idTopic", { $toObjectId: "$$id" }] },
                            { $eq: ["$idUser", { $toObjectId: "$$user" }] },
                          ],
                        },
                      },
                    },
                  ],
                  as: "topicCompleted",
                },
              },
            ],
            async function (err, topicsBase) {
              if (err) {
                console.log(err);
              } else {
                return topicsBase;
              }
            }
          );

          listCourseAdmin.push({
              block: GroupBlocks[i],
              topics: topics,
          });
        }
        res.status(200).json(listCourseAdmin)
      }
    ).sort({ preference: 1 });
    
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.getCourseUser = async (req,res) => {
  try {
    const course = await modelInscription.find({idUser: req.params.idUser}).populate('idCourse');
    res.status(200).json(course)
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.publicCourse = async (req,res) => {
  try {
    const { publication } = req.body;
    const courseBase = await modelCourse.findById(req.params.idCourse);
    if(courseBase){
        if(
          !courseBase.title || 
          !courseBase.category || 
          !courseBase.keyPromotionalImage || 
          !courseBase.urlPromotionalImage || 
          !courseBase.urlCourseVideo || 
          !courseBase.subtitle || 
          !courseBase.hours || 
          !courseBase.priceCourse || 
          !courseBase.subCategory || 
          !courseBase.description || 
          !courseBase.level ||
          !courseBase.language ||
          !courseBase.startMessage ||
          !courseBase.finalMessage ||
          courseBase.learnings.length === 0 ||
          courseBase.requirements.length === 0 ||
          courseBase.whoStudents.length === 0 
          ){
            res.status(500).json({message: "Curso incompleto"});
          }else{
            await modelCourse.findByIdAndUpdate(req.params.idCourse,{publication});
            res.status(200).json({message: "Cambios realizados."})
          }
    }else{
      res.status(404).json({message: "Este curso no existe."});
    }
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Filtros curso >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

courseCtrl.moreBuyCourse = async (req,res) => {
  try {
    let apiCourses = [];
    const course = await modelInscription.aggregate(
       [
          {
             $group:{ _id:"$idCourse", Total:{$sum: 1}}
          },
          {
            $sort: {Total: -1}
          }
       ]
       ).limit(10);
       for(i = 0; i < course.length; i++){
        apiCourses.push(await modelCourse.findById(course[i]._id));
       }
       res.status(200).json(apiCourses)
  } catch (error) {
    
  }
}

courseCtrl.getUsersCourse = async (req,res) => {
  try {
    const isnciptionBase = await modelInscription.find({idCourse: req.params.idCourse}).populate('idUser');
    res.status(200).json(isnciptionBase);
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}
 
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Routes Block >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

courseCtrl.getBlockAndTopicCourse = async (req, res) => {
  try {
    await modelBlock.find({ idCourse: req.params.idCourse },
      async function (err, GroupBlocks) {
        const listCourseAdmin = [];
        for (i = 0; i < GroupBlocks.length; i++) {
          const topics = await modelTopic.aggregate(
            [
              {
                $sort: { preference: 1 },
              },
              {
                $match: {
                  $or: [{ idBlock: GroupBlocks[i]._id }],
                },
              },
            ],
            async function (err, topics) {
              return topics;
            }
          );
          listCourseAdmin.push({
            block: GroupBlocks[i],
            topics: topics,
          });
        }
        res.status(200).json(listCourseAdmin);
      }
    ).sort({ preference: 1 });
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.addBlockCourse = async (req, res) => {
  try {
    const { blockTitle, preference } = req.body;
    const newBlock = await new modelBlock({
      blockTitle,
      preference,
      idCourse: req.params.idCourse,
    });
    await newBlock.save();
    res.status(200).json({ message: "Bloque agregado." });
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.editBlockCourse = async (req, res) => {
  try {
    await modelBlock.findByIdAndUpdate(req.params.idBlock, req.body);
    res.status(200).json({ message: "Block editado." });
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.deleteBlockCourse = async (req, res) => {
  try {
    const topicsBlock = await modelTopic.find({idBlock: req.params.idBlock});
    if(topicsBlock.length > 0){
      res.status(400).json({message: "Este bloque aun tiene temas."})
    }else{
      await modelBlock.findByIdAndDelete(req.params.idBlock);
      res.status(200).json({message: "Bloque eliminado"});
    }
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Routes Topic >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

courseCtrl.createTopicBlock = async (req, res) => {
  try {
    const { topicTitle, preference } = req.body;
    const newTopic = new modelTopic({
      topicTitle,
      idBlock: req.params.idBlock,
      preference,
    });
    await newTopic.save();
    res.status(200).json({ message: "Tema agregado." });
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.VideoTopicBlock = async (req, res) => {
  try {
    const newUploadVideo = req.body;
    await modelTopic.findByIdAndUpdate(req.params.idTopic, newUploadVideo);
    res.status(200).json({ message: "Video agregado" });
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.uploadResourceTopic = async (req, res) => {
  try {
    const { title, urlExtern } = req.body;
    const model = {
      title,
    };

    if (req.file) {
      model.keyDownloadResource = req.file.key;
      model.urlDownloadResource = req.file.location;
    }

    if (urlExtern) {
      model.urlExtern = urlExtern;
    }

    await modelTopic.updateOne(
      { _id: req.params.idTopic },
      {
        $addToSet: {
          resources: [model],
        },
      },
      async (err, response) => {
        if (err) {
          res.status(500).json({ message: "Ups, algo al el recurso", err });
        } else {
          if (!response) {
            res.status(404).json({ message: "Error al guardar" });
          } else {
            res.status(200).json({ message: "Recurso agregado" });
          }
        }
      }
    );
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.deleteResoursceTopic = async (req, res) => {
  try {
    const topicBase = await modelTopic.findById(req.params.idTopic);
    if (topicBase.resources.length) {
      for (i = 0; i < topicBase.resources.length; i++) {
        if (topicBase.resources[i]._id == req.params.idResourceTopic) {
          if (topicBase.resources[i].keyDownloadResource) {
            uploadFileAws.eliminarImagen(
              topicBase.resources[i].keyDownloadResource
            );
          }
          await modelTopic.updateOne(
            {
              _id: req.params.idTopic,
            },
            {
              $pull: {
                resources: {
                  _id: req.params.idResourceTopic,
                },
              },
            },
            (err, response) => {
              if (err) {
                res
                  .status(500)
                  .json({ message: "Ups, also paso en la base", err });
              } else {
                if (!response) {
                  res.status(404).json({ message: "Recurso no existente." });
                } else {
                  res.status(200).json({ message: "Recurso eliminado" });
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
};

courseCtrl.EditTopicBlock = async (req, res) => {
  try {
    await modelTopic.findByIdAndUpdate(req.params.idTopic, req.body);
    res.status(200).json({ message: "Tema editado." });
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.DeleteTopicBlock = async (req, res) => {
  try {
    const topic = await modelTopic.findById(req.params.idTopic);
    if (topic) {
      topic.resources.map(async (resource) => {
        if(resource.keyDownloadResource){
            uploadFileAws.eliminarImagen(
              resource.keyDownloadResource
            );
        }
      })
      await modelTopic.findByIdAndDelete(req.params.idTopic);
      res.status(200).json({ message: "Tema eliminado" });
    } else {
      res.status(404).json({ message: "Error del servidor" });
    }
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.editOrderTopic = async (req, res) => {
  try {
    const arrayOrder = req.body;
    arrayOrder.map(async (orderBlock,index) => {
          await modelBlock.findByIdAndUpdate(orderBlock.block._id, {preference: index + 1 })
          if(orderBlock.topics.length > 0){
             orderBlock.topics.map(async (topic,index) => {
                  await modelTopic.findByIdAndUpdate(topic._id,{preference: index + 1})
             })
          }
    })
    res.status(200).json({message: "Cambios realizados"});
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.registerTopicComplete = async (req, res) => {
  try {
    console.log(req.body);
    const {idTopic, idUser, idCourse, public } = req.body;
    if(!idTopic || !idUser || !idCourse){
      res.status(404).json({ message: "Datos incompletos", datos: req.body});
    }else{
      if(public == false){
        const deleteTopicComplete = await modelTopicComplete.findOne({idTopic: idTopic, idUser: idUser});
        if(deleteTopicComplete){
          await modelTopicComplete.findByIdAndDelete(deleteTopicComplete._id);
        }
      }else{
        const topicBase = await modelTopicComplete.find({idTopic: idTopic, idUser: idUser});
        if(topicBase.length === 0){
          const newTopicComplete = new modelTopicComplete(req.body);
          await newTopicComplete.save();
        }
      }
      const blockBase = await modelBlock.find({idCourse: idCourse});
      const totalTopicsComplete = await modelTopicComplete.countDocuments({idUser: idUser, idCourse: idCourse});
      let countCursos = 0;
      for(i = 0; i < blockBase.length; i++){
        const topics = await modelTopic.countDocuments({idBlock: blockBase[i]._id});
        countCursos+= topics;
      }
      const avance = (100 / Math.round(countCursos)) * Math.round(totalTopicsComplete);
      const inscriptionUserBase = await modelInscription.findOne({idCourse: idCourse, idUser: idUser});
      if(avance >= 100){
        if(inscriptionUserBase){
          if(inscriptionUserBase.ending === false){
            await modelInscription.findOneAndUpdate({idCourse: idCourse, idUser: idUser}, {studentAdvance: Math.round(avance),endDate: new Date(),ending: true});
          }else{
            await modelInscription.findOneAndUpdate({idCourse: idCourse, idUser: idUser}, {studentAdvance: Math.round(avance)});
          }
        }else{
          res.status(404).json({ message: "Este usuario no a comprado el curso"});
        }
      }else{
        await modelInscription.findOneAndUpdate({idCourse: idCourse, idUser: idUser}, {studentAdvance: Math.round(avance)});
      }
      
      res.status(200).json({message: Math.round(avance)});
    }
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Promociones curso >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

courseCtrl.coursePrice = async (req,res) => {
  try {
    const course = await modelCourse.findById(req.params.idCourse);
    if(course){
      await modelCourse.findByIdAndUpdate(req.params.idCourse,req.body);
      res.status(200).json({message: "Precio agregado."});
    }else{
      res.status(404).json({message: "Este curso no existe."});
    }
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.courseFreeInscription = async (req,res) => {
  try {
    const inscriptionBase = await modelInscription.findOne({idCourse: req.params.idCourse, idUser: req.params.idUser});
    if(inscriptionBase){
      res.status(404).json({message: "Este usuario ya tiene este curso"});
    }else{
      const courseBase = await modelCourse.findById(req.params.idCourse);
      if(courseBase.priceCourse.free === true){
        const newInscription = new modelInscription({
          idCourse: req.params.idCourse,
          idUser: req.params.idUser,
          codeKey: "",
          code: false,
          priceCourse: courseBase.priceCourse.price,
          freeCourse: true,
          promotionCourse: courseBase.priceCourse.promotionPrice,
          persentagePromotionCourse: courseBase.priceCourse.persentagePromotion,
          studentAdvance: "0",
          ending: false,
          numCertificate: reuserFunction.generateNumCertifictate(10)
        });
        await newInscription.save();
        res.status(200).json({message: "Curso adquirido."})
      }else{
        res.status(404).json({message: "Este curso no se puede adquirir"});
      }
    }
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Cupones curso >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

courseCtrl.generateCoupon = async (req,res) => {
  try {
    const { coupon } = req.body;
    for(i = 0; i < parseInt(coupon); i++){
      const newCoupon = new modelCoupon({
        code: reuserFunction.generateCode(10),
        idCourse: req.params.idCourse,
        exchange: false
      })
      await newCoupon.save();
    }
    res.status(200).json({message: "Cupones Creados"});
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.getCouponCourse = async (req,res) => {
  try {
    const { exchange = '', code = '' } = req.query;
    if(exchange){
      const couponBase = await modelCoupon.find({idCourse: req.params.idCourse, exchange: exchange}).populate('idUser');
      res.status(200).json(couponBase);
    }else if(exchange && code){
      const couponBase = await modelCoupon.find({idCourse: req.params.idCourse ,code: code ,exchange: exchange}).populate('idUser');
      res.status(200).json(couponBase);
    }else if(!exchange && code){
      const couponBase = await modelCoupon.find({idCourse: req.params.idCourse ,code: code}).populate('idUser');
      res.status(200).json(couponBase);
    }else{
      const couponBase = await modelCoupon.find({idCourse: req.params.idCourse}).populate('idUser');
      res.status(200).json(couponBase);
    }
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.exchangeCouponCourse = async (req,res) => {
  try {
    //agregar conicion de curso yt cupon que sea el mismo curso
    const { idUser,idCourse,code } = req.body;
    const courseBase = await modelCourse.findById(idCourse);
    const courseCoup = await modelCoupon.findOne({code: code.trim()});
    if(courseCoup){
      const inscriptionBase = await modelInscription.findOne({idCourse: idCourse, idUser: idUser});
      if(inscriptionBase){
        res.status(400).json({message: "Este usuario ya tiene este curso."});
      }else{
        if(courseCoup.exchange === false){
          await modelCoupon.findByIdAndUpdate(courseCoup._id,
            {
              exchange: true,
              idUser: idUser
            });
          const newInscription = new modelInscription({
            idCourse: idCourse,
            idUser: idUser,
            codeKey: code.trim(),
            code: true,
            priceCourse: courseBase.priceCourse.price,
            freeCourse: false,
            promotionCourse: courseBase.priceCourse.promotionPrice,
            persentagePromotionCourse: courseBase.priceCourse.persentagePromotion,
            studentAdvance: "0",
            ending: false,
            numCertificate: reuserFunction.generateNumCertifictate(10)
          });
          await newInscription.save();
          res.status(200).json({message: "Codigo canjeado correctamente."});
        }else{
          res.status(400).json({message: "Este codigo ya fue canjeado."});
        }
      }
    }else{
      res.status(404).json({message: "Este codigo no existe."});
    }
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Calificacion del cuerso >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

courseCtrl.aggregateCommentCourse = async (req,res) => {
  try {
    const {comment = "",qualification = ""} = req.body;
    if(!comment || !qualification){
      res.status(404).json({message: "Datos no completos"});
    }else{
      const newComment = new modelCommentCourse({
        idUser: req.params.idUser,
        idCourse: req.params.idCourse,
        comment: comment,
        qualification: qualification
      });
      await newComment.save();
      res.status(200).json({message: "Cometario agregado"});

      const countCommentCourse = await modelCommentCourse.countDocuments({idCourse: req.params.idCourse});

        const sumComment = await modelCommentCourse.find({idCourse: req.params.idCourse});

        let sumQualification = 0;
        for(i = 0; i < sumComment.length; i++){
          sumQualification+= sumComment[i].qualification;
        }

        let qualificationEnd = Math.round(sumQualification / countCommentCourse);
        await modelCourse.findByIdAndUpdate(req.params.idCourse,{qualification: qualificationEnd})
    }

  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.searchCourse = async (req,res) => {
  try {
    const  search  = req.params.search;
    await modelCourse.aggregate(
      [
				{
					$match: {
						$or: [
							{ title: { $regex: '.*' + search + '.*', $options: 'i' } },
							{ subtitle: { $regex: '.*' + search + '.*', $options: 'i' } },
							{ hours: { $regex: '.*' + search + '.*', $options: 'i' } },
							{ category: { $regex: '.*' + search + '.*', $options: 'i' } },
							{ subCategory: { $regex: '.*' + search + '.*', $options: 'i' } }
						],
						$and: [ { $or: [ { publication: true } ] } ]
					}
				}
			],
			async (err, postStored) => {
				if (err) {
					res.status(500).json({ message: 'Error en el servidor', err });
				} else {
					if (!postStored) {
						res.status(404).json({ message: 'Error al mostrar cursos' });
					} else {

            await modelCourse.populate(postStored, {path: 'idProfessor'}, function(err, populatedTransactions) {
              // Your populated translactions are inside populatedTransactions
              if(err){
                res.send({ message: 'Ups, algo paso', err });
              }else{
                res.status(200).json({posts: populatedTransactions});
              }
            });
					}
				}
			}
    )
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Comentario del curso >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

courseCtrl.createComentCourseTopic = async (req,res) => {
  try {
    /* const { idUser, idCourse, comment, idTopic } = req.body; */
    const newComment = new modelComentDashCourse(req.body);
    newComment.likes = 0;
    newComment.dislikes = 0;
    await newComment.save();
    res.status(200).json({message: "Comentario agregado"});
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

module.exports = courseCtrl;
