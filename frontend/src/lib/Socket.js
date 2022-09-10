import { RemoteAvatar, SelfAvatar } from ".";
import { io } from "socket.io-client";

/**
 * @classdesc Socket class can be initialized using `new Socket(options)`.
 * @param  options - Options to initialize Socket data
 * @param {string} options.url - URL which will be used to initialize `io()` method of Socket.io
 *
 */
export class Socket {
  constructor({ url = "http://localhost:3001" } = {}) {
    this.socket = io(url, {
      reconnectionAttempts: 10,
      reconnectionDelay: 5000,
      transports: ["websocket"],
    });
    this.joinedRooms = [];
    this.userRoom = undefined;
    this.joinedUsers = {};
    // Execute when socket connection with backend is successful
    this.socket.on("connect", () => {
      document.getElementById("id-info").innerHTML = this.socket.id;
      this.user = new SelfAvatar(this.socket.id, 30, 30);
      this.joinedRooms.push(this.socket.id);
      document.getElementById("rooms-info").innerHTML = this.joinedRooms;
    });

    this.socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`, err);
    });

    // Do when reconnect is attempted due to disconnection
    this.socket.io.on("reconnect_attempt", () => {
      this.joinedRooms = [];
      document.getElementById("world-input").value = "";
      console.log(`Attempting to reconnect`);
    });

    // Do when reconnection is successful
    this.socket.io.on("reconnect", () => {
      console.log(`Reconnected`);
    });

    // when a remote user joins
    this.socket.on("userJoined", (remoteUser) => {
      console.log(remoteUser);
      let userJoined = new RemoteAvatar(
        remoteUser.id,
        remoteUser.position,
        remoteUser.color
      );
      userJoined.name = remoteUser.name;
      this.joinedUsers[userJoined.id] = userJoined;
      console.log("Total joined users", this.joinedUsers);
      this.socket.emit("introducing", remoteUser.id, this.user.getMetaData());
    });

    // when the present users introduce themselves
    this.socket.on("introducing", (remoteUser) => {
      console.log(remoteUser);
      let remoteUserAvatar = new RemoteAvatar(
        remoteUser.id,
        remoteUser.position,
        remoteUser.color
      );
      remoteUserAvatar.name = remoteUser.name;
      this.joinedUsers[remoteUserAvatar.id] = remoteUserAvatar;
    });

    // a remote user moved in local user room
    this.socket.on("moved", (remoteUser) => {
      this.joinedUsers[remoteUser.id] &&
        this.joinedUsers[remoteUser.id].walk(remoteUser.xpos, remoteUser.ypos);
      if (remoteUser.name) {
        this.joinedUsers[remoteUser.id].name = remoteUser.name;
      }
      this.redrawUsers();
    });

    // a remote user disconnects
    this.socket.on("user disconnected", (ruid) => {
      this.joinedUsers[ruid].clear();
      delete this.joinedUsers[ruid];
      this.redrawUsers();
    });
  }

  joinRoom(room) {
    this.user && this.socket.emit("join", room, this.user.getMetaData());
    this.joinedRooms.push(room);
    this.userRoom = room;
    document.getElementById("rooms-info").innerHTML = this.userRoom;
  }

  setName(name) {
    if (this.user) {
      this.user.name = name;
      document.getElementById("id-info").innerHTML = name;
    }
  }

  selfWalk() {
    this.user &&
      this.userRoom &&
      this.socket.emit("moved", this.userRoom, this.user);
    Object.keys(this.joinedUsers).map((uid) => this.joinedUsers[uid].draw());
  }

  redrawUsers() {
    this.user.clear();
    Object.keys(this.joinedUsers).map((uid) => this.joinedUsers[uid].draw());
    this.user.draw();
  }
}

export const sio = new Socket();
