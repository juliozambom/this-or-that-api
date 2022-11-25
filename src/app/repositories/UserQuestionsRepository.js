const { PrismaClient } = require('@prisma/client');
const { userQuestion }  = new PrismaClient();

class UserQuestionsRepository {
    async create(user_id) {
        await userQuestion.create({
            data: {
                user_id,
                questions_played: "[]"
            }
        });
    }

    async update({ user_id, questions_played }) {
        await userQuestion.update({
            where: {
                user_id,
            },
            data: {
                questions_played,
            }
        });
    }

    async findQuestionsAlreadyPlayed(id) {
        try {
            const questionsPlayed = userQuestion.findMany({
                where: {
                    user_id: id
                },
                select: {
                    questions_played: true
                }
            });
    
            return questionsPlayed;
        } catch {
            return null;
        }
    }
}

module.exports = new UserQuestionsRepository();