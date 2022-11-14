const jwt = require("jsonwebtoken");

function AdminPermissionsMiddleware(req, res, next) {
  const { authorization } = req.headers;

  const token = authorization.split(" ")[1];

  try {
    const tokenDecoded = jwt.verify(token, process.env.SECRET);
    const { isAdmin } = tokenDecoded;

    if (isAdmin) {
      next();
    } else {
      return res.status(401).json({
        message: "Você não tem permissão de admin para acessar essa rota",
        error: true,
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Você não tem permissão de admin para acessar essa rota",
      error: true,
    });
  }
}

module.exports = AdminPermissionsMiddleware;
