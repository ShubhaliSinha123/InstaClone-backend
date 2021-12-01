module.exports = function (model) {

    model.post.hasMany(model.comment, {
        foreignKey: 'postId'
    });

    model.comment.belongsTo(model.post, {
        foreignKey: 'postId'
    });
};