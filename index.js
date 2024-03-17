let userselection = null;

function oddeven(val) {
  userselection = val; //storing if user chose odd or even
  console.log(userselection);
  document.getElementById("OEchoice").innerText = userselection;

  //   Disabling the buttons after the user selects one
  document.getElementById("odd").disabled = true;
  document.getElementById("even").disabled = true;

  //   showing the tossing option
  document.getElementById("cointoss").style.display = "block";
}

let batorbowl = null;
let computerchoice = null;

let youare = null; //for the file in game.js

function check() {
  let bbchoice = ["bat", "bowling"];
  const toss = Math.floor(Math.random() * 2); //0 or 1
  console.log(toss);

  let val = null; //stores result of the toss
  if (toss == 0) val = "even";
  else val = "odd";
  console.log("tossval=" + val);
  document.getElementById("cointossresult").innerText = val;
  document.getElementById("Coin").disabled = true;

  if (val === userselection) {
    document.getElementById("usercorrect").style.display = "block";
    //finsing out what the user chose bat or bowl. Needs work done
    document.getElementById("bat").addEventListener("click", function () {
      document.getElementById("userchoice").innerText = "batting";
      batorbowl = "bat";
      document.getElementById("bat").disabled = true;
      document.getElementById("bowl").disabled = true;

      youare = "bat"; //for currently tag and ....
      console.log("you are now " + youare);
      document.getElementById("currently").innerText = youare;
      document.getElementById("game").style.display = "block";
    });

    document.getElementById("bowl").addEventListener("click", function () {
      document.getElementById("userchoice").innerText = "bowling";
      batorbowl = "bowling";
      //disabling the buttons after selection
      document.getElementById("bat").disabled = true;
      document.getElementById("bowl").disabled = true;

      youare = "bowling";
      console.log("you are now " + youare);
      document.getElementById("currently").innerText = youare;
      document.getElementById("game").style.display = "block";
    });
    console.log(batorbowl);
  } else {
    batorbowl = bbchoice[Math.floor(Math.random() * 2)];
    console.log("batorbowl=" + batorbowl);
    //disabling the buttons after selection
    document.getElementById("compcorrect").style.display = "block";
    document.getElementById("computerchoice").innerText = batorbowl;
    computerchoice = true;

    youare = batorbowl == "bat" ? "bowling" : "bat";
    console.log("you are now " + youare);
    document.getElementById("currently").innerText = youare;
    document.getElementById("game").style.display = "block";
  }
  // document.getElementById("nextpage").disabled = false;

  // document.getElementById("currently").innerText = youare;
}

// game.js

// let bat = youare === "bat" ? true : false;
// let bowl = bat == true ? false : true;
// let lowercaseyouare = youare.toLowerCase();

// let bat = lowercaseyouare === "bat" ? true : false;
// let bowl = bat == true ? false : true;

let ch = ["1", "2", "3", "4", "5", "6"]; //choice for battobowl

let score = 1;

function batbowlinit() {
  let lowercaseyouare = youare.toLowerCase();
  let bat = lowercaseyouare === "bat" ? true : false;
  let bowl = bat == true ? false : true;
}
batbowlinit();
function play(val) {
  console.log("youaree in play()" + youare + " type of= " + typeof youare);
  int_val = parseInt(val);
  console.log("user input:" + int_val);
  document.getElementById("player_choice").innerText = int_val;

  if (youare === "bat") {
    //function bat to bowl
    //if bat == true then user is batting else he is balling
    console.log("bat=" + bat);
    if (bat) {
      //user is batting
      const random = ch[Math.floor(Math.random() * 6)];
      console.log("COMPUTERS CHOICE=" + random);
      document.getElementById("computer_choice").innerText = random;

      if (val == random) {
        console.log("YOU ARE OUT");
        alert("SWITCHING SIDES!!!YOU ARE OUT");
        console.log("SCORE to win=" + score);
        document.getElementById("score").innerText = score;
        bat = false;
      } else {
        score = score + int_val;
        document.getElementById("score").innerText = score;
      }
      console.log("CURRENT SCORE=" + score);
    } else {
      // user is bowling
      console.log("You are now bowling");

      if (score > 0) {
        const random = ch[Math.floor(Math.random() * 6)];
        console.log("COMPUTERS CHOICE(bowl)=" + random);
        document.getElementById("computer_choice").innerText = random;

        if (val == random) {
          console.log("you win");
          alert("YOU WIN!!");
          document.querySelectorAll(".game-button").forEach((button) => {
            button.disabled = true;
          });
          // return;
        } else {
          if (score > parseInt(random)) {
            score = score - parseInt(random);
            document.getElementById("score").innerText = score;
          } else {
            // score = parseInt(random) - score;
            score = 0;
            document.getElementById("score").innerText = score;
          }
          console.log("SCORE to win(ball)=" + score);
        }
      }

      if (score <= 0) {
        console.log("You loose");
        alert("YOU LOOSE!!");
        console.log("score=" + score);
        document.querySelectorAll(".game-button").forEach((button) => {
          button.disabled = true;
        });
        // return;
      }
    }
  } else {
    if (bowl) {
      const random = ch[Math.floor(Math.random() * 6)];
      console.log("COMPUTERS CHOICE=" + random);
      document.getElementById("computer_choice").innerText = random;

      if (val == random) {
        console.log("COMPUTR IS OUT");
        // score += 1;
        alert("Switching SIDES.Computer is OUT");
        console.log("SCORE to win=" + score);
        document.getElementById("score").innerText = score;

        bowl = false;
        bat = true;
      } else {
        score = score + parseInt(random);
        document.getElementById("score").innerText = score;
      }
      console.log("CURRENT SCORE=" + score);
    } else {
      if (score > 0) {
        const random = ch[Math.floor(Math.random() * 6)];
        console.log("COMPUTERS CHOICE aganist you=" + random);
        document.getElementById("computer_choice").innerText = random;

        if (val == random) {
          console.log("you are out, YOU LOOSE");
          alert("YOU ARE OUT!!YOU LOOSE");
          document.querySelectorAll(".game-button").forEach((button) => {
            button.disabled = true;
          });
          // return;
        } else {
          if (score > int_val) {
            score = score - int_val;
            document.getElementById("score").innerText = score;
          } else {
            score = 0;
            document.getElementById("score").innerText = score;
          }
          console.log("SCORE to win(ball)=" + score);
        }
      }
      if (score <= 0) {
        console.log("You WINN");
        alert("YOU WINN!!");
        console.log("score=" + score);
        document.getElementById("score").innerText = score;

        document.querySelectorAll(".game-button").forEach((button) => {
          button.disabled = true;
        });
        // return;
      }
    }
  }
}
