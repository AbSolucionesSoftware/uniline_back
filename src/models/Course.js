const mongoose = require("mongoose");
var Float = require("mongoose-float").loadType(mongoose, 4);

const courseSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    keyPromotionalImage: String,
    urlPromotionalImage: String,
    urlCourseVideo: String,
    hours: String,  
    priceCourse: {
      free: Boolean,
      price: Float,
      promotionPrice: Float,
      persentagePromotion: String,
    },
    idProfessor: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    publication: Boolean,
    qualification: Number,
    learnings: [
      {
        learning: String,
      },
    ],
    category: String,
    subCategory: String,
    requirements: [
      {
        requirement: String,
      },
    ],
    whoStudents: [
      {
        whoStudent: String,
      },
    ],
    description: String,
    level: String,
    language: String,
    startMessage: String,
    finalMessage: String,
    inscriptionStudents: Number,
    idMassPromotion: String,
    MassPromotionPercentage: String,
    slug: {
      type: String,
      unique: true
    },
    // >>>>>>> TALLER  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    taller:{
        nameTaller: String,
        fechaTaller: String,
        descripcionTaller:String,
        aprendizajesTaller: [
          {
            apredizaje: String
          }
        ], 
        publicTaller: Boolean,
        keyImageTaller: String,
        urlImageTaller: String,
        nameMaestro: String,
        descripcionMaestro: String,
        keyImageMaestro: String,
        urlImageMaestro: String,
        infoCorreo: String
    },
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("course", courseSchema);
