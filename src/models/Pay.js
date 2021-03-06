const mongoose = require("mongoose");
var Float = require("mongoose-float").loadType(mongoose, 4);
const { Schema, model } = mongoose;

const paySchema = new Schema(
  {
    stripeObject: String,
    triedPayment: String,
    idUser: {
       type: Schema.ObjectId,
       ref: 'user' 
    },
    priceCourse: Float,
    pricePromotionCourse: Float,
    promotion: Boolean,
    persentagePromotionCourse: String,
    idCourse: {
      type: Schema.ObjectId,
      ref: 'course'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model('pay',paySchema);