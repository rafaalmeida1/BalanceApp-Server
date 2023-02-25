import Fastify from "fastify";
import cors from "@fastify/cors";
import { appRoutes } from "./routes";

const app = Fastify();

app.register(cors, {
  origin: ["http://localhost:3000", "https://balance-app-theta.vercel.app/"],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
});

app.register(appRoutes);

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log(`HTTP Server running on port http://localhost:${3333}`);
  });
