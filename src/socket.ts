import { Server as HttpServer } from "http";
import { Socket, Server as SocketIOServer } from "socket.io";

export const startSocket = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://instagram-client-abb.vercel.app",
      ],
      methods: ["GET", "POST"],
    },
  });

  io.use((_socket, next) => {
    next();
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.id;

    socket.join(userId);
    console.log(`User ${userId} connected`);

    io.to(socket.id).emit("user_connected", userId);

    socket.onAny((eventName, ...args) => {
      console.log(`Received message from ${userId}: ${eventName}`, args);
    });

    socket.on("private_message", (data: { to: string; message: string }) => {
      const { to, message } = data;

      io.to(to).emit("private_message", { from: userId, message });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });

  return io;
};
