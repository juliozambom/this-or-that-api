const jwt = require("jsonwebtoken");

function createToken( id, isAdmin ) {
  const token = jwt.sign({ id, isAdmin }, process.env.SECRET);
  return token;
}

module.exports = createToken;
