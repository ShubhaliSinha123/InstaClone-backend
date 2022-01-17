module.exports = function (model) {

    model.post.hasMany(model.comment, {
        foreignKey: 'postId'
    });

    model.comment.belongsTo(model.post, {
        foreignKey: 'postId'
    });

    model.post.hasMany(model.comment, {
        foreignKey: 'userId'
    });

    model.user.belongsTo(model.post, {
        foreignKey: 'userId'
    })
};