import { Avatar } from "./Avatar";

export class RemoteAvatar extends Avatar {
  constructor(id, { xpos, ypos }, color, width = 30, height = 30) {
    super(id, width, height);
    this.xpos = xpos;
    this.ypos = ypos;
    this.color = color.avatar;
    this.labelColor = color.labelColor;
    this.draw();
  }

  walk(xpos, ypos) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.clear();
    this.draw();
  }
}
