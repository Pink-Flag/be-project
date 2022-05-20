const db = require("../db/connection.js");
const createRef = require("../db/helpers/utils.js");
const { selectTopics } = require("./topicsModel.js");

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
      return Promise.reject({ status: 404, msg: "Not found" });
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

exports.selectArticles = async (
  sort_by = "created_at",
  order = "desc",
  topic
) => {
  // create greenlists

  let promisedTopics = [];

  try {
    promisedTopics = await selectTopics();
  } catch (err) {
    return Promise.reject({
      status: 500,
      msg: "Server Error, return to clowntown",
    });
  }

  const validTopics = promisedTopics.map((topic) => topic.slug);

  const validSortBy = [
    "created_at",
    "title",
    "author",
    "votes",
    "article_id",
    "topic",
  ];

  const validOrder = ["ASC", "DESC"];

  //greenlist checks

  order = order.toUpperCase();

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (!validTopics.includes(topic) && topic !== undefined) {
    return Promise.reject({ status: 404, msg: "Not found" });
  }

  //create queryStr and pass into database query

  const queryArr = [];

  let queryStr = `
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
  JOIN users ON data.author = users.username`;

  if (topic !== undefined) {
    queryStr += ` WHERE data.topic = $1`;
    queryArr.push(topic);
  }

  queryStr += `
  GROUP BY article_id, title, users.username
  ORDER BY ${sort_by} ${order}
  `;

  return db.query(queryStr, queryArr).then((result) => {
    return result.rows;
  });
};

exports.selectArticleComments = (article_id) => {
  const queryStr = `
  SELECT
  users.name AS author,
  comment_id,
  votes,
  created_at,
  body
  FROM comments AS data
  JOIN users ON data.author = users.username
  WHERE data.article_id = $1
  `;

  return db.query(queryStr, [article_id]).then((result) => {
    return result.rows;
  });
};
