import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";

export const initializeSocket = (server: HTTPServer) => {
  console.log("Socket initialized!");
  const io = new Server(server);

  io.on("connection", (socket: Socket) => {
    const socketId = socket.id;

    console.log("User connected");

    socket.on("message", (msg: string) => {
      console.log(`Message from ${socketId}: ${msg}`);
      io.emit("message", { id: socketId, message: msg });
    });

    socket.on("typing", () => {
      io.emit("typing", `${socketId} is typing!`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};
