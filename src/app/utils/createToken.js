const jwt = require("jsonwebtoken");

function createToken({ id }) {
  const token = jwt.sign({ id }, process.env.SECRET);
  return token;
}

module.exports = createToken;
