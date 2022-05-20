const db = require("../db/connection.js");

exports.selectCommentsById = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1", [article_id])
    .then((result) => {
      return result.rows;
    });
};

exports.insertComment = (article_id, comment) => {
  if (
    comment.username &&
    comment.body &&
    typeof comment.username === "string" &&
    typeof comment.body === "string"
  ) {
    const queryVals = [comment.username, comment.body, article_id];
    const queryStr =
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3)RETURNING *";

    return db.query(queryStr, queryVals).then((result) => {
      return result.rows[0].body;
    });
  } else {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
};

exports.removeCommentById = (comment_id) => {
  const queryVals = [comment_id];

  const queryStr = `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *
  `;

  return db.query(queryStr, queryVals).then((results) => {
    if (results.rows.length) {
      return Promise.resolve();
    } else {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
  });
};
