console.log("js working");
let my_socket_id = null;
// Socket.on("my_socket_id",(socket.id))
//getting room id from url
const path = window.location.pathname;
const parts = path.split("/");
const room_id = parts[parts.length - 1];

let you_are_currently = null;
const body = document.body;
const messages_to_user = document.getElementById("messages_to_user");
const insufficient_players = document.getElementById("insufficient_players");
const copy_room_id = document.getElementById("copy_room_id");
const copy_room_id_button = document.getElementById("copy_room_id_button");
const copy_icon = document.getElementById("copy_icon");
const main_part = document.getElementById("main_part");
const choosing_values = document.getElementById("choosing_values");
const heads = document.getElementById("heads");
const tails = document.getElementById("tails");
const opposite_value = {
  heads: "tails",
  tails: "heads",
  bat: "ball",
  ball: "bat",
};
const heads_or_tails_p = document.getElementById("heads_or_tails_p");
let my_heads_or_tails = null;
const starting_toss = document.getElementById("starting_toss");
const toss_result_p = document.getElementById("toss_result_p");
const bat_or_ball_button = document.getElementById("bat_or_ball_button");
const bat = document.getElementById("bat");
const ball = document.getElementById("ball");
const game_part = document.getElementById("game_part");
const you_are = document.getElementById("you_are");
let warning = 0;
const runs = document.getElementById("runs");
const balls = document.getElementById("balls");
let balls_value = 0;
const your_choice = document.getElementById("your_choice");
const opponent_choice = document.getElementById("opponent_choice");
const zero = document.getElementById("0");
const one = document.getElementById("1");
const two = document.getElementById("2");
const three = document.getElementById("3");
const four = document.getElementById("4");
const five = document.getElementById("5");
const six = document.getElementById("6");
const to_win = document.getElementById("to_win");
const game_over = document.getElementById("game_over");

const Socket = io();

Socket.emit("my_socket_id");

Socket.on("my_socket_id", (socket_id) => {
  my_socket_id = socket_id;
  console.log(`my socketid=${my_socket_id},typeof=${typeof my_socket_id}`);
});

Socket.emit("join_room", room_id);
copy_room_id.innerHTML = room_id;

Socket.on("alert", (message, warning_boolean = null) => {
  alert(message);
  if (message === "Error encountered in room...Go back") {
    window.location.href = "http://localhost:5050/";
  }
  if (warning_boolean) {
    //should fill this when we start sending warning to the users
  }
});

copy_room_id_button.addEventListener("click", () => {
  navigator.clipboard
    .writeText(room_id)
    .then(() => {
      console.log("Room ID copied to clipboard: " + room_id);
      setTimeout(() => {
        copy_icon.src = "../image/copy_succesfull_icon.png";
        copy_icon.classList.remove("fade-out");
        copy_icon.classList.add("fade-in");
      }, 100); // Match the duration of the fade-out transition
    })
    .catch((error) => {
      console.error("Error copying to clipboard:", error);
    });
});

Socket.on("start_match", () => {
  console.log(`start match`);
  messages_to_user.removeChild(insufficient_players);
  choosing_values.style.display = "block";
});

heads.addEventListener("click", () => {
  console.log(`choice heads`);
  Socket.emit("heads_or_tails", room_id, "heads");
  enable_disable__button("disabled", heads, tails);
});

tails.addEventListener("click", () => {
  console.log(`choice tails`);
  Socket.emit("heads_or_tails", room_id, "tails");
  enable_disable__button("disabled", heads, tails);
});

Socket.on("heads_or_tails_result", (buffer) => {
  enable_disable__button("disabled", heads, tails);
  console.log(`${JSON.stringify(buffer)}`);
  for (const [socket_id, heads_or_tails] of Object.entries(buffer)) {
    if (socket_id === my_socket_id) {
      my_heads_or_tails = heads_or_tails;
      heads_or_tails_p.innerText = `You chose ${heads_or_tails}`;
      console.log(`you are ${heads_or_tails}`);
      starting_toss.style.display = "block";
    } else {
      my_heads_or_tails = opposite_value[heads_or_tails];
      heads_or_tails_p.innerText = `The opponent chose ${heads_or_tails}. Therefore, you get ${opposite_value[heads_or_tails]}.`;
      console.log(`you are ${opposite_value[heads_or_tails]}`);
      starting_toss.style.display = "block";
    }
  }
});

Socket.on("toss_result", (heads_or_tails) => {
  if (my_heads_or_tails === heads_or_tails) {
    toss_result_p.innerText =
      "Congrats, You have won the Toss. Choose from the folowing";
    bat_or_ball_button.style.display = "flex";
  } else {
    toss_result_p.innerText = "The Toss is in Opponents favour";
  }
});

bat.addEventListener("click", () => {
  you_are_currently = "bat";
  console.log(`ypu are current${you_are_currently}`);
  Socket.emit("bat_or_ball", room_id, "bat");
  enable_disable__button("disabled", bat, ball);
  three_times_in_bat();
});

