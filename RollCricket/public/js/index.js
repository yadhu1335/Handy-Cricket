const submitbtn = document.getElementById("submitbtn");
const joinbtn = document.getElementById("joinbtn");
const createbtn = document.getElementById("createbtn");
const randbtn = document.getElementById("randbtn");
let room_id;
let username;

const Socket = io();

function uuidv4() {
  return "xxyxyxxyx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

submitbtn.addEventListener("click", function () {
  username = document.getElementById("nameinput").value;
  if (username === "") {
    alert("Enter valid username");
    return;
  }
  console.log(`usernameis ${username}`);
  document.getElementById("game_selection").style.display = "block";
});

joinbtn.addEventListener("click", function () {
  document.getElementById("join_room").style.display = "block";
  const join_room_btn = document.getElementById("join_room_btn");
  join_room_btn.addEventListener("click", function () {
    room_id = document.getElementById("room_id").value;
    console.log(`room id is ${room_id}`);
    Socket.emit("roomlist");
    Socket.on("roomlist", (roomlist) => {
      if (roomlist.includes(room_id)) {
        console.log("roomexist");
        location.href = `../views/room.html?room=${room_id}&username=${username}`;
      } else {
        console.log("room does not exist ");
        alert("enter valid room id");
        // location.href = `../views/room.html?room=${room_id}&username=${username}`;
        //for the time being only!!!Correct it
      }
    });
  });
});

createbtn.addEventListener("click", function () {
  room_id = uuidv4();
  console.log(`room id is ${room_id}`);
  Socket.emit("addroom", room_id);
  location.href = `../views/room.html?room=${room_id}&username=${username}`;
});
