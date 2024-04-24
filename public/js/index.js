const submitbtn = document.getElementById("submitbtn");
const joinbtn = document.getElementById("joinbtn");
const createbtn = document.getElementById("createbtn");
const randbtn = document.getElementById("randbtn");
const botbtn = document.getElementById("botbtn");
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

randbtn.addEventListener("click", () => {
  randbtn.disabled = true;
  console.log(`Searching for rooms`);
  Socket.emit("random_lobby");
  // document
  //   .getElementById("searching_div")
  //   .appendChild((document.createElement("p").textContent = "Searching..."));
  const pElement = document.createElement("p");
  pElement.textContent = "Searching...";
  document.getElementById("searching_div").appendChild(pElement);

  function updateEllipsis() {
    const currentText = pElement.textContent;
    pElement.textContent = currentText.endsWith("...")
      ? "Searching"
      : currentText + ".";
  }

  // Start updating ellipsis dynamically
  const ellipsisInterval = setInterval(updateEllipsis, 500);

  // Stop updating ellipsis when the room is assigned
  Socket.on("assign_room_id", () => {
    clearInterval(ellipsisInterval);
    document.getElementById("searching_div").style.display = "none";
  });

  Socket.on("assign_room_id", (room_id) => {
    location.href = `../views/room.html?room=${room_id}&username=${username}`;
  });
});

botbtn.addEventListener("click", function () {
  location.href = `../views/bot.html`;
});

let show_rules = false; //to toggle block and none for the below event
document.getElementById("how_to_play_btn").addEventListener("click", () => {
  show_rules = !show_rules;
  if (show_rules)
    document.getElementById("how_to_play").style.display = "block";
  else document.getElementById("how_to_play").style.display = "none";
});
