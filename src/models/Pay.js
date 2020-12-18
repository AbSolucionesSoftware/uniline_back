const { Schema, model } = require("mongoose");

const paySchema = new Schema(
  {
    stripeObject: String,
    triedPayment: String,
    idCourse: {
        type: Schema.ObjectId,
        ref: 'course'
    },
    idUser: {
       type: Schema.ObjectId,
       ref: 'user' 
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model('pay',paySchema);