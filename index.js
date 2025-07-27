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


dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());
app.use(express.json());

app.use("/bet", betRoutes);
app.use("/cashout", cashoutRoutes);
app.use("/wallet", walletRoutes);
app.use("/round", roundRoutes);



app.get("/", (req, res) => {
  res.status(200).send('<h1>Hello from Crypto Cashout Backend</h1>')
});

socketHandler(io);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    startGameLoop(io);
    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((e) => console.error("Mongo Connect Error", e));
