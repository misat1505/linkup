import { LoginFormType, SignupFormType } from "../validators/auth.validators";
import { User } from "../types/User";
import { AUTH_API } from "./utils";
import { AxiosResponse } from "axios";

export class AuthService {
  static async updateMe(data: SignupFormType): Promise<User> {
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
    } = await AUTH_API.put("/user", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return user;
  }

  static async me(): Promise<User> {
    const {
      data: { user }
    } = await AUTH_API.get("/user");
    return user;
  }

  static async login(payload: LoginFormType): Promise<User> {
    const {
      data: { user }
    } = await AUTH_API.post("/login", payload);
    return user;
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

    return user;
  }

  static async logout(): Promise<any> {
    return await AUTH_API.post("/logout");
  }
}
