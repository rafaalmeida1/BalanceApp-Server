import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma";
import * as bcrypt from "bcrypt";
import { ObjectId } from "bson";

const salt = bcrypt.genSaltSync(10);

export async function appRoutes(app: FastifyInstance) {
  app.get("/", async (req, res) => {
    return "Hello World";
  });

  app.post("/api/register", async (req, res) => {
    const userParams = z.object({
      username: z.string(),
      email: z.string(),
      password: z.string(),
    });

    const { username, email, password } = userParams.parse(req.body);

    const id = new ObjectId();

    let user;
    const findUserAlreadyExists = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (findUserAlreadyExists || email.includes(" ")) {
        return res.status(400).send("Email already exists");
    } else {
      user = await prisma.user.create({
        data: {
          id: String(id),
          username,
          email,
          password: bcrypt.hashSync(password, salt),

          user_account: {
            create: {
              id: String(id),
              balance: 1000,
            },
          },
        },
      });
    }

    const userAccount = await prisma.account.findUnique({
      where: {
        id: String(id),
      },
    });

    return {
      user,
      userAccount,
    };
  });

  app.post("/api/login", async (req, res) => {
    const userParams = z.object({
      email: z.string(),
      password: z.string(),
    });

    const { email, password } = userParams.parse(req.body);

    const selectUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    const passwordMatch = bcrypt.compareSync(password, selectUser!.password);

    try {
      if (passwordMatch) {
        const userLoggedIn = await prisma.user.findFirst({
          where: {
            email,
          },
        });

        let userAccount;

        if (userLoggedIn) {
          userAccount = await prisma.account.findFirst({
            where: {
              id: userLoggedIn?.id,
            },
          });
          return res.status(201).send({ userLoggedIn, userAccount });
        }
      } else {
        return res.status(403).send("Usuário ou senha incorretos");
      }
    } catch (error) {
      console.log(error);
      return res.status(404).send(error);
    }
  });

  app.get("/api/user/:id", async (req, res) => {
    const idParams = z.object({
      id: z.string(),
    });

    const { id } = idParams.parse(req.params);

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        user_account: {
          select: {
            balance: true,
          },
        },
      },
    });

    return res.status(200).send(user);
  });

  app.put("/api/update-user/:id", async (req, res) => {
    const paramsId = z.object({
      id: z.string(),
    });

    const userSchema = z.object({
      email: z.string(),
      password: z.string(),
      newPassword: z.string().optional(),
      username: z.string(),
    });

    const { id } = paramsId.parse(req.params);
    const { email, password, newPassword, username } = userSchema.parse(
      req.body
    );

    const userFounded = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    const passwordMatch = bcrypt.compareSync(password, userFounded!.password);

    if (!passwordMatch) {
      return res.status(403).send("Password is incorrect");
    }

    if (newPassword === password) {
      return res.status(401).send("Passwords are the same");
    }

    if (userFounded && passwordMatch) {
      if (!newPassword) {
        const userUpdate = await prisma.user.update({
          where: {
            id,
          },
          data: {
            email,
            password: bcrypt.hashSync(password, salt),
            username,
          },
        });

        return userUpdate;
      } else {
        const userUpdate = await prisma.user.update({
          where: {
            id,
          },
          data: {
            email,
            password: bcrypt.hashSync(newPassword, salt),
            username,
          },
        });

        return userUpdate;
      }
    }
  });
}
