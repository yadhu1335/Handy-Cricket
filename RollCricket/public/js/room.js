const socket = io();
let your_choice_in_toss; // this is renamed to "heads_or_tails_button"
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
  //       socket.emit("my_heads_or_tails_choice", buttonID, room_id);

  //       console.log(`${username} choose ${buttonID}`);
  //       // Disable the buttons
  //       document.getElementById("heads").disabled = true;
  //       document.getElementById("tails").disabled = true;
  //     }
  //   });
  const toss_choice_parentDiv = document.getElementById("choice"); //parent div called choice which will dispaly your choice and opponents choice
  let heads_or_tails_btn; //My choice in heads or tails
  const heads = document.getElementById("heads");
  const tails = document.getElementById("tails");
  heads.addEventListener("click", function () {
    heads_or_tails_btn = "heads";
    print_your_choice(heads_or_tails_btn);
    console.log(`${username} chose Heads`);
    heads.disabled = true;
    tails.disabled = true;
    socket.emit("my_heads_or_tails_choice", "heads", room_id);
    document.createElement("p").textContent = "u chose heads";
  });

  tails.addEventListener("click", function () {
    heads_or_tails_btn = "tails";
    print_your_choice(heads_or_tails_btn);
    console.log(`${username} chose Tails`);
    heads.disabled = true;
    tails.disabled = true;
    socket.emit("my_heads_or_tails_choice", "tails", room_id);
    document.createElement("p").textContent = "u chose tails";
  });

  function print_your_choice(heads_or_tails_btn) {
    const your_choice_pTag = document.createElement("p");
    your_choice_pTag.textContent = `You chose ${heads_or_tails_btn}`;
    toss_choice_parentDiv.appendChild(your_choice_pTag);
  }

  socket.on("opponents_heads_or_tails_choice", (heads_or_tails) => {
    let opposition_choice_in_toss = heads_or_tails;
    console.log(`opposition choose ${heads_or_tails}`);

    // Create a p tag for the opponent choice
    const opponent_choice_pTag = document.createElement("p");
    opponent_choice_pTag.textContent = `opposition chose ${opposition_choice_in_toss}`;
    toss_choice_parentDiv.appendChild(opponent_choice_pTag);

    // Disable the buttons
    if (heads_or_tails == "heads") {
      document.getElementById("heads").disabled = true;
    } else {
      document.getElementById("tails").disabled = true;
    }
  });

  function appendtag(tagname, message, parentDiv) {}

  socket.on("toss result", (loose_or_win, toss_favor) => {
    if (loose_or_win === "won") {
    }
  });
});
