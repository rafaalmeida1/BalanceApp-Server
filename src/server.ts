import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { appRoutes } from "./routes";

const app = Fastify();

app.register(fastifyCors, {
  origin: "*",
  exposedHeaders: [
    "Origin",
    "*",
    "Content-Type",
    '*',
    "Authorization",
    '*',
    "Control-Allow-Origin",
    '*',
    "Control-Allow-Headers",
    '*'
  ],
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
