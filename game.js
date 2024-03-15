//code from index.js
// let batorbowl = "bat";
let batorbowl = "bowling";
// console.log("batorbowl set to bat explicitly");
console.log("batorbowl set to bowl explicitly");

// let youare = "bat";
let youare = "bowling";

let bat = youare == "bat" ? true : false;
let bowl = bat == true ? false : true;

let ch = ["1", "2", "3", "4", "5", "6"]; //choice for battobowl
// let out = false;

// let prevsel = [];
let score = 1;
function play(val) {
  int_val = parseInt(val);
  console.log("user input:" + int_val);
  if (youare == "bat") {
    //function bat to bowl
    //if bat == true then user is batting else he is balling
    if (bat == true) {
      //user is batting
      const random = ch[Math.floor(Math.random() * 6)];
      console.log("COMPUTERS CHOICE=" + random);
      if (val == random) {
        console.log("YOU ARE OUT");
        console.log("SCORE to win=" + score);
        bat = false;
      } else score = score + int_val;
      console.log("CURRENT SCORE=" + score);
    } else {
      // user is bowling
      console.log("You are now bowling");

      if (score > 0) {
        const random = ch[Math.floor(Math.random() * 6)];
        console.log("COMPUTERS CHOICE(bowl)=" + random);

        if (val == random) {
          console.log("you win");
          alert("YOU WIN!!");
          document.querySelectorAll(".game-button").forEach((button) => {
            button.disabled = true;
          });
          return;
        } else {
          if (score > int_val) {
            score = score - parseInt(random);
          } else {
            score = parseInt(random) - score;
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
        return;
      }
    }
  } else {
    if (bowl) {
      const random = ch[Math.floor(Math.random() * 6)];
      console.log("COMPUTERS CHOICE=" + random);
      if (val == random) {
        console.log("COMPUTR IS OUT");
        // score += 1;
        console.log("SCORE to win=" + score);
        bowl = false;
        bat = true;
      } else score = score + parseInt(random);
      console.log("CURRENT SCORE=" + score);
    } else {
      if (score > 0) {
        const random = ch[Math.floor(Math.random() * 6)];
        console.log("COMPUTERS CHOICE(bat)=" + random);

        if (val == random) {
          console.log("you are out, YOU LOOSE");
          alert("YOU ARE OUT!!");
          document.querySelectorAll(".game-button").forEach((button) => {
            button.disabled = true;
          });
          return;
        } else {
          if (score > int_val) {
            // score = score - parseInt(random);
            score = score - int_val;
          } else {
            // score = parseInt(random) - score;
            score = int_val - score;
          }
          console.log("SCORE to win(ball)=" + score);
        }
      }
      if (score <= 0) {
        console.log("You WINN");
        alert("YOU WINN!!");
        console.log("score=" + score);
        document.querySelectorAll(".game-button").forEach((button) => {
          button.disabled = true;
        });
        return;
      }
    }
  }
}

// let leastpredict;
// let prediction;

//user goes from bat to bowl
// function battobowl(val) {
//   while (prevsel.length < 4) {
//     console.log("length of prevsel=" + prevsel.length);
//     //while the length of array is less than 4. It chooses a random number from  0-5 and pushes it into the prevsel array.
//     if (ch[Math.floor(Math.random() * 6)] == val) {
//       console.log("OUT");
//       // alert("OUT!!");
//       out = true;
//     } else score += val;
//     prevsel.push(val);
//   }
//   //if prev.lengh > 3
//   while (out == false) {
//     // let prediction = predict(prevsel);
//     prediction = predict(prevsel); //computers prediction
//     console.log("computer prediction=" + prediction);

//     if (prediction == val) {
//       console.log("OUT");
//       // alert("OUT!!");
//       out = true;
//     } else score += val;
//     prevsel.push(val);
//   }
//   //bowling
//   // let leastpredict = predictLeast(prevsel);
//   console.log("Switching to bowling");
//   while (score > 0) {
//     leastpredict = predictLeast(prevsel);
//     console.log("Least predict(for bowling)=" + leastpredict);
//     if (val !== leastpredict) {
//       score = score - val;
//     } else {
//       // alert("YOU WON!!!");
//       console.log("You won!");
//       return;
//     }
//   }
//   console.log("YOU LOOSE!!! THE COMPUTER BEAT YOUR SCORE");
// }

// function predict(prevsel) {
//   // Frequency of each choice in the previous selections
//   const freq = {};
//   ch.forEach((c) => {
//     freq[c] = 0;
//   });
//   prevsel.forEach((c) => {
//     freq[c]++;
//   });

//   // Find the choice with the highest frequency
//   let maxFreq = -Infinity;
//   let mostChoice = null;
//   for (let key in freq) {
//     if (freq[key] > maxFreq) {
//       maxFreq = freq[key];
//       mostChoice = key;
//     }
//   }

//   return mostChoice;
// }

// function predictLeast(prevsel) {
//   // Frequency of each choice in the previous selections
//   const freq = {};
//   ch.forEach((c) => {
//     freq[c] = 0;
//   });
//   prevsel.forEach((c) => {
//     freq[c]++;
//   });

//   // Find the choice with the lowest frequency
//   let leastFreq = Infinity;
//   let leastChoice = null;
//   for (let key in freq) {
//     if (freq[key] < leastFreq) {
//       leastFreq = freq[key];
//       leastChoice = key;
//     }
//   }

//   return leastChoice;
// }
