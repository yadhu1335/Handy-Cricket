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
  bbchoice = ["bat", "bowling"];
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
    });

    document.getElementById("bowl").addEventListener("click", function () {
      document.getElementById("userchoice").innerText = "bowling";
      batorbowl = "bowling";
      //disabling the buttons after selection
      document.getElementById("bat").disabled = true;
      document.getElementById("bowl").disabled = true;

      youare = "bowling";
      console.log("you are now " + youare);
    });
    console.log(batorbowl);
  } else {
    batorbowl = bbchoice[Math.floor(Math.random() * 2)];
    console.log("batorbowl=" + batorbowl);
    //disabling the buttons after selection
    document.getElementById("compcorrect").style.display = "block";
    document.getElementById("computerchoice").innerText = batorbowl;
    computerchoice = true;

    youare = batorbowl === "bat" ? "bowling" : "bat";
    console.log("you are now " + youare);
  }
  // window.bob = batorbowl;
  document.getElementById("nextpage").disabled = false;

  document.getElementById("currently").innerText = youare;
}

console.log("batorbowl set to bat explicitly");

//from game.js
let prevsel = [];
let score = 0;
function play(val) {
  // prevsel.push(val);// //we shouldny push the val the first time. Should update it after checking if it is working.
  console.log("user input:" + val);

  if (youare === "bat") {
    batorbowl(val);
  } else {
    // bowltobat();
    battobowl(val); //debugging purpose
  }
}

let leastpredict;
let prediction;
//user goes from bat to bowl
function battobowl(val) {
  out = false;
  while (prevsel.length < 4) {
    //while the length of array is less than 4. It chooses a random number from  0-5 and pushes it into the prevsel array.
    let ch = ["1", "2", "3", "4", "5", "6"];
    if (ch[Math.floor(Math.random() * 6)] === val) {
      console.log("OUT");
      alert("OUT!!");
      out = true;
    } else score += 1;
    prevsel.push(val);
  }
  //if prev.lengh > 3
  while (out == false) {
    // let prediction = predict(prevsel);
    prediction = predict(prevsel);
    console.log("computer prediction=" + prediction);

    if (prediction == val) {
      console.log("OUT");
      alert("OUT!!");
      out = true;
    }
    prevsel.push(val);
  }
  //bowling
  // let leastpredict = predictLeast(prevsel);
  while (score > 0) {
    leastpredict = predictLeast(prevsel);
    console.log("Least predict(for bowling)=" + leastpredict);
    if (val !== leastpredict) {
      score = score - val;
    } else {
      alert("YOU WON!!!");
      console.log("You won!");
    }
  }
}

//function to predict the most  probable number
function predict(selections) {
  let freeqmap = {};
  selections.forEach((selection) => {
    freeqmap[selection] = (freeqmap[selection] || 0) + 1;
  });

  let prediction = null;
  let maxfreeq = null;

  for (let number in freeqmap) {
    if (freeqmap[number] > maxfreeq) {
      maxfreeq = number;
      prediction = freeqmap[number];
    }
  }
  console.log("prediction=" + prediction);
  console.log("maxfreeq=" + maxfreeq);
  return prediction;
}

//functtion to choose the one with least probbility.
function predictLeast(selections) {
  let frequencyMap = {};
  selections.forEach((selection) => {
    frequencyMap[selection] = (frequencyMap[selection] || 0) + 1;
  });

  let leastFrequency = Infinity; // Initialize with Infinity to find the minimum frequency
  let prediction = null;

  for (let number in frequencyMap) {
    if (frequencyMap[number] < leastFrequency) {
      leastFrequency = frequencyMap[number];
      prediction = number;
    }
  }

  console.log("Least frequent number:", prediction);
  console.log("Least frequency:", leastFrequency);
  return prediction;
}
