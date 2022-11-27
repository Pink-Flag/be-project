const app = require("./app");

const { PORT = 9090 } = process.env;

app.listen(PORT, (err) => {
  console.log("hello matt");
  if (err) throw err;
  console.log(`Listening on ${PORT}...`);
});
