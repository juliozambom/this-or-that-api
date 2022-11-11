const QuestionsRepository = require("../repositories/QuestionsRepository");
const UsersRepository = require("../repositories/UsersRepository");
const isSomeFieldEmpty = require("../utils/isSomeFieldEmpty");
const UsersController = require("./UsersController");

class QuestionsController {
  async index(req, res) {
    const questions = await QuestionsRepository.findAll();

    return res.status(200).json({
      message: "Questões encontradas",
      questions,
    });
  }

  async show(req, res) {
    const { id } = req.params;
    const parseId = Number(id);

    const question = await QuestionsRepository.findById(parseId);

    if (!question) {
      return res.status(400).json({
        message: "Questão não encontrada",
        question: null,
      });
    }

    return res.status(200).json({
      message: "Questão encontrada",
      question,
    });
  }

  async store(req, res) {
    const socket = req.io;
    const { questionContent, firstOption, secondOption, userId } = req.body;

    const emptyFieldExists = isSomeFieldEmpty([
      questionContent,
      firstOption,
      secondOption,
      userId,
    ]);

    if (emptyFieldExists) {
      return res.status(400).json({
        message: "Campos obrigatórios não foram enviados",
        questionCreated: null,
      });
    }

    const parseUserId = Number(userId);
    const userExists = await UsersRepository.findById(parseUserId);

    if (!userExists) {
      return res.status(400).json({
        message: "Não foi possível encontrar um membro com este id",
        questionCreated: null,
      });
    }

    const question = await QuestionsRepository.create({
      question_content: questionContent,
      first_option: firstOption,
      second_option: secondOption,
      user_id: parseUserId,
    });

    if (!question) {
      return res.status(400).json({
        message: "Não foi possível criar a questão",
        questionCreated: null,
      });
    }

    //SOCKET.IO
    socket.emit("question-created", question);

    return res.status(200).json({
      message: "Questão criada com sucesso",
      question,
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const parseId = Number(id);

    const { questionContent, firstOption, secondOption } = req.body;

    const updatedQuestion = await QuestionsRepository.update({
      id: parseId,
      question_content: questionContent,
      first_option: firstOption,
      second_option: secondOption,
    });

    return res.status(200).json({
      message: "Questão atualizada",
      updatedQuestion,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const parseId = Number(id);

    const deletedQuestion = await QuestionsRepository.delete(parseId);

    return res.status(200).json({
      message: "Questão deletada com sucesso",
      deletedQuestion,
    });
  }
}

module.exports = new QuestionsController();
