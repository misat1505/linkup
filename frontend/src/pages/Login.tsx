import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { API_URL } from "../constants";
import { useNavigate } from "react-router-dom";

export const schema = z.object({
  login: z
    .string()
    .min(5, "Login must be at least 5 characters long.")
    .max(50, "Login must be at most 50 characters long."),
  password: z.string().min(5, "Password must be at least 5 characters long."),
});

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, data, {
        withCredentials: true,
      });
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Login</label>
        <input {...register("login")} />
        {errors.login && (
          <p className="text-red-500">{(errors.login as any).message}</p>
        )}
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register("password")} />
        {errors.password && (
          <p className="text-red-500">{(errors.password as any).message}</p>
        )}
      </div>
      <button
        onClick={handleSubmit(onSubmit)}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
