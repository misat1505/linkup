import { NextFunction, Request, Response } from "express";

/**
 * Controller to retrieve a list of user friendships.
 *
 * @remarks
 * This controller handles fetching all friendships for a given user. It retrieves the user ID from the request token and queries the FriendshipService for a list of friendships associated with that user. If successful, it returns the list of friendships. If there's a server error, it returns an appropriate error message.
 *
 * @param {Request} req - The Express request object containing the user token.
 * @param {Response} res - The Express response object used to send the list of friendships or an error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
 * @swagger
 * /friendships:
 *   get:
 *     summary: Retrieve a list of user friendships
 *     tags: [Friendships]
 *     responses:
 *       200:
 *         description: Friendships retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 friendships:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         description: Current status of the friendship
 *                         example: "ACCEPTED"
 *                       requester:
 *                         description: Details of the requester user
 *                         $ref: '#/components/schemas/User'
 *                       acceptor:
 *                         description: Details of the acceptor user
 *                         $ref: '#/components/schemas/User'
 *       500:
 *         description: Cannot retrieve user friendships due to a server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cannot get user friendships."
 */
export const getUserFriendships = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body.token;
    const friendshipService = req.app.services.friendshipService;

    const friendships = await friendshipService.getUserFriendships(userId);

    return res.status(200).json({ friendships });
  } catch (e) {
    next(new Error(req.t("friends.controllers.get.failure")));
  }
};
