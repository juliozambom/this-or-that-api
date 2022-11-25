const Router = require("express");
const questionRoutes = Router();

const QuestionsController = require("../controllers/QuestionsController");
const AdminPermissionsMiddleware = require("../middlewares/AdminPermissionsMiddleware");

questionRoutes.get("/questions", QuestionsController.index);
questionRoutes.get("/questions/:id", QuestionsController.show);
questionRoutes.get(
  "/unvalidated-questions",
  QuestionsController.showNonValidatedQuestions
);
questionRoutes.get(
  "/validated-questions",
  QuestionsController.showValidatedQuestions
);
questionRoutes.post("/questions", QuestionsController.store);

//Route to increase count of question choosen count
questionRoutes.patch(
  "/questions/:id",
  QuestionsController.increaseQuestionChoosedCount
);

//Admin routes
questionRoutes.put(
  "/questions/:id",
  AdminPermissionsMiddleware,
  QuestionsController.update
);
questionRoutes.delete(
  "/questions/:id",
  AdminPermissionsMiddleware,
  QuestionsController.delete
);

//Route to validate some question
questionRoutes.patch(
  "/validate-question/:id",
  AdminPermissionsMiddleware,
  QuestionsController.validateQuestion
);

//Route to get the questions the user didn't played
questionRoutes.get('/available-questions', QuestionsController.findAvailableQuestions);

module.exports = questionRoutes;
