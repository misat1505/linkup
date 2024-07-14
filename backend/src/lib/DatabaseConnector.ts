import mysql from "mysql2/promise";
import { env } from "../config/env";

export class DatabaseConnector {
  connectionOptions: mysql.ConnectionOptions;
  connection: mysql.Connection | null;

  constructor(
    host: string,
    user: string,
    password: string,
    database: string,
    port: number
  ) {
    this.connectionOptions = {
      host: host,
      user: user,
      password: password,
      database: database,
      port: port,
    };
    this.connection = null;
  }

  async connect(): Promise<void> {
    try {
      this.connection = await mysql.createConnection(this.connectionOptions);
      console.log("Connected to the database.");
    } catch (err) {
      console.error("Failed to connect to the database.");
    }
  }

  async executeQuery(query: string, params?: any[]): Promise<any> {
    if (!this.connection) {
      await this.connect();
    }

    if (!params) params = [];

    const [rows, _] = (await this.connection!.execute(query, params)) as any;
    return rows;
  }
}

const database =
  env.NODE_ENV === "test" ? env.DB_TEST_DATABASE : env.DB_DATABASE;

export const db = new DatabaseConnector(
  env.DB_HOST,
  env.DB_USER,
  env.DB_PASSWORD,
  database,
  env.DB_PORT
);
