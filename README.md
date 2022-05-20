# NC News API documentation

This is version of a social news aggregator website such as Reddit. It has been created with Node.js and Express. The data is stored with PostgreSQL and the API is hosted via Heroku:

https://trickmirror.herokuapp.com/api

All available endpoints

## Installation

Installation Requirements:

Node.js: v17.9.0 or later
PostgreSQL: v 10.21 or later

1. Clone the repository in a new folder and `cd` into the directory
2. Run `npm install` to install the project and any dependencies
3. Create two `.env` files locally to setup environment variables for the test and development databases. These are already set to be ignored in `.gitignore`:

   ```
   echo 'PGDATABASE=nc_news' > ./.env.development
   echo 'PGDATABASE=nc_news' > ./.env.test
   ```

4. run `npm run setup-dbs` to seed the development and test databases
5. To run the app use: `npm start`

## Testing

Testing in this application is done via the `jest` framework and can be run with the command: `npm test`

## Available endpoints

These can also be viewed at the url: https://trickmirror.herokuapp.com/api

| **Method** | **Endpoint**                       | **Description**                                                                                                  |
| ---------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| GET        | /api                               | serves up a json representation of all the available endpoints of the api                                        |
| GET        | /api/topics                        | serves an array of all topics                                                                                    |
| GET        | /api/articles                      | serves an array of all articles                                                                                  |
| GET        | /api/articles/:article_id          | serves an individual article from input id                                                                       |
| GET        | /api/articles/:article_id/comments | serves an array of comment objects from given ID                                                                 |
| GET        | /api/users                         | serves an array of all user objects                                                                              |
| PATCH      | /api/articles/:article_id          | increments or decrements article vote by specified amount then returns object with new vote count                |
| POST       | /api/articles/:article_id/comments | posts a comment and username to the given article id and then returns an object with the posted comment and user |
| DELETE     | /api/comments/:comment_id          | deletes a comment from given comment id and returns a 204 status code                                            |
