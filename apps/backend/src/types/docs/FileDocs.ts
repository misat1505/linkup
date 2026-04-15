export const FileSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "The unique ID of the file",
      example: "f57ac20b-89bc-4472-a567-1e02b2d3d579",
    },
    url: {
      type: "string",
      description: "The URL where the file is stored",
      example: "https://example.com/files/file123.png",
    },
  },
} as const;
