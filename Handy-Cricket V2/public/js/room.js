console.log("js working");
const path = window.location.pathname;
const parts = path.split("/");
const room_id = parts[parts.length - 1];
const body = document.body;
const messages_to_user = document.getElementById("messages_to_user");
const insufficient_players = document.getElementById("insufficient_players");
console.log(`roomid=${room_id}`);

const Socket = io();

Socket.emit("join_room", room_id);

Socket.on("alert", (message, warning_boolean = null) => {
  alert(message);
  if (warning_boolean) {
    //should fill this when we start sending warning to the users
  }
});

Socket.on("start_match", () => {
  console.log(`start match`);
  messages_to_user.removeChild(insufficient_players);
});
