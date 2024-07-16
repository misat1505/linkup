import { db } from "../lib/DatabaseConnector";
import { FrontendUser, User } from "../models/User";

type DatabaseUser = Omit<User, "firstName" | "lastName"> & {
  first_name: User["firstName"];
  last_name: User["lastName"];
};

export class UserService {
  static async isLoginTaken(login: User["login"]): Promise<boolean> {
    const result = await db.executeQuery(
      "SELECT COUNT(*) FROM Users WHERE login = ?",
      [login]
    );

    return result[0]["COUNT(*)"] > 0;
  }

  static async insertUser(user: User): Promise<void> {
    const { id, firstName, login, lastName, password, photoURL } = user;

    await db.executeQuery(
      "INSERT INTO Users (id, login, password, first_name, last_name, photoURL) VALUES (?, ?, ?, ?, ?, ?);",
      [id, login, password, firstName, lastName, photoURL]
    );
  }

  static async loginUser(
    login: User["login"],
    password: User["password"]
  ): Promise<User | null> {
    const result = await db.executeQuery(
      "SELECT * FROM Users WHERE login = ? AND password = ?;",
      [login, password]
    );
    const userData = result[0];
    return userData ? this.intoUser(userData as DatabaseUser) : null;
  }

  static async getUser(id: User["id"]): Promise<User | null> {
    const result = await db.executeQuery("SELECT * FROM Users WHERE id = ?;", [
      id,
    ]);

    const user = result[0];
    return user ? this.intoUser(user as DatabaseUser) : null;
  }

  private static intoUser(databaseUser: DatabaseUser): User {
    const {
      first_name: firstName,
      last_name: lastName,
      ...rest
    } = databaseUser;
    const user = { firstName, lastName, ...rest } as User;
    return user;
  }

  static intoFrontendUser(user: User): FrontendUser {
    const { login, password, ...rest } = user;
    const frontendUser: FrontendUser = { ...rest };
    return frontendUser;
  }
}
