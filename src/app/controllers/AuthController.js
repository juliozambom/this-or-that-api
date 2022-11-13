const { PrismaClient } = require("@prisma/client");
const { admin } = new PrismaClient();

const UsersRepository = require("../repositories/UsersRepository");
const isSomeFieldEmpty = require("../utils/isSomeFieldEmpty");
const bcrypt = require("bcrypt");
const createToken = require("../utils/createToken");

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;

    const emptyFieldExists = isSomeFieldEmpty([email, password]);

    if (emptyFieldExists) {
      return res.status(400).json({
        message: "Campos obrigatórios não foram enviados",
        token: null,
      });
    }

    const user = await UsersRepository.findByEmail(email);

    if (!user) {
      return res.status(400).json({
        message: "Não há um usuário com este email",
        token: null,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Senha incorreta",
        token: null,
      });
    }

    const token = createToken( user.id, false);

    return res.status(200).json({
      message: "Login realizado com sucesso",
      token,
    });
  }

  async adminLogin(req, res, next) {
    const { email, password } = req.body;

    const emptyFieldExists = isSomeFieldEmpty([email, password]);

    if (emptyFieldExists) {
      return res.status(400).json({
        message: "Campos obrigatórios não foram enviados",
        token: null,
      });
    }

    const adminExists = await admin.findFirst({
      where: {
        email,
      },
    });

    if (!adminExists) {
      return res.status(401).json({
        message: "Não conseguimos encontrar um admin com o email especificado",
        token: null,
      });
    }

    if (password !== adminExists?.password) {
      return res.status(401).json({
        message: "Senha incorreta",
        token: null,
      });
    }

    const token = createToken(adminExists?.id, true);

    return res.status(200).json({
      message: "Admin logado com sucesso",
      token,
    });
  }
}

module.exports = new AuthController();
