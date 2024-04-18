const socket = io();
let your_choice_in_toss; // this is renamed to "heads_or_tails_button"
// let opposition_choice_in_toss;
let mySocketID;
let you_are_currently;
// Getting my socketId from front end
socket.on("socketid", (mySocketID) => {
  mySocketID = mySocketID;
  console.log(`my socket id is ${mySocketID}`);
});
let prevScore = 0;
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

    createTag(
      "p",
      `opposition chose ${opposition_choice_in_toss}`,
      toss_choice_parentDiv
    );

    // Disable the buttons
    if (heads_or_tails == "heads") {
      document.getElementById("heads").disabled = true;
    } else {
      document.getElementById("tails").disabled = true;
    }
  });

  //function to add tags to html
  function createTag(tagname, message, parentDiv, id = null) {
    const tag = document.createElement(tagname);
    tag.textContent = message;
    if (id) {
      tag.id = id;
    }
    parentDiv.appendChild(tag);
  }
  const Game_area = document.getElementById("Game_Area");
  socket.on("toss result", (lose_or_win, toss_favor) => {
    if (lose_or_win === "won") {
      console.log(`You won the toss... the toss is in favour of ${toss_favor}`);
      createTag(
        "p",
        `Congrats!!! The Toss is in favour of ${toss_favor}`,
        toss_choice_parentDiv
      ); //displaying that they have won the toss
      createTag("button", "Bat", Game_area, "bat"); //creating button for "BAT"
      createTag("button", "Bowl", Game_area, "bowl"); //creating button for "BOWL"

      document.getElementById("bat").addEventListener("click", function () {
        socket.emit("bat_or_bowl choice", "bat", room_id);
        console.log(`You chose to bat`);
        document.getElementById("bat").disabled = true;
        document.getElementById("bowl").disabled = true;
      });

      document.getElementById("bowl").addEventListener("click", function () {
        socket.emit("bat_or_bowl choice", "bowl", room_id);
        console.log(`You chose to bowl`);
        document.getElementById("bat").disabled = true;
        document.getElementById("bowl").disabled = true;
      });
    } else {
      console.log(
        `You lost the toss... the toss is in favour of ${toss_favor}`
      );
      createTag(
        "p",
        `Sorry!!! The Toss is in favour of ${toss_favor}`,
        toss_choice_parentDiv
      ); //displaying that they have lost the toss
    }
  });

  socket.on("bat_or_bowl result", (value) => {
    you_are_currently = value; //value will be either bat or bowl.
    createTag("h4", `You got to ${value}`, Game_area, "you_are_currently");
    document.getElementById("choose_value").style.display = "block";
  });

  document
    .getElementById("choose_value")
    .addEventListener("click", function (event) {
      if (event.target.tagName === "BUTTON") {
        const targetId = event.target.id;
        console.log(`${targetId} has been pressed`);
        socket.emit(
          "choose value",
          parseInt(targetId),
          room_id,
          you_are_currently
        );
      }
      disable_enable_Buttons("disable");
    });

  function disable_enable_Buttons(enable_or_disable) {
    //value for enable_or_disable is either "enable" or "disable";
    if (enable_or_disable === "disable") {
      console.log(`disabling buttons`);
      for (let i = 1; i <= 6; i++) {
        document.getElementById(i + "").disabled = true;
      }
    }

    if (enable_or_disable === "enable") {
      console.log(`enabling buttons`);
      for (let i = 1; i <= 6; i++) {
        document.getElementById(i + "").disabled = false;
      }
    }
  }

  socket.on("update you_are_currently", (value) => {
    document.getElementById("score").innerText = `score=${0}`;
    if (value === "bat") {
      document.getElementById(
        "prevScore"
      ).innerHTML = `score to beat is ${prevScore}`;
    } else {
      document.getElementById(
        "prevScore"
      ).innerText = `Your score=${prevScore}`;
    }
    console.log(`Changing sides...signal from server `);
    document.getElementById("you_are_currently").style.display = "none";
    createTag(
      "h4",
      `Switching sides.....You are now ${value}ing`,
      Game_area,
      "you_are_currently_updated"
    );
    alert("switching sides");
    disable_enable_Buttons("enable");
    //code for enabling value buttons(1 to 6)
    you_are_currently = value;
  });

  socket.on("score", (score) => {
    document.getElementById("score").innerText = `score=${score}`;
    prevScore = score;
    disable_enable_Buttons("enable");
  });

  socket.on("final result", (score, win_or_loose, largestScore) => {
    disable_enable_Buttons("disable");
    let final_resut_div = document.getElementById("final result");
    if (win_or_loose === "win") {
      createTag("h3", "Congrats!! You win the game", final_resut_div);
      createTag("h3", `Score=${score}`, final_resut_div);
      console.log(`You win`);
      createTag("button", "Go Back", final_resut_div, "go_back_btn");
    } else {
      createTag("h3", "Sorry!! You loose the game", final_resut_div);
      createTag(
        "h3",
        `Your score=${score} , u lost by ${score - largestScore}`,
        final_resut_div
      );
      console.log(`you loose`);
      createTag("button", "Go Back", final_resut_div, "go_back_btn");
    }

    document.getElementById("go_back_btn").addEventListener("click", () => {
      location.href = `../views/index.html`;
    });
  });
});
