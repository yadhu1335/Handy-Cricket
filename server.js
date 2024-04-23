const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
// const e = require("express");
const PORT = process.env.PORT || 5050;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

let rooms = []; //array containing the room id
let Rooms = {}; //obj mapping roomid with username and usercount
let socketRoomMap = {}; //saving room id along with socket id
let randroom = []; //for random lobby joining

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views", "index.html"));
});

function add_room_id(room_id) {
  //i am using the same lines 2 times so i created this function. One for friend lobby and another for random lobby.
  /*my_yapping()
  {
    when the user clicks on "create room" button in index.js a roomid is created and passed. Then the roomid is added into an array called rooms and an object called Rooms.
    why 2 rooom? ans= the array rooms is used for checking wheater the room exists and it will be complicated to call the obj recuurently for suh a trivial task.
    Rooms is mostly used for the server side. room(array) is passed to index.html so that when a user tries to join a room it can check wheater the room exists or not.
  }*/
  console.log(`added room ${room_id} to the array`);
  rooms.push(room_id); //adding the room to the array
  Rooms[room_id] = {
    users: {},
    userCount: 0,
    toss: {},
    game: {},
    switch_side: false,
    bat: 0,
    bowl: 0, //bat and bowl is used to store the bat and bowl value
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

//A user connects
io.on("connection", (socket) => {
  console.log("A user connected");

  io.to(socket.id).emit("socketid", socket.id); //sending socketid value to the front end js

  socket.on("random_lobby", () => {
    randroom.push(socket.id);
    console.log(`${socket.id} has been added to the array randomroom`);
    if (randroom.length >= 2) {
      room_id = uuidv4(); //generates a roomid
      add_room_id(room_id); //adding and initializing newly created room_id
      for (let i = 0; i < 2; i++) {
        io.to(randroom[i]).emit("assign_room_id", room_id);
      }
      randroom.shift();
      randroom.shift();
      //removing the first 2 element from the array
    }
  });

  socket.on("addroom", (room_id) => {
    add_room_id(room_id);
  });

  //For sending the rooms(array) to "index" file.
  //the better way is to check if room id exist in Rooms[room_id] and send them true or false
  socket.on("roomlist", () => {
    console.log(`Sending back the list of rooms`);
    io.emit("roomlist", rooms);
  });

  //when a user joins a room
  socket.on("joinroom", (room_id, username) => {
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
    //if the usercount is lessthan 2 you can join
    else {
      socket.join(room_id);
      Rooms[room_id].userCount++;
      Rooms[room_id].users[socket.id] = username;
      console.log(`${username} joined in ${room_id}`);
      console.log(`users in ${room_id} are ${JSON.stringify(Rooms[room_id])}`);
      Rooms[room_id].game[socket.id] = { score: 0, warning: 0 };
      socketRoomMap[socket.id] = room_id;
    }
    //when the number of users hit 2 the game starts this if condition is used for that purpose.
    if (Rooms[room_id].userCount === 2) {
      io.to(room_id).emit("start match"); //changed from socket to io bcoz it will not emit to the 2nd user who
      console.log("Number of users is 2 so everyone can start playing");
      io.to(room_id).emit("players info", Rooms[room_id].users);

      io.to(room_id).emit("start call"); //to start the webrtc procedure for audio transfering
    }
  });

  //after a user sends their toss (heads or tails) value it is sended there for
  socket.on("my_heads_or_tails_choice", (heads_or_tails, room_id) => {
    console.log(`${Rooms[room_id].users[socket.id]} chose ${heads_or_tails}`);
    Rooms[room_id].toss[socket.id] = heads_or_tails; //saving what the user chose inside the Rooms obj
    console.log(Rooms[room_id].toss);
    socket.to(room_id).emit("opponents_heads_or_tails_choice", heads_or_tails); //broadcasting what the opponent chose
    // heads=0,tails=1
    if (Object.keys(Rooms[room_id].toss).length === 2) {
      console.log("both plyers have made their my_heads_or_tails_choice");
      let randomValue = Math.round(Math.random());
      console.log(`random value generated is ${randomValue}`);
      if (randomValue === 1) {
        for (const [socketid, choice] of Object.entries(Rooms[room_id].toss)) {
          if (choice === "tails") {
            console.log(`${socketid} has won the toss`);
            io.to(socketid).emit("toss result", "won", "tails");
          } else {
            console.log(`${socketid} lose the toss`);
            io.to(socketid).emit("toss result", "lost", "tails");
          }
        }
      } else {
        for (const [socketid, choice] of Object.entries(Rooms[room_id].toss)) {
          if (choice === "heads") {
            console.log(`${socketid} has won the toss`);
            io.to(socketid).emit("toss result", "won", "heads");
          } else {
            console.log(`${socketid} lose the toss`);
            io.to(socketid).emit("toss result", "lost", "heads");
          }
        }
      }
    }
  });

  socket.on("bat_or_bowl choice", (bat_or_bowl, room_id) => {
    console.log("Inside bat_or_bowl ");
    //checking if toss propert exist if it exist then delete it
    if (Rooms[room_id].hasOwnProperty("toss")) {
      delete Rooms[room_id].toss; //deleting toss property from the object
    }

    if (!Rooms[room_id].hasOwnProperty("bat_or_bowl")) {
      //if bat or bowl property does not exist then
      Rooms[room_id].bat_or_bowl = {};
    }
    //the for loop is to create a new property bat_or_bowl which will store what the user is performing now
    for (const [socketid] of Object.entries(Rooms[room_id].users)) {
      // Check if the property is directly on the object, not on the prototype chain
      if (Rooms[room_id].users.hasOwnProperty(socketid)) {
        Rooms[room_id].bat_or_bowl[socketid] = null;
        if (socketid === socket.id) {
          console.log(`The socketid and socket.id is same`);
          Rooms[room_id].bat_or_bowl[socketid] = bat_or_bowl;
        } else {
          console.log(`The socketid and socket.id is different`);
          let opposite = bat_or_bowl === "bat" ? "bowl" : "bat";
          Rooms[room_id].bat_or_bowl[socketid] = opposite;
        }
      }
    }
    console.log(`updated rooms obj ${JSON.stringify(Rooms[room_id])}`);
    for (const [socketid, value] of Object.entries(Rooms[room_id].bat_or_bowl))
      io.to(socketid).emit("bat_or_bowl result", value);
  });

  //the variable is used to store the value sended from the front end
  socket.on("choose value", (targetId, room_id, you_are_currently) => {
    if (you_are_currently == "bat") {
      //entering the value of bat into obj
      Rooms[room_id].bat = targetId;
      console.log(`Value of bat in obj is ${Rooms[room_id].bat}`);
    } else {
      Rooms[room_id].bowl = targetId;
      console.log(`Value of bowl in obj is ${Rooms[room_id].bowl}`);
    }
    if (Rooms[room_id].bat != 0 && Rooms[room_id].bowl != 0) {
      //Recieved value for both bat and bowl so we can start calc and emit the choice os the users

      io.to(room_id).emit(
        "button value of players",
        Rooms[room_id].bat,
        Rooms[room_id].bowl
      );

      console.log(`Got both bat and bowl values`);
      if (Rooms[room_id].bat != Rooms[room_id].bowl) {
        console.log(`Upading scorre since bat and bowl are not same`);
        for (let [socketid, value] of Object.entries(
          Rooms[room_id].bat_or_bowl
        )) {
          if (value === "bat") {
            Rooms[room_id].game[socketid].score += Rooms[room_id].bat;
            console.log(
              `Updating score=${Rooms[room_id].game[socketid].score}`
            );
            io.to(room_id).emit("score", Rooms[room_id].game[socketid].score);
            if (Rooms[room_id].switch_side == true) {
              //checking if score is greater the
              console.log(`${socketid} is batting`);
              if (
                Rooms[room_id].game[socketid].score >
                Rooms[room_id].score_to_beat
              ) {
                console.log(`${Rooms[room_id].game[socketid].score} >
                ${Rooms[room_id].score_to_beat}`);
                finding_largest_sockedid_and_score(Rooms, room_id);
              }
            }
          }
        }
      } else {
        console.log(`Someone is out`);
        if (Rooms[room_id].switch_side == true) {
          // //both had their turn in batting
          // // Initialize variables to store the largest and least scores and their associated socket IDs

          finding_largest_sockedid_and_score(Rooms, room_id);
        } else {
          //One of the person in game didnt have chnce to bat.
          for (const [socketid, value] of Object.entries(
            Rooms[room_id].bat_or_bowl
          )) {
            console.log(`swiching sides(bat to bowl and vise versa)`);
            if (value === "bat") {
              Rooms[room_id].bat_or_bowl[socketid] = "bowl";
              console.log(`changing the ${socketid} to bowl`);
              Rooms[room_id].score_to_beat =
                Rooms[room_id].game[socketid].score; //updating score to beat
            } else {
              Rooms[room_id].bat_or_bowl[socketid] = "bat";
              console.log(`changing the ${socketid} to bat`);
            }
            console.log(
              `After swapping bat and bowl=${Rooms[room_id].bat_or_bowl}`
            );
            io.to(socketid).emit(
              "update you_are_currently",
              Rooms[room_id].bat_or_bowl[socketid]
            );
          }
          Rooms[room_id].switch_side = true; //after switching sides it is changed to false
        }
      }
      Rooms[room_id].bat = 0;
      Rooms[room_id].bowl = 0;
    }
  });

  //didnt think of another name
  function finding_largest_sockedid_and_score(Rooms, room_id) {
    let largestScore = -Infinity;
    let leastScore = Infinity;
    let largestSocketId;
    let leastSocketId;

    // Iterate through the game object
    for (const [socketId, { score }] of Object.entries(Rooms[room_id].game)) {
      if (score > largestScore) {
        largestScore = score; // Update the largest score
        largestSocketId = socketId; // Update the socket ID associated with the largest score
      }
      if (score < leastScore) {
        leastScore = score; // Update the least score
        leastSocketId = socketId; // Update the socket ID associated with the least score
      }
    }
    console.log(
      `Socket ID with the largest score: ${largestSocketId}, Score: ${largestScore},Socket ID with the least score: ${leastSocketId}, Score: ${leastScore}`
    );

    io.to(largestSocketId).emit("final result", largestScore, "win");
    io.to(leastSocketId).emit("final result", leastScore, "lose", largestScore);
  }

  socket.on("Time out", (room_id) => {
    console.log(`Warning +1 for ${socket.id}`);
    let warning = Rooms[room_id].game[socket.id].warning;
    // Rooms[room_id].game[socket.id].warning += 1;
    warning += 1;
    io.to(socket.id).emit(
      "alert",
      `Warning issued for ${Rooms[room_id].users[socket.id]}`
    );
    Rooms[room_id].bat = 0;
    Rooms[room_id].bowl = 0;
    if (warning >= 3) {
      console.log(`Warning exceeded for ${socket.id}`);
      socket
        .to(room_id)
        .emit("won_by_default", "Warning exceeded for opponent you win");
    }
  });

  //webrtc
  socket.on("offer", (offer, room_id) => {
    // Relay offer to the other user in the room
    socket.to(room_id).emit("offer", offer);
  });

  socket.on("answer", (answer, room_id) => {
    // Relay answer to the other user in the room
    socket.to(room_id).emit("answer", answer);
  });

  socket.on("ice candidate", (candidate, room_id) => {
    // Relay ICE candidate to the other user in the room
    socket.to(room_id).emit("ice candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log(
      `${socket.id} player disconnected in room id ${socketRoomMap[socket.id]}`
    );
    io.to(socketRoomMap[socket.id]).emit(
      "won_by_default",
      "Player Disconnected. You win by Default"
    );
  });
});
server.listen(PORT, () =>
  console.log(`Server is up and running on port http://localhost:${PORT}`)
);
