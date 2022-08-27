const { Sequelize, Model } = require("sequelize");
const connection = require("../database/database");

const Pergunta = connection.define("perguntas", {
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

// Se no meu banco não tiver a tabela pergunta, ele cria.
// Se a tabela existe ele nn vai forçar
Pergunta.sync({ force: false }).then(() => {});

module.exports = Pergunta;
