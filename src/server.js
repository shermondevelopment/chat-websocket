const express = require("express");
const path = require("path");
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "..", "public")));

app.set("views", path.resolve(__dirname, "..", "public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

app.get("/", (request, response) => {
  response.render("index", { title: "victor" });
});

var messages = [];
var identify = {
  id: 0
};

io.on("connection", (socket) => {
  socket.emit("previusMessages", messages);
  identify.id = socket.id

  socket.on("typingMessage", (data) => {
    socket.broadcast.emit("message", data);
  });

  socket.on("mensagem", (data) => {
    messages.push([{...data, id: identify.id}]);
    socket.broadcast.emit("mensagem", data);
  });

  socket.on("disconnect", (reason) => {
    messages = [];
  });
});

server.listen(process.env.PORT || 3002, () => {
  console.log("application start running");
});
