import express, { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "./lib/prisma";

export const router = express.Router();

router.post("/api/register", async (req: Request, res: Response) => {
  const userParams = z.object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
  });

  const { username, email, password } = userParams.parse(req.body);

  const id = Date.now();

  let user;
  const findUserAlreadyExists = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (findUserAlreadyExists) {
    return res.status(400).send("Email already exists");
  } else {
    user = await prisma.user.create({
      data: {
        id: String(id),
        username,
        email,
        password,

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

  return res.status(201).json({user, userAccount})
});

router.post("/api/login", async (req: Request, res: Response) => {
  const userParams = z.object({
    email: z.string(),
    password: z.string(),
  });

  const { email, password } = userParams.parse(req.body);

  try {
    const userLoggedIn = await prisma.user.findFirst({
      where: {
        email,
        password,
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
    } else {
      return res.status(403).send("Usuário ou senha incorretos");
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send(error.message);
  }
});

router.get("/api/user/:id", async (req: Request, res: Response) => {
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

  res.status(200).send(user);
});

router.put("/api/update-user/:id", async (req: Request, res: Response) => {
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
  const { email, password, newPassword, username } = userSchema.parse(req.body);

  const userFounded = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (password !== userFounded?.password) {
    return res.status(403).json({message: "Password is incorrect"});
  }

  if (newPassword === password) {
    return res.status(403).json({message: "Passwords are the same"});
  }

  if (userFounded) {
    if (!newPassword) {
      const userUpdate = await prisma.user.update({
        where: {
          id,
        },
        data: {
          email,
          password,
          username,
        },
      });

      return res.status(201).json({userUpdate});
    } else {
      const userUpdate = await prisma.user.update({
        where: {
          id,
        },
        data: {
          email,
          password: newPassword,
          username,
        },
      });

      return res.status(201).json({userUpdate})
    }
  }
});