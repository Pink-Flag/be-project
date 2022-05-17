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
