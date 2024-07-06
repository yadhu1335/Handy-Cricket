const socket = io();
let mySocketID; //For saving my socketid
let you_are_currently; //To know what i am doing Batting or bowling. The will be either bat or bowl.
let match_ended = false; //For knowing if the atch has ended or not. This is used to prevent "win_by_default" socket from executing
// Getting my socketId from front end
socket.on("socketid", (socketid) => {
  mySocketID = socketid;
  console.log(`my socket id is ${mySocketID}`);
});
let prevScore = 1;

const params = new URLSearchParams(window.location.search); // Get the URL search parameters

// Get the value of roomid from the URL
const room_id = params.get("room");
document.getElementById("roomcode").innerText = room_id; //show the value in p tag

const username = params.get("username"); // Get the value of username from the URL
console.log(`your useranme is ${username} and room id is ${room_id}`);

socket.emit("joinroom", room_id, username); //when the room.js website is loaded up it automatically emits "join room".

// should improve this
socket.on("alert", (message, warning) => {
  alert(message);
  if (warning) {
    console.log(`Warning recieved `);
    disable_enable_Buttons("enable");
    console.log(`Restarting the rimer`);
    resetTimer();
    startTimer();

    document.getElementById("your_selection").innerText = 0;
    document.getElementById("opponents_selection").innerText = 0;
  }
});

socket.on("players info", (value) => {
  users = [];
  for (let [sockeid, username] of Object.entries(value)) {
    users.push(username);
  }
  console.log(`Users=[${users}]`);
  document.getElementById("players").innerText = `${users[0]} vs ${users[1]}`; //showing you username vs opponent username
});

document.getElementById("roomcode_btn").addEventListener("click", () => {
  navigator.clipboard
    .writeText(room_id)
    .then(() => {
      console.log("Room ID copied to clipboard: " + room_id);
    })
    .catch((error) => {
      console.error("Error copying to clipboard:", error);
    });
});

function disable_enable_Buttons(enable_or_disable) {
  //value for enable_or_disable is either "enable" or "disable";
  if (enable_or_disable === "disable") {
    console.log(`disabling buttons`);
    for (let i = 1; i <= 6; i++) {
      document.getElementById(i + "").disabled = true;
      document.getElementById(i + "").style.cursor = "not-allowed";
    }
  }

  if (enable_or_disable === "enable") {
    console.log(`enabling buttons`);
    for (let i = 1; i <= 6; i++) {
      document.getElementById(i + "").disabled = false;
      document.getElementById(i + "").style.cursor = "pointer";
    }
  }
}

