import { body } from "express-validator";

export const createPrivateChatRules = [
  body("users")
    .isArray({ min: 2, max: 2 })
    .withMessage("Users should be an array with exactly 2 UUIDs"),
  body("users.*").isUUID().withMessage("Each user should be a valid UUID"),
];

export const createGroupChatRules = [
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users should be an array with at least 1 UUID"),
  body("users.*").isUUID().withMessage("Each user should be a valid UUID"),
  body("name")
    .isString()
    .isLength({ max: 100 })
    .withMessage(
      "Name should be a string with a maximum length of 100 characters"
    ),
  body("file").optional(),
];

export const createMessageRules = [
  body("content")
    .isString()
    .isLength({ max: 5000 })
    .withMessage(
      "Content should be a string with a maximum length of 5000 characters"
    ),
  body("responseId")
    .optional()
    .isUUID()
    .withMessage("Response ID should be a valid UUID"),
];

export const createReactionRules = [
  body("messageId").isUUID().withMessage("messageId should be a valid UUID"),
  body("reactionId").isUUID().withMessage("responseId should be a valid UUID"),
];

export const updateAliasRules = [
  body("alias")
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 100 })
    .withMessage(
      "alias should be null or a string of maximum length of 100 characters"
    ),
];

export const addUserToGroupChatRules = [
  body("userId").isUUID().withMessage("userId should be a valid UUID"),
];

export const updateGroupChatRules = [
  body("name")
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 100 })
    .withMessage(
      "Name should be a string with a maximum length of 100 characters"
    ),
  body("file").optional(),
];
