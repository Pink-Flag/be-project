const app = require("./app");
const PORT = 9090;
const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// module.exports = { server };
