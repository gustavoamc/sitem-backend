import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

let io: Server;

export const initIO = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Middleware to authenticate the socket connection
  // This will check the JWT token sent by the client
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Token ausente"));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
      (socket as any).user = decoded;
      next();
    } catch (err) {
      return next(new Error("Token inválido"));
    }
  });

  // Handles global events
  io.on("connection", (socket) => {
    console.log(`Novo cliente conectado: ${socket.id}`);

    // Join a specific room
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`Usuário ${socket.id} entrou na sala ${roomId}`);
    });

    // send a message to a specific room
    socket.on("send_message", ({ roomId, message }) => {
      console.log(`Mensagem recebida na sala ${roomId}: ${message}`);
      io.to(roomId).emit("receive_message", {
        user: (socket as any).user,
        message,
        timestamp: new Date()
      });
    });

    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO não foi inicializado!");
  }
  return io;
};
