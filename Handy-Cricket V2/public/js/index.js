console.log("js working");
const room_id_form = document.getElementById("room_id_form");
const room_id_input = document.getElementById("room_id"); //The input field where room id is recieved
const create_room = document.getElementById("create_room");
const bot = document.getElementById("bot");
const tutorial = document.getElementById("tutorial");

// Creates a value. invoke when user creates a room
function uuidv4() {
  return "xxyxyxxyx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

room_id_form.addEventListener("submit", (event) => {
  event.preventDefault();
  const room_id = room_id_input.value;
  console.log(room_id);
  location.href = `/room/${room_id}`; //Routing to the room
});

create_room.addEventListener("click", () => {
  const room_id = uuidv4();
  console.log(`${room_id}`);
  location.href = `/room/${room_id}`; //Routing to the room
});

bot.addEventListener("click", () => {
  location.href = `/bot`; //Routing to the bot
});

tutorial.addEventListener("click", () => {
  location.href = `/howtoplay`; //Routing to the bot
});
