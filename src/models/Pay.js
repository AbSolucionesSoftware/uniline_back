const mongoose = require("mongoose");
var Float = require("mongoose-float").loadType(mongoose, 4);
const { Schema, model } = mongoose;

const paySchema = new Schema(
  {
    stripeObject: String,
    payPalPayment: String,
    triedPayment: String,
    idUser: {
       type: Schema.ObjectId,
       ref: 'user' 
    },
    nameUser: String,
    typePay: String,
    statusPay: Boolean,
    total: String,
    amount: String,
    courses: [
      {
        priceCourse: Float,
        pricePromotionCourse: Float,
        promotion: Boolean,
        persentagePromotion: String,
        idCourse: {
          type: Schema.ObjectId,
          ref: 'course'
        },
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = model('pay',paySchema);