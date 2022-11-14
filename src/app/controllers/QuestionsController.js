const QuestionsRepository = require("../repositories/QuestionsRepository");
const UsersRepository = require("../repositories/UsersRepository");
const isSomeFieldEmpty = require("../utils/isSomeFieldEmpty");
const isSomeFieldFilled = require("../utils/isSomeFieldFilled");
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
    const { questionContent, firstOption, secondOption } = req.body;
    const userId = req.userId;

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

    const question = await QuestionsRepository.create({
      question_content: questionContent,
      first_option: firstOption,
      second_option: secondOption,
      user_id: userId,
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

    const someFieldFilled = isSomeFieldFilled([
      questionContent,
      firstOption,
      secondOption,
    ]);

    if (!someFieldFilled) {
      return res.status(400).json({
        message: "Preencha ao menos um campo para alterar a questão",
        error: true,
      });
    }

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

  async increaseQuestionChoosedCount(req, res) {
    const { id } = req.params;
    const { optionChoosed } = req.body;
    const parseId = Number(id);

    const someFieldEmpty = isSomeFieldEmpty([optionChoosed]);

    if (someFieldEmpty) {
      return res.status(400).json({
        message: "Campos obrigatórios não foram enviados",
        question: null,
      });
    }
    const questionExists = await QuestionsRepository.findById(parseId);

    if (!questionExists) {
      return res.status(400).json({
        message: "Questão não encontrada",
        question: null,
      });
    }

    if (optionChoosed == 1) {
      const increasedQuestion = await QuestionsRepository.update({
        id: parseId,
        first_option_chosen_count: questionExists.first_option_chosen_count + 1,
      });

      return res.status(200).json({
        message: "Primeira opção escolhida",
        question: increasedQuestion,
      });
    } else if (optionChoosed == 2) {
      const increasedQuestion = await QuestionsRepository.update({
        id: parseId,
        second_option_chosen_count:
          questionExists.second_option_chosen_count + 1,
      });

      return res.status(200).json({
        message: "Segunda opção escolhida",
        question: increasedQuestion,
      });
    } else {
      return res.status(400).json({
        message: "Opção inválida",
        question: null,
      });
    }
  }

  async validateQuestion(req, res) {
    const { id } = req.params;
    const parseId = Number(id);

    const questionExists = await QuestionsRepository.findById(parseId);

    if (!questionExists) {
      return res.status(400).json({
        message: "Questão não encontrada",
        validated: false,
      });
    }

    if (questionExists.is_validated) {
      return res.status(400).json({
        message: "Questão já validada, não necessita de revalidação",
        validated: true,
      });
    }

    await QuestionsRepository.update({
      id: parseId,
      is_validated: true,
    });

    return res.status(200).json({
      message: "Questão validada",
      validated: true,
    });
  }
}

module.exports = new QuestionsController();
