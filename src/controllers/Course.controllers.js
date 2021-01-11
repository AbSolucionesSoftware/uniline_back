const courseCtrl = {};
const modelCourse = require("../models/Course");
const uploadFile = require("../middleware/awsFile");

courseCtrl.uploadFile = async (req, res, next) => {
  try {
    await uploadFile.upload(req, res, function (err) {
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
    const { learnings, requirements, whoStudents } = req.body;
    console.log(learnings.length);
    const course = await modelCourse.findById(req.params.idCourse);
    const editCourse = course;
    if(learnings){
      if(learnings.length > 0){
        editCourse.learnings = learnings;
      }
    }

    if(requirements){
      if(requirements.length > 0){
        editCourse.requirements = requirements;
      }
    }

    if(whoStudents){
      if(whoStudents.length > 0){
        editCourse.whoStudents = whoStudents;
      }
    }


    await modelCourse.findByIdAndUpdate(req.params.idCourse,editCourse);
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
    const courseBase = await modelCourse.findById(req.params.idCourse); 
    if(courseBase){
      const editCourse = req.body;
      await modelCourse.findByIdAndUpdate(req.params.idCourse,editCourse);
      res.status(200).json({messege: "Curso editado"});
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
        editImagen.keyPromotionalImage = req.file.key;
        editImagen.urlPromotionalImage = req.file.location;
        await modelCourse.findByIdAndUpdate(req.params.idCourse, editImagen);
        res.status(200).json({messege: "Imagen agregada."});
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
      res.status(200).json({message: "Video subido correctamente"})
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

courseCtrl.addBlockCourse = async (req,res) => {
  try {
    
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
}

module.exports = courseCtrl;
