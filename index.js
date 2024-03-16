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

    youare = batorbowl == "bat" ? "bowling" : "bat";
    console.log("you are now " + youare);
  }
  // window.bob = batorbowl;
  document.getElementById("nextpage").disabled = false;

  document.getElementById("currently").innerText = youare;
}

// window.var1 = batorbowl;
// window.var2 = youare;
