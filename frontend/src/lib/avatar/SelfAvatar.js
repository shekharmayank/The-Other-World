import { sio } from "../";
import { canvasElement } from "../canvas";
import { Avatar } from "./Avatar";

export class SelfAvatar extends Avatar {
  constructor(id, width = 30, height = 30) {
    super(id, width, height);
    document.onkeyup = this.checkKeys;
    document.onkeydown = this.walk;
    this.socket = undefined;
    this.draw();
  }

  walk = (event, move = false) => {
    if (this.xkeys[event.keyCode] || this.ykeys[event.keyCode]) {
      this.xpos += this.xkeys[event.keyCode] || this.xdirection;
      this.ypos += this.ykeys[event.keyCode] || this.ydirection;

      if (
        this.xkeys[event.keyCode] &&
        (this.xpos + this.width > canvasElement.width || this.xpos < 0)
      )
        this.xpos -= this.xkeys[event.keyCode];
      if (
        this.ykeys[event.keyCode] &&
        (this.ypos + this.height > canvasElement.height || this.ypos < 0)
      )
        this.ypos -= this.ykeys[event.keyCode];

      this.clear();
      this.draw();

      if (this.xkeys[event.keyCode])
        this.xdirection = this.xkeys[event.keyCode] || 0;
      if (this.ykeys[event.keyCode])
        this.ydirection = this.ykeys[event.keyCode] || 0;
    } else if (move) {
      this.xpos = event.clientX - this.width / 2;
      this.ypos = event.clientY - this.height / 2;

      this.clear();
      this.draw();
    }
    sio.selfWalk();
  };
}
