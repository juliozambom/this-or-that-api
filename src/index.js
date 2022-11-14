require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const server = http.createServer(app);

const authRoutes = require("./app/routes/AuthRoutes");
const questionsRoutes = require("./app/routes/QuestionRoutes");
const usersRoutes = require("./app/routes/UsersRoutes");
const AuthMiddleware = require("./app/middlewares/AuthMiddleware");
const AdminPermissionsMiddleware = require("./app/middlewares/AdminPermissionsMiddleware");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
  methods: ["GET", "POST"],
});

io.on("connection", (socket) => {
  console.log(socket.id);
});

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/", (req, res) => res.send("This or That 🔴🔵"));
app.use(authRoutes);

//Users routes
app.use(AuthMiddleware);
app.use(questionsRoutes);

//Admin routes
app.use(AdminPermissionsMiddleware);
app.use(usersRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("🔴 Server Running 🔵"));
