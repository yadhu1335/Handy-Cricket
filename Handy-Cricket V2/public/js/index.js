console.log("js working");
const bg_image = document.getElementById("bg_image");
const main_part = document.getElementById("main_part");
const room_id_form = document.getElementById("room_id_form");
const room_id_input = document.getElementById("room_id"); //The input field where room id is recieved
const join_button = document.getElementById("join_button");
const create_room = document.getElementById("create_room");
const bot = document.getElementById("bot");
const tutorial = document.getElementById("tutorial");
const random_room = document.getElementById("random_room");
const searching_div = document.getElementById("searching_div");
const searching_text = document.getElementById("searching_text");
const searching_div_buttons = document.getElementById("searching_div_buttons");
const Socket = io();

window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    // The page was loaded from the cache
    window.location.reload();
  }
});

room_id_form.addEventListener("submit", (event) => {
  event.preventDefault();
  const room_id = room_id_input.value;
  console.log(room_id);
  //checking if the room exists in the server
  if (room_id == "") {
    console.log(`empty room id`);
    alert("Invalid Room ID");
  } else {
    Socket.emit("room_exist", room_id); //checking whether the room exists or not
  }
  Socket.on("room_exist", (boolean_value) => {
    if (boolean_value) {
      console.log(`${room_id} exists`);
      location.href = `/room/${room_id}`; //Routing to the room
    } else alert("Room does not exist");
  });
});

create_room.addEventListener("click", () => {
  const room_id = uuidv4();
  console.log(`${room_id}`);
  Socket.emit("create_room", room_id);
  location.href = `/room/${room_id}`; //Routing to the room
});

bot.addEventListener("click", () => {
  location.href = `/bot`; //Routing to the bot
});

tutorial.addEventListener("click", () => {
  location.href = `/howtoplay`; //Routing to the bot
});

random_room.addEventListener("click", () => {
  enable_disable__button(
    "disabled",
    create_room,
    bot,
    random_room,
    join_button
  );

  bg_image.classList.add("blur");
  main_part.classList.add("blur");
  searching_div.style.display = "flex";

  searching_text.textContent = "Searching...";
  document.getElementById("searching_div").appendChild(searching_text);

  function updateEllipsis() {
    const currentText = searching_text.textContent;
    searching_text.textContent = currentText.endsWith("...")
      ? "Searching"
      : currentText + ".";
  }

  // Start updating ellipsis dynamically. Calls every 500ms
  const ellipsisInterval = setInterval(updateEllipsis, 500);

  createTag(
    "button",
    "Cancel",
    searching_div_buttons,
    "cancel_button",
    "button-56"
  );
  createTag("button", "Bot", searching_div_buttons, "bot_button", "button-56");

  //function to emit cancel_search and to return everything to normal
  function cancel_search() {
    Socket.emit("cancel_search");
    // Clear the interval for updating the ellipsis
    clearInterval(ellipsisInterval);
    // Hide the searching_div and remove dynamically added buttons and text
    searching_div.style.display = "none";
    // Optionally, reset the blurred effect and re-enable the buttons
    bg_image.classList.remove("blur");
    main_part.classList.remove("blur");
    enable_disable__button(
      "enabled",
      create_room,
      bot,
      random_room,
      join_button
    );
    searching_div_buttons.innerHTML = ""; // This will remove all child elements
  }

  // event listner for cancel button
  const cancel_button = document.getElementById("cancel_button");
  if (cancel_button) {
    cancel_button.addEventListener("click", () => {
      console.log(`search cancelled`);
      cancel_search();
    });
  }
  // event listner for bot button
  const bot_button = document.getElementById("bot_button");
  if (bot_button) {
    bot_button.addEventListener("click", () => {
      cancel_search(); //this line is not required. i wrote this before creating the windlows reload in the line 15. Will work completely fine even if we delte this line of code.
      location.href = "/bot";
    });
  }

  Socket.emit("random_room");
  Socket.on("assigned_room_id", (room_id) => {
    clearInterval(ellipsisInterval);
    document.getElementById("searching_div").style.display = "none";
    location.href = `/room/${room_id}`;
  });
});

//functions starts here
// Creates a value. invoke when user creates a room
function uuidv4() {
  return "xxyxyxxyx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
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

function enable_disable__button(enable_or_disable, ...buttons) {
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
