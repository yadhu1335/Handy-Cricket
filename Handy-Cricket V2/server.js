const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const PORT = process.env.PORT || 5050;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views", "index.html"));
});

app.get("/room/:room_id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views", "room.html"));
});

app.get("/bot", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views", "bot.html"));
});

app.get("/howtoplay", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views", "tutorial.html"));
});

const asciiArt = `
██╗   ██╗ █████╗ ██████╗ ██╗  ██╗██╗   ██╗
╚██╗ ██╔╝██╔══██╗██╔══██╗██║  ██║██║   ██║
 ╚████╔╝ ███████║██║  ██║███████║██║   ██║
  ╚██╔╝  ██╔══██║██║  ██║██╔══██║██║   ██║
   ██║   ██║  ██║██████╔╝██║  ██║╚██████╔╝
   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝ `;

server.listen(PORT, () => {
  console.log(asciiArt);
  console.log(`Server is up and running on port http://localhost:${PORT}`);
});
