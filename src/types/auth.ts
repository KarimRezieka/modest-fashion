export interface User {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: "USER" | "ADMIN";
  provider: "EMAIL" | "GOOGLE";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
