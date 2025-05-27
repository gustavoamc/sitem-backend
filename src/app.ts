import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Rotas de exemplo
app.get("/ping", (_, res) => res.send("pong"));

export default app;
