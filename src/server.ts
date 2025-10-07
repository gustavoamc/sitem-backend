import { createServer } from "http";
import app from "./app";
import dotenv from "dotenv";
import { initIO } from "./sockets/setupSocket";
import { connectDB } from "./config/db";
import ensureRootExists from "./helpers/ensureRootExists";

dotenv.config();

ensureRootExists();

// creates an HTTP server to integrate with Socket.IO
const server = createServer(app);

// initializes Socket.IO with the HTTP server
initIO(server);

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
});