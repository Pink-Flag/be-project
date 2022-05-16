const express = require("express");
const app = express();
app.use(express.json());

const { getTopics } = require("./Controllers/topicsController.js");
const { getArticleById } = require("./Controllers/articlesController.js");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Invalid server path" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(400).send({ msg: "Invalid input" });
});

app.use((err, req, res, next) => {
  res.sendStatus(500).send({ msg: "internal server error" });
});

module.exports = app;
