const {
  selectCommentsById,
  insertComment,
} = require("../Models/commentsModel.js");
const { articleCheck } = require("../Models/utilsModel.js");
const { selectArticleComments } = require("../Models/articlesModel.js");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentsById(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [articleCheck(article_id)];
  if (article_id) promises.push(selectArticleComments(article_id));

  return Promise.all(promises)
    .then(([_, comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  insertComment(article_id, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
