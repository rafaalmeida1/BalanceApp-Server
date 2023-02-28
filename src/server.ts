import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { appRoutes } from "./routes";
import { config } from "dotenv";
import cookie from '@fastify/cookie'

const app = Fastify();
config();

app.register(fastifyCors);

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
