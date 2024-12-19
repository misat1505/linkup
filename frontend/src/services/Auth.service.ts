import { LoginFormType, SignupFormType } from "../validators/auth.validators";
import { User } from "../types/User";
import { AUTH_API } from "./utils";
import { AxiosResponse } from "axios";
import { getAccessToken, setAccessToken } from "../lib/token";

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

  static async login(payload: LoginFormType): Promise<User> {
    const {
      data: { user, accessToken }
    } = await AUTH_API.post("/login", payload);
    setAccessToken(accessToken);
    return user;
  }

  static async refreshToken(): Promise<AxiosResponse<any>> {
    const response = await AUTH_API.post("/refresh");
    setAccessToken(response.data.accessToken);
    return response;
  }

  static async me(): Promise<User> {
    const response = await AuthService.refreshToken();

    setAccessToken(response.data.accessToken);

    const {
      data: { user }
    } = await AUTH_API.get("/user");
    return user;
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
      data: { user, accessToken }
    } = await AUTH_API.post("/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    setAccessToken(accessToken);
    return user;
  }

  static async logout(): Promise<any> {
    const response = await AUTH_API.post("/logout");
    setAccessToken(null);
    return response;
  }
}
