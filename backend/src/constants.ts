import dotenv from "dotenv";
dotenv.config();

// JWT secret key
export const JWT_SECRET = process.env.JWT_SECRET!;
