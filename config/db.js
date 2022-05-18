const { Sequelize } = require("sequelize");
  require("dotenv").config();
  
  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: "localhost",
    dialect: "mysql"
  });

  require("../models/user")(sequelize);
  require("../models/post")(sequelize);
  require("../models/comment")(sequelize);

  const {User, Post, Comment} = sequelize.models;
  User.hasMany(Post, {
    as: "posts",
    foreignKey: "UserId",
  });
  User.hasMany(Comment, {
    as: "comments",
    foreignKey: "UserId",
  });

  Post.belongsTo(User, {
    as: "author",
    foreignKey: "UserId",
  });
  Post.hasMany(Comment, {
    as: "comments",
    foreignKey: "PostId",
  });

  Comment.belongsTo(Post);
  Comment.belongsTo(User, {
    as: "author",
    foreignKey: "UserId",
  });

module.exports = db = sequelize;