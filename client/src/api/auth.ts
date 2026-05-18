import { http } from "./http";
import type { ApiResponse } from "../types/api";
import type { AuthResponse } from "../types/auth";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await http.post<ApiResponse<AuthResponse>>("/auth/register", payload);
    return data.data;
  },
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await http.post<ApiResponse<AuthResponse>>("/auth/login", payload);
    return data.data;
  },
  me: async (): Promise<AuthResponse["user"]> => {
    const { data } = await http.get<ApiResponse<{ user: AuthResponse["user"] }>>("/auth/me");
    return data.data.user;
  }
};
