const express = require("express");
const path = require("path");
const PORT = 3000;
const app = express();

app.get("/", (req, res) => {
  res.send("Hola nena");
});

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
})