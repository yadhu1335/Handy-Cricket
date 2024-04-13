const socket = io();
let your_choice_in_toss;
// let opposition_choice_in_toss;
let mySocketID;

// Get the URL search parameters
const params = new URLSearchParams(window.location.search);
// Get the value of roomid from the URL
const room_id = params.get("room");
// Get the value of username from the URL
const username = params.get("username");
console.log(`your useranme is ${username} and room id is ${room_id}`);

socket.emit("joinroom", room_id, username);

// should improve this
socket.on("alert", (message) => {
  alert(message);
  //   if (message === "Room is full")
  //   location.href = "../views/index.js";
});
// let buttonID;
socket.on("start match", () => {
  //   document.getElementById("players").innerText=`${} vs ${}`
  console.log("server gave signal to start the match");
  document.getElementById("match").style.display = "block";
  document.getElementById("insufficient_players").style.display = "none";

  // document.getElementById("heads_or_tails").addEventListener("click", function (event) {
  //     if (event.target.tagName === "BUTTON") {
  //       let buttonID = event.target.id;
  //       your_choice_in_toss = buttonID;
  //       socket.emit("toss choice", buttonID, room_id);

  //       console.log(`${username} choose ${buttonID}`);
  //       // Disable the buttons
  //       document.getElementById("heads").disabled = true;
  //       document.getElementById("tails").disabled = true;
  //     }
  //   });
  let heads_or_tails_btn;
  const heads = document.getElementById("heads");
  const tails = document.getElementById("tails");
  heads.addEventListener("click", function () {
    heads_or_tails_btn = "heads";
    console.log(`${username} chose Heads`);
    heads.disabled = true;
    tails.disabled = true;
    socket.emit("toss choice", "heads", room_id);
    document.createElement("p").textContent = "u chose heads";
  });

  tails.addEventListener("click", function () {
    heads_or_tails_btn = "tails";
    console.log(`${username} chose Tails`);
    heads.disabled = true;
    tails.disabled = true;
    socket.emit("toss choice", "tails", room_id);
    document.createElement("p").textContent = "u chose tails";
  });

  // socket.emit("toss", buttonID, room_id);

  socket.on("toss result", (heads_or_tails) => {
    let opposition_choice_in_toss = heads_or_tails;
    console.log(`opposition choose ${heads_or_tails}`);
    document.createElement(
      "p"
    ).textContent = `opposition chose ${opposition_choice_in_toss}`;

    // Disable the buttons
    if (heads_or_tails == "heads") {
      document.getElementById("heads").disabled = true;
    } else {
      document.getElementById("tails").disabled = true;
    }
  });
});
