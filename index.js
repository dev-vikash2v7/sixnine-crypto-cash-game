import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";

import betRoutes from "./src/routes/betRoutes.js";
import cashoutRoutes from "./src/routes/cashoutRoutes.js";
import walletRoutes from "./src/routes/walletRoutes.js";
import roundRoutes from "./src/routes/roundRoutes.js";
import socketHandler from "./src/socketHandler.js";
import { startGameLoop } from "./src/services/roundService.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/bet", betRoutes);
app.use("/cashout", cashoutRoutes);
app.use("/wallet", walletRoutes);
app.use("/round", roundRoutes);



app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

socketHandler(io);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    startGameLoop(io);
    server.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((e) => console.error("Mongo Connect Error", e));
