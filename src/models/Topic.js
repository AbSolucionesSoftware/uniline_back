const {Schema, model} = require('mongoose');

const topicSchema = new Schema({
    topicTitle: String,
    preference: Number,
    keyTopicVideo: String,
    resource: [{
        title: String,
        downloadResource: String,
        urlExtern: String
    }],
    idBlock: {
        type: Schema.ObjectId,
        ref: 'block'
    }
},{
    timestamps: true,
});

module.exports = model('topic',topicSchema);

