const debug = require("debug")("vwbe:socketOnConnection");
const util = require("util");

function socketOnConnection(socket) {
  debug(`Client connected: ${socket.id}`);
  debug(
    `Client ${socket.id} joined rooms: ${util.inspect(
      socket.rooms,
      false,
      null,
      true
    )}`
  );

  socket.on("location", (data) => {
    socket.to(data.room).emit("locationUpdate", data);
  });

  // when user joins a room
  socket.on("join", (room, metaData) => {
    socket.join(room);
    debug(metaData);
    socket.to(room).emit("userJoined", metaData);
    debug(
      `Client ${socket.id} joined rooms: ${util.inspect(
        socket.rooms,
        false,
        null,
        true
      )}`
    );
  });

  socket.on("introducing", (newUser, toUser) => {
    socket.to(newUser).emit("introducing", toUser);
  });

  socket.on("moved", (room, user) => {
    socket.to(room).emit("moved", user);
  });

  socket.on("disconnecting", (reason) => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit("user disconnected", socket.id);
      }
    }
  });
}

module.exports = socketOnConnection;
