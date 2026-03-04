import { api } from "@/lib/api/client";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  InfoUserResponse,
} from "@/types";

const BASE = "/Auth";

export const authService = {
  authenticate: (data: LoginRequest) =>
    api.post<AuthResponse>(`${BASE}/Authenticate`, data),

  logout: (refreshToken: string) =>
    api.get<boolean>(`${BASE}/Logout/${refreshToken}`),
};

const USER_BASE = "/User";

export const userAuthService = {
  createUser: (data: RegisterRequest) =>
    api.post<InfoUserResponse>(`${USER_BASE}/CreateUser`, data),

  confirmEmail: (token: string) =>
    api.get<void>(`${USER_BASE}/ConfirmEmail/${token}`),

  sendConfirmEmail: () =>
    api.get<void>(`${USER_BASE}/SendConfirmEmail`),

  sendForgotPasswordEmail: (email: string) =>
    api.post<boolean>(`${USER_BASE}/SendForgotPasswordEmail`, { email }),

  verifyForgotPasswordToken: (token: string) =>
    api.get<boolean>(`${USER_BASE}/VerifyForgotPasswordToken/${token}`),

  forgotPassword: (token: string, password: string, confirmPassword: string) =>
    api.post<void>(`${USER_BASE}/ForgotPassword/${token}`, {
      password,
      confirmPassword,
    }),
};
