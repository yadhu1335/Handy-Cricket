console.log("js working");
// const params = new URLSearchParams(window.location.search);
// const room_id = params.get("room_id");
const path = window.location.pathname;
const parts = path.split("/");
const room_id = parts[parts.length - 1];
console.log(`roomid=${room_id}`);
