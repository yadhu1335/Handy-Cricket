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
let socket_to_room_map = {};

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

  //code for room.js

  socket.on("my_socket_id", () => {
    io.to(socket.id).emit("my_socket_id", socket.id);
  });

  //when a user joins a room
  socket.on("join_room", (room_id) => {
    if (!Rooms[room_id]) {
      console.log(`Room ${room_id} does not exist`);
      io.to(socket.id).emit("alert", "Error encountered in room...Go back");
      return;
    } //checking if the room exists in the Rooms object

    //if the usercount in that particular room is more than 2 then you cannot join
    if (!(Rooms[room_id].userCount < 2)) {
      console.log("number of user exceeded");
      socket.emit("alert", "Room is full");
      return;
    }
    //if the usercount is less than 2 you can join
    else {
      socket.join(room_id);
      Rooms[room_id].userCount += 1;
      console.log(`${socket.id} joined in ${room_id}`);
      console.log(`users in ${room_id} are ${JSON.stringify(Rooms[room_id])}`);
      socket_to_room_map[socket.id] = room_id;
    }
    //when the number of users hit 2 the game starts this if condition is used for that purpose.
    if (Rooms[room_id].userCount === 2) {
      io.to(room_id).emit("start_match"); //changed from socket to io bcoz it will not emit to the 2nd user who
      console.log("Number of users is 2 so everyone can start playing");
    }
  });

  socket.on("heads_or_tails", (room_id, heads_or_tails) => {
    console.log(`Rooms = ${JSON.stringify(Rooms)},room_id=${room_id}`);
    if (Rooms[room_id]) {
      const buffer_length = Object.keys(Rooms[room_id].buffer).length;
      console.log(`Buffer length = ${buffer_length}`);
      if (buffer_length === 0) {
        console.log(`${socket.id} chose ${heads_or_tails}`);
        Rooms[room_id].buffer[socket.id] = heads_or_tails;
        console.log(
          `After getting heads or tails = ${JSON.stringify(Rooms[room_id])}`
        );
        io.to(room_id).emit("heads_or_tails_result", Rooms[room_id].buffer);

        const random_value = Math.floor(Math.random() * 2); //0=heads 1=tails
        console.log(`Random vaue=${random_value}`);
        if (random_value == 0) {
          io.to(room_id).emit("toss_result", "heads");
        } else {
          io.to(room_id).emit("toss_result", "tails");
        }
      }
    } else {
      console.error(
        `Room ${room_id} does not exist when trying to set heads or tails`
      );
    }
  });

  socket.on("bat_or_ball", (room_id, bat_or_ball) => {
    if (Rooms[room_id]) {
      Rooms[room_id].user_bat_ball[bat_or_ball] = socket.id; //changed
      console.log(
        `${JSON.stringify(Rooms[room_id])}=${JSON.stringify(
          Rooms[room_id].user_bat_ball
        )}`
      );
      socket.to(room_id).emit("opponent_bat_or_ball", bat_or_ball);
    } else {
      console.log(`problem in RoomId(bat_or_ball)`);
    }
  });

  socket.on("value", (value, you_are_currently, room_id) => {
    console.log(`${socket.id}-${value},${you_are_currently},${room_id}`);
    //  add to bufffer
    // Rooms[room_id].buffer = {};
    // Rooms[room_id].buffer[you_are_currently] = value;
    // console.log(`buffer=${Rooms[room_id].buffer}`);
    console.log(`you are currently=${you_are_currently}`);
    if (you_are_currently === "bat") {
      Rooms[room_id].bat = value;
    } else {
      Rooms[room_id].ball = value;
    }
    console.log(`value=${JSON.stringify(Rooms[room_id])}`);
    if (Rooms[room_id].bat !== -1 && Rooms[room_id].ball !== -1) {
      if (Rooms[room_id].bat !== Rooms[room_id].ball) {
        if (Rooms[room_id].bat === 0) {
          Rooms[room_id].bat += Rooms[room_id].ball;
        } else {
          Rooms[room_id].score += Rooms[room_id].bat; //adding the score value to bat
        }
        io.to(room_id).emit(
          "runs_bat_ball",
          Rooms[room_id].score,
          Rooms[room_id].bat,
          Rooms[room_id].ball
        );
        Rooms[room_id].bat = -1;
        Rooms[room_id].ball = -1;
      } else {
        //out
        if (Rooms[room_id].switch_side === false) {
          Rooms[room_id].switch_side = true;
          Rooms[room_id].score_to_beat = Rooms[room_id].score;
          Rooms[room_id].score = 0;
          //emit alert
          io.to(room_id).emit("alert", "OUT!!Switching sides");
          let temp = Rooms[room_id].bat;
          Rooms[room_id].bat = Rooms[room_id].ball;
          Rooms[room_id].ball = temp;
          io.to(room_id).emit("switch_sides", Rooms[room_id].score_to_beat);
        }
      }
    }
  });

  socket.on("disconnect", () => {
    if (random_room.indexOf(socket.id) != -1) {
      const index = random_room.indexOf(socket.id);
      console.log(`socketid to be removed=${socket.id}`);
      random_room.splice(index, 1); //removing random id
    }

    socket
      .to(socket_to_room_map[socket.id])
      .emit(
        "won_by_default",
        "Player Disconnected. You win by Default",
        socket.id
      );

    const room_id_to_delete = socket_to_room_map[socket.id]; //to get the roomid

    if (Rooms.hasOwnProperty(room_id_to_delete)) {
      console.log(`Deleting ${room_id_to_delete}`);
      delete Rooms[room_id_to_delete];
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
    buffer: {},
    user_bat_ball: {},
    // scores: {}, // score is used to save the scores of the socket.is's
    score: 0,
    switch_side: false,
    bat: -1,
    ball: -1,
    // bat and bowl is used to store the bat and bowl value
    score_to_beat: 0,
  }; // Initialize room with empty users array and user count 0
}

function uuidv4() {
  return "xxyxyxxyx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
