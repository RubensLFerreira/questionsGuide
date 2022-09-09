const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Resposta = sequelize.define("respostas", {
  corpo: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  perguntaId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

Resposta.sync({ force: false });

module.exports = Resposta;
