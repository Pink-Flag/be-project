const express = require("express");
const app = express();
app.use(express.json());

const { getTopics } = require("./Controllers/topicsController.js");

app.get("/api/topics", getTopics);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Invalid input" });
});

app.use((err, req, res, next) => {
  res.sendStatus(500).send({ msg: "internal server error" });
});

module.exports = app;
