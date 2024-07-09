import { LoginFormType, SignupFormType } from "@/validators/auth.validators";
import { User } from "../models/User";
import { AUTH_API } from "./utils";
import { AxiosResponse } from "axios";

export const fetchUser = async (): Promise<User> => {
  const { data } = await AUTH_API.get("/user");
  return data.user;
};

export const loginUser = async (payload: LoginFormType): Promise<User> => {
  const { data } = await AUTH_API.post("/login", payload);
  return data.user;
};

export const refreshToken = async (): Promise<AxiosResponse<any>> => {
  return await AUTH_API.post("/refresh");
};

export const signupUser = async (data: SignupFormType): Promise<void> => {
  const formData = new FormData();
  formData.append("login", data.login);
  formData.append("password", data.password);
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  if (data.file) {
    formData.append("file", data.file?.[0]);
  }

  await AUTH_API.post("/signup", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const logoutUser = async (): Promise<any> => {
  return await AUTH_API.post("/logout");
};
