const mongoose = require("mongoose");
var Float = require("mongoose-float").loadType(mongoose, 4);
const {Schema,model} = mongoose;

const inscriptionSchema = new Schema(
  {
    idCourse: {
      type: Schema.ObjectId,
      ref: "course",
    },
    idUser: {
      type: Schema.ObjectId,
      ref: "user",
    },
    ending: Boolean,
    endDate: Date,
    certificateKey: String, 
    certificateUrl: String,
    code: Boolean,
    codeKey: String,
    priceCourse: Float,
    freeCourse: Boolean,
    promotionCourse: Float,
    persentagePromotionCourse: String,
    studentAdvance: String,
    numCertificate: String
  },
  {
    timestamps: true,
  }
);

module.exports = model("inscription", inscriptionSchema);
