const { PrismaClient } = require("@prisma/client");
const { question } = new PrismaClient();

class QuestionsRepository {
  async findAll() {
    const questions = await question.findMany();

    return questions;
  }

  async findById(id) {
    const questionExists = await question.findFirst({
      where: {
        id,
      },
    });

    return questionExists;
  }

  async create({ question_content, first_option, second_option }) {
    try {
      const questionCreated = await question.create({
        data: {
          question: question_content,
          first_option,
          second_option,
        },
      });

      return questionCreated;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update({ id, question_content, first_option, second_option }) {
    const updatedQuestion = await question.update({
      where: {
        id,
      },
      data: {
        question: question_content,
        first_option,
        second_option,
      },
    });

    return updatedQuestion;
  }

  async delete(id) {
    const deletedQuestion = await question.deleteMany({
      where: {
        id,
      },
    });

    return deletedQuestion;
  }
}

module.exports = new QuestionsRepository();
