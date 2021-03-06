const express = require("express");
const app = express();
const cors = require("cors");

const { getTopics } = require("./Controllers/topicsController.js");
const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require("./Controllers/articlesController.js");
const { getUsers } = require("./Controllers/usersController.js");
const {
  getArticleComments,
  postComment,
  deleteCommentById,
} = require("./Controllers/commentsController.js");
const { getEndpoints } = require("./Controllers/apiController.js");

app.use(cors());
app.use(express.json());

//api helper

app.get("/api", getEndpoints);

//articles
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/articles", getArticles);

// topics
app.get("/api/topics", getTopics);

//comments

app.post("/api/articles/:article_id/comments", postComment);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.delete("/api/comments/:comment_id", deleteCommentById);

//users
app.get("/api/users", getUsers);

//errors

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
    res.status(err.status).send({ msg: err.msg });
  }
});

// app.use((err, req, res, next) => {
//   res.status(err.status).send({ msg: err.msg });
// });

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
