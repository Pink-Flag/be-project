process.env.NODE_ENV = "test";
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const app = require("../app");
const request = require("supertest");
require("jest-sorted");

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
        expect(body.msg).toBe("Bad request");
      });
  });
  it("status 404: returns a not found message when article isn't in db", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
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
        expect(body.msg).toBe("Bad request");
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
        expect(body.msg).toBe("Bad request");
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
  it("status 200: responds with an empty array if no comments for article ID", () => {
    const article_id = 2;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments tests", () => {
  it("status 201: responds with posted comments", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I <3 Brian Eno",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual("I <3 Brian Eno");
      });
  });
  it("status 404: returns error when trying to post comment to article that doesn't exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I <3 Brian Eno",
    };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
  it("status 400: only allows comments and usernames as a string", () => {
    const newComment = {
      username: 12345,
      body: true,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("status 400: returns an error if passed empty comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  it('Status 400, invalid ID, e.g. string of "not-an-id"', () => {
    const newComment = {
      username: "butter_bridge",
      body: "listen to ambient 1: music for airports",
    };
    return request(app)
      .post("/api/articles/brianeno/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("Status 400, missing required field(s), e.g. no username or body properties", () => {
    const newComment = {
      username: "",
      body: "",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("Status 404, username does not exist", () => {
    const newComment = {
      username: "William-Basinski",
      body: "Disintegration Loops",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
  it("Status 201: ignores unecessary properties", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Go outside. Shut the door.",
      bestPackOfCards: "Oblique Strategies",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual("Go outside. Shut the door.");
      });
  });
});
describe("get articles tests", () => {
  it("status 200: responds with an array of article sorted by article id, defaulting to descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .then(({ body }) => {
        expect(body.articles).toHaveLength(12);
        expect(body.articles).toBeSorted({
          key: "article_id",
          descending: true,
        });
      });
  });
  it("status 200: responds with an array of article defaulting to created_at in ascending order", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .then(({ body }) => {
        expect(body.articles).toHaveLength(12);
        expect(body.articles).toBeSorted({
          key: "created_at",
          descending: false,
        });
      });
  });
  it("status 200: responds with an array of article defaulting to created_at and descending order", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body.articles).toHaveLength(12);
        expect(body.articles).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
  it("status 200: responds with an array of article sorted by title in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .then(({ body }) => {
        expect(body.articles).toHaveLength(12);
        expect(body.articles).toBeSorted({
          key: "title",
          descending: false,
        });
      });
  });
  it("status 200: responds with an array of articles matching topic of cats", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .then(({ body }) => {
        expect(body.articles).toHaveLength(1);
      });
  });
  it("status 200: responds with an array of articles matching topic of mitch in ascending order by creation date", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=created_at&order=asc")
      .then(({ body }) => {
        expect(body.articles).toHaveLength(11);
        expect(body.articles).toBeSorted({
          key: "created_at",
          descending: false,
        });
      });
  });
  it("status 400: responds with an error if provided with invalid query", () => {
    return request(app)
      .get("/api/articles?brian=eno")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("status 400: responds with an error if provided with key for order", () => {
    return request(app)
      .get("/api/articles?orderMe=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("status 404: responds with an error if provided with invalid query for valid key", () => {
    return request(app)
      .get("/api/articles?sort_by=fugazi")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
  it("status 400: responds with an error if provided with correct key and query but wrong order query", () => {
    return request(app)
      .get("/api/articles?topic=cats&order_by=dogs")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});
