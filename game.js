// let youare = "bat";

// let batorbowl=""
// let youare = "bowling";

let bat = youare == "bat" ? true : false;
let bowl = bat == true ? false : true;

let ch = ["1", "2", "3", "4", "5", "6"]; //choice for battobowl

let score = 1;
// function play(val) {
//   int_val = parseInt(val);
//   console.log("user input:" + int_val);
//   if (youare == "bat") {
//     //function bat to bowl
//     //if bat == true then user is batting else he is balling
//     if (bat) {
//       //user is batting
//       const random = ch[Math.floor(Math.random() * 6)];
//       console.log("COMPUTERS CHOICE=" + random);
//       if (val == random) {
//         console.log("YOU ARE OUT");
//         console.log("SCORE to win=" + score);
//         bat = false;
//         bowl = true;
//       } else score = score + int_val;
//       console.log("CURRENT SCORE=" + score);
//     } else {
//       // user is bowling
//       console.log("You are now bowling");

//       if (score > 0) {
//         const random = ch[Math.floor(Math.random() * 6)];
//         console.log("COMPUTERS CHOICE(bowl)=" + random);

//         if (val == random) {
//           console.log("you win");
//           alert("YOU WIN!!");
//           document.querySelectorAll(".game-button").forEach((button) => {
//             button.disabled = true;
//           });
//           return;
//         } else {
//           if (score > int_val) {
//             score = score - parseInt(random);
//           } else {
//             score = parseInt(random) - score;
//           }
//           console.log("SCORE to win(ball)=" + score);
//         }
//       }

//       if (score <= 0) {
//         console.log("You loose");
//         alert("YOU LOOSE!!");
//         console.log("score=" + score);
//         document.querySelectorAll(".game-button").forEach((button) => {
//           button.disabled = true;
//         });
//         return;
//       }
//     }
//   } else {
//     if (bowl) {
//       const random = ch[Math.floor(Math.random() * 6)];
//       console.log("COMPUTERS CHOICE=" + random);
//       if (val == random) {
//         console.log("COMPUTR IS OUT");
//         // score += 1;
//         console.log("SCORE to win=" + score);
//         bowl = false;
//         bat = true;
//       } else score = score + parseInt(random);
//       console.log("CURRENT SCORE=" + score);
//     } else {
//       if (score > 0) {
//         const random = ch[Math.floor(Math.random() * 6)];
//         console.log("COMPUTERS CHOICE(bat)=" + random);

//         if (val == random) {
//           console.log("you are out, YOU LOOSE");
//           alert("YOU ARE OUT!!");
//           document.querySelectorAll(".game-button").forEach((button) => {
//             button.disabled = true;
//           });
//           return;
//         } else {
//           if (score > int_val) {
//             // score = score - parseInt(random);
//             score = score - int_val;
//           } else {
//             // score = parseInt(random) - score;
//             score = int_val - score;
//           }
//           console.log("SCORE to win(ball)=" + score);
//         }
//       }
//       if (score <= 0) {
//         console.log("You WINN");
//         alert("YOU WINN!!");
//         console.log("score=" + score);
//         document.querySelectorAll(".game-button").forEach((button) => {
//           button.disabled = true;
//         });
//         return;
//       }
//     }
//   }
// }
function play(val) {
  int_val = parseInt(val);
  console.log("user input:" + int_val);
  document.getElementById("player_choice").innerText = int_val;

  if (youare == "bat") {
    //function bat to bowl
    //if bat == true then user is batting else he is balling
    if (bat == true) {
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
          if (score > int_val) {
            score = score - parseInt(random);
            document.getElementById("score").innerText = score;
          } else {
            score = parseInt(random) - score;
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
          alert("YOU ARE OUT!!");
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
