const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
app.use(express.static(__dirname + "/public"));
const { Server } = require("socket.io");
const io = new Server(server);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  socket.on("user_msg", (msg) => {
    io.emit("msgs", msg);
    console.log("Client message is:", msg);
  });
});

server.listen(3000, () => {
  console.log("app is running");
});
