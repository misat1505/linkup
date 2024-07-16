import { db } from "../lib/DatabaseConnector";
import { User, UserWithCredentials } from "../models/User";

type DatabaseUser = Omit<UserWithCredentials, "firstName" | "lastName"> & {
  first_name: UserWithCredentials["firstName"];
  last_name: UserWithCredentials["lastName"];
};

export class UserService {
  static async isLoginTaken(
    login: UserWithCredentials["login"]
  ): Promise<boolean> {
    const result = await db.executeQuery(
      "SELECT COUNT(*) FROM Users WHERE login = ?",
      [login]
    );

    return result[0]["COUNT(*)"] > 0;
  }

  static async insertUser(user: UserWithCredentials): Promise<void> {
    const { id, firstName, login, lastName, password, photoURL } = user;

    await db.executeQuery(
      "INSERT INTO Users (id, login, password, first_name, last_name, photoURL) VALUES (?, ?, ?, ?, ?, ?);",
      [id, login, password, firstName, lastName, photoURL]
    );
  }

  static async loginUser(
    login: UserWithCredentials["login"],
    password: UserWithCredentials["password"]
  ): Promise<UserWithCredentials | null> {
    const result = await db.executeQuery(
      "SELECT * FROM Users WHERE login = ? AND password = ?;",
      [login, password]
    );
    const userData = result[0];
    return userData ? this.intoUser(userData as DatabaseUser) : null;
  }

  static async getUser(
    id: UserWithCredentials["id"]
  ): Promise<UserWithCredentials | null> {
    const result = await db.executeQuery("SELECT * FROM Users WHERE id = ?;", [
      id,
    ]);

    const user = result[0];
    return user ? this.intoUser(user as DatabaseUser) : null;
  }

  private static intoUser(databaseUser: DatabaseUser): UserWithCredentials {
    const {
      first_name: firstName,
      last_name: lastName,
      ...rest
    } = databaseUser;
    const user = { firstName, lastName, ...rest } as UserWithCredentials;
    return user;
  }

  static removeCredentials(userWithCredentials: UserWithCredentials): User {
    const { login, password, ...rest } = userWithCredentials;
    const user: User = { ...rest };
    return user;
  }
}
