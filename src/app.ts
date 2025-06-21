import express from "express";
import cors from "cors";

import AuthRoutes from "./routes/auth.routes";
import UserRoutes from "./routes/user.routes";
import AdminRoutes from "./routes/admin.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", AuthRoutes);
app.use("/user", UserRoutes);
app.use("/admin", AdminRoutes);

// Rotas de exemplo
app.get("/ping", (_, res) => res.send("pong"));

export default app;

//TODO: implement logs with logModel