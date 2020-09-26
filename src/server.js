const express = require("express");
const path = require("path");
const socketioJwt = require("socketio-jwt");
const jwt = require("jsonwebtoken");
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "..", "public")));

app.set("views", path.resolve(__dirname, "..", "public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

app.use("/", (request, response) => {
  response.render("index", { title: "victor" });
});

const messages = [];

io.on("connection", (socket) => {
  socket.emit("previusMessages", messages);

  socket.on("typingMessage", (data) => {
    socket.broadcast.emit("message", data);
  });

  socket.on("mensagem", (data) => {
    messages.push(data);
    socket.broadcast.emit("mensagem", data);
  });
});

server.listen(process.env.PORT || 3001, () => {
  console.log("application start running");
});
