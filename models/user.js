const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
class User extends Model {}
module.exports = (sequelize) => {
    User.init({
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: uuidv4()
      },
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
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
    }, { sequelize });
}