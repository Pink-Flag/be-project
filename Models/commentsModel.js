const db = require("../db/connection.js");

exports.selectCommentsById = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1", [article_id])
    .then((result) => {
      return result.rows;
    });
};

exports.insertComment = (article_id, comment) => {
  const queryVals = [comment.username, comment.body, article_id];
  const queryStr =
    "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3)RETURNING *";

  if (
    comment.username &&
    comment.body &&
    typeof comment.username === "string" &&
    typeof comment.body === "string"
  ) {
    return db.query(queryStr, queryVals).then((result) => {
      return result.rows[0].body;
    });
  }
};
