const jwt = require("jsonwebtoken");

function AuthMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message: "É necessário fornecer um token de autenticação",
      auth: false,
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const tokenDecoded = jwt.verify(token, process.env.SECRET);

    if (tokenDecoded) {
      req.token = tokenDecoded;
      req.auth = true;
      next();
    } else {
      return res.status(401).json({
        message: "O token fornecido é inválido",
        auth: false,
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Algo deu errado na verificação do token",
      auth: false,
    });
  }
}

module.exports = AuthMiddleware;
