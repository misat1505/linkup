import { extractValidatedRequest } from "@/utils/extractValidatedRequest";
import { buildValidatedResponder } from "@/utils/validatedResponder";
import { API_CONTRACT, CONTRACT_KEYS } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
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
 */
export const searchUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contractKey = CONTRACT_KEYS.SEARCH_USER;
  const respond = buildValidatedResponder(res, contractKey);

  try {
    const {
      query: { term },
    } = extractValidatedRequest(req, API_CONTRACT[contractKey]);

    const userService = req.app.services.userService;

    const users = await userService.searchUsers(term);

    return respond(StatusCodes.OK, { users });
  } catch {
    next(new Error(req.t("users.controllers.search.failure")));
  }
};
