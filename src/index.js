const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const server = http.createServer(app);

const questionsRoutes = require("./app/routes/QuestionRoutes");
const usersRoutes = require("./app/routes/UsersRoutes");

app.use(cors());
app.use(express.json());

const io = new Server({
  cors: {
    origin: "http://localhost:5000",
  },
  methods: ["GET", "POST"],
});

io.on("connection", (socket) => {
  console.log(socket.id);
});

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("This or That 🔴🔵"));

app.use(questionsRoutes);
app.use(usersRoutes);

server.listen(PORT, () => console.log("🔴 Server Running 🔵"));
