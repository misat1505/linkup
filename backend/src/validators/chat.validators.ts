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
    .withMessage("chats.validators.create-private-chat.users.not-2"),
  body("users.*")
    .isUUID()
    .withMessage("chats.validators.create-private-chat.users.each.is-not-uuid"),
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
    .withMessage("chats.validators.create-group-chat.users.empty"),
  body("users.*")
    .isUUID()
    .withMessage("chats.validators.create-group-chat.users.each.is-not-uuid"),
  body("name")
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 100 })
    .withMessage("chats.validators.create-group-chat.name.bad-length"),
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
    .withMessage("chats.validators.create-message.content.bad-length"),
  body("responseId")
    .optional()
    .isUUID()
    .withMessage("chats.validators.create-message.responseId.is-not-uuid"),
];

/**
 * Validation rules for creating a reaction.
 * - `messageId`: Should be a valid UUID.
 * - `reactionId`: Should be a valid UUID.
 *
 * @constant
 */
export const createReactionRules = [
  body("messageId")
    .isUUID()
    .withMessage("chats.validators.create-reaction.messageId.is-not-uuid"),
  body("reactionId")
    .isUUID()
    .withMessage("chats.validators.create-reaction.reactionId.is-not-uuid"),
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
    .withMessage("chats.validators.update-alias.alias.bad-length"),
];

/**
 * Validation rules for adding a user to a group chat.
 * - `userId`: Should be a valid UUID.
 *
 * @constant
 */
export const addUserToGroupChatRules = [
  body("userId")
    .isUUID()
    .withMessage("chats.validators.add-user-to-group-chat.userId.is-not-uuid"),
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
    .withMessage("chats.validators.update-group-chat.name.bad-length"),
  body("file").optional(),
];
