// process.env.NODE_ENV = "test";
const seed = require("../db/seeds/seed");
const devData = require("../db/data/development-data/index.js");
const db = require("../db/connection.js");
// const { get } = require("../app");
const app = require("../app");
const request = require("supertest");

beforeEach(() => {
  return seed(devData);
});

afterAll(() => {
  return db.end();
});

describe.only("GET API TOPICS", () => {
  it("gets an array of topic objects, each of which should have the properties of slug and description", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        expect(body.topic.length).toEqual(3);
        body.topic.forEach((topic) => {
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

describe.only("ERROR HANDLING", () => {
  it("returns a 404 error if endpoint is invalid", () => {
    return request(app)
      .get("/api/notARoute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});
