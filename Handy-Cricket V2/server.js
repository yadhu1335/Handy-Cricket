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

let exisiting_room = []; //array containing ll the rooms that exists.used for validation when user enters room id and joins.
let Rooms = {};
let random_room = []; // for saving socket.id of people who want to play aganist random people.

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);
  socket.on("room_exist", (room_id) => {
    if (exisiting_room.includes(room_id)) {
      console.log(`${room_id} exists`);
      io.to(socket.id).emit("room_exist", true);
    } else {
      console.log(`${room_id} does not exist`);
      io.to(socket.id).emit("room_exist", false);
    }
  });

  //creating room
  socket.on("create_room", (room_id) => {
    add_room_id(room_id);
  });

  socket.on("random_room", () => {
    random_room.push(socket.id);
    console.log(`${socket.id} has been added to the array randomroom`);
    if (random_room.length >= 2) {
      console.log("found 2 people");
      room_id = uuidv4(); //generates a roomid
      add_room_id(room_id); //adding and initializing newly created room_id
      for (let i = 0; i < 2; i++) {
        io.to(random_room[i]).emit("assigned_room_id", room_id);
      }
      random_room.shift();
      random_room.shift();
      //removing the first 2 element from the array
    }
  });

  socket.on("cancel_search", () => {
    const index = random_room.indexOf(socket.id);
    console.log(`socketid to be removed=${socket.id}`);
    random_room.splice(index, 1); //removing random id
  });

  socket.on("disconnect", () => {
    if (random_room.indexOf(socket.id) != -1) {
      const index = random_room.indexOf(socket.id);
      console.log(`socketid to be removed=${socket.id}`);
      random_room.splice(index, 1); //removing random id
    }
  });
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

function add_room_id(room_id) {
  console.log(`added room ${room_id} to the array`);
  exisiting_room.push(room_id); //adding the room to the array
  Rooms[room_id] = {
    userCount: 0,
    toss: {},
    buffer: {},
    // scores: {},
    // // game is used to save the scores of the socket.is's
    // switch_side: false,
    // bat: 0,
    // bowl: 0,
    // //bat and bowl is used to store the bat and bowl value
    // score_to_beat: 0,
  }; // Initialize room with empty users array and user count 0
}

function uuidv4() {
  return "xxyxyxxyx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
