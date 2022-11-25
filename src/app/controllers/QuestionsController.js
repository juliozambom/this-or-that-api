const QuestionsRepository = require("../repositories/QuestionsRepository");
const UserQuestionsRepository = require("../repositories/UserQuestionsRepository");
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
    const socket = req.io;
    const { id } = req.params;
    const parseId = Number(id);

    await QuestionsRepository.delete(parseId);

    const questionsRemaining = await QuestionsRepository.findQuestions(
      "non-validated"
    );

    //SOCKET
    socket.emit("question-deleted", { questionsRemaining });

    return res.status(200).json({
      message: "Questão deletada com sucesso",
      questionsRemaining
    });
  }

  async showValidatedQuestions(req, res) {
    const validatedQuestions = await QuestionsRepository.findQuestions(
      "validated"
    );

    return res.status(200).json({
      message: "Questões validadas",
      questions: validatedQuestions,
    });
  }

  async showNonValidatedQuestions(req, res) {
    const nonValidatedQuestions = await QuestionsRepository.findQuestions(
      "non-validated"
    );

    if (nonValidatedQuestions.length === 0) {
      return res.status(400).json({
        message: "Todas as questões enviadas já foram validadas e/ou deletadas",
      });
    }
    return res.status(200).json({
      message: "Questões não validadas",
      questions: nonValidatedQuestions,
    });
  }

  async increaseQuestionChoosedCount(req, res) {
    const { id } = req.params;
    const { optionChoosed } = req.body;
    const parseId = Number(id);

    const userId = req.userId;
    const parseUserId = Number(userId);

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

    try {
      //Getting the array of questions already played by this user, saved in database as a string
      const [{ questions_played: questionsPlayed }] = await UserQuestionsRepository.findQuestionsAlreadyPlayed(parseUserId);

      //Now I am parsing the string to get array
      const parseQuestions = JSON.parse(questionsPlayed);

      //Merging the new question played to older questions played by the user
      const questionsPlayedUpdated = [...parseQuestions, id];

      //Updating questions played
      await UserQuestionsRepository.update({
        user_id: parseUserId,
        questions_played: JSON.stringify(questionsPlayedUpdated)
      })

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

    } catch (error) {
      return res.sendStatus(500);
    }
  }

  async validateQuestion(req, res) {
    const socket = req.io;
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

    const questionsRemaining = await QuestionsRepository.findQuestions(
      "non-validated"
    );
    
    //SOCKET
    socket.emit("question-validated", { questionsRemaining });

    return res.status(200).json({
      message: "Questão validada",
      questionsRemaining
    });
  }

  async findAvailableQuestions(req, res) {
    const userId = req.userId;
    const parseId = Number(userId);

    try {
      //Getting the array of questions already played by this user, saved in database as a string
      const [{ questions_played: questionsPlayed }] = await UserQuestionsRepository.findQuestionsAlreadyPlayed(parseId);

      //Now I am parsing the string to get array
      const parseQuestions = JSON.parse(questionsPlayed);

      //Getting all validated questions
      const allQuestions = await QuestionsRepository.findQuestions('validated');

      //Taking off the array all the questions the user already played
      const availableQuestions = allQuestions.filter((question) => { 
        return !parseQuestions.includes(String(question.id))
      })

      // If the array returns empty, it means that the user already played all the questions in the game,
      // the code below returns a warning about this
      if(availableQuestions.length === 0) {
        return res.status(404).json({
          message: 'Você já jogou todas as perguntas do jogo',
          questions: null
        })
      }

      //Returning only the questions the user didn't played
      return res.status(200).json({
        message: 'Questões ainda não jogadas encontradas',
        questions: availableQuestions
      })

    } catch (error) {
      return res.sendStatus(500);
    }
  }
}

module.exports = new QuestionsController();
