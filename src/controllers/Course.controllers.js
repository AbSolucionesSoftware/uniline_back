const courseCtrl = {};
const modelCourse = require("../models/Course");

courseCtrl.getCourses = async (req, res) => {
  try {
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.getCourse = async (req, res) => {
  try {
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

courseCtrl.editLerningsRequiredStudents = async (req, res) => {
  try {
    const { learnigs, requeriments, whoStudents } = req.body;
    const course = await modelCourse.findById(req.params.idCourse);
    const editCourse = course;
    if(learnigs.length > 0){
      editCourse.learnings = learnings;
    }
    if(requeriments.length > 0){
      editCourse.requirements = requirements;
    }
    if(whoStudents.length > 0){
      editCourse.whoStudents = whoStudents;
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
    console.log(req.file);
    res.status(200).json({messege: "Curso editado"})
  } catch (error) {
    res.status(505).json({ message: "Error del servidor", error });
    console.log(error);
  }
};

module.exports = courseCtrl;
