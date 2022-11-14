const Router = require("express");
const questionRoutes = Router();

const QuestionsController = require("../controllers/QuestionsController");
const AdminPermissionsMiddleware = require("../middlewares/AdminPermissionsMiddleware");

questionRoutes.get("/questions", QuestionsController.index);
questionRoutes.get("/questions/:id", QuestionsController.show);
questionRoutes.post("/questions", QuestionsController.store);

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

module.exports = questionRoutes;
