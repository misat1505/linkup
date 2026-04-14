export const UserSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "The unique ID of the user",
      example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    },
    firstName: {
      type: "string",
      description: "The user's first name",
      example: "John",
    },
    lastName: {
      type: "string",
      description: "The user's last name",
      example: "Doe",
    },
    photoURL: {
      type: "string",
      nullable: true,
      description: "URL to the user's profile photo (optional)",
      example: "https://example.com/avatar.jpg",
    },
    lastActive: {
      type: "string",
      format: "date-time",
      description: "The last time the user was active",
      example: "2024-09-12T14:35:45.000Z",
    },
  },
} as const;
