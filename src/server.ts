import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import dotenv from "dotenv";
import { setupSocket } from "./sockets/setupSocket";
import { connectDB } from "./config/db";

dotenv.config();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

setupSocket(io); // configures socket events

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
});