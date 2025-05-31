import express from "express";
import cors from "cors";
import AuthRoutes from "./routes/authRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", AuthRoutes);

// Rotas de exemplo
app.get("/ping", (_, res) => res.send("pong"));

export default app;
