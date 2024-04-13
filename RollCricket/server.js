const path = require("path");
const express = require("express");
const http = require("http");
const moment = require("moment"); //for time
const socketio = require("socket.io");
const PORT = process.env.PORT || 5050;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

let rooms = []; //array containing the room id
let Rooms = {}; //obj mapping roomid with username and usercount
// let usercount = 0;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views", "index.html"));
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("addroom", (room_id) => {
    console.log(`added room ${room_id} to the array`);
    rooms.push(room_id); //adding the room to the array
    Rooms[room_id] = { users: {}, userCount: 0 }; // Initialize room with empty users array and user count 0
  });

  socket.on("roomlist", () => {
    console.log(`Sending back the list of rooms`);
    socket.emit("roomlist", rooms);
  });

  socket.on("joinroom", (room_id, username) => {
    if (!Rooms[room_id]) {
      console.log(`Room ${room_id} does not exist`);
      return;
    } //checking if the room exists in the Rooms object

    //if the usercount in that particular room is more than 2 then you cannot join
    if (!(Rooms[room_id].userCount < 2)) {
      console.log("number of user exceeded");
      socket.emit("alert", "Room is full");
      return;
    } else {
      socket.join(room_id);
      Rooms[room_id].userCount++;
      Rooms[room_id].users[socket.id] = username;
      console.log(`${username} joined in ${room_id}`);
      console.log(`users in ${room_id} are ${JSON.stringify(Rooms[room_id])}`);
    }
    if (Rooms[room_id].userCount === 2) {
      io.to(room_id).emit("start match"); //changed from socket to io bcoz it will not emit to the 2nd user who
      console.log("Number of users is 2 so everyone can start playing");
    }
  });

  socket.on("toss choice", (heads_or_tails, room_id) => {
    console.log(`${Rooms[room_id].users[socket.id]} chose ${heads_or_tails}`);
    socket.to(room_id).emit("toss result", heads_or_tails);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} aka disconnected`);
  });
});
server.listen(PORT, () =>
  console.log(`Server is up and running on port ${PORT}`)
);
