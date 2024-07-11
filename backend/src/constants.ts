import dotenv from "dotenv";
dotenv.config();

// server port
export const PORT = process.env.PORT;

// JWT secret key
export const JWT_SECRET = process.env.JWT_SECRET!;

// frontend server url
export const FRONTEND_URL = "https://localhost:3000";
