const Router = require("express");
const router = Router();

const AuthController = require("../controllers/AuthController");

router.post("/auth/login", AuthController.login);
router.post("/auth/admin-login", AuthController.adminLogin);

module.exports = router;
