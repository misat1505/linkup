import mysql from "mysql2/promise";

const isError = (err: unknown): err is Error => err instanceof Error;

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
      if (isError(err))
        console.log("Failed to connect to the database:", err.message);
      console.log("Retrying to connect to the database...");
      setTimeout(() => this.connect(), 1000);
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

export const db = new DatabaseConnector(
  process.env.DB_HOST!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  process.env.DB_DATABASE!,
  parseInt(process.env.DB_PORT!)
);
