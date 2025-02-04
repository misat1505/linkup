import { body } from "express-validator";

/**
 * Validation rules for creating a private chat.
 * - `users`: Should be an array with exactly 2 valid UUIDs.
 *
 * @constant
 */
export const createPrivateChatRules = [
  body("users")
    .isArray({ min: 2, max: 2 })
    .withMessage("Users should be an array with exactly 2 UUIDs"),
  body("users.*").isUUID().withMessage("Each user should be a valid UUID"),
];

/**
 * Validation rules for creating a group chat.
 * - `users`: Should be an array with at least 1 valid UUID.
 * - `name`: Optional, should be a string with a maximum length of 100 characters.
 * - `file`: Optional field for attaching a file.
 *
 * @constant
 */
export const createGroupChatRules = [
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users should be an array with at least 1 UUID"),
  body("users.*").isUUID().withMessage("Each user should be a valid UUID"),
  body("name")
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 100 })
    .withMessage(
      "Name should be a string with a maximum length of 100 characters"
    ),
  body("file").optional(),
];

/**
 * Validation rules for creating a message.
 * - `content`: Should be a string with a maximum length of 5000 characters.
 * - `responseId`: Optional, should be a valid UUID if provided.
 *
 * @constant
 */
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

/**
 * Validation rules for creating a reaction.
 * - `messageId`: Should be a valid UUID.
 * - `reactionId`: Should be a valid UUID.
 *
 * @constant
 */
export const createReactionRules = [
  body("messageId").isUUID().withMessage("messageId should be a valid UUID"),
  body("reactionId").isUUID().withMessage("responseId should be a valid UUID"),
];

/**
 * Validation rules for updating an alias.
 * - `alias`: Optional, should be a string with a maximum length of 100 characters.
 *
 * @constant
 */
export const updateAliasRules = [
  body("alias")
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 100 })
    .withMessage(
      "alias should be null or a string of maximum length of 100 characters"
    ),
];

/**
 * Validation rules for adding a user to a group chat.
 * - `userId`: Should be a valid UUID.
 *
 * @constant
 */
export const addUserToGroupChatRules = [
  body("userId").isUUID().withMessage("userId should be a valid UUID"),
];

/**
 * Validation rules for updating a group chat.
 * - `name`: Optional, should be a string with a maximum length of 100 characters.
 * - `file`: Optional field for attaching a file.
 *
 * @constant
 */
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
