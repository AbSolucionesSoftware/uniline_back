const { Schema, model } = require("mongoose");

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
  },
  {
    timestamps: true,
  }
);

module.exports = model("inscription", inscriptionSchema);
