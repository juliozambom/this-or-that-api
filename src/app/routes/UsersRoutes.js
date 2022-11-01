const Router = require("express");
const usersRoutes = Router();

const UsersController = require("../controllers/UsersController");

usersRoutes.get("/users", UsersController.index);
usersRoutes.get("/users/:id", UsersController.show);
usersRoutes.post("/users", UsersController.store);
usersRoutes.put("/users/:id", UsersController.update);
usersRoutes.delete("/users/:id", UsersController.delete);

module.exports = usersRoutes;
