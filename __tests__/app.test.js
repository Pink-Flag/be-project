process.env.NODE_ENV = "test";
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const app = require("../app");
const request = require("supertest");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("ERROR HANDLING", () => {
  it("returns a 404 error if endpoint is invalid", () => {
    return request(app)
      .get("/api/notARoute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid server path");
      });
  });
});

describe("tests for get topics", () => {
  it("gets an array of topic objects, each of which should have the properties of slug and description", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        expect(body.topics.length).toEqual(3);
        body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("tests for get article by ID", () => {
  it("STATUS 200: RESPONDS WITH SINGLE MATCHING ARTICLE", () => {
    const articleId = 1;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: articleId,
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          title: "Living in the shadow of a great man",
          topic: "mitch",
          votes: 100,
          comments: 11,
        });
      });
  });
  it("status:400, responds with an error message when passed an invalid ID", () => {
    return request(app)
      .get("/api/articles/hiya")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  it("status 404: returns a not found message when article isn't in db", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("tests for patch by article ID", () => {
  it("status 200: increments votes and responds with updated article", () => {
    const articleUpdate = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(articleUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          title: "Living in the shadow of a great man",
          topic: "mitch",
          votes: 110,
        });
      });
  });
  it("status 200: reduces votes and responds with updated article when passed a negative number", () => {
    const articleUpdate = {
      inc_votes: -10,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(articleUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          title: "Living in the shadow of a great man",
          topic: "mitch",
          votes: 90,
        });
      });
  });
  it("status 200: reduces votes to a negative number and responds with updated article when passed a negative number", () => {
    const articleUpdate = {
      inc_votes: -110,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(articleUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          title: "Living in the shadow of a great man",
          topic: "mitch",
          votes: -10,
        });
      });
  });
  it("status 404: returns a not found message when article ID isn't in db", () => {
    const articleUpdate = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/9999999")
      .send(articleUpdate)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  it("status 200: responds with a custom error message when not passed a vote count", () => {
    return request(app)
      .patch("/api/articles/1")
      .send()
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe("no vote data!");
      });
  });
  it("status 400: responds with an error message when passed an invalid input", () => {
    const articleUpdate = {
      inc_votes: "NFFC",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(articleUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("get api users", () => {
  it("status 200: responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .then(({ body }) => {
        expect(body.users.length).toEqual(4);
        body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("get comments by article id", () => {
  it("status 200: responds with comments matching article id", () => {
    const articleId = 1;
    return request(app)
      .get(`/api/comments/${articleId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
      });
  });
});

describe("add comment count to get article by id", () => {
  it("status 200: responds with matching article and comment count", () => {
    const articleId = 1;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: articleId,
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          title: "Living in the shadow of a great man",
          topic: "mitch",
          comments: 11,
          votes: 100,
        });
      });
  });
  it("status 200: responds with comment counter of zero if no comments", () => {
    const articleID = 2;
    return request(app)
      .get(`/api/articles/${articleID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.comments).toEqual(0);
      });
  });
});

describe("get articles tests", () => {
  it("status 200: responds with an array of article objects including comment count and the real name of the user", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body.articles.length).toEqual(12);
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("respondes with status 200 and an array of comments for the given article_id of which each comment should have a real name", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  it("Status 400: bad request if article_id does not exist", () => {
    return request(app)
      .get("/api/articles/NottinghamForestAreGoingUp/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  it("Status 404: should indicate if no comments for article ID can be found", () => {
    return request(app)
      .get("/api/articles/1985/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No comments for this article ID found");
      });
  });
});
