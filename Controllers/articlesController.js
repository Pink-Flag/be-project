const {
  selectArticleById,
  updateArticleById,
  selectArticles,
  selectArticleComments,
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

exports.getArticles = (req, res, next) => {
  const queries = ["sort_by", "order", "topic"];

  if (!Object.keys(req.query).every((query) => queries.includes(query))) {
    throw { status: 400, msg: "Bad request" };
  }

  const { sort_by, order, topic } = req.query;

  selectArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
