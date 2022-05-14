const { Model, DataTypes } = require("sequelize");
class Comment extends Model {}
module.exports = (sequelize) => {
  Comment.init({
    content: {
      type: DataTypes.STRING
    }
  }, { sequelize });
}