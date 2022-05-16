const { selectTopics } = require("../Models/topicsModel.js");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
