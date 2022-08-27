const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("../database/database");
const Pergunta = require("../model/Perguntar");
const Resposta = require("../model/Resposta");

//Conexão
connection
  .authenticate()
  .then(() => {
    console.log("Conexão com banco de dados estabelecida com sucesso!");
  })
  .catch((err) => {
    console.log("Erro ao conectar com o banco de dados! " + err);
  });

// utilizando ejs como engine
app.set("view engine", "ejs");
// para pode utilizar arquivo estáticos
app.use(express.static("public"));

// o bodyparser vai tranforma os dados do form em javascript
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rotas
app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true, order: [["id", "desc"]] }).then((perguntas) => {
    // raw trás apenas os dados
    res.render("index", {
      // enviando para o front
      perguntas,
    });
  });
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

// Esse post tá vindo do formulário
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
  // buscando o id na tabela pergunta
  const id = req.params.id;

  Pergunta.findOne({
    where: { id: id },
  }).then((pergunta) => {
    if (pergunta) {
      Resposta.findAll(
        {
          where: { perguntaId: pergunta.id },
          order: [["id", "desc"]]
        }
      ).then((respostas) => {
        res.render("pergunta", {
          pergunta,
          respostas,
        });
      });
    } else {
      res.render("error");
    }
  });
});

app.get("/error", (req, res) => {
  res.render("error");
});

app.post("/responder", (req, res) => {
  const corpo = req.body.corpo;
  const perguntaId = req.body.perguntaId;

  Resposta.create({
    corpo,
    perguntaId,
  }).then(() => {
    res.redirect(`/pergunta/${perguntaId}`);
  });
});

app.listen(8081, () => {
  console.log("Server running at URL: http://localhost:8081");
});

// console.log(__dirname);
