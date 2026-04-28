import { apiContractClient } from "@/lib/apiContractClient";
import { setAccessToken } from "@/lib/token";
import { LoginFormType, SignupFormType } from "@/validators/auth.validators";
import { User } from "@packages/schemas";

export class AuthService {
  static async updateMe(data: SignupFormType): Promise<User> {
    const res = await apiContractClient.updateSelf({ body: data });
    return res.user;
  }

  static async login(payload: LoginFormType): Promise<User> {
    const res = await apiContractClient.login({ body: payload });
    setAccessToken(res.accessToken);
    return res.user;
  }

  static async refreshToken(): Promise<{ accessToken: string }> {
    return apiContractClient.refreshToken();
  }

  static async me(): Promise<User> {
    const response = await AuthService.refreshToken();
    setAccessToken(response.accessToken);

    const res = await apiContractClient.getSelf();
    return res.user;
  }

  static async signup(data: SignupFormType): Promise<User> {
    const res = await apiContractClient.signup({ body: data });
    setAccessToken(res.accessToken);
    return res.user;
  }

  static async logout(): Promise<void> {
    await apiContractClient.logout();
    setAccessToken(null);
  }
}
