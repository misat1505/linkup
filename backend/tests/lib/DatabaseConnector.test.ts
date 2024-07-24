import mysql from "mysql2/promise";
import { DatabaseConnector } from "../../src/lib/DatabaseConnector";
import { env } from "../../src/config/env";

jest.mock("mysql2/promise");

describe("DatabaseConnector", () => {
  const mockConnection = {
    execute: jest.fn(),
    end: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (mysql.createConnection as jest.Mock).mockResolvedValue(mockConnection);
  });

  it("should connect to the database successfully", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();
    const db = new DatabaseConnector(
      env.DB_HOST,
      env.DB_USER,
      env.DB_PASSWORD,
      env.DB_DATABASE,
      env.DB_PORT
    );
    await db.connect();
    expect(mysql.createConnection).toHaveBeenCalledWith({
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
      port: env.DB_PORT,
    });
    expect(db.connection).toBe(mockConnection);
    expect(logSpy).toHaveBeenCalledWith("Connected to the database.");
    logSpy.mockRestore();
  });

  it("should handle connection failure", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation();
    (mysql.createConnection as jest.Mock).mockRejectedValue(
      new Error("Connection failed")
    );
    const db = new DatabaseConnector(
      env.DB_HOST,
      env.DB_USER,
      env.DB_PASSWORD,
      env.DB_DATABASE,
      env.DB_PORT
    );
    await db.connect();
    expect(mysql.createConnection).toHaveBeenCalled();
    expect(db.connection).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith("Failed to connect to the database.");
    errorSpy.mockRestore();
  });

  it("should execute query without parameters", async () => {
    mockConnection.execute.mockResolvedValueOnce([[{ result: 2 }], []]);

    const db = new DatabaseConnector(
      env.DB_HOST,
      env.DB_USER,
      env.DB_PASSWORD,
      env.DB_DATABASE,
      env.DB_PORT
    );
    const result = await db.executeQuery("SELECT 1 + 1 AS result");

    expect(mockConnection.execute).toHaveBeenCalledWith(
      "SELECT 1 + 1 AS result",
      []
    );
    expect(result).toEqual([{ result: 2 }]);
  });

  it("should execute query with parameters", async () => {
    mockConnection.execute.mockResolvedValueOnce([[{ result: 3 }], []]);

    const db = new DatabaseConnector(
      env.DB_HOST,
      env.DB_USER,
      env.DB_PASSWORD,
      env.DB_DATABASE,
      env.DB_PORT
    );
    const result = await db.executeQuery("SELECT ? + ? AS result", [1, 2]);

    expect(mockConnection.execute).toHaveBeenCalledWith(
      "SELECT ? + ? AS result",
      [1, 2]
    );
    expect(result).toEqual([{ result: 3 }]);
  });

  it("should throw error if query fails", async () => {
    const error = new Error("Query failed");
    mockConnection.execute.mockRejectedValueOnce(error);

    const db = new DatabaseConnector(
      env.DB_HOST,
      env.DB_USER,
      env.DB_PASSWORD,
      env.DB_DATABASE,
      env.DB_PORT
    );

    await expect(db.executeQuery("SELECT 1 + 1 AS result")).rejects.toThrow(
      "Query failed"
    );
  });
});
