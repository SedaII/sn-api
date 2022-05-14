const { Model, DataTypes } = require("sequelize");
class User extends Model {}
module.exports = (sequelize) => {
    User.init({
      email: {
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        type: DataTypes.STRING
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true
      },
      fullname: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstname ? this.firstname + " " : ""}${this.lastname ? this.lastname : ""}`;
        }
      },
      job: {
        type: DataTypes.STRING,
      allowNull: true
      }
    }, { sequelize });
}