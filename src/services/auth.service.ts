import axios from "axios";
import type { AuthResponse, LoginInput, RegisterInput } from "@/types/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  withCredentials: true,
});

export const authService = {
  async register(data: RegisterInput): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/api/auth/register", data);
    return res.data;
  },

  async login(data: LoginInput): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/api/auth/login", data);
    return res.data;
  },

  async logout(): Promise<void> {
    await api.post("/api/auth/logout");
  },

  async refreshToken(): Promise<{ tokens: { accessToken: string } }> {
    const res = await api.post<{ tokens: { accessToken: string } }>("/api/auth/refresh");
    return res.data;
  },

  async getMe(accessToken: string): Promise<AuthResponse["user"]> {
    const res = await api.get<{ user: AuthResponse["user"] }>("/api/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data.user;
  },
};
