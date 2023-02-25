import Fastify from "fastify";
import { appRoutes } from "./routes";
import fastifyCors from "@fastify/cors";

const app = Fastify();

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
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