socket.on("start match", () => {
  //  IMP!!! document.getElementById("players").innerText=`${} vs ${}`
  console.log("server gave signal to start the match");
  document.getElementById("match").style.display = "block";
  document.getElementById("insufficient_players").style.display = "none";

  const toss_choice_parentDiv = document.getElementById("choice"); //parent div called choice which will dispaly your choice and opponents choice
  let heads_or_tails_btn; //My choice in heads or tails
  const heads = document.getElementById("heads");
  const tails = document.getElementById("tails");

  const heads_or_tails = document.getElementById("heads_or_tails"); //div where we have the button heads and tails

  heads_or_tails.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      heads_or_tails_btn = event.target.id; //id will be either heads or tails
      createTag("p", `You chose ${heads_or_tails_btn}`, toss_choice_parentDiv); //appending choice to html
      console.log(`${username} chose Heads`);
      heads.disabled = true;
      tails.disabled = true;
      socket.emit("my_heads_or_tails_choice", event.target.id, room_id);
    }
  });

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
  const bat_and_bowl = document.getElementById("bat_and_bowl");
  socket.on("toss result", (lose_or_win, toss_favor) => {
    if (lose_or_win === "won") {
      console.log(`You won the toss... the toss is in favour of ${toss_favor}`);
      createTag(
        "p",
        `Congrats!!! The Toss is in favour of ${toss_favor}`,
        toss_choice_parentDiv
      ); //displaying that they have won the toss
      createTag("button", "Bat🏏", bat_and_bowl, "bat"); //creating button for "BAT"
      createTag("button", "Bowl⚾", bat_and_bowl, "bowl"); //creating button for "BOWL"

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
    document.getElementById("button_value_of_users").style.display = "block";
    startTimer(); //starting the timer
  });

  document
    .getElementById("choose_value")
    .addEventListener("click", function (event) {
      if (event.target.tagName === "BUTTON") {
        const targetId = event.target.id;
        document.getElementById("your_selection").innerText = targetId;
        document.getElementById("opponents_selection").innerText = 0;

        console.log(`${targetId} has been pressed`);
        socket.emit(
          "choose value",
          parseInt(targetId),
          room_id,
          you_are_currently
        );
      }
      disable_enable_Buttons("disable");

      stopTimer(); //after user presses a button the timer stops.
    });

  //disable_enable_button was here

  //This is used to show the users their chosen value along with the opponent value
  socket.on("button value of players", (bat, bowl) => {
    console.log(`!!!!Adding values to html!!!! `);
    if (you_are_currently === "bat") {
      console.log(`Opponents choice=${bowl}`);
      document.getElementById("opponents_selection").innerText = bowl;
    } else {
      console.log(`Opponents choice=${bat}`);
      document.getElementById("opponents_selection").innerText = bat;
    }
  });

  socket.on("update you_are_currently", (value) => {
    document.getElementById("score").innerText = `score=${0}`;
    if (value === "bat") {
      document.getElementById("prevScore").innerHTML = `score to beat is ${
        prevScore + 1
      }`; //+1 to the score of first batsman
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
    resetTimer();
    startTimer();
  });

  socket.on("score", (score) => {
    document.getElementById("score").innerText = `score=${score}`;
    prevScore = score;
    disable_enable_Buttons("enable");
    resetTimer(); //reset timer
    startTimer(); //Starting timer
  });

  let final_resut_div = document.getElementById("final result");
  socket.on("final result", (score, win_or_loose, largestScore) => {
    match_ended = true;
    console.log(`match ended= ${match_ended}`);
    stopTimer(); //when final result gets emitted timer stops
    disable_enable_Buttons("disable");
    if (win_or_loose === "win") {
      createTag("h3", "Congrats!! You win the game", final_resut_div);
      createTag("h3", `Score=${score}`, final_resut_div);
      console.log(`You win`);
      createTag("button", "Go Back", final_resut_div, "go_back_btn");
    } else {
      createTag("h3", "Sorry!! You loose the game", final_resut_div);
      createTag(
        "h3",
        `Your score=${score} , You lost by ${Math.abs(
          score - largestScore
        )} runs`,
        final_resut_div
      );
      console.log(`you loose`);
      createTag("button", "Go Back", final_resut_div, "go_back_btn");
    }

    document.getElementById("go_back_btn").addEventListener("click", () => {
      // location.href = `../views/index.html`;
      location.href = `../`;
    });
  });

  socket.on("draw", () => {
    createTag("p", "The match has ended in a Draw", final_resut_div);
    createTag("button", "Go Back", final_resut_div, "go_back_btn");
    document.getElementById("go_back_btn").addEventListener("click", () => {
      location.href = `../`;
    });
    match_ended = true;
  });

  socket.on("won_by_default", (value, socketid) => {
    if (match_ended === false) {
      console.log(`Inside won by default`);
      console.log(
        `socketid of looser ${socketid}, my socet id is ${mySocketID}`
      );
      //if match hasnt ended, only then u can win by default
      if (socketid !== mySocketID) {
        match_ended = true;
        stopTimer(); //when final result gets emitted timer stops
        console.log(`Win by default`);
        createTag("h3", value, final_resut_div);
        createTag("button", "Go Back", final_resut_div, "go_back_btn");
        document.getElementById("go_back_btn").addEventListener("click", () => {
          location.href = `../`;
        });
        disable_enable_Buttons("disable");
      } else {
        match_ended = true;
        console.log(`Lost by default`);
        stopTimer(); //when final result gets emitted timer stops
        createTag("h3", `Warning exceeded...You loose`, final_resut_div);
        createTag("button", "Go Back", final_resut_div, "go_back_btn");
        document.getElementById("go_back_btn").addEventListener("click", () => {
          location.href = `../`;
        });
        disable_enable_Buttons("disable");
      }
    }
  });

  //webrtc

  // Create RTCPeerConnection object
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }, // Specify STUN server
    ],
  });

  let localStream; //for saving the local stream ie yours

  socket.on("start call", () => {
    // Initiate WebRTC process here
    console.log(`starting starWebRTC()`);
    startWebRTC();
  });

  function startWebRTC() {
    console.log(`function started and getting audio`);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        // Add user's audio stream to peer connection
        localStream = stream;
        stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));
        peerConnection.onicecandidate = handleICECandidateEvent;
        // Add this event listener for handling remote audio stream
        peerConnection
          .createOffer()
          .then((offer) => peerConnection.setLocalDescription(offer))
          .then(() => {
            // Send offer to the other user via signaling server
            socket.emit("offer", peerConnection.localDescription, room_id);
          });
      })
      .catch(function (err) {
        console.error("Error accessing user media: ", err);
      });
  }
  peerConnection.ontrack = handleRemoteStreamAdded; // Add event listeners for ICE candidates and create offer/answer

  function handleICECandidateEvent(event) {
    console.log(`Handling icecandidate`);
    if (event.candidate) {
      // Send ICE candidate to the other user via signaling server
      socket.emit("ice candidate", event.candidate, room_id);
    }
  }

  socket.on("offer", async (offer) => {
    try {
      console.log(`offer recieved`);
      // Set remote description
      await peerConnection.setRemoteDescription(offer);
      // Create answer
      const answer = await peerConnection.createAnswer();
      // Set local description
      await peerConnection.setLocalDescription(answer);
      // Send answer to the other user via signaling server
      socket.emit("answer", answer, room_id);
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  });

  socket.on("answer", async (answer) => {
    try {
      console.log(`answer recieved`);
      // Set remote description
      await peerConnection.setRemoteDescription(answer);
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  });

  socket.on("ice candidate", (candidate) => {
    try {
      console.log(`icecandidate recieved`);
      // Add ICE candidate to peer connection
      peerConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error("Error handling ICE candidate:", error);
    }
  });

  // Function to handle remote audio stream
  function handleRemoteStreamAdded(event) {
    console.log(`Addign remote stram to audio element`);
    const remoteAudioElement = document.getElementById("audio");
    if (!remoteAudioElement.srcObject) {
      remoteAudioElement.srcObject = event.streams[0];
    }
  }
  //https://stackoverflow.com/questions/34469618/how-to-add-audio-video-mute-unmute-buttons-in-webrtc-video-chat for toggling on and off audio btn
  const audio_control = document.getElementById("audio_control");
  audio_control.addEventListener("click", () => {
    localStream.getAudioTracks()[0].enabled =
      !localStream.getAudioTracks()[0].enabled;
    console.log(`audio control ${localStream.getAudioTracks()[0].enabled}`);
    if (localStream.getAudioTracks()[0].enabled)
      audio_control.innerText = "Mute";
    else audio_control.innerText = "Unmute";
  });
});

//code for timer
let timerInterval;
let timeLeft = 10; // Initial time in seconds

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(timerInterval); // Stop the timer when time runs out
      timerRunsOut(); // Call function when timer runs out
    } else {
      updateTimerDisplay(); // Update the timer display
    }
  }, 1000); // Update timer every second (1000 milliseconds)
}

function stopTimer() {
  clearInterval(timerInterval); // Stop the timer
}

function resetTimer() {
  stopTimer(); // Stop the timer if it's running
  timeLeft = 10; // Reset the time
  updateTimerDisplay(); // Update the display with the reset time
}

function updateTimerDisplay() {
  // Display the remaining time wherever you want
  let timerElement = document.getElementById("timer");
  // Format the time left (for example, as minutes and seconds)
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  let formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  // Update the content of the element with the formatted time
  timerElement.textContent = `Time left: ${formattedTime}`;
}

function timerRunsOut() {
  console.log("Timer has run out!");
  // Add your logic to execute when the timer runs out
  socket.emit("Time out", room_id);
}
