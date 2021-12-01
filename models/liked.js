const mongoose = require('mongoose');

const likedSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'USER'
    },
    postId: {
        type: String,
        unique: true,
        required: true,
        ref: 'POST'
    },
    checked: {
        type: Boolean,
        default: false,
    },
    checkedAt: {
        type: Date,
    }
},{
    timestamps: true
});

likedSchema.pre('save', function(next) {
    if (!this.checkedAt) this.checkedAt = new Date;
    next();
  });

const Liked = mongoose.model('LIKED', likedSchema);

module.exports = Liked;