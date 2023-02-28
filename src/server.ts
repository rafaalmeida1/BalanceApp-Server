import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { appRoutes } from "./routes";
import { config } from "dotenv";
import { z } from "zod";
import cookie from '@fastify/cookie'

const app = Fastify();
config();

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
});

app.register(appRoutes);
app.register(cookie);

app
  .listen({
    port: Number(process.env.PORT),
    host: "0.0.0.0",
  })
  .then(() => {
    console.log(`HTTP Server running on port http://localhost:${3333}`);
  });
