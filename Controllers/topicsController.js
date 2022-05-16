const res = require("express/lib/response");
const { selectTopics } = require("../Models/topicsModel.js");

exports.getTopics = (req, res) => {
  selectTopics().then((topic) => {
    res.status(200).send({ topic });
  });
};
