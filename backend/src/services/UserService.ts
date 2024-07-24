import { db } from "../lib/DatabaseConnector";
import { User, UserWithCredentials } from "../models/User";

type DatabaseUser = Omit<
  UserWithCredentials,
  "firstName" | "lastName" | "lastActive"
> & {
  first_name: UserWithCredentials["firstName"];
  last_name: UserWithCredentials["lastName"];
  last_active: User["lastActive"];
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
    const {
      id,
      firstName,
      login,
      lastName,
      password,
      photoURL,
      lastActive,
      salt,
    } = user;

    await db.executeQuery(
      "INSERT INTO Users (id, login, password, first_name, last_name, photoURL, last_active, salt) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
      [
        id,
        login,
        password,
        firstName,
        lastName,
        photoURL,
        lastActive.toISOString(),
        salt,
      ]
    );
  }

  static async getUserByLogin(
    login: UserWithCredentials["login"]
  ): Promise<UserWithCredentials | null> {
    const result = await db.executeQuery(
      "SELECT * FROM Users WHERE login = ?;",
      [login]
    );
    const user = result[0];
    return user ? this.intoUser(user as DatabaseUser) : null;
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

  static async updateLastActive(id: User["id"]): Promise<void> {
    await db.executeQuery("UPDATE Users SET last_active = ? WHERE id = ?;", [
      new Date().toISOString(),
      id,
    ]);
  }

  private static intoUser(databaseUser: DatabaseUser): UserWithCredentials {
    const {
      first_name: firstName,
      last_name: lastName,
      last_active,
      ...rest
    } = databaseUser;

    const user = {
      firstName,
      lastName,
      lastActive: new Date(last_active),
      ...rest,
    } as UserWithCredentials;

    return user;
  }

  static removeCredentials(userWithCredentials: UserWithCredentials): User {
    const { login, password, salt, ...rest } = userWithCredentials;
    const user: User = { ...rest };
    return user;
  }
}
