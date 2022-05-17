const {
  selectArticleById,
  updateArticleById,
} = require("../Models/articlesModel.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  const newVotes = req.body.inc_votes;
  updateArticleById(article_id, newVotes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
