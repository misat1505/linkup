import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export const searchUser = async (req: Request, res: Response) => {
  try {
    const { term } = req.query;

    if (!term || typeof term !== "string")
      return res
        .status(400)
        .json({ message: "'term' query param is required." });

    const users = await UserService.searchUsers(term);

    return res.status(200).json({ users });
  } catch (e) {
    return res.status(500).json({ message: "Couldn't search users." });
  }
};
