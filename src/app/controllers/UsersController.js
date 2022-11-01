const UsersRepository = require("../repositories/UsersRepository");

class UsersController {
  async index(req, res) {
    const users = await UsersRepository.findAll();

    return res.status(200).json({
      message: "Usuários encontrados",
      users,
    });
  }

  async show(req, res) {
    const { id } = req.params;
    const parseId = Number(id);

    const user = await UsersRepository.findById(parseId);

    if (!user) {
      return res.status(400).json({
        message: "Usuário não encontrado",
        user: null,
      });
    }

    return res.status(200).json({
      message: "Usuário encontrado",
      user,
    });
  }

  async store(req, res) {
    const { name, email, password } = req.body;

    const createdUser = await UsersRepository.create({ name, email, password });

    if (!createdUser) {
      return res.status(400).json({
        message: "Não foi possível criar o usuário",
        createdUser: null,
      });
    }

    return res.status(200).json({
      message: "Usuário criado com sucesso",
      createdUser,
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const parseId = Number(id);

    const { name, email } = req.body;

    const updatedUser = await UsersRepository.update({
      id: parseId,
      name,
      email,
    });

    return res.status(200).json({
      message: "Usuário atualizado com sucesso",
      updatedUser,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const parseId = Number(id);

    const deletedUser = await UsersRepository.delete(parseId);

    return res.status(200).json({
      message: "Usuário deletado com sucesso",
      deletedUser,
    });
  }
}

module.exports = new UsersController();
