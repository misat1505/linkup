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
];
