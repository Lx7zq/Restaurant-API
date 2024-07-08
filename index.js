const express = require("express");
const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("<h1>Hello Restaurant API</h1>");
});

app.listen(PORT, () => {
  console.log("Listening to http://localhost:"+PORT);
});
