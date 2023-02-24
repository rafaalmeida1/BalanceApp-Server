require("dotenv").config();
import express from "express";
import cors from "cors";
import { router } from "./routes";

const app = express();

app.use(
  cors({
    origin: [
      "https://balance-app.cyclic.app",
      "https://balance-app-theta.vercel.app",
      "https://balance-app-theta.vercel.app/api",
      "http://localhost:3000",
    ],
  })
);
app.use(express.json());
app.use(router);

app.listen(3333, () => console.log(`Server is running on port ${3333}`));
