const { Schema, model } = require("mongoose");

const categorieSchema = new Schema(
  {
    categorie: String,
    subCategories: [
      {
        subCategorie: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("categorie", categorieSchema);