ball.addEventListener("click", () => {
  you_are_currently = "ball";
  Socket.emit("bat_or_ball", room_id, "ball");
  enable_disable__button("disabled", bat, ball);
  three_times_in_bat();
});

Socket.on("opponent_bat_or_ball", (bat_or_ball) => {
  if (you_are_currently === null) {
    you_are_currently = opposite_value[bat_or_ball];
    three_times_in_bat();
    Socket.emit("bat_or_ball", room_id, opposite_value[bat_or_ball]);
  } else {
    console.log(`you already chose`);
  }
});

Socket.on("switch_sides", (score_to_beat) => {
  console.log(`Switch sides`);
  if (you_are_currently === "bat") {
    you_are_currently = "ball";
    you_are.innerText = "You are currently Bowling";
  } else {
    you_are_currently = "bat";
    you_are.innerText = "You are currently Batting";
  }
  to_win.innerText = `To Win=${score_to_beat}`;
  runs.innerText = `Runs=0`;
  balls.innerText = `Balls=0`;
  balls_value = 0;
  your_choice.innerText = `Your choice=-1`;
  enable_disable__button("enabled", zero, one, two, three, four, five, six);
});

Socket.on("runs_bat_ball", (runs_value, bat, ball) => {
  console.log(`Runs=${runs_value}`);
  runs.innerText = `Runs=${runs_value}`;
  ++balls_value;
  balls.innerText = `Balls=${balls_value}`;
  if (you_are_currently === "bat") {
    console.log(`opp=${ball}`);
    opponent_choice.innerText = `Opponents choice=${ball}`;
  } else {
    console.log(`opp=${bat}`);
    opponent_choice.innerText = `Opponents choice=${bat}`;
  }
  enable_disable__button("enabled", zero, one, two, three, four, five, six);
});

Socket.on("game_over", (winner) => {
  main_part.classList.add("blur");
  game_over.style.display = "flex";
  console.log(`winner=${winner}`);
  switch (winner) {
    case "bat_win":
      if (you_are_currently === "bat") {
        createTag("img", "", game_over, "won_img");
        document.getElementById("won_img").src = `../image/won_img.png`;
        // createTag("p", "You WON!!", game_over, p_won);
        alert("you win");
      } else {
        createTag("img", "", game_over, "lost_img");
        document.getElementById("lost_img").src = `../image/lost_img.png`;
        // createTag("p", "You lost", game_over, p_lost);
        alert("you lose");
      }
      break;
    case "ball_win":
      if (you_are_currently === "ball") {
        createTag("img", "", game_over, "won_img");
        document.getElementById("won_img").src = `../image/won_img.png`;
        // createTag("p", "You WON!!", game_over, "p_won");
        alert("you win");
      } else {
        createTag("img", "", game_over, "lost_img");
        document.getElementById("lost_img").src = `../image/lost_img.png`;
        // createTag("p", "You lost", game_over, "p_lost");
        alert("you lose");
      }
      break;
    default:
      alert("Draw");
  }
});

Socket.on("won_by_default", (message) => {
  console.log(`${message}`);
  alert(`${message}`);
  window.location.href = "http://localhost:5050/";
});
// functions
function enable_disable__button(enable_or_disable, ...buttons) {
  console.log(`disabling these buttons ${buttons}`);
  if (enable_or_disable == "disabled") {
    buttons.forEach((button) => {
      button.style.cursor = "not-allowed";
      button.disabled = true;
    });
  } else {
    buttons.forEach((button) => {
      button.style.cursor = "pointer";
      button.disabled = false;
    });
  }
}

//function to add tags to html
//eg: createTag("<tag like button,p,h1-6 etc>", "msg u want to display", div where you want to place the tag, "id for the tag(not necessary)");
function createTag(tagname, message, parentDiv, id = null, className = null) {
  const tag = document.createElement(tagname);
  tag.textContent = message;
  if (id) {
    tag.id = id;
  }
  if (className) {
    tag.className = className;
  }
  parentDiv.appendChild(tag);
}

//couldnt name it properly
function three_times_in_bat() {
  createTag(
    "p",
    `You are currently=${you_are_currently}`,
    choosing_values,
    "you_are_currently_p"
  );

  createTag("p", `Loading Game...`, choosing_values, "loading");
  choosing_values.style.display = "none";
  game_part.style.display = "block";
  if (you_are_currently === "bat") {
    you_are.innerText = `You are currently Batting`;
  } else {
    you_are.innerText = `You are currently Bowling`;
  }
  runs.innerText = `Runs:0`;
  balls.innerText = `Balls:0`;
}

function values(value) {
  console.log(`value=${value}`);
  opponent_choice.innerText = `Opponents choice=-1`;
  enable_disable__button("disabled", zero, one, two, three, four, five, six);
  your_choice.innerText = `Your choice=${value}`;
  Socket.emit("value", value, you_are_currently, room_id);
}
