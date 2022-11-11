const jwt = require("jsonwebtoken");

function createToken() {
  const token = jwt.sign({ id: 2 }, process.env.SECRET);
  return token;
}

module.exports = createToken;
