const { PrismaClient } = require('@prisma/client');
const { userQuestion }  = new PrismaClient();

class UserQuestionsRepository {
    async create(id) {
        await userQuestion.create({
            data: {
                user_id: id,
                questions_played: "[]"
            }
        });
    }

    async findQuestionsAlreadyPlayed(id) {
        try {
            const questionsPlayed = userQuestion.findFirst({
                where: {
                    user_id: id
                },
                select: {
                    questions_played
                }
            });
    
            return questionsPlayed;
        } catch {
            return null;
        }
    }
}

module.exports = new UserQuestionsRepository();