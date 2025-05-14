import { NextFunction, Request, Response } from "express";
import { SearchUserQuery } from "../../validators/users/users.validators";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to search users by a search term.
 *
 * @remarks
 * This controller handles the search for users based on a provided search term. The search term is expected to be passed as a query parameter.
 * The search is case-insensitive and can match partial text in usernames, email addresses, or other user-related fields.
 * If the term is missing or invalid, a `400` error is returned.
 * If the search is successful, the list of matching users is returned.
 * The request is protected by authentication via a Bearer JWT token.
 *
 * @param {Request} req - The Express request object, which contains the search term in the query string and the authentication token in the header.
 * @param {Response} res - The Express response object, used to send the list of users or an error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
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
export const searchUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { term } = req.validated!.query! as SearchUserQuery;
    const userService = req.app.services.userService;

    const users = await userService.searchUsers(term);

    return res.status(StatusCodes.OK).json({ users });
  } catch (e) {
    next(new Error(req.t("users.controllers.search.failure")));
  }
};
