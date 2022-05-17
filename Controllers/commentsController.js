const { selectCommentsById } = require("../Models/commentsModel.js");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentsById(article_id).then((comments) => {
    res.status(200).send({ comments });
  });
};
