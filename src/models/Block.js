const { Schema, model } = require("mongoose");

const blockSchema = new Schema(
  {
    blockTitle: String,
    idCourse: {
      type: Schema.ObjectId,
      ref: "course",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("block", blockSchema);
