const mongoose = require("mongoose");
var Float = require("mongoose-float").loadType(mongoose, 4);

const courseSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    keyPromotionalImage: String,
    urlPromotionalImage: String,
    promotionalVideo: String,
    hours: String,  
    price: Float,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("course", courseSchema);
