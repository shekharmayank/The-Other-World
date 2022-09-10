export const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;
export const cancelAnimationFrame =
  window.cancelAnimationFrame || window.mozCancelAnimationFrame;

export const canvasElement = document.getElementById("canvas_poc");

let canvasContext;
if (canvasElement.getContext) {
  canvasContext = canvasElement.getContext("2d");
} else {
  alert("This app won't work on this browser because canvas is not supported");
}

export default canvasContext;
