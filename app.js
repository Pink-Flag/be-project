const express = require("express");
const app = express();
app.use(express.json());

const { getTopics } = require("./Controllers/topicsController.js");
const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require("./Controllers/articlesController.js");
const { getUsers } = require("./Controllers/usersController.js");
const { getComments } = require("./Controllers/commentsController.js");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/users", getUsers);
app.get("/api/comments/:article_id", getComments);
app.get("/api/articles", getArticles);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Invalid server path" });
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

app.use((err, req, res, next) => {
  res.status(400).send({ msg: "Invalid input" });
});

app.use((err, req, res, next) => {
  res.sendStatus(500).send({ msg: "internal server error" });
});

module.exports = app;
