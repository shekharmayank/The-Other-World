import { canvasElement, sio } from "./lib";
import "./style.css";

// initializing socket connection

// displaying canvas
setCanvasSize();

function setCanvasSize() {
  const rect = canvasElement.parentNode.getBoundingClientRect();
  canvasElement.width = rect.width - 6.72; // 6.72 -> adjusted for padding and border used around canvas
  canvasElement.height = rect.height - 6.72;
}

// selfAvatar is initialized in Socket constructer in order to populate id

// setting room when user joins a room
document.getElementById("world-input").addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("world-btn").click();
  }
});

document.getElementById("world-btn").addEventListener("click", setRoom);

function setRoom() {
  let room = document.getElementById("world-input").value;
  sio.joinRoom(room);
}

document.getElementById("username-btn").addEventListener("click", setName);

function setName() {
  let name = document.getElementById("username-input").value;
  sio.setName(name);
  sio.redrawUsers();
}

// todo: code to handle further workflow
