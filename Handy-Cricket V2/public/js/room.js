console.log("js working");
//getting room id from url
const path = window.location.pathname;
const parts = path.split("/");
const room_id = parts[parts.length - 1];

const body = document.body;
const messages_to_user = document.getElementById("messages_to_user");
const insufficient_players = document.getElementById("insufficient_players");
const copy_room_id = document.getElementById("copy_room_id");
const copy_room_id_button = document.getElementById("copy_room_id_button");

console.log(`roomid=${room_id}`);

const Socket = io();

Socket.emit("join_room", room_id);
copy_room_id.innerHTML = room_id;

Socket.on("alert", (message, warning_boolean = null) => {
  alert(message);
  if (warning_boolean) {
    //should fill this when we start sending warning to the users
  }
});

copy_room_id_button.addEventListener("click", () => {
  alert("Copied to clipboard succesfully");
  navigator.clipboard
    .writeText(room_id)
    .then(() => {
      console.log("Room ID copied to clipboard: " + room_id);
    })
    .catch((error) => {
      console.error("Error copying to clipboard:", error);
    });
});

Socket.on("start_match", () => {
  console.log(`start match`);
  messages_to_user.removeChild(insufficient_players);
});
