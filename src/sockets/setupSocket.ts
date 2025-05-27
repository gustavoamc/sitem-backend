import { Server } from "socket.io";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("Novo usuário conectado");

    socket.on("send_message", (data) => {
      io.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("Usuário desconectado");
    });
  });
};
