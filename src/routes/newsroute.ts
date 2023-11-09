import { Router, Request, Response } from "express";
import { User } from "../models/userModel";
const instagramRouter = Router();

instagramRouter.post("/api", async (req: Request, res: Response) => {
  try {
    const newUser = {
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      surname: req.body.surname,
    };
    const user = await User.create(newUser);
    return res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "An unknown error occurred." });
  }
});

export default instagramRouter;
