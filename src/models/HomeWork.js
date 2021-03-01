const { Schema, model } = require("mongoose");

const homeWorkSchema = new Schema(
  {
    idUser: {
        type: Schema.ObjectId,
        ref: "user",
    },
    idCourse: {
        type: Schema.ObjectId,
        ref: "course",
    },
    qualificationHomework: Number,
    homeworkDileKey: String,
    homeworkDileUrl: String,
    comments: [
        {
            comment: String,
            
        }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = model("homeworks", homeWorkSchema);