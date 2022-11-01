const Router = require("express");
const questionRoutes = Router();

const QuestionsController = require("../controllers/QuestionsController");

questionRoutes.get("/questions", QuestionsController.index);
questionRoutes.get("/questions/:id", QuestionsController.show);
questionRoutes.post("/questions", QuestionsController.store);
questionRoutes.put("/questions/:id", QuestionsController.update);
questionRoutes.delete("/questions/:id", QuestionsController.delete);

module.exports = questionRoutes;
