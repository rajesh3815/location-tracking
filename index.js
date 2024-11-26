const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.render("index");
});

io.on("connection", (socket) => {
  socket.on("locations", (data) => {
    io.emit("receive_location", { id: socket.id, ...data });
  });
  socket.on("disconnect", function () {
    io.emit("user_disconnect", socket.id);
  });
});

server.listen(3000, () => {
  console.log("app is running");
});
