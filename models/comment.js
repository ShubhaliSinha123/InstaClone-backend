const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'USER'
    },
    postId: {
        type: String,
        required: true,
        ref: 'POST'
    },
    comments: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
    }
},{
    timestamps: true
});

commentSchema.pre('save', function(next) {
    if (!this.created) this.created = new Date;
    next();
  });

const Comment = mongoose.model('COMMENT', commentSchema);

module.exports = Comment;