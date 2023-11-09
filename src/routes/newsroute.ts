import { Router, Request, Response } from "express";
import { User } from "../models/userModel";
const instagramRouter = Router();

instagramRouter.get("/api", async (req: Request, res: Response) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An unknown error occurred." });
  }
});

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

instagramRouter.delete("/api/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "User has not been found" });
    }
    return res.status(200).send({ message: "User has been deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "An unknown error occurred." });
  }
});

export default instagramRouter;
