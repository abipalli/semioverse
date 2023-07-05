import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import Play from "../old/play.js"; // Make sure you've the correct path

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://127.0.0.1:8080",
    methods: ["GET", "POST"],
  },
});

let play = new Play(
  "3c4387f8e27a94cf1891d7510d197168fd239190aeb67932e828830526d61fe5"
);

console.log(play);

play.setDataCallback((data) => {
  io.emit("game-data", data);
});

io.on("connection", (socket) => {
  console.log("A player connected");

  socket.on("game-action", (data) => {
    play.broadcast(data);
  });
});

httpServer.listen(3000, () => {
  console.log("Listening on port 3000");
});
