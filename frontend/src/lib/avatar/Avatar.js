import canvasContext, { canvasElement, requestAnimationFrame } from "../canvas";

export class Avatar {
  xdirection = 0;
  ydirection = 0;
  xpos = canvasElement.width * Math.random();
  ypos = canvasElement.height * Math.random();
  speed = 6;
  xkeys = {
    37: -this.speed,
    39: this.speed,
    65: -this.speed,
    68: this.speed,
  };
  ykeys = {
    38: -this.speed,
    40: this.speed,
    87: -this.speed,
    83: this.speed,
  };
  width = 30;
  height = 30;

  constructor(id, width, height, name) {
    this.width = width;
    this.height = height;
    this.id = id;
    this.name = name;
    this.color = this.getRandomColor(100, 50, 80);
    this.labelColor = this.getRandomColor(10, 50, 55);
    canvasElement.onclick = (event) => this.walk(event, true);
    this.requestAnimation();
  }

  checkKeys = (event) => {
    if (this.xkeys[event.keyCode] && this.xdirection) {
      this.xdirection = 0;
    }
    if (this.ykeys[event.keyCode] && this.ydirection) {
      this.ydirection = 0;
    }
  };

  getRandomColor(number, saturation, lightness) {
    const hue = Math.random() * number * 137.508;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  requestAnimation = () => {
    requestAnimationFrame(this.requestAnimation);
  };

  getMetaData() {
    return {
      id: this.id,
      name: this.name,
      color: {
        avatar: this.color,
        labelColor: this.labelColor,
      },
      position: {
        xpos: this.xpos,
        ypos: this.ypos,
      },
    };
  }

  writeLabel = (x, y) => {
    canvasContext.font = "16px sans-serif";
    canvasContext.fillStyle = this.labelColor;
    canvasContext.textAlign = "center";
    canvasContext.fillText(`${this.name}`, x, y);
  };

  draw = () => {
    canvasContext.beginPath();
    canvasContext.arc(this.xpos, this.ypos, this.width, 0, 2 * Math.PI);
    canvasContext.fillStyle = this.color;
    canvasContext.fill();
    canvasContext.stroke();
    this.writeLabel(this.xpos, this.ypos - this.width - 10);
  };

  clear = () => {
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
  };
}
