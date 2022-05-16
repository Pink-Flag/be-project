const res = require("express/lib/response");
const db = require("../db/connection.js");

exports.selectArticleById = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
    .then((result) => {
      console.log(result);
      return result.rows[0];
    });
};
