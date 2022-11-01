const express = require("express");

const questionsRoutes = require("./app/routes/QuestionRoutes");

const app = express();
app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => res.send("This or That 🔴🔵"));

app.use(questionsRoutes);

app.listen(PORT, () => console.log("🔴 Server Running 🔵"));
