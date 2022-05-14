const { Model, DataTypes } = require("sequelize");
class Post extends Model {}
module.exports = (sequelize) => {
  Post.init({
    image: {
      type: DataTypes.STRING,
    allowNull: true
    },
    title: {
      type: DataTypes.STRING,
    allowNull: true
    }
  }, { sequelize });
}