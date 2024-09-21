import { Request, Response } from "express";
import { UserService } from "../../services/UserService";

export const searchUserController = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /users/search:
   *   get:
   *     summary: Search users by term
   *     description: Search for users based on a search term.
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: term
   *         schema:
   *           type: string
   *         required: true
   *         description: The search term for finding users
   *     responses:
   *       200:
   *         description: A list of users matching the search term
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 users:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/User'
   *       400:
   *         description: Missing or invalid 'term' query parameter
   *       500:
   *         description: Couldn't search users
   */
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
