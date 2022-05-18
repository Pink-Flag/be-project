const db = require("../db/connection.js");

exports.articleCheck = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
      console.log(result.rows);
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No comments for this article ID found",
        });
      }
    });
};
