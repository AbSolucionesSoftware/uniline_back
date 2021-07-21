const {Schema, model} = require('mongoose');

const userTallerSchema = new Schema(
    {
        nameUser: String,
        emailUser: String,
        idCourse: {
            type: Schema.ObjectId,
            ref: 'course'
        }
    }
)

module.exports = model('userTaller', userTallerSchema);

