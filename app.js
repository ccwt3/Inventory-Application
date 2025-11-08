//imports
const express = require("express");
const path = require("path");
const homeRouter = require("./routes/homeRouter")

const app = express();

// Views confing
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//middleware
app.use(express.urlencoded({ extended: true }))
app.use("/", homeRouter);

//Getting up the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Server listening on ${PORT}`)
})