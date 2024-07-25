const sequelize = require("./db");
const Sequeluze = require("sequelize");
const User = require("./user.model");
const Role = require("./role.model");


const db = {};
db.sequelize = Sequeluze;
db.sequelize = sequelize;

db.User = User;
db.Role = Role;


//กำหนดความสัมพันธ์
db.User.belongsToMany(db.Role,{
    through:"user_roles"
});

db.Role.belongsToMany(db.User, {
  through: "user_roles",
});

module.exports = db;