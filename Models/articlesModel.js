const db = require("../db/connection.js");
const users = require("../db/data/test-data/users.js");

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
  FROM articles AS data
  JOIN users ON data.author = users.username
  WHERE data.article_id = $1`;

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

exports.selectArticles = () => {
  const queryStr = `
  SELECT
    users.name AS author,
    title,
    article_id,
    topic,
    created_at,
    votes,
    ( SELECT CAST (COUNT(*) AS INTEGER)
      FROM comments
      WHERE comments.article_id = article_id
    ) AS comment_count
  FROM articles AS data
  JOIN users ON data.author = users.username
  ORDER BY created_at DESC;
`;

  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};
