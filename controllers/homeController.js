function homeGet(req, res) {
  res.render("home");
}

function elpepe(req, res) {
  res.send("I will delete this later on");
}

module.exports = {
  homeGet,
  elpepe
}