const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'USER'
    },
    title: {
        type: String,
        required: true,
    },
    images: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'COMMENT',
        //default: []
    }],
    createdAt: {
        type: Date,
    },
},{
    timestamps: true
});

postSchema.pre('save', function(next) {
    if (!this.created) this.created = new Date;
    next();
  });

const Post = mongoose.model('POST', postSchema);

module.exports = Post;