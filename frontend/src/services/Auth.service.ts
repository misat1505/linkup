import { LoginFormType, SignupFormType } from "../validators/auth.validators";
import { User } from "../models/User";
import { AUTH_API } from "./utils";
import { AxiosResponse } from "axios";

export class AuthService {
  static async me(): Promise<User> {
    const {
      data: { user }
    } = await AUTH_API.get("/user");
    user.lastActive = new Date(user.lastActive);
    return user as User;
  }

  static async login(payload: LoginFormType): Promise<User> {
    const {
      data: { user }
    } = await AUTH_API.post("/login", payload);
    user.lastActive = new Date(user.lastActive);
    return user as User;
  }

  static async refreshToken(): Promise<AxiosResponse<any>> {
    return await AUTH_API.post("/refresh");
  }

  static async signup(data: SignupFormType): Promise<User> {
    const formData = new FormData();
    formData.append("login", data.login);
    formData.append("password", data.password);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    if (data.file) {
      formData.append("file", data.file?.[0]);
    }

    const {
      data: { user }
    } = await AUTH_API.post("/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    user.lastActive = new Date(user.lastActive);
    return user as User;
  }

  static async logout(): Promise<any> {
    return await AUTH_API.post("/logout");
  }
}
