const db = require("../db/connection.js");

exports.selectArticleById = (articleId) => {
  const queryStr = `
  SELECT
  users.username AS author,
  title,
  article_id,
  body,
  topic,
  created_at,
  votes,
  ( SELECT CAST (COUNT(*) AS INTEGER) 
    FROM comments  
    WHERE comments.article_id = $1
  ) AS comments
  FROM articles AS a
  JOIN users ON author = users.username
  WHERE a.article_id = $1`;

  return db.query(queryStr, [articleId]).then((result) => {
    if (!result.rows.length) {
      return Promise.reject({ status: 404, msg: "not found" });
    }
    return result.rows[0];
  });
};

exports.updateArticleById = (articleId, newVotes) => {
  if (!newVotes) {
    return Promise.reject({ status: 200, msg: "no vote data!" });
  }

  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [newVotes, articleId]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return result.rows[0];
    });
};

// const queryStr =
//   const queryVals = [article_id];

//   return db.query(queryStr, queryVals).then((results) => {
//     if (results.rows.length === 0) {
//       return Promise.reject({ status: 404, msg: "Not found." });
//     } else {
//       return results.rows[0];
//     }
//   });
// };
