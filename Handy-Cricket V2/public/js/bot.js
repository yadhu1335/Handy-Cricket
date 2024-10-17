console.log(`js working`);
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
const computer_choice = document.getElementById("computer_choice");
const zero = document.getElementById("0");
const one = document.getElementById("1");
const two = document.getElementById("2");
const three = document.getElementById("3");
const four = document.getElementById("4");
const five = document.getElementById("5");
const six = document.getElementById("6");
const to_win = document.getElementById("to_win");
const game_over = document.getElementById("game_over");

let runs_val = 0;
let score_to_win = -1;
let balls_val = 0;

heads.addEventListener("click", async () => {
  console.log(`choice heads`);
  heads_or_tails_p.innerText = `You chose Heads`;
  enable_disable__button("disabled", heads, tails);
  starting_toss.style.display = "block";
  const toss1 = toss(2);
  console.log(`toss1=${toss1}`);
  if (toss1 === 0) {
    console.log(`ur side`);
    bat_or_ball_button.style.display = "flex";
  } else {
    //comp will choose

    toss_result_p.innerText = "The Computer won the Toss";
    console.log(`computer won the toss`);
    const toss2 = toss(2);
    console.log(`toss2=${toss2}`);
    if (toss2 === 0) {
      console.log(`comp choose bat`);
      you_are_currently = "ball";
      you_are.innerText = `You are currently Bowling`;
      console.log(`you are currently ${you_are_currently}`);
    } else {
      console.log(`comp  choose bowl`);
      you_are_currently = "bat";
      you_are.innerText = `You are currently Batting`;
      console.log(`you are currently ${you_are_currently}`);
    }
    await delay(7000);
    choosing_values.style.display = "none";
    runs.innerText = `Runs:0`;
    balls.innerText = `Balls:0`;
    game_part.style.display = "block";
  }
});

tails.addEventListener("click", async () => {
  console.log(`choice tails`);
  heads_or_tails_p.innerText = `You chose Tails`;
  enable_disable__button("disabled", heads, tails);
  const toss1 = toss(2);
  if (toss1 === 1) {
    console.log(`ur side`);
    bat_or_ball_button.style.display = "flex";
  } else {
    toss_result_p.innerText = "The Computer won the Toss";
    console.log(`computer won the toss`);
    const toss2 = toss(2);
    console.log(`toss2=${toss2}`);
    if (toss2 === 0) {
      console.log(`comp choose bat`);
      you_are_currently = "ball";
      you_are.innerText = `You are currently Bowling`;
      console.log(`you are currently ${you_are_currently}`);
    } else {
      console.log(`comp  choose bowl`);
      you_are_currently = "bat";
      you_are.innerText = `You are currently Batting`;
      console.log(`you are currently ${you_are_currently}`);
    }
    await delay(7000);
    choosing_values.style.display = "none";
    runs.innerText = `Runs:0`;
    balls.innerText = `Balls:0`;
    game_part.style.display = "block";
  }
});

bat.addEventListener("click", () => {
  you_are_currently = "bat";
  console.log(`ypu are current${you_are_currently}`);
  enable_disable__button("disabled", bat, ball);
  three_times_in_bat();
  game_part.style.display = "block";
});

ball.addEventListener("click", () => {
  you_are_currently = "ball";
  console.log(`ypu are current${you_are_currently}`);
  enable_disable__button("disabled", bat, ball);
  three_times_in_bat();
  game_part.style.display = "block";
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

function toss(limit) {
  console.log(`limit=${limit}`);
  const random_value = Math.floor(Math.random() * limit); //0=heads 1=tails
  console.log(`Random vaue=${random_value}`);
  return random_value;
}

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
  // console.log(`runs in hml`);
  balls.innerText = `Balls:0`;
}

function values(value) {
  console.log(`value=${value}`);
  // computer_choice.innerText = `Opponents choice=-1`;
  enable_disable__button("disabled", zero, one, two, three, four, five, six);
  your_choice.innerText = `Your choice=${value}`;
  const computer_value1 = computer_value(); //i know the names are same in any issue change the names
  console.log(`computer_value1=${computer_value1}`);
  computer_choice.innerText = `Computers choice=${computer_value1}`;

  //checking if out or not
  if (value === computer_value1) {
    console.log(`inside first if`);
    console.log("out");
    alert(`out`); //remve this
    if (score_to_win != -1) {
      console.log(`game ovr`);
      alert("game0ver"); //remove thsi
      main_part.classList.add("blur");
      game_over.style.display = "flex";
      if (you_are_currently === "bat") {
        createTag("img", "", game_over, "lost_img");
        document.getElementById("lost_img").src = `../image/lost_img.png`;
        // createTag("p", "You lost", game_over, p_lost);
        alert("you lose");
      } else {
        createTag("img", "", game_over, "won_img");
        document.getElementById("won_img").src = `../image/won_img.png`;
        // createTag("p", "You WON!!", game_over, p_won);
        alert("you win");
      }
    } else {
      runs_val += 1;
      score_to_win = runs_val;
      to_win.innerText = `To win=${runs_val}`;
      you_are_currently = opposite_value[you_are_currently];
      console.log(`you are currently=${you_are_currently}`);
      you_are.innerText = `You are currrently ${you_are_currently}`;
      runs_val = 0;
      balls_val = 0;
      runs.innerText = `Runs:0`;
      balls.innerText = `Balls:0`;

      your_choice.innerText = `Your choice=-1`;
      computer_choice.innerText = `Computer choice=-1`;
      enable_disable__button("enabled", zero, one, two, three, four, five, six);
    }
  } else {
    console.log(`inside else`);
    balls_val += 1;
    console.log(`ballsval=${balls_val}`);
    balls.innerText = `Balls=${balls_val}`;
    if (you_are_currently === "bat") {
      console.log(`u+runs_val`);
      runs_val += value;
    } else {
      console.log(`computer+runs_val`);
      runs_val += computer_value1;
    }
    runs.innerText = `Runs:${runs_val}`;
    enable_disable__button("enabled", zero, one, two, three, four, five, six);
    if (score_to_win != -1) {
      console.log(`last stage`);
      if (runs_val >= score_to_win) {
        console.log(`game ovr`);
        main_part.classList.add("blur");
        game_over.style.display = "flex";
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
      }
    }
  }
}

function computer_value() {
  const toss3 = toss(7); //random val from 0 to 7
  console.log(`Computer choice=${toss3}`);
  return toss3;
}

// Function to create a delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
