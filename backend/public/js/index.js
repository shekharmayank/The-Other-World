const socket = io("http://localhost:3001");
let joinedRooms = [];

/**
 * Socket related stuff
 */
socket.on("connect", () => {
  document.getElementById("conn-id").innerHTML = socket.id;
  joinedRooms.push(socket.id);
  console.log(`Connected: ${socket.id}`);
  document.getElementById("rooms-info").innerHTML = joinedRooms;
});

socket.on("locationUpdate", (data) => {
  setLocation(data.id, data.user, false);
});

socket.io.on("reconnect_attempt", () => {
  joinedRooms = [];
  clearAllLocations(); 
  document.getElementById("world").value = "";
  console.log(`Attempting to reconnect `);
});

socket.io.on("reconnect", () => {
  console.log(`Reconnected`);
});
/**
 * HTML related stuff
 */
//Initializing world
const world = document.getElementById("canvas");

const tile = document.createElement("div");
tile.setAttribute(
  "style",
  "color: white; display: inline-block;width: 100px;height: 100px;border: 1px solid red; background-color: green; overflow: hidden;"
);

tile.setAttribute("class", "tile");

for (let i = 0; i < 30; i++) {
  tile.setAttribute("id", `${i}`);
  world.appendChild(tile.cloneNode(true));
  document
    .getElementById(i)
    .addEventListener("click", (e) =>
      setLocation(e.target.id, socket.id, true)
    );
}
function setLocation(id, sId, self) {
  // set clients present location and emit to others in room
  for (let i = 0; i < 30; i++) {
    if (document.getElementById(i).innerHTML === sId) {
      document.getElementById(i).innerHTML = "";
    }
  }
  document.getElementById(id).innerHTML = sId;
  self && socket.emit("location", { id, user: sId, room: joinedRooms[1] });
}

function clearAllLocations() {
  for (let i = 0; i < 30; i++) {
    document.getElementById(i).innerHTML = "";
  }
}

document.getElementById("worldbtn").addEventListener("click", setRoom);

function setRoom() {
  let room = document.getElementById("world").value;
  socket.emit("join", room);
  joinedRooms.push(room);
  document.getElementById("rooms-info").innerHTML = joinedRooms;
  console.log(`Joined rooms: ${joinedRooms}`);
}

document.getElementById("usernamebtn").addEventListener("click", setUsername);

function setUsername() {
  let username = document.getElementById("username").value;
  // to be implemented later
  console.log(`Username set to ${username}`);
}
