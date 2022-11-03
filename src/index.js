const express = require("express");

const questionsRoutes = require("./app/routes/QuestionRoutes");
const usersRoutes = require("./app/routes/UsersRoutes");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("This or That 🔴🔵"));

app.use(questionsRoutes);
app.use(usersRoutes);

app.listen(PORT, () => console.log("🔴 Server Running 🔵"));
