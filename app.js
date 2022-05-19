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
const {
  getComments,
  getArticleComments,
  postComment,
} = require("./Controllers/commentsController.js");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/users", getUsers);
app.get("/api/comments/:article_id", getComments);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postComment);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Invalid server path" });
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(400).send({ msg: "Article doesn't exist!" });
  }
  if (err.code === "42703") {
    res.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

app.use((err, req, res, next) => {
  res.status(400).send({ msg: "Bad request" });
});

app.use((err, req, res, next) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, req, res, next) => {
  res.sendStatus(500).send({ msg: "internal server error" });
});

module.exports = app;
