const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sequelize = require("../config/database");

// Pergunta model
const Pergunta = require("../model/Pergunta");
const Resposta = require("../model/Resposta");
// Conexão com o banco
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão estabelecida com sucesso!");
  })
  .catch((error) => {
    console.error("Erro de conexão", error);
  });

app.set("view engine", "ejs");
app.use(express.static("public"));

// Possibilita pegas os dados passados pelo form
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Página princpal
app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true, order: [["id", "desc"]] }).then((perguntas) => {
    res.render("pages/index", {
      perguntas: perguntas,
    });
  });
});

// Página perguntar
app.get("/perguntar", (req, res) => {
  res.render("pages/perguntar");
});

app.post("/salvarpergunta", (req, res) => {
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;

  Pergunta.create({
    titulo,
    descricao,
  }).then(() => {
    res.redirect("/");
  });
});

app.get("/pergunta/:id", (req, res) => {
  const id = req.params.id;
  Pergunta.findOne({
    where: { id: id },
  }).then((pergunta) => {
    if (pergunta) {

      Resposta.findAll({
        where: { perguntaId: pergunta.id}, order: [["id", "desc"]]
      }).then((respostas) => {
        res.render("pages/pergunta", {
          pergunta,
          respostas,
        });
      });

    } else {
      res.render("pages/error");
    }
  });
});

app.post("/responder", (req, res) => {
  const perguntaId = req.body.pergunta;
  const corpo = req.body.corpo;

  Resposta.create({
    corpo,
    perguntaId,
  }).then(() => {
    res.redirect(`/pergunta/${perguntaId}`);
  });
});

app.listen(8080, () => {
  console.log(`Server running - link: http://localhost:8080`);
});

// console.log(__dirname);
