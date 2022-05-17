const db = require("../db/connection.js");

exports.selectCommentsById = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1", [article_id])
    .then((result) => {
      return result.rows;
    });
};
