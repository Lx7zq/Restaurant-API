const {DataTypes} = require("sequelize");
const sequelize = require("./db");

const User = sequelize.define("user", {
  username: {
    type: DataTypes.STRING,
    primaryKey:true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

User.sync({ force: false })
  .then(() => {
    console.log("User table created or already exists");
  })
  .catch((error) => {
    console.log("Error creating User table:", error);
  });
  
module.exports = User;