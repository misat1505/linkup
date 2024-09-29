import { Request, Response } from "express";
import { UserService } from "../../services/UserService";
import { Hasher } from "../../lib/Hasher";
import { TokenProcessor } from "../../lib/TokenProcessor";
import { jwtCookieOptions } from "../../config/jwt-cookie";

export const loginController = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Log in an existing user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               login:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: User logged in successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: Invalid login or password
   *       500:
   *         description: Cannot log in
   */
  try {
    const { login, password } = req.body;

    const user = await UserService.getUserByLogin(login);

    if (!user) {
      return res.status(401).json({ message: "Invalid login." });
    }

    const hashedPassword = Hasher.hash(password + user.salt);
    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const jwt = TokenProcessor.encode({ userId: user.id }, { expiresIn: "1h" });
    const accessToken = TokenProcessor.encode(
      { userId: user.id },
      { expiresIn: "1h" }
    );
    res.cookie("token", jwt, jwtCookieOptions);
    return res
      .status(200)
      .json({ user: UserService.removeCredentials(user), accessToken });
  } catch (e) {
    return res.status(500).json({ message: "Cannot login." });
  }
};