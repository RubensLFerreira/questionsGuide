const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("guiaperguntas", "root", "noob0987", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
